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

When you add a Device (anything wired to a port), the **New Device** box asks for these, in this order, as BruControl does:

1. **Interface**
2. **Device Type** (see the list below)
3. **Port** (the pin). The list shows only the pins that are free on that Interface and fit that Device Type, best first: plain pins for a relay or switch, PWM pins for a PWM output, counter pins for a flow meter, A0-A15 for an analog input. You can still type another pin. An output port can have more than one type, see below.
4. **Label**, the Display name the tab shows, for example *Fly Sparge*.

Press **Create**. The Device is always made on the **Build Tab** first, the same way as a new Widget or Template, and its **Properties** open right away so you can set everything else. If you make several in a row, each new one sits a little down and to the right of the last, so none hide each other. Then press **💾 Save Build ...** and pick the Tab: the Device moves there and the Tab ID is added to the end of its name.

The name is filled in for you as you go:

**Interface ID _ Port _ Device Type ID _ Label __ Tab ID**

The port is always in the name, and the Device Type ID comes third. There are **two** underscores before the Tab ID. A low temperature proportional valve called *Fly Sparge*, on port 25 of the Mega `MB`, on the Sparge tab `SP`, gets:

`MB_25_P_L_Vlv_Fly_Sparge__SP`

Analog pins are written the way BruControl numbers them, A0 = 54 up to A15 = 69, so a 10K thermistor called *Mash/Tun* on pin A0 gets `MB_54_10KNTC_Mash~Tun__SP`. You can still type A0 or 54 when you pick the pin. DS18B20 probes all share one wire, so each probe number is a virtual port from 700 to 799 (probe 1 = 700, probe 2 = 701 ...): `MB_700_1W_HLT__HL`. A probe number can belong to one Device only.

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
- **One Device per port, with one exception.** Two Devices can't use the same port on the same Interface, except outputs of different Device Types. Like in BruControl, you pick the Interface, then the Port, and then you can add more than one type on that Port. Example: one heater wired to port 5 can have `MB_05_Hys_HLT__BR` and `MB_05_PID_HLT__BR`.
- **The last one turned on wins.** When you enable (or turn on) one of them, the others on that port are turned off at once, so only one drives the heater. Inputs, like a probe or a switch, never share a port.

## Pins kept for RTD and OneWire probes

Some probes share pins on the board. On an Arduino Mega with the Skynet sketch:

- **RTD and thermocouple probes** (PT100, PT1000, MAX31855 / MAX31856 boards) all use the **SPI pins 50, 51 and 52**. Each board also has one pin of its own, its chip-select (CS) pin, and that is the Port in its name, for example `MB_48_RTD_HLT__HL`. The CS pin can be any free pin except 50, 51 and 52.
- **DS18B20 (OneWire) probes** all share one data pin, **pin 40**. Each probe gets its own virtual port 700-799 in its name instead.

What the panel does:

- **Blocked:** once an RTD or thermocouple is on an Interface, pins 50, 51 and 52 on it can't be used by anything else. Once a DS18B20 probe is set up, pin 40 can't be used by anything else.
- **Heads up:** if no such probe is there yet and you put something else on pin 50, 51, 52 or 40, the panel asks first. It tells you that while that Device is on the pin, you can't add RTD, thermocouple or DS18B20 probes to that Interface. Press **Cancel** to pick another pin.
- **Not allowed the other way round either:** if a pump already sits on pin 51, you can't add an RTD to that Interface until you move the pump.

Tip: keep pins 40 and 50-52 free, even if you have no such probes yet. Then you can add them later without rewiring.

### PWM and counter pins

A Mega has only 15 **PWM pins** (2-13, 44-46), for pump speed, SSR power and the like, and only 6 **counter pins** (2, 3, 18, 19, 20, 21), for flow meters. If you put a Device that doesn't need them (a relay, a switch, a valve) on one of those, the panel gives you a heads-up and names a free pin that fits it better, for example *Pin 14 is free and fits it*. A PWM output on pin 2 or 3 is offered a PWM pin that isn't a counter pin, and a flow meter on 2 or 3 is offered 18-21.

Press **OK** to keep your pin anyway, or **Cancel** to go back and pick another one. Once no better pin is free, there is no heads-up any more.

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

**Virtual ports.** Some Devices have no pin of their own, so, as in BruControl, they get a virtual port: hydrometers `200`, `201` ..., OneWire probes `700` to `799`. A Tilt would be named like `MB_200_Hydro_Red_Tilt__FE`.

## Thermistors

An NTC thermistor is read on an analog pin with a series resistor, using its **ohms at 25 °C** and its **Beta** value from the data sheet. The Add list has 10K (Beta 3950), 10K BCS-462 / BruControl (Beta 3977), 50K and 100K ready; for any other one pick **NTC** and type its numbers. The temperature is worked out in °C, and each probe shows **°F or °C**, whichever you pick in its properties.

## Devices you already have

Devices made before this keep their names, so your Processes still work. Their old type codes (`PmP`, `VlV` ...) are changed to the new Device Type IDs by themselves. Their properties show the **Suggested name**; you can type it into **Name** if you like. Your Processes are changed to the new name by themselves when you save the layout (see [Renaming Devices and Widgets](53-renaming)).

Interfaces and tabs from before get an ID by themselves the first time the Schema opens. Changing an Interface ID or Tab ID later does not rename Devices that already exist.

## Who can change things

Only an **Admin** can edit a Schema: add or change Interfaces, Devices, Widgets and tabs, or move graphics in **Edit layout**. Operators run Processes and switch things; Viewers watch.

See also [Devices and boards](03-devices) and [Login, users and passwords](10-login).
