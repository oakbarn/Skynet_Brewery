# The Label Cannot Be Blank

Every Device and Widget has a **Label**, and a Label can't be blank (Skynet Rules 18.15 and 18.28).

## What you see

In any **Add** box or **Properties** dialog with a Label: if the Label is empty and you click or tap anything else (another field,
a switch, a dropdown, **Save**, **➕ Add Device**, an icon), nothing happens except a small pop-up:

> ⚠ The Label cannot be blank.

The cursor goes back to the Label so you can type one. The pop-up goes away by itself after **5 seconds** (or tap it). Pressing
**Tab** or **Enter** in an empty Label does the same.

## What always works

- **✖ Cancel** is always "hot": it works even while the Label is blank, so you can always leave the dialog. (If you changed
  something, it still asks first.) **Esc** works the same way.
- The Label's own **⬆** (bigger box) and **⬢** (Label attributes) icons, since they are for typing the Label.

## The Port too

When a Device needs a Port (a pin on its board), the same goes for the **Port**: once you are on the Available Ports dropdown and
it is still empty, clicking anything else gives **"⚠ The Port cannot be blank."** You can still go back to the **Label** or the
**Interface** (for example to pick a board that has a free Port), and Cancel always works.

## Adding a new Interface from the dropdown

Pick **➕ Add new Interface…** in the Interface dropdown and the Add Interface box opens. When you save it, you come back with the
**new Interface picked** in the dropdown. If you cancel it instead, the **Interface that was there before** (the default) is put
back.
