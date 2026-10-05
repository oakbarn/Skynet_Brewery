#!/bin/bash
# Skynet Brewer installer for Mac
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
#
# Double-click it. The first time, macOS may say it "cannot be opened": right-click it, choose Open, then Open again.
#
# It looks for the panel in this order: the BrewPanel folder this file sits in (BrewPanel/install/mac),
# a Skynet*.zip next to this file (the Full zip first), or a BrewPanel folder next to this file (Safari unzips downloads by itself).
# It installs to ~/Brewing/BrewPanel and puts "Skynet Brewer" on the Desktop.
set -eu

PORT=8080
NODE_MIN=22.13.0
DEST="$HOME/Brewing/BrewPanel"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
fail() { printf '\n\033[31m%s\033[0m\n' "$*"; read -r -p "Press Enter to close. " _; exit 1; }

HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

say "Skynet Brewer installer (Mac)"

# ---------------------------------------------------------------- Where is the panel?
SRC=""
if [ -f "$HERE/../../server.js" ]; then
  SRC="$(cd "$HERE/../.." && pwd)"
else
  ZIP="$(ls -t "$HERE"/Skynet*Full*.zip 2>/dev/null | head -n 1 || true)"
  [ -n "$ZIP" ] || ZIP="$(ls -t "$HERE"/Skynet*.zip 2>/dev/null | head -n 1 || true)"
  if [ -n "$ZIP" ]; then
    echo "Unpacking $(basename "$ZIP")"
    unzip -q "$ZIP" -d "$TMP/zip"
    SRC="$(dirname "$(find "$TMP/zip" -maxdepth 3 -name server.js | head -n 1)")"
  elif [ -f "$HERE/BrewPanel/server.js" ]; then
    SRC="$HERE/BrewPanel"
  fi
fi
[ -n "$SRC" ] && [ -f "$SRC/server.js" ] || fail "Could not find the panel. Put this file next to the Skynet .zip file and open it again."

# ---------------------------------------------------------------- Node.js
node_ok() { command -v node >/dev/null && node -e "const [a,b]=process.versions.node.split('.').map(Number),[c,d]='$NODE_MIN'.split('.').map(Number);process.exit(a>c||(a===c&&b>=d)?0:1)" 2>/dev/null; }
if ! node_ok; then
  if command -v brew >/dev/null; then
    echo "Installing Node.js with Homebrew"
    brew install node || true
  fi
fi
if ! node_ok; then
  open "https://nodejs.org/en/download"
  fail "The panel runs on Node.js (free), and this Mac does not have it (or has an old one).
The download page just opened: get the macOS Installer (.pkg) for the LTS version and install it.
Then open this installer again."
fi
echo "Node.js $(node -v) is installed."

# ---------------------------------------------------------------- Stop a running panel
while lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  echo "Something is still running on port $PORT (probably the panel). Stop it (Ctrl+C in its Terminal window), then press Enter."
  read -r _
done

# ---------------------------------------------------------------- Copy the files
STAMP="$(date +%Y-%m-%d_%H%M%S)"
UPDATE=no
[ -f "$DEST/server.js" ] && UPDATE=yes
[ "$UPDATE" = yes ] || [ -f "$SRC/config/brewery.json" ] || fail "This is an update-only zip, and there is no panel in $DEST yet. Use the Skynet_BrewPanel_Full zip for a first install."
mkdir -p "$DEST"
DEST="$(cd "$DEST" && pwd)"
# Your folders (config, data, media, scripts): an update only adds files that are new. It never replaces or deletes yours.
if [ "$SRC" != "$DEST" ]; then
  if [ "$UPDATE" = yes ]; then
    echo "Updating the panel in $DEST"
    echo "Kept as they are: your layout and settings (config), brew data, log, users and passwords (data),"
    echo "pictures and sounds (media) and processes (scripts). Only new sample files are added to them."
    if ls "$DEST"/help/*.md >/dev/null 2>&1; then
      mkdir -p "$DEST/help/backups/before_update_$STAMP"
      cp -p "$DEST"/help/*.md "$DEST/help/backups/before_update_$STAMP/"
      echo "Help pages are replaced by the new manual. The old ones are in help/backups/before_update_$STAMP"
    fi
  else
    echo "Full install to $DEST"
  fi
  ( cd "$SRC" && find . -type f ! -path './data/*' ! -path './node_modules/*' ) | while IFS= read -r f; do
    case "$f" in
      ./config/*|./media/*|./scripts/*) if [ -e "$DEST/$f" ]; then continue; fi ;;
    esac
    mkdir -p "$DEST/$(dirname "$f")"
    cp -p "$SRC/$f" "$DEST/$f"
  done
fi
# Files copied from a download are marked "from the internet"; clear that so they open without warnings
xattr -dr com.apple.quarantine "$DEST" 2>/dev/null || true

echo "Getting the USB support package (needs internet)"
( cd "$DEST" && npm install --no-audit --no-fund ) || echo "Could not get it. The panel still works; for USB boards run 'npm install' in $DEST later."

# ---------------------------------------------------------------- Desktop launcher
LAUNCHER="$HOME/Desktop/Skynet Brewer.command"
cat > "$LAUNCHER" <<EOF
#!/bin/bash
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
# Starts the Skynet Brew Panel and opens it in your browser. Made by the Skynet Brewer installer.
export PATH="/opt/homebrew/bin:/usr/local/bin:\$PATH"
cd "$DEST"
( sleep 4; open http://localhost:$PORT ) &
npm start
EOF
chmod +x "$LAUNCHER"

say "Skynet Brewer is installed in $DEST"
echo "Start it with Skynet Brewer on the Desktop. Your browser opens the panel at http://localhost:$PORT"
IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
[ -n "$IP" ] && echo "From a phone or PC at home: http://$IP:$PORT"
echo "To stop it, press Ctrl+C in its Terminal window."
echo "The first time, create the admin account and save the recovery code."
read -r -p "Press Enter to close. " _
