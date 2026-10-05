# Devices and boards

## Devices and widgets

- A **Device** is tied to a port or pin on a board (a PLC): a pump relay, a valve, a temperature probe, a float switch, a flow meter, a scale.
- A **Widget** lives only in the app: pictures, labels, timers, alarms, variables, IP points and pipe fittings.

"PLC" here means hobby boards: Arduino-compatible boards (such as the Mega), ESP32 and the Raspberry Pi. They connect by **USB**, by **Ethernet** where the board has it, or by **WiFi** through an ESP32.

## Adding a board

On the **Devices** screen, under **Add device**:

1. Give it a **Name**, for example `MEGA1`.
2. Pick the **Type**: a board on USB, a board on Ethernet, an ESP32 on WiFi, or the **Simulator** (no hardware; handy for trying things).
3. For USB, press **Scan ports** and pick the port (Windows: `COM3`; Pi: `/dev/ttyACM0`). For Ethernet or WiFi, type its network address.
4. Press **Add**.

The table at the top shows each board and whether it is connected.

> On the Pi, USB boards need `npm install serialport` once in the panel folder, and `sudo usermod -aG dialout $USER` once (then log out and in).

## Putting a device on a tab

In **Tabs > Edit layout > Add element**, the list groups devices by kind:

- **Outputs**: on/off (relays), PWM %, analog 0-10 V or 4-20 mA. A **Pump** and a **Valve** are ready-made outputs with their pictures and flow points already set.
- **Digital inputs**: switches, float and level switches, flow switches, interlocks, and buttons. A **push button** is ON only while it is held and OFF when released. A **toggle button** stays ON after one press and OFF after the next. A **pulse button** gives one short ON per press.
- **Temperature probes**: DS18B20, PT100, PT1000, thermocouples (K, J, T and more), NTC thermistors.
- **Analog sensors**: 0-5 V, 0-10 V, 4-20 mA, pressure, level, pH (with two-point calibration).
- **Flow meters** (pulse) and **vessel scales** (HX711 load cells, with tare and calibration).

Then pick the **Device** (board) and **Pin / channel** in its properties. The properties show only the settings that kind needs, plus the live reading for calibration.

## OneWire probes (DS18B20)

Each probe gets a **number** in the **OneWire probe index**, and temperature elements use that number. Probes are recognised by their ROM id, not by where they sit on the wire.

**To replace a probe:** plug in the new one, find it under **OneWire probes seen**, and pick its ROM id in the old probe's row. Every element using that number follows it; nothing else changes.

## Safety

Keep hard-wired safety devices no matter what the panel does: burner flame safety, float switches and an emergency stop. The panel is not yet tested with a real Mega, and the board firmware has not been compiled yet.
