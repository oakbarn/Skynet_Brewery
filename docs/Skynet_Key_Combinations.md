# Skynet Key Combinations

Which key combinations Skynet may use so that every shortcut works the same on **Windows, Mac, Linux and the Raspberry Pi** (Skynet Rule 2.73).
OakBarn Brewery, 2026-11-24: "I want things to work universal so ALT + Z and ALT + R are Out. and all the Firefox ones as well".

The same table as a spreadsheet: [Skynet_Key_Combinations.csv](Skynet_Key_Combinations.csv).

**Available on Skynet Tab:** **Yes** = free on all four systems and every browser. **By its place** = usable, but the key shows a different sign on European keyboards, so Help names it by where it sits. **No** = something on at least one system uses it. **In use** = Skynet already uses it.

- Mac: Option is the Alt key. Option + key normally types a symbol, so Skynet reads the key by its place (`ev.code`) and the shortcut still works.
- "When installed" = only on PCs with that program (NVIDIA or AMD graphics app). Skynet treats them as taken, since many brewers have them.
- Pi = Raspberry Pi OS with Chromium. Linux = a common desktop (GNOME, KDE) with Chrome or Firefox. Desktops differ. **Unknown** in the Pi column means it is questionable on a Pi (not checked there); the words after it say what other Linux desktops do.
- No shortcut ever works while typing in a text box.

**Short list:** Alt + A, C, G, I, J, K, L, M, N, O, P (in use), Q, U, W, X, Y. Shift + Alt + any letter except A, I, T. Shift + Alt + numbers and arrows. Never Ctrl + Alt, Alt + number, Alt + arrows, Alt + F-keys, Alt + mouse.

## Alt + letter

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Alt + A** | None | Types å | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + B** | Firefox: Bookmarks menu | Types ∫ | Firefox: Bookmarks menu | Firefox: Bookmarks menu | No |  |  | Firefox menu |
| **Alt + C** | None | Types ç | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + D** | Chrome / Edge: jump to the address bar | Types ∂ | Chrome / Chromium: jump to the address bar | Chromium: jump to the address bar | No |  |  | Browser address bar on Windows, Linux and Pi |
| **Alt + E** | Chrome / Edge: open the browser menu | Types ´ (accent key) | Chrome / Chromium: open the browser menu | Chromium: open the browser menu | No |  |  | Browser menu on Windows, Linux and Pi |
| **Alt + F** | Chrome / Edge: open the browser menu; Firefox: File menu | Types ƒ | Chrome / Chromium: open the browser menu; Firefox: File menu | Chromium: open the browser menu; Firefox: File menu | No |  |  | Browser menu on Windows, Linux and Pi; Firefox File menu |
| **Alt + G** | None | Types © | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + H** | Firefox: Help menu | Types ˙ | Firefox: Help menu | Firefox: Help menu | No |  |  | Firefox menu |
| **Alt + I** | None | Types ˆ (accent key) | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + J** | None | Types ∆ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + K** | None | Types ˚ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + L** | None | Types ¬ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + M** | None | Types µ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + N** | None | Types ˜ (accent key) | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + O** | None | Types ø | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + P** | None | Types π | None | None | Yes | Picture picker (admins, Rule 18) | In use. Read by its place, so Option + P on a Mac works. |  |
| **Alt + Q** | None | Types œ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + R** | AMD Adrenalin overlay; NVIDIA performance overlay, when installed | Types ® | None | None | No |  | Fritz: "ALT + Z and ALT + R are Out". | AMD and NVIDIA overlays on Windows PCs |
| **Alt + S** | Firefox: History menu | Types ß | Firefox: History menu | Firefox: History menu | No |  |  | Firefox menu |
| **Alt + T** | Firefox: Tools menu | Types † | Firefox: Tools menu | Firefox: Tools menu | No |  |  | Firefox menu |
| **Alt + U** | None | Types ¨ (accent key) | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + V** | Firefox: View menu | Types √ | Firefox: View menu | Firefox: View menu | No |  |  | Firefox menu |
| **Alt + W** | None | Types ∑ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + X** | None | Types ≈ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + Y** | None | Types ¥ | None | None | Yes |  | Free. Read by its place, so Option on a Mac works. |  |
| **Alt + Z** | NVIDIA overlay (GeForce Experience / NVIDIA App), when installed | Types Ω | None | None | No |  | Was Zoom in PR 601, taken out 2026-11-24. Plain Z opens Zoom. | NVIDIA overlay on many Windows PCs |

