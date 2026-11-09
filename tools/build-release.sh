#!/usr/bin/env bash
# Builds a Skynet Brewer release in release/ (MIT License, Copyright (c) OakBarn Brewery 2026):
#   Skynet_BrewPanel_<version>.zip         the panel in a BrewPanel folder, for a first install AND for updates: it has no
#                                          data/, config/, media/ or scripts/ (their samples are in defaults/), so it never replaces yours
#   Skynet_Brewer_Setup_<version>.exe     Windows installer (needs NSIS: sudo apt install nsis)
#   Install Skynet Brewer.command, install-skynet-brewer.sh, Skynet_Brewer.bat, ReadMe.txt
#   First_Install_<platform>/              step-by-step first-install ReadMe + first-install file for Windows, Mac, Linux, Pi
# Usage: bash tools/build-release.sh [version]     (version defaults to today's date, e.g. 2026-10-05)
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION="${1:-$(date +%Y-%m-%d)}"
OUT="release"
STAGE="$OUT/stage/BrewPanel"
rm -rf "$OUT/stage"
mkdir -p "$STAGE"

# Only the files git knows about (tracked, or new and not ignored), so data/, node_modules and backups stay out.
# Delete/ (retired files, Rule 15.3) and Sandbox/ (Schemas set aside, Rule 16.8) are never shipped either.
git ls-files -z --cached --others --exclude-standard | grep -zEv '^(release/|\.github/|\.gitignore$|Delete/|Sandbox/)' | while IFS= read -r -d '' f; do
  [ -e "$f" ] || continue
  mkdir -p "$STAGE/$(dirname "$f")"
  cp -p "$f" "$STAGE/$f"
done
chmod +x "$STAGE"/install/linux/*.sh "$STAGE"/install/pi/*.sh "$STAGE"/install/mac/*.command

# Your folders (config, media, scripts) are NOT in the zip. Their samples go in defaults/, and the panel copies them
# into place on its first start (lib/seed.js). So unzipping a new version over a panel can never replace yours.
# data/ is never in a release at all.
mkdir -p "$STAGE/defaults"
for d in config media scripts; do [ -d "$STAGE/$d" ] && mv "$STAGE/$d" "$STAGE/defaults/$d"; done

ZIP="Skynet_BrewPanel_$VERSION.zip"
rm -f "$OUT"/Skynet_BrewPanel_*.zip
( cd "$OUT/stage" && zip -qr -X "../$ZIP" BrewPanel )
echo "Built $OUT/$ZIP"

cp -p install/ReadMe.txt install/windows/Skynet_Brewer.bat install/linux/install-skynet-brewer.sh "install/mac/Install Skynet Brewer.command" "$OUT/"
# First-time install by hand: one ReadMe and one first-install file per platform
for d in windows mac linux pi; do mkdir -p "$OUT/First_Install_$d"; done
cp -p install/windows/ReadMe_Windows.txt install/windows/Skynet_First_Install.bat install/windows/Skynet_Brewer.bat "$OUT/First_Install_windows/"
cp -p install/mac/ReadMe_Mac.txt "install/mac/Skynet First Install.command" "$OUT/First_Install_mac/"
cp -p install/linux/ReadMe_Linux.txt install/linux/skynet-first-install.sh "$OUT/First_Install_linux/"
cp -p install/pi/ReadMe_Raspberry_Pi.txt install/pi/skynet-first-install-pi.sh "$OUT/First_Install_pi/"
cp -p help/27-minimum-equipment.md "$OUT/Minimum_Equipment_and_Limitations.txt"

if command -v makensis >/dev/null; then
  EXE="Skynet_Brewer_Setup_$VERSION.exe"
  # Signing (docs/Code_Signing_Setup.md): only when the release workflow has set everything tools/sign-exe.sh needs.
  # Otherwise the Setup .exe is built unsigned, as before.
  SIGN=()
  rm -f "$OUT/signing.log"
  if [ -n "${SKYNET_SIGN_JAR:-}" ] && [ -n "${SKYNET_SIGN_ENDPOINT:-}" ] && [ -n "${SKYNET_SIGN_ACCOUNT:-}" ] \
     && [ -n "${SKYNET_SIGN_PROFILE:-}" ] && [ -n "${SKYNET_SIGN_TOKEN:-}" ]; then
    export SKYNET_SIGN_LOG="$(pwd)/$OUT/signing.log"
    : > "$SKYNET_SIGN_LOG"
    SIGN=(-DSIGN_SCRIPT="$(pwd)/tools/sign-exe.sh")
    echo "Signing is set up: the Setup .exe and its Uninstall .exe will be signed."
  else
    echo "Signing is not set up, so the Setup .exe is not signed (see docs/Code_Signing_Setup.md)."
  fi
  makensis -V2 -DSRC="$(pwd)/$STAGE" -DVERSION="$VERSION" -DOUTFILE="$(pwd)/$OUT/$EXE" "${SIGN[@]}" install/windows/SkynetBrewer.nsi
  echo "Built $OUT/$EXE"
  [ -f "$OUT/signing.log" ] && cat "$OUT/signing.log"
else
  echo "NSIS (makensis) is not installed, so no Windows installer was built. On Linux: sudo apt install nsis"
fi
rm -rf "$OUT/stage"
ls -la "$OUT"
