# Getting started

Welcome to the **Brew Panel**, the brewery control program for the Skynet Brewery. It runs on the Raspberry Pi (the "brain") and you use it from any browser: a PC, Mac, tablet, Android phone or iPhone, in Chrome, Edge, Safari, Firefox or DuckDuckGo.

The Pi keeps everything: the layout of your screens, your processes, pictures, sounds, the brew log and this manual. Every screen you open shows the same live brewery, and processes keep running when every browser is closed.

## Opening the panel

- On the Pi itself: `http://localhost:8080`
- From another computer or phone at home: `http://<Pi's address>:8080`, for example `http://192.168.1.50:8080`
- Away from home: through Tailscale only. See [Installing Tailscale on Windows](00-tailscale-windows) and [Login, users and passwords](10-login).

The very first time, the panel asks you to **create the admin account**. That only works from a phone or computer on your home network.

## Finding your way

The buttons along the top are the main screens:

| Button | What it is for |
|---|---|
| **Tabs** | Your brewery screens: pumps, valves, temperatures, timers, pipes. Where you brew. |
| **Processes** | Write, check, start and stop processes (automatic brew steps). |
| **Variables** | Every vKonstant, vAPI and Shared variable and its value. |
| **Log** | Values written to the brew database, with a CSV download. |
| **Devices** | The boards (PLCs) connected to the Pi, and the temperature probe list. |
| **Media** | Add pictures and sounds to the Pi from any browser. |
| **Import** | Bring in a BeerSmith recipe or a BruControl configuration. |
| **Settings** | Samples, your password, users and panel settings. |
| **Help** | This manual. |

What you can see depends on your role. An **Admin** sees everything; an **Operator** can run a brew day; a **Viewer** can only watch. See [Login, users and passwords](10-login).

## Common jobs

- Change a tab's background picture or color: [Tab background picture and color](26-tab-background).
- Put your own pictures and sounds on the Pi: [Media](07-media).

## Words used in this manual

The [Glossary](13-glossary) explains every special word. The three you will meet most:

- **Tab**: one brewery screen (BruControl calls these workspaces).
- **Device**: anything tied to a port or pin on a board (a pump relay, a probe, a valve).
- **Widget**: something that lives only in the app and is not tied to any board (a pipe fitting, a note, a timer).

## Updating to a new version

Stop the panel first, then run the installer again or unzip the **Update** zip. Your layout, settings, brew data, users, pictures, sounds and processes are never overwritten. See [Updating to a new version](18-updating).

## About this manual

Click a page on the left (on a phone, the page buttons are at the top). Type in **Search the manual** to find a word on every page. When you open Help from another screen, it opens the page about that screen.

**Print** prints the page you are reading. Admins see **Edit page** and **New page**: see [Editing this manual](12-editing-help).
