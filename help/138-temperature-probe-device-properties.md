# Temperature Probe Device Properties

Adding a **Temperature Probe** works the same way as adding a Pump (see [Pump Device Properties](115-pump-device-properties)).
A probe reads a temperature, so it has **no Cover, Toggle or Overlay**. This covers every probe: a plain probe, a **Thermowell**
(Short, Medium, Long) and a **tee with a Temperature Probe** (Instrument Tee or Long Tee). (Skynet Rule 18.26)

## Adding a probe

1. In Edit layout, click **Probe** (or the Add Device list) and pick the **kind of probe**: DS18B20, PT100, PT1000, a
   thermocouple, an NTC thermistor, LM35 or TMP36. For a **Thermowell** or a **probe tee**, pick it first, then step **2a**
   asks the kind of probe in it. The kind of probe is always picked first.
2. The Add box opens with the probe as its title, for example **Short Thermowell: DS18B20**. Its **Label** is already filled in
   by its kind of probe as **tP_Type_n** (the next number for that kind): **tP_1W_1** (DS18B20), **tP_RTD_1** (PT100 or PT1000),
   **tP_TC_1** (thermocouple), **tP_10KNTC_1**, **tP_50KNTC_1**, **tP_100KNTC_1** (NTC thermistors), **tP_LM35_1**, **tP_TMP36_1**,
   so the cursor starts on the next empty field. You can change the Label, but it can't
   be blank. Fill it in order: 1 the **Label** (the ⬢ beside it sets its font and colors) and **Label Visible**, 2 the
   **Interface** (the board) and, on the same line, the **Port**: the **1-Wire Index** for a DS18B20 (a new 1-Wire circuit, or the next Index on one you have: Help 234), or an
   **Available Port** (the chip-select pin of an RTD or thermocouple board, the analog pin of an NTC, LM35 or TMP36), 3 the **Tab**.
   Then the **Suggested Name** shows, made from them, with the rest:
   - **Graphic** and **Path** (a Thermowell or probe tee): the Skynet drawing as it will show on the Tab. The Path is set.
   - **Orientation** and, on the same line, **Flip** (a Thermowell or probe tee): turn it 90, 180 or 270 degrees and flip it.
     The Graphic and its IPs turn with it.
   - **Probe type**, greyed out: the kind you picked. The **⬢** beside it has its settings (wires and reference resistor of an
     RTD, thermocouple type, thermistor values, board voltage, Simulator settings).
   - **Units** (°F or °C) and **Decimals** on one line. Units is what the probe keeps its numbers in; a new probe starts in °C.
     What you see and type always follows ☰ Menu > Settings > Units, so a US brewer still sees °F (Skynet Rule 2.59).
   - **Display**: how the reading shows on its Tab: a **Number**, **LCD digits**, **LED digits** or the **Skynet Dial**; the ⬢ beside it holds the Dial settings ([Skynet Dial and Timer Digits](152-skynet-dial-and-timer-digits)). The reading and its unit always stay on one line (212.0 °F, even 9999.9 °F): when they are wider than the box the digits get smaller to fit, and go back to their own size when the reading is short again (Skynet Rule 2.56).
   - **Calibration offset** (added to every reading) and, on the same line, **Database and .API ⬢** (Help 98).
   - **X**, **Y**, **Width** and **Height**, and the **Device Type** greyed out (for example **TEMP@1W**: a DS18B20 probe, 1W, on a Temperature port, TEMP; a DS18B20's Suggested Name has its 1-Wire Index instead, for example BM1w1_1_HLT_BH).
   **Enter** takes you through Label, Interface, Port, Tab, Orientation, then **➕ Add Device**. If **➕ Add Device** looks faded,
   press it anyway: it tells you what is still missing.
3. Press **➕ Add Device**. The probe is made on the 🔨 [Build Tab](55-build-tab) and its Properties open; **✅ Finish Build ...** moves it to the Tab you picked. The **Interface** and **Port** are now
   greyed out and set: they are the wiring. To wire it to another board or pin, or to use another kind of probe, delete it and add
   it again. Its Name can still be changed with **✏ Change name**.

## Properties, from the top

1. The title is the probe (for example **Long Tee, probe in the branch: PT100 RTD**), with the **🔓 lock**, **Visible** and
   **Hidden Locked** beside it. Then **Delete**, **Cancel** and **Save**.
2. **1. Label ⬆ ⬢** and **Label Visible**. A Label is never blank: leave it empty and it becomes the Name.
3. **2. Interface** and its **Port**, greyed out.
4. **3. Tab** and **4. Name** (the Suggested Name; you may type your own).
5. **Graphic**, **Path**, **Orientation** and **Flip** (a Thermowell or probe tee).
6. The probe's own settings: **Probe type ⬢**, **Units** and **Decimals**, **Calibration offset** with **Database and .API ⬢**,
   **Setpoint**, **Boil Probe** and the **Reading now** (to help calibrate). **Boil Probe** marks the one probe in your boil kettle
   that `wait_boil` reads; on every other probe it is greyed out and a line says which probe has it (see [Boil temperature](238-boil-temperature)).
7. **X (Horizontal)**, **Y (Vertical)**, **Width**, **Height**, and the **Device Type** greyed out.

A Thermowell still snaps onto an IP, shows from the front on a front facing IP, and a probe tee still cuts a pipe as a tee does
(see [Probe tees and thermowells on pipes](132-probe-tees-and-thermowells-on-pipes)). A probe that is part of a RIMS tube or an
Integrated Electric Kettle keeps the dialog of that Device.
