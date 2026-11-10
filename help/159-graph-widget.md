# Graph Widget

A **Graph Widget** draws a **line graph over time** on a Tab, for example your fermenter temperature over the last 5 days, or an
iSpindel's gravity over 2 weeks (Skynet Rule 1.26). It used to be called the Chart Widget.
Each Graph draws up to **two** Devices or Widgets:

- **Channel 1** uses the **left** axis.
- **Channel 2** uses the **right** axis, so a temperature and a gravity can share one Graph.

The lines come from the readings kept in the **brew database** (see [Database and API](98-database-and-api)). A Device or Widget
must be **sent to the database** (its **Database** box, for example Every 1 minute), or its line stays empty, and the Graph says so.

## Add one

**Edit layout > Add Widget > On-screen controls > Graph (a line graph of recorded readings)**. It starts 610 x 190 pixels with a
1 hour Span. Double-click it for its Properties.

## Its Properties

| Properties | What it does | Process attribute |
|---|---|---|
| **1. Label** | The title over the graph (never blank) | `.label` |
| **Channel 1 (left axis)** | The Device or Widget drawn. The ⬢ beside it: **Auto scale** (the axis fits the readings), **Axis lowest** and **Axis highest** (when Auto scale is off), **Line color**, **Axis color** | `.ch1element`, `.ch1autoscale`, `.ch1ymin`, `.ch1ymax`, `.ch1linecolor`, `.ch1axiscolor` |
| **Channel 2 (right axis)** | The same for the second line | `.ch2element` ... `.ch2axiscolor` |
| **Span (seconds)** | How far back the graph goes: 3600 = 1 hour, 86400 = 1 day, 432000 = 5 days. The ⬢ beside it: **Grid lines across**, **Grid lines up and down** (0 = none) and the **Time axis color** | `.spanseconds`, `.hgridlines`, `.vgridlines`, `.xaxiscolor` |
| **Refresh interval (seconds)** | How often the graph is drawn again with the newest readings | `.refreshinterval` |

Like every Widget it also has a Tab, X, Y, Width, Height, Visible, Hidden Locked and Lock.

A Process can change a Graph while it runs, for example:

```
wgt_GPH_Conical_CT.spanseconds = 86400
wgt_GPH_Conical_CT.ch1element = "BS_62_AI_S_Ferm~Temp_CT"
wgt_GPH_Conical_CT.ch1linecolor = "#00B050"
```

A Graph made before the new name keeps its old name (`wgt_CHT_...`) and works the same; names already made never change by
themselves (Rule 3.5).
