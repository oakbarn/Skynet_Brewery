# Predictive text in the Process editor

The Process editor helps you write a Process by offering what can come next, the way a phone keyboard does. You can still type everything by hand; the list is only there to help. A beginner can write a whole Process just by picking from the list.

## While you type

As soon as you type a letter, a list pops up under the cursor with what fits:

- At the **start of a line**: the commands first (`if`, `wait`, `start`, `new value` ...), each with a short note of what it does, then the names you already used higher up in this Process.
- **Anywhere else**: the names of your variables, timers, vAPI, vKonstants, Devices, Widgets and Processes.
- Each letter you type **narrows the list**: `vV_` shows every name that starts with `vV_`, `vV_A` only those starting with `vV_A`. Inside an `if` the list only holds what an `if` can take, so commands never show up there. Each kind (variables, timers, vAPI, vKonstants, Devices, Widgets) is listed A to Z.
- A name also matches on **any part after a `_`**. Typing `Pump` finds `MB_06_Pump_Wort__HS`, so you don't need to remember the start of a long Device name.

The best pick is also shown in **gray after the cursor**. To take it:

| Key | What it does |
|---|---|
| **Tab**, **Enter** or **Right arrow** | Takes the highlighted pick |
| **Up** / **Down** | Moves through the list |
| **Esc** | Closes the list |
| Click or tap | Takes that pick |

## After a dot: attributes

Type a name and a dot, and the list shows that item's attributes, with its main value first (`.state` for a pump, `.value` for a probe). Each letter you type narrows the list to the attributes that start with those letters:

| You type | The list shows |
|---|---|
| `Pump.` | every attribute of Pump, `state` first |
| `Pump.h` | `height`, `hidden` |
| `Pump.he` | only `height`, so it is filled in by itself |
| `Pump.st` | only `state`, filled in by itself |

At the start of a line the pick also gets ` = ` after it (`Pump.state = `); inside an `if` or a `wait` you get just the attribute.

## Ctrl+Space or the Suggest button: what can go here

Press **Ctrl+Space** (on a phone or tablet, tap **💡 Suggest** above the editor) to open the list even before you type a letter. It shows only what can go at that spot:

- On an **empty line**: the commands.
- After **`if`**, **`wait`** or **`elseif`**: only what can be tested, in this order: variables made in this Process, timers, vAPI, vKonstants, Devices, Widgets, Processes, then `true`, `false`, `now` and `not`. No commands.
- After a **name in an `if`** (`if MB_06_Pump_Wort__HS`): the compare signs (`==` is equal to, `!=` is not, `>` more than ...) and that item's own attributes, such as `.state` (the same as the name alone), `.visible` or `.enabled`.
- After a **name at the start of a line**: `=` set it to, `+=`, `-=`, `++`, and its attributes, such as `.visible = `.
- After **`==` or `=`** on something that is on or off (a pump, a valve, an alarm, a true/false variable): `true`, `false`, `on` and `off` come first.
- After a **whole test** (`if MB_06_Pump_Wort__HS == true`): `and` or `or`, to add another test.
- After **`start`**, **`stop`** or **`restart`**: your Processes, then the timers and alarms they can start or stop. After **`reset`**: timers and stepper motors.
- After **`play`**: alarms and sound players.
- After **`show tab`**: your Tab names (a name with a space gets its quotes).
- After **`goto`**: the `[labels]` in this Process.
- After **`new`**: `value`, `string`, `bool`, `time` and `datetime`.

## Writing a line by picking

When you pick a command or a name, the list of what can come next opens by itself. For example:

1. On an empty line press **Ctrl+Space** (or **💡 Suggest**) and pick `if`.
2. The list now shows what can be tested. Pick `MB_06_Pump_Wort__HS`.
3. The list shows `==`, `!=` ... and `.state`, `.visible`. Pick `==`.
4. The list shows `true` and `false` first. Pick `true`.

The line is now `if MB_06_Pump_Wort__HS == true`. A value ends the line, so the list stays closed and **Enter** makes a new line. To add another test, press **Ctrl+Space** again for `and` / `or`.

## What is never offered

- **Clones** of a Device are not used in Processes (see the Help page Cloned Devices), so they are never in the list. Use the Device's own name.
- **Hidden keys** never leave the Brain and can't be used in a Process (see the Help page Name change and hidden keys). Only names are offered.

See [Process language and steps](22-process-language) for what each command does, and [The Process editor](30-process-editor) for the other editor tools.
