# Ice Water Can

An **Ice Water Can** is a big trash can (or a tub or cooler) full of ice and water. Many brewers pump that cold water through
their chiller and let it run back into the can, so the same water goes round and round. It is a Widget with no Devices and no
IPs of its own (Skynet Rule 19.8): nothing in it is wired to a board. Skynet draws it for you, the can, its rim, its handles, the
water and the ice, in the shape of its box.

## Add one

In **Edit layout**, open **Add equipment ➕** and pick **Ice Water Can**. Like every new Widget it is made on the 🔨 Build Tab
first (Rule 4.1); **💾 Save Build ... > Move to Tab** puts it on its Tab. Its Label starts **Ice Water**. Drag its corner to
make it taller or wider.

## The ice water loop

The simplest loop: a sump pump sits in the can, its hose runs to the chiller, and a second hose runs from the chiller back into
the can. On the Tab:

1. Add the **Ice Water Can**.
2. Add a **Sump Pump by hand** (Select Widget Type > Semi_Widgets_Devices, Help 162) and drag it **inside the can**, low down.
   Its inlet is its screen, sitting in the water, so nothing is joined to its inlet.
3. Draw a hose from the pump's outlet to the chiller's Water In.
4. Draw a **Quick Disconnect hose** from the chiller's Water Out and drop its end in the **top third** of the can. It hangs over
   the rim, into the water (Help 127).
5. Plug the pump in, click it on the Tab and confirm. The hoses show the cold water moving, in **Blue**.

## Example: the OakBarn Brewery two chiller loop

OakBarn Brewery uses **two Plate Chillers**, and this chills the wort very fast:

- **Plate Chiller 1** (the pre-chiller): the ice water from the can runs through one side and goes back into the can. **Tap
  water** runs through the other side and comes out cold.
- **Plate Chiller 2** (the wort chiller): that cold tap water runs through one side, and the **wort** runs through the other.
- The tap water out of Plate Chiller 2 is **waste water**. It goes out to water the lawn.

On the Tab:

1. Draw the ice water loop above, through **Plate Chiller 1**'s Water In and Water Out.
2. Add a **Tap Water Valve** (Help 31) and draw a hose from it to **Plate Chiller 1**'s other side (Wort In). Each side of a
   plate chiller is its own path and never mixes with the other (Rule 5.41), so it does not matter that this side is named Wort.
3. Draw a hose from **Plate Chiller 1**'s Wort Out to **Plate Chiller 2**'s Water In.
4. Put a plain **IP** where the waste water leaves (Select Widget Type > IPs, couplings and caps), give it the Label **Lawn**, and
   draw a hose from **Plate Chiller 2**'s Water Out to it. Every hose end sits on an IP.
5. Pipe the wort through **Plate Chiller 2**'s Wort In and Wort Out as usual, from your kettle's pump.

Open the Tap Water Valve and turn on the sump pump: both water loops show **Blue**, the ice water going round and the tap water
going out to the lawn.

## Its color

The water from the can takes the can's **Out flow color**. It starts **Blue**, because the water is cold. Change it in its
Properties if you like (Help 116).

## The technical side

- Its Name has no spaces: `Ice_Water_Can_1`. A Process puts a hose in its top with `Hose_1.connect = Ice_Water_Can_1` and then
  waits for someone to press **Done** (Help 142).
- A running pump whose inlet is inside an Ice Water Can, with nothing joined to that inlet, draws from the can. Its flow takes the
  can's Out flow color (Rule 5.21).
- **Graphic:** leave it empty and Skynet draws it. Pick a picture of your own and that picture is used instead.
