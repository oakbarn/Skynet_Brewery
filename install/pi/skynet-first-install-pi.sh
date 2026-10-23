#!/usr/bin/env bash
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
#
# Skynet Brewery - FIRST TIME INSTALL for a Raspberry Pi (the Brain).
# Run it once, after you have installed Node.js and unzipped the panel into ~/Brewing/BrewPanel:
#     bash ~/Brewing/skynet-first-install-pi.sh
# Do not put sudo in front; it asks for your password when it needs it.
# It checks Node.js, gets the USB board support, lets the panel use USB boards, and sets the
# panel up as a service called skynet-brewer, so it starts by itself every time the Pi starts
# and restarts by itself if it ever stops.

PANEL="$HOME/Brewing/BrewPanel"
PORT=8080
SERVICE=skynet-brewer

bold() { printf '\n\033[1m%s\033[0m\n' "$*"; }
stop() { printf '\n\033[31m%s\033[0m\n\n' "$*"; read -r -p "Press Enter to close. " _; exit 1; }

[ "$(id -u)" = 0 ] && stop "Do not run this with sudo. Run it as yourself:  bash ~/Brewing/skynet-first-install-pi.sh"

bold "==================================================="
bold " Skynet Brewery - first time install (Raspberry Pi)"
bold "==================================================="

# 1. Is the panel where it should be?
[ -f "$PANEL/server.js" ] || stop "The panel is not in $PANEL
Unzip Skynet_BrewPanel_(date).zip so you get the folder Brewing/BrewPanel in your home
folder, with server.js inside it. See step 7 of ReadMe_Raspberry_Pi.txt"
cd "$PANEL" || exit 1
echo "[1/6] Found the panel in $PANEL"

# Already had the panel here? Its work is in config, data, media and scripts (a new zip has none of them).
OLD=""
for d in config data media scripts; do [ -e "$PANEL/$d" ] && OLD="$OLD $d"; done
if [ -n "$OLD" ]; then
  printf '\n\033[41;97m %s \033[0m\n' "WARNING: THIS COMPUTER ALREADY HAS A SKYNET PANEL WITH YOUR WORK IN IT"
  echo
  echo "Starting over gives you a brand-new panel, as if it had never been installed."
  echo "ALL OF THE WORK DONE SO FAR WILL BE OVERWRITTEN:"
  echo "  - your Tabs, layout, Devices, pipes and settings   (config)"
  echo "  - your Processes                                   (scripts)"
  echo "  - your pictures and sounds                         (media)"
  echo "  - your brew log, users, passwords and recovery code (data)"
  echo "(As a safety net the old folders are moved to $HOME/Brewing/Old_Panel_<date>,"
  echo " not deleted. Nothing from them is used by the new panel.)"
  echo
  echo "  Type  YES   to start over and overwrite all of it."
  echo "  Type  KEEP  to keep all your work and only finish the install."
  echo "  Press Enter to stop without changing anything."
  read -r -p "Your answer: " ANSWER
  case "$ANSWER" in
    YES)
      if systemctl is-active --quiet skynet-brewer 2>/dev/null; then
        echo "Stopping the running panel (type your password if asked)."
        sudo systemctl stop skynet-brewer
      fi
      if (echo > /dev/tcp/127.0.0.1/8080) 2>/dev/null; then
        stop "The panel is still running. Stop it first (Ctrl+C in its window, or close the window),
then run this file again. Nothing was changed."
      fi
      KEEP_DIR="$HOME/Brewing/Old_Panel_$(date +%Y%m%dT%H%M%S)"
      mkdir -p "$KEEP_DIR" || stop "Could not make $KEEP_DIR. Nothing was changed."
      for d in $OLD; do mv "$PANEL/$d" "$KEEP_DIR/" || stop "Could not move $d. Close any window that uses the panel's files and try again."; done
      echo "Started over. The old work was moved to $KEEP_DIR"
      ;;
    KEEP|keep|Keep) echo "Keeping all your work." ;;
    *) stop "Stopped. Nothing was changed." ;;
  esac