## Alt + number

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Alt + 1** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 1 | Chromium / Firefox: go to browser tab 1 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 2** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 2 | Chromium / Firefox: go to browser tab 2 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 3** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 3 | Chromium / Firefox: go to browser tab 3 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 4** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 4 | Chromium / Firefox: go to browser tab 4 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 5** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 5 | Chromium / Firefox: go to browser tab 5 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 6** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 6 | Chromium / Firefox: go to browser tab 6 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 7** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 7 | Chromium / Firefox: go to browser tab 7 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 8** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to browser tab 8 | Chromium / Firefox: go to browser tab 8 | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 9** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | Chrome / Firefox: go to the last browser tab | Chromium / Firefox: go to the last browser tab | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |
| **Alt + 0** | Top row: none. Number pad: types an Alt code character (Alt + 0176 = °) | Types a symbol | None | None | No |  |  | Browser tab switch on Linux and Pi; Alt codes on Windows |

## Alt + function keys

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Alt + F1** | NVIDIA: screenshot, when installed | Option + brightness/volume keys open their Settings | GNOME: Activities / app menu on some desktops | Unknown (some desktops: app menu) | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F2** | NVIDIA: photo mode, when installed | None | GNOME: run a command | Unknown (some desktops: run a command) | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F3** | NVIDIA: game filter, when installed | None | Some desktops: search | Unknown | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F4** | Close the window (whole browser) | None | Close the window | Close the window | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F5** | None | None | Some desktops: restore window size | Unknown | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F6** | Cycle panes in some programs | None | GNOME: switch windows of the same program | Unknown | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F7** | None | None | GNOME / KDE: move the window | Unknown (some desktops: move the window) | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F8** | None | None | GNOME / KDE: resize the window | Unknown (some desktops: resize the window) | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F9** | NVIDIA: start / stop recording, when installed | None | Some desktops: minimize | Unknown | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F10** | NVIDIA: save instant replay, when installed | None | GNOME: maximize / restore the window | Unknown (some desktops: maximize) | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F11** | None | None | None | Unknown | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |
| **Alt + F12** | None | None | None | Unknown | No |  | Laptops need an Fn key too, and many keyboards use these for volume / brightness. | System, window or graphics overlay keys on at least one system; Fn needed on laptops |

## Alt + other keys

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Alt + Tab** | Switch programs | Types a tab in some boxes | Switch programs | Switch programs | No |  |  | System program switcher |
| **Alt + Space** | Window menu (move, size, close) | Types a non-breaking space | Window menu | Unknown (window menu (most desktops)) | No |  |  | System window menu |
| **Alt + Esc** | Switch to the next window | None | Switch windows | Unknown | No |  |  | System window switcher |
| **Alt + Enter** | In the address bar: open in a new tab; on files: Properties | None | In the address bar: open in a new tab | Chromium: in the address bar, open in a new tab | No |  |  | Browser address bar; too close to Enter, which saves dialogs |
| **Alt + Left Arrow** | Browser Back (leaves the Panel page) | In a text box: jump a word | Browser Back | Browser Back | No |  |  | Browser Back on Windows, Linux and Pi |
| **Alt + Right Arrow** | Browser Forward | In a text box: jump a word | Browser Forward | Browser Forward | No |  |  | Browser Forward on Windows, Linux and Pi |
| **Alt + Up Arrow** | In a dropdown: close its list | In a text box: jump a paragraph | Some desktops: window or workspace keys | Unknown | No |  |  | Dropdown key; Linux desktops vary |
| **Alt + Down Arrow** | In a dropdown: open its list | In a text box: jump a paragraph | Some desktops: window or workspace keys | Unknown | No |  |  | Dropdown key; Linux desktops vary |
| **Alt + Home** | Browser home page (leaves the Panel page) | None | Browser home page | Browser home page | No |  |  | Browser home page |
| **Alt + End** | None | None | None | Unknown | Yes |  | Free on Windows, Mac and Linux; not checked on a Pi. |  |
| **Alt + Page Up / Page Down** | None | None | None | Unknown | Yes |  | Free on Windows, Mac and Linux; not checked on a Pi. |  |
| **Alt + Backspace** | Undo in some boxes (old Windows key) | In a text box: delete a word | In a text box: delete a word (some) | Unknown | No |  |  | Text editing key |
| **Alt + Delete** | None | In a text box: delete the next word | None | Unknown | No |  |  | Text editing key on a Mac |
| **Alt + Print Screen** | Screenshot of one window | No such key | Screenshot of one window | Unknown | No |  |  | System screenshot |
| **Alt (pressed and let go alone)** | Chrome / Edge: focus the browser menu; Firefox: show the menu bar | None | Firefox: show the menu bar | Firefox: show the menu bar | No |  |  | Browser menu |

