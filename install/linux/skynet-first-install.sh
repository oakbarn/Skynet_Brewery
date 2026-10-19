#!/usr/bin/env bash
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
#
# Skynet Brewery - FIRST TIME INSTALL for Linux (Ubuntu, Linux Mint, Debian, Fedora and similar).
# Run it once, after you have installed Node.js and unzipped the panel into ~/Brewing/BrewPanel:
#     bash ~/Brewing/skynet-first-install.sh
# Do not put sudo in front; it asks for your password when it needs it.
# It checks Node.js, gets the USB board support, lets you use USB boards, puts "Skynet Brewer"
# on your Desktop and in the applications menu, and starts the panel.

PANEL="$HOME/Brewing/BrewPanel"
PORT=8080

bold() { printf '\n\033[1m%s\033[0m\n' "$*"; }
stop() { printf '\n\033[31m%s\033[0m\n\n' "$*"; read -r -p "Press Enter to close. " _; exit 1; }

[ "$(id -u)" = 0 ] && stop "Do not run this with sudo. Run it as yourself:  bash ~/Brewing/skynet-first-install.sh"

bold "============================================"
bold " Skynet Brewery - first time install (Linux)"
bold "============================================"

# 1. Is the panel where it should be?
[ -f "$PANEL/server.js" ] || stop "The panel is not in $PANEL
Unzip Skynet_BrewPanel_(date).zip so you get the folder Brewing/BrewPanel in your home
folder, with server.js inside it. See step 5 of ReadMe_Linux.txt"
cd "$PANEL" || exit 1
echo "[1/6] Found the panel in $PANEL"

# 2. Is Node.js installed, and new enough?
command -v node >/dev/null || stop "Node.js is not installed. The panel cannot run without it.
Do step 3 of ReadMe_Linux.txt, then run this file again."
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)" \
  || stop "Node.js $(node -v) is too old. The panel needs version 22.13 or newer.
Do step 3 of ReadMe_Linux.txt (it replaces the old one), then run this file again."
command -v npm >/dev/null || stop "Node.js is there but npm is missing. Do step 3 of ReadMe_Linux.txt again."
echo "[2/6] Node.js $(node -v) is installed. Good."

# 3. USB board support (the serialport package). Needs the internet.
echo "[3/6] Getting the USB board support. This needs the internet and can take a minute..."
if ! { npm install --no-audit --no-fund && node -e "import('serialport').catch(()=>process.exit(1))"; }; then
  echo
  echo "      Could not get the USB board support. The panel still works with the simulator."
  echo "      Check the internet, then run this file again to get it."
fi

# 4. Permission to use USB boards (the dialout group)
NEED_RELOGIN=no
if getent group dialout >/dev/null && ! id -nG "$USER" | grep -qw dialout; then
  echo "[4/6] Letting $USER use USB boards. Type your password if asked."
  sudo usermod -aG dialout "$USER" && NEED_RELOGIN=yes
else
  echo "[4/6] USB permission is already set."
fi

# 5. The everyday start file, Desktop icon and menu entry
cat > "$HOME/Brewing/start-skynet-brewer.sh" <<EOF
#!/usr/bin/env bash
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
# Starts the Skynet Brew Panel and opens it in your browser. Keep this window open while you brew.
cd "$PANEL" || { echo "The panel is not in $PANEL"; read -r -p "Press Enter to close. " _; exit 1; }
( sleep 4; xdg-open http://localhost:$PORT >/dev/null 2>&1 ) &
npm start
read -r -p "The panel has stopped. Press Enter to close this window. " _
EOF
chmod +x "$HOME/Brewing/start-skynet-brewer.sh"
DESKTOP_FILE="[Desktop Entry]
Type=Application
Name=Skynet Brewer
Comment=Skynet Brew Panel
Exec=\"$HOME/Brewing/start-skynet-brewer.sh\"
Icon=$PANEL/install/icon.png
Terminal=true
Categories=Utility;
"
mkdir -p "$HOME/.local/share/applications"
printf '%s' "$DESKTOP_FILE" > "$HOME/.local/share/applications/skynet-brewer.desktop"
DESKTOP_DIR="$(xdg-user-dir DESKTOP 2>/dev/null || echo "$HOME/Desktop")"
if [ -d "$DESKTOP_DIR" ]; then
  printf '%s' "$DESKTOP_FILE" > "$DESKTOP_DIR/skynet-brewer.desktop"
  chmod +x "$DESKTOP_DIR/skynet-brewer.desktop"
  command -v gio >/dev/null && gio set "$DESKTOP_DIR/skynet-brewer.desktop" metadata::trusted true 2>/dev/null
  echo "[5/6] Put \"Skynet Brewer\" on your Desktop and in the applications menu."
else
  echo "[5/6] Put \"Skynet Brewer\" in the applications menu."
fi

# 6. Start the panel and open the browser
IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
bold "[6/6] Starting the panel. Your browser opens it in a few seconds."
echo "On this computer:            http://localhost:$PORT"
[ -n "$IP" ] && echo "From a phone or PC at home:  http://$IP:$PORT"
[ "$NEED_RELOGIN" = yes ] && echo "For USB boards: log out and back in (or restart) once after this, so the USB permission works."
echo "KEEP THIS WINDOW OPEN while you brew. Closing it, or Ctrl+C, stops the panel."
echo
( sleep 5; xdg-open http://localhost:$PORT >/dev/null 2>&1 ) &
npm start
read -r -p "The panel has stopped. Press Enter to close. " _