fi

# 2. Is Node.js installed, and new enough?
command -v node >/dev/null || stop "Node.js is not installed. The panel cannot run without it.
Do step 6 of ReadMe_Raspberry_Pi.txt, then run this file again."
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)" \
  || stop "Node.js $(node -v) is too old. The panel needs version 22.13 or newer.
(The Node.js that comes with Raspberry Pi OS is too old.) Do step 6 of ReadMe_Raspberry_Pi.txt,
then run this file again."
command -v npm >/dev/null || stop "Node.js is there but npm is missing. Do step 6 of ReadMe_Raspberry_Pi.txt again."
NODE_BIN="$(command -v node)"
echo "[2/6] Node.js $(node -v) is installed. Good."

# 3. USB board support (the serialport package). Needs the internet.
echo "[3/6] Getting the USB board support. This needs the internet and can take a few minutes..."
if ! { npm install --no-audit --no-fund && node -e "import('serialport').catch(()=>process.exit(1))"; }; then
  echo
  echo "      Could not get the USB board support. The panel still works with the simulator."
  echo "      Check the internet, then run this file again to get it."
fi

# 4. Permission to use USB boards (the dialout group)
if ! id -nG "$USER" | grep -qw dialout; then
  echo "[4/6] Letting $USER use USB boards. Type your password if asked."
  sudo usermod -aG dialout "$USER"
else
  echo "[4/6] USB permission is already set."
fi

# 5. Start by itself at every boot (a systemd service)
echo "[5/6] Setting the panel to start by itself whenever the Pi starts. Type your password if asked."
sudo tee "/etc/systemd/system/$SERVICE.service" >/dev/null <<EOF
# Skynet Brew Panel. Made by skynet-first-install-pi.sh
[Unit]
Description=Skynet Brew Panel
After=network-online.target
Wants=network-online.target

[Service]
User=$USER
SupplementaryGroups=dialout
WorkingDirectory=$PANEL
ExecStart=$NODE_BIN --no-warnings server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE" >/dev/null 2>&1
sudo systemctl restart "$SERVICE"

# A Desktop icon that opens the panel in the Pi's own browser
DESKTOP_DIR="$(xdg-user-dir DESKTOP 2>/dev/null || echo "$HOME/Desktop")"
if [ -d "$DESKTOP_DIR" ]; then
  cat > "$DESKTOP_DIR/skynet-brewer.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Skynet Brewer
Comment=Open the Skynet Brew Panel
Exec=xdg-open http://localhost:$PORT
Icon=$PANEL/install/icon.png
Terminal=false
EOF
  chmod +x "$DESKTOP_DIR/skynet-brewer.desktop"
fi

# 6. Check it is running
sleep 4
IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
if systemctl is-active --quiet "$SERVICE"; then
  bold "[6/6] Done. The panel is RUNNING, and it starts by itself every time the Pi starts."
  echo
  echo "  Open it on this Pi:              http://localhost:$PORT"
  [ -n "$IP" ] && echo "  From a phone or PC at home:      http://$IP:$PORT"
  echo "  Or by name (most phones/PCs):    http://$(hostname).local:$PORT"
  echo
  echo "  Stop it:        sudo systemctl stop $SERVICE"
  echo "  Start it:       sudo systemctl start $SERVICE"
  echo "  Is it running?  systemctl status $SERVICE"
  echo "  Its messages:   journalctl -u $SERVICE -f      (Ctrl+C to stop watching)"
  echo
  echo "  Restart the Pi once (sudo reboot) so the USB permission works for everything."
else
  stop "The panel did not start. Its last messages:
$(journalctl -u "$SERVICE" -n 20 --no-pager 2>/dev/null)"
fi
read -r -p "Press Enter to close. " _
