#!/usr/bin/env bash
#
# One-command redeploy for the AEJ frontend — run on the VPS as `web3`:
#
#   cd ~/apps/aej && ./deploy.sh          # deploys the default branch below
#   cd ~/apps/aej && ./deploy.sh main     # deploys another branch
#
# It pulls the latest code, installs deps, rebuilds, then reloads pm2. A failed
# build aborts BEFORE the reload, so the app keeps serving the previous version.
# `.env.production` is git-ignored, so it is never touched.
#
# The work is wrapped in main() so that a self-update during `git reset` can't
# corrupt the run already in progress (bash parses the whole function first).
#
# First time only:  chmod +x deploy.sh   (or run it with `bash deploy.sh`)
set -euo pipefail

main() {
  cd "$(dirname "$0")"

  local BRANCH="${1:-main}"

  echo "▶ [1/4] Fetching + syncing to origin/$BRANCH …"
  git fetch --prune origin
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"        # match remote exactly (discard drift)
  echo "     now at $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

  echo "▶ [2/4] Installing dependencies …"
  npm install --no-audit --no-fund   # reconcile package-lock.json (avoids the
                                     # "out of sync" failure `npm ci` throws)
  npm ci --no-audit --no-fund        # then a clean, reproducible install

  echo "▶ [3/4] Building (next build) …"
  npm run build

  echo "▶ [4/4] Reloading pm2 …"
  pm2 startOrReload ecosystem.config.js --update-env
  pm2 save

  echo "✅ Deploy complete."
  pm2 list
}

main "$@"
