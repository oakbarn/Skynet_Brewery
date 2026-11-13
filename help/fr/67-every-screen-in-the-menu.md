# Chaque écran dans le ☰ Menu {#every-screen-in-the-menu}

Le **☰ Menu** liste chaque endroit du panel où vous pouvez aller, donc rien n'est caché. C'est la même liste partout : le ☰ Menu de la page des Tabs, le ☰ de la Menu Bar des autres pages, et le petit ☰ dans le coin d'une fenêtre (voir [Le ☰ Menu partout](51-menu-everywhere)).

La liste a trois parties :

1. **Show Menu Bar** et **Edit layout** (Admins).
2. **Menu tabs** : Zoom, Default, Equipment Profile, Vessel, les Templates, les Profiles, Schema, About ... dans leur ordre (voir [Le ☰ Menu](33-menu)).
3. **Pages** : chaque page de la Menu Bar, et sous chaque page, marquées par **↳**, ses parties.

Choisissez une page pour aller en haut de celle-ci. Choisissez une partie **↳** pour y aller directement : la page s'ouvre, défile jusqu'à cette partie et l'éclaire un instant. Une partie qui est une fenêtre (Recycle Bin, Backups ...) ouvre cette fenêtre.

## Les parties sous chaque page {#the-parts-under-each-page}

- **Tabs** : chacun de vos Tabs d'écran (celui où vous êtes est en gras).
- **Processes** : Find in all Processes, Recycle Bin (Processes supprimés), Color key.
- **Variables** : chaque gGlobal.
- **Log** : Download CSV, Show readings.
- **Devices** : **Interfaces (boards)** (les cartes (PLC) et leurs Interface ID), Add Interface, OneWire probe index, OneWire probes seen.
- **Import** : BeerSmith recipe, BruControl Schema.
- **Settings** : Start from a sample Schema, My account (mot de passe), Sign-in codes by email or text, Users, Password rules, Recovery code, Sending codes, Simulation, Panel settings, Beer money pop-up, Pictures (PNG / JPG to SVG), MQTT and voice.
- **Schema.json** : Backups.
- **Media**, **File Move** et **Help** n'ont pas de parties : toute la page est un seul écran.

## Qui voit quoi {#who-sees-what}

Une page ou une partie que seuls les Admins peuvent utiliser (File Move, Schema.json, Users, MQTT and voice ...) ne s'affiche que dans le ☰ Menu d'un Admin, comme sur la page elle-même. Les Operators et les Viewers voient le reste.

Les Tabs du jour de brassage restent propres : ces choix vivent dans le ☰ Menu, à un appui.
