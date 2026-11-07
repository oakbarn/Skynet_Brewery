# Shared variables became gGlobals

There used to be a **Shared variable**: a value that Processes could pass to each other, with no place on a Tab, in the
database or for outside programs. A **gGlobal** does the same job, so the Shared variable class is gone (Skynet Rule 1.25;
Fritz, 2026-11-07).

## What happens to the ones you have

When an older Schema loads, each Shared variable becomes a **gGlobal** of the Kind that fits it:

| It held | It becomes |
|---|---|
| a number | gV_Global_Value |
| text | gS_Global_String |
| true or false | gB_Global_Boolean |
| a time | gT_Global_Time |
| a date and time | gD_Global_DateTime |

It keeps its **Name**, its value and its first value, so every Process that uses it works as before. Its **Database** and
**.API** are **Off**, so nothing outside the Processes can see it. It is never on a Tab (gGlobals never are). You find it on
**☰ Menu > Variables** with the other gGlobals.

## Passing a value between Processes now

Make a gGlobal (**➕ New gGlobal**, or a `new gV gV_Name` line in a Process: see [Make a gGlobal in a Process](145-make-a-gglobal-in-a-process))
and leave its **Database** and **.API** Off.

## BruControl Globals

Globals brought in by the BruControl Import are set one at a time later, in the Importer's globals questions.
