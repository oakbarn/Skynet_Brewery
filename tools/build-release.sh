#!/usr/bin/env bash
# Builds a Skynet Brewer release in release/ (MIT License, Copyright (c) OakBarn Brewery 2026):
#   Skynet_BrewPanel_<version>.zip        the panel in a BrewPanel folder (no data/, no node_modules)
#   Skynet_Brewer_Setup_<version>.exe     Windows installer (needs NSIS: sudo apt install nsis)
#   Install Skynet Brewer.command, install-skynet-brewer.sh, Skynet_Brewer.bat, ReadMe.txt
# Usage: bash tools/build-release.sh [version]     (version defaults to today's date, e.g. 2026-10-05)
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION="${1:-$(date +%Y-%m-%d)}"
OUT="release"
STAGE="$OUT/stage/BrewPanel"
rm -rf "$OUT/stage"
mkdir -p "$STAGE"

# Only the files git knows about (tracked, or new and not ignored), so data/, node_modules and backups stay out
git ls-files -z --cached --others --exclude-standard | grep -zEv '^(release/|\.github/|\.gitignore$)' | while IFS= read -r -d '' f; do
  [ -e "$f" ] || continue
  mkdir -p "$STAGE/$(dirname "$f")"
  cp -p "$f" "$STAGE/$f"
done
chmod +x "$STAGE/install/linux/install-skynet-brewer.sh" "$STAGE/install/mac/Install Skynet Brewer.command"

ZIP="Skynet_BrewPanel_$VERSION.zip"
rm -f "$OUT/$ZIP"
( cd "$OUT/stage" && zip -qr -X "../$ZIP" BrewPanel )
echo "Built $OUT/$ZIP"

cp -p install/ReadMe.txt install/windows/Skynet_Brewer.bat install/linux/install-skynet-brewer.sh "install/mac/Install Skynet Brewer.command" "$OUT/"

if command -v makensis >/dev/null; then
  EXE="Skynet_Brewer_Setup_$VERSION.exe"
  makensis -V2 -DSRC="$(pwd)/$STAGE" -DVERSION="$VERSION" -DOUTFILE="$(pwd)/$OUT/$EXE" install/windows/SkynetBrewer.nsi
  echo "Built $OUT/$EXE"
else
  echo "NSIS (makensis) is not installed, so no Windows installer was built. On Linux: sudo apt install nsis"
fi
rm -rf "$OUT/stage"
ls -la "$OUT"
