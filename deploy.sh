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
KEEP=5                                     # releases to retain

main() {
  local BRANCH="${1:-main}"
  mkdir -p "$RELEASES"

  # Pre-flight: shared config must exist BEFORE we build anything.
  if [[ ! -f "$SHARED/.env.production" ]]; then
    echo "✖ Missing $SHARED/.env.production — do the one-time setup first." >&2
    exit 1
  fi

  echo "▶ [1/6] Fetching origin/$BRANCH …"
  git -C "$REPO" fetch --prune origin

  local STAMP REL
  STAMP="$(date +%Y%m%d-%H%M%S)-$(git -C "$REPO" rev-parse --short "origin/$BRANCH")"
  REL="$RELEASES/$STAMP"

  echo "▶ [2/6] Creating release $STAMP (out-of-place) …"
  git -C "$REPO" worktree add --force --detach "$REL" "origin/$BRANCH"

  echo "▶ [3/6] Linking shared config …"
  ln -sfn "$SHARED/.env.production" "$REL/.env.production"

  echo "▶ [4/6] Installing + building IN THE RELEASE (live app untouched) …"
  ( cd "$REL" && npm ci --no-audit --no-fund && npm run build )

  echo "▶ [5/6] Atomic swap + reload …"
  ln -sfn "$REL" "$CURRENT"                                   # ← the only prod-facing step
  pm2 reload "$APP" --update-env 2>/dev/null \
    || pm2 start "$ECOSYSTEM" --update-env                    # first run: boot from ecosystem
  pm2 save

  echo "▶ [6/6] Pruning old releases (keeping $KEEP) …"
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
  pm2 reload "$APP" --update-env && pm2 save && pm2 list
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
