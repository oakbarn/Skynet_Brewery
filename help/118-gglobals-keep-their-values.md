# gGlobals keep their values

**Every gGlobal is non-volatile**. It keeps its **.value** like a setting does, not like a
Process variable:

| | A Process variable (`new value vTemp`) | A gGlobal (`gV_Strike_Temp`) |
|---|---|---|
| Who can use it | Only the Process that made it | Every Process (global scope) |
| When a Process starts | Starts empty again | **Keeps its value** |
| When a Process stops or restarts | Gone | **Keeps its value** |
| When the panel is closed or the Brain is shut down or loses power | Gone | **Kept on the Brain's disk** |
| When the Brain starts again | – | **Comes back with the value it had** |

## How it works

- When a gGlobal changes (from a Process or from its dialog), Skynet writes the new
  value to the Brain's disk within about a third of a second. If a Process is changing it all the time, it is still written at least
  once every second. Closing Skynet Brewer (☰ Menu > Close Skynet Brewer) writes it once more.
- The values are in **data/state.json** on the Brain, whether the Brain is a Raspberry Pi or a Windows, Linux or Mac computer. Each write is made safely: the new values go to a new file first, the last
  good copy is kept as **data/state.json.bak**, then the new file takes its place. If the power goes off in the middle of a write,
  the panel starts with the last good copy.
- There is **no "Keep value on restart" switch** any more. Every gGlobal keeps its value. Older Schemas that had the switch off
  lose the switch when they load, and keep their values from then on.
- The **.value** you type in a gGlobal's dialog is its **first value**: the value it has when it is made, before anything has
  changed it.

## Each Schema keeps its own

Each Schema has its own gGlobals, so each Schema keeps its own saved values. Loading another Schema saves the values of the one
you leave and brings back the values of the one you load.

## Starting fresh on purpose

A gGlobal is only put back to a start value when something sets it. If a brew day should start with clean values, put lines at the
top of its Flow Process that set them, for example:

```
gB_Grain_Added = false
gS_Brewer_Note = ""
```

The sample brew days already do this.

Installing a new version keeps every gGlobal value. Only the installer's **Start Fresh** (Skynet Rule 9.8, after its second
warning) deletes them, with the Schemas.

## Not included

- **Push Button** and **Pulse Button** gGlobals always start let go (OFF), so nothing is switched on by itself when the Brain starts.
- A **Long String** with a text file: its value is the text in the file, and the file is already on the disk.

See also: [gGlobal Kinds](108-gglobal-kinds), [Variables](04-variables), [Updating](18-updating).
