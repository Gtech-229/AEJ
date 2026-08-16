#!/usr/bin/env bash
#
# Zero-clobber (blue-green) redeploy for the AEJ frontend — run on the VPS as `web3`:
#
#   cd ~/apps/aej && ./deploy.sh          # deploys the default branch below
#   cd ~/apps/aej && ./deploy.sh main     # deploys another branch
#
# WHY this replaces the old in-place deploy:
#   The old script ran `npm ci` (wiped node_modules) and `next build` (overwrote
#   .next/) IN the directory the live app was serving from. While that ran, the
#   running Next process read half-swapped chunks/action-manifests → the
#   "Failed to find Server Action" spam + intermittent 503s.
#
# This builds each release in its OWN directory (a git worktree) and only touches
# production at the final, atomic symlink swap. Any failure before that leaves the
# live app completely untouched (it keeps serving the previous release).
#
#   Layout:
#     $REPO      (~/apps/aej)              canonical git repo — NEVER served from
#     $RELEASES  (~/apps/aej-releases/*)   one built worktree per deploy
#     $CURRENT   (~/apps/aej-current)      symlink → the active release (pm2 cwd)
#     $SHARED    (~/apps/aej-shared)       server-only config: .env.production + ecosystem
#
# ONE-TIME SETUP (see the block at the bottom of this file).
# First time only:  chmod +x deploy.sh
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
REPO="$(cd "$(dirname "$0")" && pwd)"     # this repo (canonical mirror)
BASE="$(dirname "$REPO")"                 # ~/apps
RELEASES="$BASE/aej-releases"
SHARED="$BASE/aej-shared"
CURRENT="$BASE/aej-current"
APP="app"                                 # pm2 process name
ECOSYSTEM="$SHARED/ecosystem.config.js"   # pm2 config; its `cwd` must be $CURRENT
PORT="${PORT:-3100}"                       # port the app listens on (health check)
KEEP=5                                     # releases to retain

main() {
  local BRANCH="${1:-main}"
  mkdir -p "$RELEASES"

  echo "▶ [1/6] Fetching origin/$BRANCH …"
  git -C "$REPO" fetch --prune origin

  local STAMP REL
  STAMP="$(date +%Y%m%d-%H%M%S)-$(git -C "$REPO" rev-parse --short "origin/$BRANCH")"
  REL="$RELEASES/$STAMP"

  echo "▶ [2/6] Creating release $STAMP (out-of-place) …"
  git -C "$REPO" worktree add --force --detach "$REL" "origin/$BRANCH"

  echo "▶ [3/6] Linking shared config (if any) …"
  # Only if you keep a server-only env in $SHARED. If the app runs on the
  # committed .env, this is skipped and each release uses that .env from git.
  [[ -f "$SHARED/.env.production" ]] && ln -sfn "$SHARED/.env.production" "$REL/.env.production"
  [[ -f "$SHARED/.env.local" ]] && ln -sfn "$SHARED/.env.local" "$REL/.env.local"
  true

  echo "▶ [4/6] Installing + building IN THE RELEASE (live app untouched) …"
  # `npm install` (not `npm ci`): the committed package-lock.json drifts from
  # package.json, which `npm ci` rejects. install reconciles it in the release.
  ( cd "$REL" && npm install --no-audit --no-fund && npm run build )

  echo "▶ [5/6] Atomic swap + hard restart …"
  ln -sfn "$REL" "$CURRENT"                                   # ← the only prod-facing step
  # pm2 caches a process's RESOLVED cwd (the real release path) at start time, so
  # `reload`/`startOrReload` keep serving the OLD release even after the symlink
  # moves — the new version is never picked up. A full delete + start forces pm2
  # to re-resolve the aej-current symlink to the new release. (A few seconds of
  # restart; run the ecosystem in cluster mode with ≥2 instances if you need HA.)
  pm2 delete "$APP" 2>/dev/null || true
  pm2 start "$ECOSYSTEM" --update-env
  pm2 save

  echo "▶ [6/7] Health check (localhost:$PORT) …"
  # Confirm the NEW release actually answers before we call it a success. Give
  # next a moment to boot, then poll a few times. Non-fatal (warns) so a slow
  # boot or a different port doesn't abort — see the commit that's live below.
  ( for i in 1 2 3 4 5 6; do
      if curl -fsS -o /dev/null "http://localhost:$PORT"; then
        echo "   ✓ responding on $PORT"; break
      fi
      [[ $i -eq 6 ]] && echo "   ⚠ no response on $PORT yet — check 'pm2 logs $APP'"
      sleep 2
    done ) || true

  echo "▶ [7/7] Pruning old releases (keeping $KEEP) …"
  ls -1dt "$RELEASES"/*/ 2>/dev/null | tail -n +$((KEEP + 1)) | while read -r old; do
    git -C "$REPO" worktree remove --force "${old%/}" 2>/dev/null || rm -rf "$old"
  done
  git -C "$REPO" worktree prune

  echo "✅ $STAMP is live — $(git -C "$REL" log -1 --pretty=%s)"
  pm2 list
}

# ── Rollback ──────────────────────────────────────────────────────────────────
#   ./deploy.sh --rollback <release-dir-name>
if [[ "${1:-}" == "--rollback" ]]; then
  ln -sfn "$RELEASES/${2:?usage: ./deploy.sh --rollback <release>}" "$CURRENT"
  # Same pm2 cwd-cache gotcha as the deploy — hard restart so the symlink
  # re-resolves to the rolled-back release (a plain `reload` keeps the old one).
  pm2 delete "$APP" 2>/dev/null || true
  pm2 start "$ECOSYSTEM" --update-env && pm2 save && pm2 list
  exit 0
fi

main "$@"

# ──────────────────────────────────────────────────────────────────────────────
# ONE-TIME SETUP (run once, by hand):
#
#   cd ~/apps
#   mkdir -p aej-releases aej-shared
#   mv aej/.env.production   aej-shared/.env.production     # move server env out of the repo
#   mv aej/ecosystem.config.js aej-shared/ecosystem.config.js   # (if it lived in the repo)
#
#   # Edit aej-shared/ecosystem.config.js so it has:
#   #   name: 'app'
#   #   cwd:  '/ABSOLUTE/PATH/TO/aej-current'      ← the symlink, not a release
#   #   script: 'node_modules/next/dist/bin/next'
#   #   args:   'start -p 3100'
#   #   # optional zero-downtime reload: exec_mode:'cluster', instances:2
#
#   cd ~/apps/aej && ./deploy.sh main            # builds the first release + creates aej-current
#   pm2 delete app 2>/dev/null || true
#   pm2 start ~/apps/aej-shared/ecosystem.config.js
#   pm2 save
# ──────────────────────────────────────────────────────────────────────────────
