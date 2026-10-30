# Tab Styles

A **Tab Style** is the look of the Devices and Widgets on a Tab. It sets, as two separate groups:

- **Label** (the title of a Device or Widget): **Fore color**, **Back color**, **Font** and **Font size**.
- **The Device or Widget itself**: **Fore color**, **Back color**, **Font** and **Font size**.

A box left on **Default** keeps the look as it is now (the ☰ Menu > Default tab, then the panel's normal look).

## Only the ones with none of their own change

A Tab Style **never writes over** a color, font or size a Device or Widget already has. It only fills in what is left on Default. So when a Tab's Style changes, only the Devices and Widgets that had **no Fore and Back color of their own** change. Give one its own colors in its Properties and it keeps them on any Tab Style.

## Skynet Styles and User Styles

- **Skynet Styles** 🔒 come with Skynet and **can never be changed by a user** (Rule 2.24):
  - **Skynet Default**: everything as it is now.
  - **Tennyson**: the Label is black text (RGB 0 0 0) on light grey (RGB 195 195 195), **Comic Sans MS**, size **16**. The Device or Widget itself stays as it is now (light grey with black text).
- **➕ Add new User Style…** at the end of the list makes your own, starting from the one picked now. **✏ Edit** beside the list changes or deletes a User Style (greyed out for a Skynet Style). A User Style belongs to the Schema.

## Where to set it

- **One Tab:** Edit layout > **Tab settings** > **Tab Style**. The first choice, **(the Default tab's Style)**, makes the Tab follow the Default tab.
- **Every Tab with none of its own:** ☰ Menu > **Default** tab > **Tab Style**. It starts on Skynet Default.

The **Recipe** Tab in each sample Schema uses **Tennyson**. A Schema you already had gets Tennyson on its **Recipe** Tab once, the first time it loads with this version (only if that Tab had no Tab Style yet). After that, change it in Tab settings any time.

The Text Widget and the labels on vessels and equipment follow the Tab Style the same way. See also [Text Widget](91-text-widget) and [Timer Widget](92-timer-widget).
