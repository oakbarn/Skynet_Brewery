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

1. **Label**, the Display name the tab shows, for example *Fly Sparge*.
2. **Interface**
3. **Port** (the pin)
4. **Device Type** (see the list below)
5. **Tab**

The name is filled in for you as you go:

**Interface ID _ Port _ Device Type ID _ Label __ Tab ID**

The port is always in the name, and the Device Type ID comes third. There are **two** underscores before the Tab ID. A low temperature proportional valve called *Fly Sparge*, on port 25 of the Mega `MB`, on the Sparge tab `SP`, gets:

`MB_25_P_L_Vlv_Fly_Sparge__SP`

A 10K thermistor called *Mash/Tun* on pin A0 gets `MB_A0_10KNTC_Mash~Tun__SP`. DS18B20 probes all share one wire, so they use their probe number instead: `MB_OW1_1W_HLT__HL`.

How the Label is turned into the name part (the Label itself stays exactly as you typed it):

- Control characters and emoji are left out, and spaces at the start and end are dropped.
- Each of `< > : " / \ | ? * . ,` becomes `~`. *Fly/Sparge In* becomes `Fly~Sparge_In`.
- Spaces become `_`.

More rules:

- **No spaces in Device names.**
- If the name is already used, a number goes after the Label: `MB_25_Pump_Wort_2__BR`.
- An Admin can type a name of their own instead. It is checked: it must not be used by any other Device or Widget.
- A name with `~` in it works in a Process as it is: `MB_25_E_L_Vlv_Fly~Sparge__SP = true`.
- While a new Device is not saved yet, its name keeps following the suggestion if you change the Label, Device Type or Tab in its properties. Once you type your own name, it stays.
- **One Device per port.** Two Devices can't use the same port on the same Interface.

## Device Type IDs

Every Device Type ID is unique. Some are in more than one list (`DO` is a plain relay and also a heating element on a relay).

**Temperature:** `1W` DS18B20, `RTD` PT100 / PT1000, `TC` thermocouple, `10KNTC` 10K NTC thermistor (BCS-462 and BruControl type), `5KNTC`, `50KNTC`, `100KNT` (100K, the 3D printer type), `NTC` any other thermistor, `LM35`, `TMP36`.

**Heating elements:** `PID`, `DutyCy` duty cycle, `Hys` hysteresis, `DO` direct on / off, `H_PWM` heating PWM, `H_AO` element on a 0-10 V power controller (SCR / SSVR).

**Direct on / off:** `DO`, `Pump`, `M_L_Vlv` low temperature manual valve, `E_L_Vlv` low temperature electric valve, `M_H_Vlv` high temperature manual valve, `E_H_Vlv` high temperature electric valve, `G_Vlv` solenoid gas valve, `Mtr` motor, `LED`, `Light`, `E_Alm` electric alarm, `Fan`, `Chill` chiller / glycol / fridge compressor, `HtPad` fermenter heat wrap or pad, `Ignit` burner igniter.

**Direct inputs:** `DI` plain, `Float` (true while the float is made, false with no voltage), `DIN` momentary push button, `PB` push button (ON only while held), `Toggle`, `Latch` (ON until reset), `FlowSw` flow switch, `Intlk` door / lid / safety interlock, `EStop` emergency stop, `Leak` leak sensor, `Count` pulse counter.

A **DIN** gives one trigger per press, however long the button is held, and a second or third press within **3 seconds** does nothing. You can change the 3 seconds in its properties (*Pulse: lockout*).

**PWM:** `PWM` plain, `H_PWM` heating PWM, `P_L_Vlv` low temperature proportional valve, `P_H_Vlv` high temperature proportional valve, `P_Pump` pump speed, `P_Fan` fan speed, `P_Mtr` motor speed, `P_LED` LED / light dimmer.

**Analog outputs (0-10 V, 4-20 mA):** `AO` plain, `H_AO`, `P_L_Vlv`, `P_H_Vlv`, `P_Pump`, `P_Fan`, `P_Mtr`.

**Analog inputs:** `AI` plain, `Pres` pressure, `Level`, `Vol` volume, `PH_Met` pH meter.

**Others:** `FlowM` flow meter, `Scale` scale (load cells), `Step` stepper motor.

**Kept for later** (Skynet can't read these yet): `DHT11`, `DHT22`, `Hydro` (a Tilt or any other hydrometer).

**Virtual ports.** A hydrometer has no pin, so, as in BruControl, it gets a virtual port: the first one is `200`, the next `201`, and so on. A Tilt would be named like `MB_200_Hydro_Red_Tilt__FE`.

## Thermistors

An NTC thermistor is read on an analog pin with a series resistor, using its **ohms at 25 °C** and its **Beta** value from the data sheet. The Add list has 10K (Beta 3950), 10K BCS-462 / BruControl (Beta 3977), 50K and 100K ready; for any other one pick **NTC** and type its numbers. The temperature is worked out in °C, and each probe shows **°F or °C**, whichever you pick in its properties.

## Devices you already have

Devices made before this keep their names, so your Processes still work. Their old type codes (`PmP`, `VlV` ...) are changed to the new Device Type IDs by themselves. Their properties show the **Suggested name**; you can type it into **Name** if you like. Your Processes are changed to the new name by themselves when you save the layout (see [Renaming Devices and Widgets](53-renaming)).

Interfaces and tabs from before get an ID by themselves the first time the Schema opens. Changing an Interface ID or Tab ID later does not rename Devices that already exist.

## Who can change things

Only an **Admin** can edit a Schema: add or change Interfaces, Devices, Widgets and tabs, or move graphics in **Edit layout**. Operators run Processes and switch things; Viewers watch.

See also [Devices and boards](03-devices) and [Login, users and passwords](10-login).
