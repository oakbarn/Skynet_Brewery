# gGlobal Kinds

Since 2026-11-02 (Fritz) a **gGlobal** is a variable with a global scope: every Process can read it and change it. It is **not a Widget** and it is **not on a Tab**. To show something on a Tab, use a Widget (a Text, Picture, Value, Time or Date Time Widget). Any Device or Widget can already go to the database and be reached by outside programs (its **Database and .API** box), so a gGlobal is no longer needed for that either.

Every gGlobal has one **Kind**. The Kind is picked when the gGlobal is made and **can never be changed**. If the Kind is wrong, delete the gGlobal and make a new one.

## The six Kinds

| Kind | .value is | Example |
|---|---|---|
| **gS_Global_String** | a String (text) | `gS_Brewer_Note.value = "Add the yeast nutrient at 10 minutes"` |
| **gG_Global_Graphic** | the path of a picture (it starts as the Image Path that Background # picks): the standard background picture paths (Image Path 1, 2, 3, Background #, Back Colour) | `gG_Brew_Day_Picture.background = 2` |
| **gV_Global_Value** | a Value (a number) | `gV_Strike_Temp.value = 163` |
| **gB_Global_Boolean** | a Boolean: true or false | `gB_Grain_Added.value = true` |
| **gT_Global_Time** | a Time, `hh:mm:ss` | `gT_Mash_Rest.value = 01:00:00` |
| **gD_Global_DateTime** | a Date Time | `gD_Brew_Day_Start.value = "2026-11-07T07:00:00"` |

The name prefixes (`gS_`, `gG_`, `gV_` ...) are hints. Any name works.

## Making a gGlobal

1. Open the **gGlobal** screen (☰ Menu > Variables) and press **➕ New gGlobal**.
2. Type its **Name**. It can't be blank, has no spaces and must be unique.
3. Pick its **Kind** from the dropdown.
4. That Kind's dialog opens below the Name. The Kind now shows 🔒: it is set.
5. Fill in the Kind's fields (below).
6. Press **💾 Save**, or **✖ Cancel**. If you changed anything, Cancel asks first: **🗑 Discard changes** or **↩ Go back to Save**.

The new gGlobal joins the list of its Kind on the gGlobal screen. Double-click its line to open its dialog again (to change its Name, its value or its settings, or to 🗑 Delete it).

## The Kind dialogs

All of them follow the General Dialog Rules: Name first, ✖ Cancel and 💾 Save at the top and the bottom, and 🗑 Delete when it already exists.

- **⬆ (red up arrow)** beside a String opens the **String Entry** box: two lines to type in, with word wrap.
- **⬢ (red hexagon)** opens a pop-up with the extra settings.

| Kind | Fields |
|---|---|
| gS_Global_String | **.value** with ⬆ |
| gG_Global_Graphic | **Image Path 1** (pick from the list or type a path) with ⬢ for the **Graphic Dialog**: Background # (1, 2 or 3 picks Image Path 1-3), Back Colour, Image Path 1, 2 and 3 with OPEN |
| gV_Global_Value | **.value**, Decimals, Units, Lowest allowed, Highest allowed |
| gB_Global_Boolean | **.value** as a switch (on = true) |
| gT_Global_Time | **.value** like `01:30:00` |
| gD_Global_DateTime | **.value** from a date and time picker |

Every Kind also has **Database and .API** with a ⬢ for its settings. Every gGlobal keeps its .value when a Process starts and when the Brain restarts: see [gGlobals keep their values](118-gglobals-keep-their-values). The .value you type is its first value.

## Sample

**➕ Add the sample gGlobals** on the gGlobal screen adds one of each Kind to the Schema you have open:

| Name | Kind | .value |
|---|---|---|
| gS_Brewer_Note | gS_Global_String | Add the yeast nutrient at 10 minutes |
| gG_Brew_Day_Picture | gG_Global_Graphic | Images/Skynet/Miscellaneous/brewery_main.png |
| gV_Strike_Temp | gV_Global_Value | 163 °F (32 to 212) |
| gB_Grain_Added | gB_Global_Boolean | false |
| gT_Mash_Rest | gT_Global_Time | 01:00:00 |
| gD_Brew_Day_Start | gD_Global_DateTime | 2026-11-07 07:00:00 |

A Process can use them like this:

```
if gB_Grain_Added == false
  gS_Brewer_Note.value = "Add the grain now"
  wait gB_Grain_Added == true
endif
gV_Strike_Temp.value = gV_Strike_Temp.value + 2
```

## Cancel asks before throwing changes away

In every dialog with ✖ Cancel and 💾 Save, if you changed something and press Cancel (or Esc), a warning asks: **🗑 Discard changes** or **↩ Go back to Save**. With nothing changed, Cancel just closes.

## The other gGlobal kinds

Switch, Push Button, Pulse Button, List, Step and Long String are **not gGlobals** any more (Fritz, 2026-11-02): they have a state you see on a Tab, so they go to a new class, **Semi_Widgets_Devices**. Until that is built they are still added on a Tab in **Edit layout** and work as before: see [Variables](04-variables).

Older gGlobals that are not true variables with a global scope will become a Text Widget or a Graphic Widget, one at a time. The list of every gGlobal in the shipped Schemas is in docs/ExistingGlobals.md.

## Coming in from BruControl

How BruControl Globals turn into these Kinds (and when the import asks you) is in the Importing Norms (docs/Importing_Norms.md), section 6c.
