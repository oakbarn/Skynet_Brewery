# Devices and boards

## Devices and widgets

- A **Device** is tied to a port or pin on a board (a PLC): a pump relay, a valve, a temperature probe, a float switch, a flow meter, a scale.
- A **Widget** lives only in the app: pictures, labels, timers, alarms, variables, IP points and pipe fittings.

"PLC" here means hobby boards: Arduino-compatible boards (such as the Mega), ESP32 and the Raspberry Pi. They connect by **USB**, by **Ethernet** where the board has it, or by **WiFi** through an ESP32.

## Adding a board (Interface)

A board is called an **Interface**. On the **Devices** screen, under **Add Interface**:

1. Give it a **Name**, for example `Main Brewery Mega USB`. Its **Interface ID** (`MB`) is filled in from the name; see [Interface, Tab and Device names](46-interface-tab-device-names).
2. Pick the **Board** (Arduino Mega, ESP32 or another Arduino-type board) and the **Type**: USB, Ethernet, WiFi, or the **Simulator** (no hardware; handy for trying things). The **connection rating** next to it says how safe that link is; see [Connection ratings](69-connection-ratings).
3. For USB, press **Scan ports** and pick the port (Windows: `COM3`; Pi: `/dev/ttyACM0`). For Ethernet or WiFi, type its network address.
4. Press **Add**.

The table at the top shows each board, its connection rating and whether it is connected.

> On the Pi, USB boards need `npm install serialport` once in the panel folder, and `sudo usermod -aG dialout $USER` once (then log out and in).

## Putting a device on a tab

In **Tabs > ☰ Menu > Edit layout**, **Select Device Type** lists the kinds of Device and **Add Device** lists the Devices of that kind (see [Edit layout bar](82-edit-layout-bar)):

- **Outputs**: on/off (relays), PWM %, analog 0-10 V or 4-20 mA. A **Pump** and a **Valve** are ready-made outputs with their pictures and flow points already set.
- **Digital inputs**: switches, float and level switches, flow switches, interlocks, and buttons. A **push button** is ON only while it is held and OFF when released. A **toggle button** stays ON after one press and OFF after the next. A **pulse button** gives one short ON per press.
- **Temperature probes**: DS18B20, PT100, PT1000, thermocouples (K, J, T and more), NTC thermistors.
- **Analog sensors**: 0-5 V, 0-10 V, 4-20 mA, pressure, level, pH (with two-point calibration).
- **Flow meters** (pulse) and **vessel scales** (HX711 load cells, with tare and calibration).

A new Device first asks for its **Interface**, **Port** (only free pins that fit are listed), its **Suggested Name**, its **Label** (with a **Show label** switch) and its size (150 x 150 to start); the **Device Type** is asked too when that kind has more than one, and gets a name like `MB_25_P_L_Vlv_Fly_Sparge__SP` ([Interface, Tab and Device names](46-interface-tab-device-names)). **➕ Add Device** (it works once the Label is typed or Show label is off) puts it in the middle of the Build Tab and opens its properties for the rest; **💾 Save Build ...** then puts it on a Tab. Only outputs of different Device Types can share a port. The properties show only the settings that kind needs, plus the live reading for calibration.

## OneWire probes (DS18B20)

Each probe gets a **number** in the **OneWire probe index**, and temperature Devices use that number. Probes are recognised by their ROM id, not by where they sit on the wire.

**To replace a probe:** plug in the new one, find it under **OneWire probes seen**, and pick its ROM id in the old probe's row. Every Device using that number follows it; nothing else changes.

## Safety

Keep hard-wired safety devices no matter what the panel does: burner flame safety, float switches and an emergency stop. The panel is not yet tested with a real Mega, and the board firmware has not been compiled yet.
