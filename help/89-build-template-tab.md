# Build Template Tab

**☰ Menu > Build Template** (Admins only) is where Device Templates are made and changed (Skynet Rule 5.18).

## Picking a Template

The dropdown at the top lists every Device Template, for example the Skynet Motorized Ball Valve Device Master H and its
Daughters VL and VR.

- **➕ New Template** makes an empty one. Give it a name with letters, digits, _ and -, and no spaces.
- **⧉ Clone** makes a copy of the one showing.

## The Template's settings

- **Title** is what the Add Device lists show.
- **Master Template** makes it a Daughter. A Daughter inherits everything from its Master and keeps only what differs (for
  example VR: Orientation Vertical, Flip Horizontal on).
- **Pictures**: one pair (when on, when off) for Horizontal and one for Vertical. The picture follows the Device's Orientation; at
  45 degrees the vertical picture is turned.

## Attributes and "User can set"

Every attribute of the Device is listed with:

- its **value in the Template**, which every User version starts with, and
- a **User can set** box. **Ticked** means the attribute shows in the Properties of the Devices made from this Template, and a
  user can change it. **Not ticked** means it is fixed: it is hidden, and the Brain puts it back to the Template's value every
  time the layout is saved (Rule 5.16).

Some attributes are **always fixed**: the pictures, Kind, Valve type, Service, Look, Digits, When tapped, Tap target, Ask before
changing, background and imagePaths. Their box is greyed out.

Attributes that belong to each Device (Name, Label, Tab, X, Y, Interface, Pin, Lock) have no Template value, only the box.

Press **💾 Save** (at the top or the bottom). The Add Device lists use the change at once.

## Skynet Templates and locking

While Skynet is still being built, every Template made or changed here is a **Skynet Template**. A change to a shipped one is
kept on this Brain until it is sent in to GitHub. When Fritz says the Templates are done, they are **locked**: then they can only
be cloned, and this tab makes User Bundled Templates. Shipped Skynet Templates are never deleted.
