# Process Version

Every Process can have a **Version**, so you can tell which copy of it you are running.

- The Version shows on the Process editor's top bar, beside the Process name: **Version 261030_11_58_1**. A Process that never had one shows **(none yet)**.
- **Update Version** (Admins) gives the Process a new Version made from the date and time now: **YYMMDD_HH_MM_n**. For example `261030_11_58_1` is 2026-10-30 at 11:58. A later one, `261030_12_02_1`, still ends in `_1` because the time makes it unique; `_n` only counts up (`_2`, `_3` ...) when you update it twice in the same minute.
- The time is the Brain's own clock.
- The Version is kept in the Schema with the Process. Renaming a Process keeps its Version.
- Update Version does not save the Process text: press **Save** for that. If there are unsaved changes you are asked first.

It is the same format as the Skynet Brewer version (see [Panel version](47-panel-version)).
