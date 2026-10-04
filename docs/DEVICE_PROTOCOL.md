# Device protocol (Arduino Mega over USB, ESP32 over WiFi)

Both use the same plain-text protocol: one command per line, ending with a newline (`\n`), fields separated by spaces.

- **Mega over USB:** 115200 baud.
- **ESP32 over WiFi:** TCP port 4100. The ESP32 can bridge to a Mega on its second serial port. The included sketch does this.

## Server → device

| Line | Meaning |
|---|---|
| `HELLO` | Sent after connecting. The device answers `HELLO <name> <firmware>` and reports all its inputs. |
| `PING` | Sent every 2 seconds. **If the device hears nothing for 10 seconds it must turn every output OFF** (safety if the PC, cable or WiFi fails). |
| `DO <pin> <0\|1>` | Set a digital output. The device answers with the same line to confirm. |
| `PWM <pin> <0-255>` | Set a PWM output (pwmOut elements, and PID elements with "PWM output" on). The device answers with the same line. |

After every reconnect the server resends the state of every output, so the hardware matches the screen.

## Device → server

| Line | Meaning |
|---|---|
| `HELLO <name> <firmware>` | Answer to HELLO, shown on the Devices page. |
| `DO <pin> <0\|1>` | Confirms an output state. |
| `DI <pin> <0\|1>` | Digital input. Send it on every change, and all inputs every few seconds. |
| `A <pin> <raw>` | Analog input (0-1023). The element's scale and offset convert it. |
| `T <romid> <°F>` | OneWire temperature, by the probe's 16-hex-digit ROM id. |
| `ERR <text>` | Any problem. Shown on the Devices page. |

### Why temperatures use the ROM id

Every DS18B20 probe has a unique 64-bit ROM id. Elements are matched to that id, not to the probe's position on the bus. You can therefore add, remove, replace or move a probe to another vessel without renumbering the others. A new probe shows up on the Devices page under **OneWire probes seen**, where you pick the element it belongs to.

## Element settings that use the protocol

| Element | Settings |
|---|---|
| digitalOut | `device`, `channel` (= pin), optional `activeLow`, `oneShot` (ms) |
| pwmOut | `device`, `channel` (sends `PWM`) |
| dutyCycle, hysteresis, pid | `device`, `channel`; the server switches the pin with `DO` (PID with `pwm` on sends `PWM`) |
| digitalIn | `device`, `channel` |
| analogIn | `device`, `channel`, `scale`, `offset`, or `calibrations` imported from BruControl (thermistor, multiplier, offset, lookup table …) and `avgWeight` (smoothing %) |
| temperature | `probe` (ROM id), optional `device` (empty = any device), `offset` (calibration) |
