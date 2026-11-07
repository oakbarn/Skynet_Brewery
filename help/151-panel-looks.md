# Panel Looks (themes)

A **Look** (theme) is how the whole Panel looks: its back color, its Tabs and boxes, and the colors of its text and Labels
(Skynet Rule 2.39; Fritz, 2026-11-07: "We only need a few, and choose one that best matches the DevExpress ones").

## Why not BruControl's themes

BruControl's **Settings > Environment > Theme** (for example **Office 2019 Black**, palette **Default**) are paid DevExpress
themes. They are not public, and they would not work in a browser anyway. Skynet gets the same effect by setting the **Back
color** and the **Text and Label colors** (Fritz: "the same affect is by setting the Back and the Text colors"). This is one of the
changes from BruControl.

## The Looks

| Look | Close to | Back color | Text |
|---|---|---|---|
| **Office Black** (the default) | BruControl's Office 2019 Black | black gray | white, blue for the picked button |
| **Dark Gray** | BruControl's Office 2019 Dark Gray | dark gray | white, light blue for the picked button |
| **White** | BruControl's Office 2019 White or Colorful | light gray, boxes White (RGB 250 250 250) | dark gray, dark blue for the picked button |
| **Skynet Night** | the first Skynet look | blue gray | white, orange for the picked button |

Each Look is just a few color picks: the **Back color** (behind everything), **Tabs and boxes**, **Buttons and typing boxes**,
the **lines** around them, the **Text**, the **Labels and hints**, and the **picked button, Tab and headings** with the text on it.

## Picking a Look

Admins pick it on **Settings > Panel settings > Look (theme)**. The Panel changes at once and it is saved right away. The Look
belongs to the Schema, so each Schema can have its own. Every computer, tablet and phone that opens the Panel shows it, and the
sign-in and Help pages use it too.

## The Tabs

- **A new Tab** starts with the Look's Tab colors: its back color, and a Tab Style with the Look's Label and text colors
  (**Skynet Office Black**, **Skynet Dark Gray** or **Skynet White**). A Tab Style picked on **☰ Menu > Default tab** wins, and a Tab
  Background Profile's color wins over the back color. You can change any of them in **Tab settings**, as before.
- **Use this Look on every Tab** gives every Tab in the Schema the Look's back color and Tab Style. Pictures and everything on the
  Tabs stay as they are. First it keeps a copy of each Tab's colors.
- **Put the Tabs back** gives every Tab the colors it had before, if you do not like the new look. Only the last **Use this Look
  on every Tab** can be put back.

Devices and Widgets that have colors of their own keep them; only the ones that have none follow the Tab.

## The BruControl Import

The Import looks for your BruControl theme in BruControl's own settings files (it only reads them) and picks the closest Look:
a Black, Dark or High Contrast theme becomes **Office Black**, a Dark Gray one **Dark Gray**, and a White, Light, Colorful or Blue
one **White**. When it cannot find it, the Schema gets **Office Black**, the closest to BruControl's own default. Each imported
Tab gets the Look's Tab colors. You can change the Look afterwards in the Panel.
