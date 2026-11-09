#!/usr/bin/env python3
# Skynet Bluetooth Hydrometers - the Raspberry Pi's own Bluetooth hears Tilts and RAPT Pills and sends what it heard to the Brain
# MIT License Granted - Copyright (c) OakBarn Brewery 2026
#
# Skynet Rule 6.25, Help 170. Runs as a service on a Pi near the fermenters: the Brain itself, or another Pi on your network. Every few
# seconds it sends each Tilt and RAPT Pill advert it heard to  POST <brain>/api/hydrometer/bluetooth
#   { "from": name, "ads": [{ "address", "rssi", "mfg": { "76": "hex" } }] }
# exactly as the ESP32_Hydrometer sketch does. The Brain reads the adverts itself (public/hydrometer.js), so this program never needs to
# change when a kind is added.
#
# Needs Raspberry Pi OS (Bookworm or newer) with python3-bleak; install.sh does that. Settings: settings.json next to this file.

import asyncio
import json
import os
import sys
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SETTINGS = {'brain': 'http://127.0.0.1:8080', 'key': '', 'name': 'Pi Bluetooth', 'every': 10}
try:
    with open(os.path.join(HERE, 'settings.json')) as f:
        SETTINGS.update(json.load(f))
except FileNotFoundError:
    pass

try:
    from bleak import BleakScanner
except ImportError:
    sys.exit('Needs python3-bleak:  sudo apt install python3-bleak  (or run install.sh)')

TILT, RAPT = 76, 16722           # company numbers: Apple (a Tilt is an iBeacon) and "RA" (RAPT)
heard = {}                        # newest advert of each Tilt or RAPT Pill, by Bluetooth address


def is_ours(company, data):
    if company == TILT:
        return len(data) >= 23 and data[0] == 0x02 and data[1] == 0x15 and data[2:5] == b'\xa4\x95\xbb'
    return company == RAPT and len(data) == 23


def on_advert(device, adv):
    for company, data in (adv.manufacturer_data or {}).items():
        if is_ours(company, bytes(data)):
            heard[device.address] = {'address': device.address, 'rssi': adv.rssi, 'mfg': {str(company): bytes(data).hex()}}


def send():
    if not heard:
        return
    url = SETTINGS['brain'].rstrip('/') + '/api/hydrometer/bluetooth' + (('?key=' + SETTINGS['key']) if SETTINGS['key'] else '')
    body = json.dumps({'from': SETTINGS['name'], 'ads': list(heard.values())}).encode()
    req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            print(time.strftime('%H:%M:%S'), 'sent', len(heard), '->', r.read().decode()[:200], flush=True)
        heard.clear()
    except Exception as e:            # the Brain is restarting or away: keep them for the next try
        print(time.strftime('%H:%M:%S'), 'could not reach the Brain:', e, flush=True)


async def main():
    print('Skynet Bluetooth Hydrometers: listening, sending to', SETTINGS['brain'], flush=True)
    async with BleakScanner(on_advert):
        while True:
            await asyncio.sleep(max(2, float(SETTINGS['every'])))
            await asyncio.get_running_loop().run_in_executor(None, send)

if __name__ == '__main__':
    asyncio.run(main())
