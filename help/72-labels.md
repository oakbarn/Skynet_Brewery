# Labels and Show label

Every Device and Widget has a **Name** and a **Label**.

- The **Name** is the one Processes use, for example `MB_25_PWM@Valve_L_Fly~Sparge_SP`.
- The **Label** is the text the Tab shows, for example *Fly Sparge*. Empty = the Tab shows the Name.

The Label used to be called the **Display name** (`displayName` in the Schema file). It is now **Label** everywhere. An older Schema moves over by itself when it loads; nothing is lost.

## Show label (a Skynet Standard)

Every Properties dialog that has a **Label** also has a **Show label** switch right with it. Off = the Label is kept but not drawn on the Tab. This is true for:

- every Device and Widget
- the New Device dialog
- vessels, Tab_Vessels and Tab_Fittings, the RIMS tube and Integrated kettles
- IPs
- pipes and hoses (the label sits in the middle of the pipe; off when a pipe is new)
- the vessels in an Equipment Profile

## In a Process

```
tm_Mash.label = "Mash rest"
```

`label` is the only word for it in a Process.

A Label a Process sets shows on every screen while the panel runs. The Schema keeps the Label from the Properties, and
`tm_Mash.label = ""` puts that one back. The 3 Vessel sample's Brew Day uses it on its Step timer: the timer says what the brew is
doing, such as **Transferring 1st Run**. A timed step (mash, boil, whirlpool) counts down; every other step counts up, so you can see
how long each transfer, heat and chill takes.

See also [Text boxes](49-text-boxes) and [Interface, Tab and Device names](46-interface-tab-device-names).
