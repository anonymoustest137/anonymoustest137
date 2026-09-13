#!/usr/bin/env bash
# Push this portfolio to github.com/anonymoustest137/anonymoustest137
# Usage:  ./push.sh
set -e
REPO="anonymoustest137"
cd "$(dirname "$0")"
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$REPO/$REPO.git"
git branch -M main
git push -u origin main
echo "✅ Live at https://github.com/$REPO/$REPO"
