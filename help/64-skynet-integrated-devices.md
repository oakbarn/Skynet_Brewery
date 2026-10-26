# Skynet Integrated Devices

A **Skynet_Integrated_Device** is one item with Devices built into it. The first one is the **RIMS tube**: its heating element and its temperature probe are part of it. The second is the [Basic electric kettle](65-skynet-integrated-electric-kettle). A **Skynet_Integrated_Widget** is one with IPs built in, like the [Skynet Fittings](60-skynet-fittings) (elbows, tees).

An Integrated item can be bundled with other things, but what is built into it can never be taken out of it (un-bundled).

## RIMS tube

The RIMS tube has one picture (no choice): TC openings at the top left (wort in) and at the bottom (wort out), each with its IP built in, the thermowell and its probe in the left end, the heating element in the right end with its housing, and the power cord to the AC supply.

### Making a RIMS tube

It is made like any other Device. In **Edit layout**, pick **Devices: Skynet > RIMS tube** in the Add list and press Add. The **New Device: RIMS tube** box asks, in the same order as every Device:

1. **Interface**: the board the RIMS tube is wired to.
2. **Device Type**: RIMS tube. Pick how the heating element is controlled: **PID**, **Hysteresis**, **Duty Cycle** or **PWM**, and the type of **Temperature probe** in its thermowell.
3. **Available Ports / Pins**: one for the heating element and one for the temperature probe (a DS18B20 probe takes its OneWire probe number instead). The lists show the free pins on that Interface, best first.

Then type its **Label** and press **Create**. The RIMS tube goes on the 🔨 Build Tab with its two Devices beside it, and its Properties open. The Devices get suggested names as usual, for example `MB_9_PID_RIMS_Heat` and `MB_700_1W_RIMS_Temp`.

A **PID** or **Hysteresis** heating element holds the temperature that its own probe reads (its Input is set for you).

### Its Properties

Double-click the RIMS tube in Edit layout. Besides the usual Name, Display Name, Flip, Rotate and place settings, **Built-in Devices** has the Interface, the heating element control and Port, and the temperature probe type and Port. Change them here and Save: both Devices follow. A Device whose name is still the suggested one gets the new suggested name.

The two Devices can't be deleted by themselves. Deleting the RIMS tube deletes them too.

A RIMS tube put on a Tab from **☰ Menu > Equipment Templates** (the **RIMS_Tube** Template) has no Devices yet: open its Properties and set the Interface and Ports.

## Thermowells

A **Thermowell** is a Temperature Device drawn as a TC 1.5 thermowell. There are three: **Short**, **Medium** and **Long**. Pick **Devices: Skynet > Thermowell, Short** (or Medium, Long) in the Add list. A pop-up asks **2a. Type of Temperature Probe** in it; then the New Device box goes on as for every Device (Interface, Device Type, Available Ports, Label).

## Skynet TC 1.5 fittings

The Skynet Fitting Templates use Fritz's TC 1.5 drawings, with rounder bends: **Elbow_90**, **Elbow_45**, **Tee** (an equal tee), **End_Cap** and the new **Instrument_Tee**, a short tee with a short, narrow branch for a probe or a gauge. Fittings already on a Tab keep the picture they had.
