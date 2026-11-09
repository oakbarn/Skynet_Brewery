#!/bin/bash
# Skynet Bluetooth Hydrometers installer: this Raspberry Pi's own Bluetooth hears Tilts and RAPT Pills for the Skynet Brain.
# Run on the Pi:   sudo bash install.sh
# It installs python3-bleak, copies the program to /opt/skynet-bt-hydrometer and starts it as a service that comes back after every
# restart. Run it again to update. On the Brain itself nothing else is needed; on another Pi, set "brain" in settings.json.
set -e
if [ "$(id -u)" != "0" ]; then echo "Please run:  sudo bash install.sh"; exit 1; fi
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST=/opt/skynet-bt-hydrometer

echo "== Installing Python parts (bleak) and turning Bluetooth on"
apt-get update -qq
apt-get install -y python3-bleak bluez
rfkill unblock bluetooth 2>/dev/null || true

echo "== Copying the program to $DEST"
mkdir -p "$DEST"
cp "$HERE/skynet_bt_hydrometer.py" "$DEST/"
[ -f "$DEST/settings.json" ] || cp "$HERE/settings.example.json" "$DEST/settings.json"
cp "$HERE/skynet-bt-hydrometer.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable skynet-bt-hydrometer
systemctl restart skynet-bt-hydrometer

echo
echo "Done. This Pi now listens for Tilts and RAPT Pills and sends them to the Brain."
echo "On the Brain itself nothing else is needed. On another Pi, set \"brain\" to the Brain's address in $DEST/settings.json,"
echo "  for example http://192.168.1.50:8080, then:  sudo systemctl restart skynet-bt-hydrometer"
echo "See what it hears:  journalctl -u skynet-bt-hydrometer -f"
exit 0
