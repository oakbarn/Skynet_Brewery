# Log (the brew database)

The **Log** screen shows values that were written to the brew database (`data/brewlog.db` on the Brain), and turns them into CSV files for Excel, Google Sheets or LibreOffice.

What gets written, and when, is set in each Device or Widget's Properties, in the **Database and .API** box: see [Database and .API](98-database-and-api). Any Device or Widget with a value can be logged. Readings are kept by the item's hidden key, so a renamed item still shows all its readings under its name now.

## Download CSV

The box at the top of the Log page makes a CSV file and saves it to the computer or phone you are using.

1. **Tick the values** you want, like `HLT_Temp`, `MLT_Temp` and `RIMS_Temp`. The number after each name is how many readings it has. **Tick all** and **Untick all** help with long lists.
2. Pick the **Time**: Last hour, Last 4 hours, Last 12 hours, Today, Last 24 hours, Last 7 days, Last 30 days, Everything, or **From ... To ...** for your own start and end.
3. Pick the **Layout**:
   - **One column per value (for graphs)**: one row per moment, with the columns Time, Minutes, then one column per ticked value. Readings written in the same second share a row. Minutes counts from the first reading in the file, so a mash or a fermentation always starts at 0. This is the one to use for a graph: select the Minutes column and the value columns and insert a line chart.
   - **One row per reading**: Time, Name, Value and Trigger, exactly as each reading was written. Readings from a [simulated brew](20-simulation) have a Trigger that starts with `sim`.
4. Press **Download CSV**.

Times are in the local time of the computer or phone you download on, written like `2026-10-21 14:05:03`, so Excel and Sheets read them as dates and times.

### File name

The file is called `Skynet_Log_` + what is in it + the date and time of its first reading, like:

- `Skynet_Log_Mash_Profile_20261021T1405.csv` for the CSV set Mash Profile
- `Skynet_Log_HLT_Temp_20261021T1405.csv` for one value
- `Skynet_Log_3_values_20261021T1405.csv` for several ticked values

When there are no readings in the time span, the file only has its heading row and the date is today's.

### CSV sets (Mash Profile, Fermentor Profile ...)

A CSV set is a saved list of values, so the values you always want together are one pick away.

1. Tick the values, for example `MLT_Temp`, `RIMS_Temp` and `HLT_Temp` for the mash.
2. Press **Save as set** and give it a name, like `Mash Profile`. Use the same name again to change a set.
3. Next time pick **Mash Profile** in the **CSV set** list: its values are ticked for you. Pick the time and press **Download CSV**.

**Delete set** removes the set, never the readings. CSV sets belong to the Schema, so each Schema keeps its own. Brewers (operators) and admins can save and delete sets; view-only accounts can download.

> A good Fermentor Profile: give `Ferm_Temp` (and the Tilt gravity, when you have one) **Send to the database: Every 15 minutes** in its Properties, then download with **Last 7 days** or **Last 30 days**.

## Look at the readings

1. Pick a name, or leave it on all.
2. Set **From** and **To** if you want a time span, and **Max** rows.
3. Press **Show**: the newest readings are at the top.

> Graphs on screen are not built yet. Use **Download CSV** and a chart in Excel or Sheets for now.

For other programs, the API still gives the raw list at `/api/log.csv` (see [API](11-api)).
