# Interface, Tab and Device names

Every Interface and every tab has a short **ID**, and a new Device gets a name made from them. You can tell at a glance which board, port and tab a Device belongs to.

## Interface ID

An **Interface** is a board (PLC) the Devices are wired to: a Mega on USB, a Mega on Ethernet, an ESP32 and so on. Interfaces are on the **Devices** page.

- The ID is **1 to 4 letters**, and is written with an underscore after it: `MB_`.
- Each one must be **unique**.
- A new Interface gets the first letter of the first two words of its name. **Main Brewery Mega USB** gets `MB_`.
- If that ID is taken, the next one gets `MB_2`, then `MB_3`.
- An Admin can type another ID when adding the Interface, or change it in the **ID** box in the table. For example `MBUB` for the USB Mega and `MBET` for the Ethernet one.

## Tab ID

- The Tab ID is **exactly 2 letters**, and each one must be **unique**. **Sparge** gets `SP`, **Batch Hops** gets `BH`.
- An Admin changes it in **Tab settings** (Edit layout, double-click an empty spot on the tab).
- Renaming a tab keeps its ID.

## Device names

When you add a Device (anything wired to a port), the **New Device** box asks for these, in this order:

1. **Display name**, what the tab shows, for example *Fly Sparge*.
2. **Interface**
3. **Port** (the pin)
4. **Type** (see the list below)
5. **Tab**

The name is filled in for you as you go:

**Interface ID _ Port _ Type _ Display Name _ Tab ID**

A proportional valve on PWM, called *Fly Sparge*, on port 25 of the Mega `MB`, on the Sparge tab `SP`, gets:

`MB_25_PWM_VlV_Fly_Sparge_SP`

- **No spaces in Device names.** A space in the Display name becomes `_`.
- The suggested name is always unique, because no two Devices share an Interface and port.
- An Admin can type a name of their own instead. It is checked: it must not be used by any other Device or Widget.
- While a new Device is not saved yet, its name keeps following the suggestion if you change the Display name, port, type or tab in its properties. Once you type your own name, it stays.
- **One Device per port.** Two Devices can't use the same port on the same Interface. A Pump can be a `PmP` or a plain `DO`, but not both on one port. (DS18B20 probes all share one wire, so they use their probe number, `OW1`, `OW2` ..., instead.)

## Type codes

**Direct outputs:** `DO` plain on / off, `PmP` Pump, `VlV` Valve, `MtR` Motor, `FaN` Fan, `LgT` Light, `LeD` LED, `ElM` heating element, `BrN` burner.

**PWM outputs:** `PWM` plain, or `PWM_` in front of an output code: `PWM_PmP`, `PWM_VlV` ...

**Analog outputs (0-10 V, 4-20 mA):** `AO` plain, or `AO_` in front of an output code: `AO_VlV` ...

**Direct inputs:** `DI` plain, `DiN` DIN, `VoL` Volume, `FlT` float / level switch, `FlS` flow switch, `BtN` button (push, toggle or pulse), `SfT` safety interlock, `CnT` pulse counter.

**Analog inputs:** `AI` plain, `PrS` pressure, `LvL` level, `VoL` volume, `PhM` pH.

**Others:** `TmP` temperature probe, `FlM` flow meter, `ScL` scale, `StP` stepper motor, `DtY` duty cycle, `HyS` hysteresis, `PiD` PID.

## Devices you already have

Devices made before this keep their names, so your Processes still work. Their properties show the **Suggested name**; you can type it into **Name** if you like. Your Processes are changed to the new name by themselves when you save the layout (see [Renaming Devices and Widgets](53-renaming)).

Interfaces and tabs from before get an ID by themselves the first time the Schema opens. Changing an Interface ID or Tab ID later does not rename Devices that already exist.

## Who can change things

Only an **Admin** can edit a Schema: add or change Interfaces, Devices, Widgets and tabs, or move graphics in **Edit layout**. Operators run Processes and switch things; Viewers watch.

See also [Devices and boards](03-devices) and [Login, users and passwords](10-login).
