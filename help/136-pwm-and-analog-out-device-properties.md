# PWM and Analog out Device Properties

Adding a **PWM output** or an **Analog output** (0-10 V or 4-20 mA) works the same way as adding a Pump (see
[Pump Device Properties](115-pump-device-properties)), with a few differences: it has **no Cover**, **no Orientation** (it has no
pipe ends) and **no Toggle** (a tap opens the box where you set its %). (Skynet Rule 18.25)

## Adding a PWM or Analog output

1. In Edit layout, click **PWM** (or **Select Device Type > PWM / Analog out**) and pick **PWM output**, **Analog output 0-10 V**
   or **Analog output 4-20 mA**. The **Pump speed** rows in the Pumps list open the same box.
2. The Add box opens titled **Add PWM Output** or **Add Analog Output**. Its **Label** is already filled in: **PWM_1** for a PWM output, **4_20_1** for a 4-20 mA Analog output, **0_10_1** for a 0-10 V one
   (the next number each time), so the cursor starts on the next empty field. You can change it, but it can't be blank. Fill it in order: 1 the **Label** (the ⬢ beside it sets
   its font and colors) and **Label Visible**, 2 the **Interface** (the board) and an **Available Port** on the same line (only the
   free PWM pins show), the **Device Type** (PWM to start; pick P_Pump, P_Fan ... if it drives one of those), 3 the **Tab**.
   Then the **Suggested Name** shows, made from them, with the rest:
   - **Graphic**: the output as it will show on the Tab. With no picture it shows its value (for example 45 %).
   - **Path**: the picture file (optional). It is the same picture when on and off.
   - **Overlay**: drawn on top while the output is above 0 % (the steady red and yellow lightning bolt). On the same line,
     **Database and .API ⬢** opens its settings (Help 98).
   - A PWM output: **Start value (%)** and **Decimals** on one line.
   - An Analog output: **Signal** and **Units** on one line, **Low value** and **High value** on one line (its value at the lowest
     and highest signal), then **Decimals**.
   - **X**, **Y**, **Width** and **Height**.
   **Enter** takes you through Label, Interface, Available Ports, Device Type, Tab, then **➕ Add Device**. If **➕ Add Device**
   looks faded, press it anyway: it tells you what is still missing.
3. Press **➕ Add Device**. The output goes on the Tab you picked and its Properties open. The **Interface** and **Port** are now
   greyed out and set: they are the wiring. To wire it to another board or pin, delete it and add it again. Its Name can still be
   changed with **✏ Change name**.

## Properties, from the top

- The title (**PWM Output Device Properties** or **Analog Output Device Properties**) with the 🔓 lock, **Visible** and
  **Hidden Locked**, then 🗑 Delete, ✖ Cancel, 💾 Save.
- **1. Label** ⬆ ⬢ and **Label Visible**; **2. Interface** with **Available Ports** (greyed out); **3. Tab**;
  **4. Name** and the Suggested Name.
- **Graphic**, **Path**, **Overlay** with **Database and .API ⬢**.
- Its own settings: Start value and Decimals (PWM), or Signal, Units, Low value, High value and Decimals (Analog).
- **X**, **Y**, **Width**, **Height**, and the **Device Type** last.

A Proportional Valve and a heating element's PWM keep their own dialogs.