## Alt + punctuation

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Alt + `  (the ~ key)** | None | Accent key (`) | GNOME: switch windows of the same program | Unknown | No |  | The key shows ² on a French keyboard, ^ on a German one. | GNOME window switch; Mac accent key; different key in Europe |
| **Alt + -** | None | Types – | None | None | By its place |  | Read by its place (the key right of 0). On European keyboards the key shows ) on French; ß on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + =** | None | Types ≠ | None | None | By its place |  | Read by its place (the key left of Backspace). On European keyboards the key shows = on French; ´ (accent key) on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + [** | None | Types “ | None | None | By its place |  | Read by its place (the key right of P). On European keyboards the key shows ^ on French; Ü on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + ]** | None | Types ‘ | None | None | By its place |  | Read by its place (the key right of [). On European keyboards the key shows $ on French; + on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + \** | None | Types « | None | None | By its place |  | Read by its place (the key above Enter). On European keyboards the key shows * on French; # on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + ;** | None | Types … | None | None | By its place |  | Read by its place (the key right of L). On European keyboards the key shows M on French; Ö on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + '** | None | Types æ | None | None | By its place |  | Read by its place (the key right of ;). On European keyboards the key shows ù on French; Ä on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + ,** | None | Types ≤ | None | None | By its place |  | Read by its place (the key right of M). On European keyboards the key shows ; on French; , on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + .** | None | Types ≥ | None | None | By its place |  | Read by its place (the key right of ,). On European keyboards the key shows : on French; . on German, so Help names it by its place. Use the allowed letters first. |  |
| **Alt + /** | None | Types ÷ | None | None | By its place |  | Read by its place (the key left of right Shift). On European keyboards the key shows ! on French; - on German, so Help names it by its place. Use the allowed letters first. |  |

## Shift + Alt

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Shift + Alt + A** | Chrome: focus an inactive browser pop-up | Types a symbol (Shift + Option) | Chrome: focus an inactive browser pop-up | Chromium: focus an inactive browser pop-up | No |  |  | Chrome / Edge keeps it |
| **Shift + Alt + B** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + C** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + D** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + E** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + F** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + G** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + H** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + I** | Chrome / Edge: send feedback / report an issue | Types a symbol (Shift + Option) | Chrome / Chromium: report an issue | Chromium: report an issue | No |  |  | Chrome / Edge keeps it |
| **Shift + Alt + J** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + K** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + L** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + M** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + N** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + O** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + P** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + Q** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + R** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + S** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + T** | Chrome / Edge: focus the toolbar | Types a symbol (Shift + Option) | Chrome / Chromium: focus the toolbar | Chromium: focus the toolbar | No |  |  | Chrome / Edge keeps it |
| **Shift + Alt + U** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + V** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + W** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + X** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + Y** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + Z** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free. On Windows, Shift + Alt alone (no letter) switches keyboard language on PCs with two languages. |  |
| **Shift + Alt + 0 to 9** | None | Types a symbol (Shift + Option) | None | None | Yes |  | Free, outside text boxes. |  |
| **Shift + Alt + arrows** | None | In a text box: pick a word / paragraph | Some desktops with Ctrl too (not without) | None | Yes |  | Free, outside text boxes only. |  |
| **Shift + Alt (pressed alone)** | Switches keyboard language (PCs with two languages) | None | Some desktops: switch keyboard layout | Unknown | No |  |  | Keyboard language switch |

## Ctrl + Alt

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Ctrl + Alt + any letter or number** | On European keyboards Ctrl + Alt is AltGr and types characters (€, @, [, {) | Control + Option is the VoiceOver key (screen reader) | Ctrl + Alt + T terminal, + L lock screen, + D show desktop (some), + Delete log out | Chromium + Linux: Ctrl + Alt + T opens a terminal; others Unknown | No |  |  | AltGr typing in Europe; Linux and Pi system keys; Mac VoiceOver |
| **Ctrl + Alt + arrows** | Some PCs (Intel graphics): rotate the screen | VoiceOver: move around | Switch desktops / workspaces | Unknown | No |  |  | Screen rotate on Windows; desktop switch on Linux |
| **Ctrl + Alt + F1 to F12** | None | None | Leave the desktop for a text console | Linux: leave the desktop for a text console | No |  |  | Linux / Pi console switch |
| **Ctrl + Alt + Delete** | Security screen | No such key | Log out / restart (desktop dependent) | Unknown | No |  |  | System key |

## Mouse

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Alt + left click / drag** | Chrome / Edge: Alt + click on a link downloads it; otherwise reaches the page | Option + click on a link downloads it (Safari); otherwise reaches the page | XFCE and others: moves the whole window (GNOME / KDE use the Windows key instead) | Unknown (likely moves the window, as older Pi OS did) | No | Hold Alt while dragging = place without the snap (Edit layout) | Fritz, 2026-11-24: "Can alt + Left Mouse Click work". The Alt no-snap drag may not reach the Panel on a Pi. | Window move on many Linux desktops and likely the Pi |
| **Alt + right click** | Reaches the page | Reaches the page | Some desktops: resize the window or window menu | Unknown | No |  |  | Window keys on Linux desktops |
| **Shift + left click** | Chrome / Edge: on a link opens a new window; otherwise reaches the page | Reaches the page | Reaches the page | Chromium: on a link opens a new window; otherwise reaches the page | Yes |  | Safe on all four (not on links). |  |
| **Ctrl + left click  (⌘ + click)** | On a link opens a new tab; otherwise reaches the page | ⌘ + click: same. Ctrl + click is a right-click on a Mac | Same as Windows | Chromium: same as Windows | In use | Opens Properties in Edit layout (Rule 2.9) |  |  |
| **Shift + right click** | The browser's own menu | The browser's own menu | The browser's own menu | Chromium: the browser's own menu | In use | Browser menu instead of Help (Rule 2.11) |  |  |
| **Right click** | Browser menu | Browser menu (or Ctrl + click) | Browser menu | Browser menu | In use | Help for what is under the mouse (Rule 2.11); never drags (Rule 2.9) |  |  |
| **Left hold (0.4 s) then drag** |  |  |  |  | In use | Moves a QD hose end, chiller or Template icon outside Edit layout (Rule 2.9) |  |  |
| **Double-click** |  |  |  |  | In use | Opens Properties in Edit layout; finishes a hose |  |  |

## Other keys Skynet already uses

| Combination | Action on Windows | Action on Mac | Action on Linux | Action on Pi | Available on Skynet Tab | Skynet Assigned | Comments | Reason to Exclude |
|---|---|---|---|---|---|---|---|---|
| **Z** |  |  |  |  | In use | Zoom box on / off (Edit layout, Rule 5.37) | Not in a text box or dialog. |  |
| **R** |  |  |  |  | In use | Turns the picked fitting a quarter turn right; **Shift + R** left (Edit layout, Rule 5.5) | Not in a text box or dialog; only with a fitting that can turn picked. |  |
| **H** |  |  |  |  | In use | Flips the picked fitting left to right (Edit layout, Rule 5.5) | Not in a text box or dialog. |  |
| **V** |  |  |  |  | In use | Flips the picked fitting top to bottom (Edit layout, Rule 5.5) | Not in a text box or dialog. |  |
| **Ctrl + Z  (⌘ + Z)** |  |  |  |  | In use | Put back the last move (Edit layout); undo typing in a box |  |  |
| **Ctrl + Y  (⌘ + Y)** |  |  |  |  | In use | Redo typing in a box (Rule 2.32) | Ctrl + Shift + Z redoes too (browser). |  |
| **Ctrl + B  (⌘ + B)** |  |  |  |  | In use | Bold code \b ... \b in a text box (Rule 2.32) |  |  |
| **Ctrl + Shift + D  (⌘ + Shift + D)** |  |  |  |  | In use | Types °F or °C in a text box (Rule 2.32) |  |  |
| **Shift + Enter** |  |  |  |  | In use | Types the new line code \n in a text box (Rule 2.32) |  |  |
| **Ctrl + S  (⌘ + S)** |  |  |  |  | In use | Save in the Process editor and the Schema editor |  |  |
| **Ctrl + F  (⌘ + F)** |  |  |  |  | In use | Find bar |  |  |
| **Ctrl + H** |  |  |  |  | In use | Replace bar | ⌘ + H hides the app on a Mac, so Ctrl only. |  |
| **Delete / Backspace** |  |  |  |  | In use | Delete the picked item (Edit layout, Rule 2.64) | Not in a text box or dialog; Ctrl + Z brings it back. |  |
| **B / Insert / Right Arrow** |  |  |  |  | In use | Copy of the focused Template onto the 🔨 Build Tab (Rule 4.10) | Right Arrow added 2026-11-24 (PR 601). |  |
| **Enter** |  |  |  |  | In use | Opens a focused Template; Save / next box in dialogs |  |  |
| **Esc** |  |  |  |  | In use | Closes the Zoom box, pop-ups and dialogs |  |  |
