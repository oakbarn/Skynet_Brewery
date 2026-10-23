# BruControl Import Standards and Rules

This is the running list of how a BruControl Schema (.brucfg) should come into Skynet when the
**BruControl User Import** is built. Fritz adds rules here as they come up.

Status words:

- **Rule**: agreed with Fritz. Not yet built into the importer unless it says **Built**.
- **Built**: the importer (lib/brucontrol.js) or the Process rewriter (lib/modernize.js) already does it.

## Visibility

Started 2026-10-23 (Fritz).

Every Device and Widget has two true / false attributes:

- `.visible`: shown or not. It also takes the words `visible` (= `true`) and `hidden` (= `false`), but only `.visible` does.
- `.hidden`: keeps the item hidden. Only `true` or `false`. `.hidden = true` takes precedence over `.visible = true`.

| BruControl | Skynet | Status |
| --- | --- | --- |
| `"my Element" visibility = visible` | `"my Element".visible = true` | Built (Process lines) |
| `"my Element" visibility = hidden` | `"my Element".visible = false` | Built (Process lines) |
| `"my Element" visibility = hiddenlocked` | `"my Element".visible = false` and `"my Element".hidden = true` (written `"my Element".visible = false; "my Element".hidden = true`) | Built (Process lines) |
| Element Appearance `Visibility = Visible` | `visibility: "visible"` (Visible switch on) | Built |
| Element Appearance `Visibility = Hidden` | `visibility: "hidden"` (Visible switch off) | Built |
| Element Appearance `Visibility = HiddenLocked` | `visibility: "hidden"` and `hidden: true` (Hidden, locked switch on) | Rule (the importer now only keeps a `bru.visibility = "HiddenLocked"` note) |

The Process lines are rewritten by lib/modernize.js, which runs when a Process is saved, when a
BruControl Schema is imported, and once at start-up for Processes on disk (old copy kept as
`.before-hidden.bak`).
