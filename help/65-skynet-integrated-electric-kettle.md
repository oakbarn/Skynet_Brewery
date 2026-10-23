# Skynet Integrated Electric Kettle

The **Basic electric kettle** is a [Skynet_Integrated_Device](64-skynet-integrated-devices) drawn from Fritz's picture. It is the base of every Skynet Integrated Electric Kettle: later ones add fittings and a valve to it as built-in parts.

It has three holes:

- **Thermowell** (upper hole, front center): its temperature probe is built in.
- **Outlet** (lower hole, front bottom center): a plain IP, so a pipe or a fitting can join it.
- **Heating element** (hole on the right side): its heating element is built in. It glows while it is on.

The probe and the element are two Devices of their own, each with its own Port. They can never be taken out of the kettle (un-bundled). The kettle itself can still be bundled with other things.

## Making one

It is made like any other Device. In **Edit layout**, pick **Devices: Skynet > Electric kettle, basic** in the Add list and press Add. The **New Device: electric kettle** box asks, in the same order as every Device:

1. **Interface**: the board the kettle is wired to.
2. **Device Type**: electric kettle. Pick how the heating element is controlled: **PID**, **Hysteresis**, **Duty Cycle** or **PWM**, and the type of **Temperature probe** in its thermowell.
3. **Available Ports / Pins**: one for the heating element and one for the temperature probe (a DS18B20 probe takes its OneWire probe number instead). The lists show the free pins on that Interface, best first.

Then type its **Label** (it starts as Kettle) and press **Create**. The kettle goes on the 🔨 Build Tab with its two Devices beside it, and its Properties open. The Devices get suggested names, for example `MB_9_PID_Kettle_Heat` and `MB_700_1W_Kettle_Temp`.

A **PID** or **Hysteresis** heating element holds the temperature its own probe reads (its Input is set for you).

## Its Properties

Double-click the kettle in Edit layout. Besides Name, Type, Display Name, Flip, Rotate and place, **Built-in Devices** has the Interface, the heating element control and Port, and the temperature probe type and Port. Change them and Save: both Devices follow.

The two Devices can't be deleted by themselves. Deleting the kettle deletes them too.

The kettle is also in **☰ Menu > Vessel Templates** as **Integrated_Electric_Kettle_Basic**. One put on a Tab from there has no Devices yet: open its Properties and set the Interface and Ports.
