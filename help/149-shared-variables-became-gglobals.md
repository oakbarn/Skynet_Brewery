# Shared variables became gGlobals

There used to be a **Shared variable**: a value that Processes could pass to each other, with no place on a Tab, in the
database or for outside programs. A **gGlobal** does the same job, so the Shared variable is gone from Skynet
completely (Skynet Rule 1.25).

## An older Schema that still has one

Skynet does not change an old Shared variable into anything. When an older Schema that still has one loads, the Shared
variable is **left out** and the rest of the Schema loads as normal. The Brain's start-up note names each one left out.
If a Process used it, make a gGlobal (below) with the same Name.

## Passing a value between Processes now

Make a **gGlobal** of the Kind that fits what it holds:

| It holds | Make a |
|---|---|
| a number | gV_Global_Value |
| text | gS_Global_String |
| true or false | gB_Global_Boolean |
| a time | gT_Global_Time |
| a date and time | gD_Global_DateTime |

Use **➕ New gGlobal** on **☰ Menu > Variables**, or a `new gV gV_Name` line in a Process (see
[Make a gGlobal in a Process](145-make-a-gglobal-in-a-process)). A gGlobal has no .API, so nothing
outside the Processes can see it. A gGlobal is never on a Tab.
