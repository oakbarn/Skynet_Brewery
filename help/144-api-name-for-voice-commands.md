# API_Name: the name a Voice Command says

Every Device and Widget that has a value has an **API_Name** box in its **Database and .API** pop-up (the ⬢ beside
Database and .API in its Properties). It is a String (text), and it is the name a **Voice Command** uses (Skynet Rule 6.18;
Fritz, 2026-11-06). It is only on the Database and .API pop-up.

## Unique

**An API_Name must be Unique.** Two items in the same Schema can't have the same API_Name. Capitals and extra spaces don't
count, so `Mash Temp`, `mash temp` and `Mash  Temp` are the same API_Name. Saving one that is already used says which item
has it, and nothing is saved until it is changed.

Name it the way you will say it. Fritz's example: a pump with the API_Name **Red Pump** is switched by saying
**"Turn on Red Pump"**. Others: `Hot Liquor`, `Mash Temp`. Spaces are fine. These characters are not allowed:
`< > : " / \ | ? *`. At most 60 characters.

## Blank

The API_Name can be left blank. Then the pop-up shows a warning:

> ⚠ API_Name is blank: a Voice Command can't be used for this item.

The item still works on its Tab, in Processes, in the database and in the web API by its Name. Only a Voice Command can't
reach it.

## Where it is used

- **Home Assistant (Alexa, Google Home, Siri)**: the API_Name is the name the item gets there and on your speakers. With
  no API_Name its Label is used, as before. The item must still have its **.API** on (Get only to read it, Get and Put to
  change it): the API_Name does not open anything by itself.
- **The web API** (`/api/items`): an item can be asked for by its Name or by its API_Name, for example
  `/api/items/Red%20Pump` or `/api/items/Red_Pump` (an `_` in the address stands for a space). The list shows each item's
  `apiName`.
- **Voice Commands** in Skynet itself are a later step; they will use the API_Name.

The API_Name is not the item's Name: the Name (Skynet Rule 3.1) is still what Processes use, and changing the API_Name
never changes a Process.

See also [Database and .API](98-database-and-api).
