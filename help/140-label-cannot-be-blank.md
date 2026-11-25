# The Label Cannot Be Blank

Every Device and Widget has a **Label**, and a Label can't be blank (Skynet Rules 18.15 and 18.28).

## What you see

In any **Add** box or **Properties** dialog with a Label, you can still move around while the Label is empty: the **Tab** key and
the mouse reach every other field and icon (the ⬆ two-line box, the ⬢, Label Visible, the Interface, the Port, the Tab, the ? Help).
Only **Save** or **➕ Add Device** (and a greyed out box) wait for a Label. Click one of them with the Label empty and you get a small
pop-up:

> ⚠ The Label cannot be blank.

The cursor goes back to the Label so you can type one. The pop-up goes away by itself after **2 seconds** (or tap it). Pressing
**Enter** in an empty Label keeps you on it, and clicking an empty spot of the dialog puts the cursor back in the Label.

## What always works

- **✖ Cancel** is always "hot": it works even while the Label is blank, so you can always leave the dialog. (If you changed
  something, it still asks first.) **Esc** works the same way.
- **🗑 Delete** is "hot" too: it works even while the Label, the Port or any needed box is blank (it does not ask first:
  the item goes at once, and **↩ Put back** (Ctrl+Z) brings it back).

## The Port too

When a Device needs a Port (a pin on its board), the same goes for the **Port**: Save or **➕ Add Device** gives **"⚠ The Port
cannot be blank."** while it is empty. An empty Port never keeps the cursor, so you can go to the **Interface** and pick a board
that has a free Port.

## Adding a new Interface from the dropdown

Pick **➕ Add new Interface…** in the Interface dropdown and the Add Interface box opens. When you save it, you come back with the
**new Interface picked** in the dropdown. If you cancel it instead, the **Interface that was there before** (the default) is put
back.
