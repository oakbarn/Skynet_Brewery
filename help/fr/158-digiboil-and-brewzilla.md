# DigiBoil et Brewzilla, réglées à la main {#digiboil-and-brewzilla-set-by-hand}

Une **DigiBoil** et une **Brewzilla 65 L** chauffent seules (la Brewzilla pompe aussi). Skynet ne peut rien en commander, donc Skynet vous dit quoi régler et vous attend (Règle Skynet 5.39).

Mettez-en une sur un Tab depuis **☰ Menu > Vessel Templates** : **Kettle_DigiBoil** ou **Kettle_Brewzilla_65L**. Le Schema Template OakBarn a les deux.

## Ce que chacune a {#what-each-one-has}

| | DigiBoil | Brewzilla 65 L |
|---|---|---|
| Interrupteurs | Power, Heater | Pump (vidange du fond), Heater 1, Heater 2, Heater 3 |
| Écran | Consigne et affichage de température | Consigne et affichage de température, un bouton On/Off et un endroit Run |
| Vannes manuelles | le Spigot (petit robinet argenté, filetage BSP) sur sa sortie | le Spigot sur sa sortie, et la vanne Pump out côté sortie de sa pompe |

Ses interrupteurs et son écran sont ses **Controls**, la case à côté (par exemple **DigiBoil_Controls**). Ses vannes sont intégrées à ses IP (par exemple **DigiBoil_Spigot**). Une vanne fermée arrête le débit sortant de cet IP.

## Dans un Process {#in-a-process}

| Ligne | Ce qui se passe |
|---|---|
| `DigiBoil_Controls.setpoint = 152` | une fenêtre : « Set the DigiBoil temperature set point to 152 °F (that is 66.7 °C) » (réglez la consigne de la DigiBoil à 152 °F, soit 66,7 °C) |
| `DigiBoil_Controls.power = on` | une fenêtre : « Turn the DigiBoil Power switch ON » (mettez l'interrupteur Power de la DigiBoil sur ON) |
| `DigiBoil_Controls.heat = on` | l'interrupteur Heater (sur la Brewzilla, Heater 1 ; `.heat2` et `.heat3` sont Heater 2 et 3) |
| `Brewzilla_Controls.pump = on` | l'interrupteur Pump de la Brewzilla |
| `Brewzilla_Controls.power = on` | le bouton On/Off sur l'écran de la Brewzilla |
| `Brewzilla_Controls.run = on` | « Press Run on the Brewzilla screen » (appuyez sur Run sur l'écran de la Brewzilla) |
| `open_valve DigiBoil_Spigot` | « OPEN DigiBoil Spigot by hand » (ouvrez le Spigot de la DigiBoil à la main) |
| `close_valve Brewzilla_Pump_Out` | « CLOSE Brewzilla Pump out valve by hand » (fermez la vanne Pump out de la Brewzilla à la main) |

Le Process attend que vous appuyiez sur **✔ Done**. Si c'est déjà réglé ainsi, il n'y a pas de fenêtre.

`open_valve` et `close_valve` marchent pour **toute** vanne : une manuelle vous demande et attend, une motorisée est commandée tout de suite.

## °F et °C {#f-and-c}

Les deux écrans repassent en **°C** chaque fois qu'on les éteint. Quand votre panneau travaille en °F, la fenêtre donne aussi la consigne en °C, pour que vous la régliez tout de suite, ou passiez d'abord l'écran en °F.

## À la main, sans Process {#by-hand-with-no-process}

Cliquez sur ses Controls (pas en Edit layout) pour dire ce que vous avez fait : un interrupteur, une vanne, une nouvelle consigne, ou ce qu'affiche son écran. Sur la Brewzilla, l'endroit **▶ Run** sur ses Controls montre qu'elle tourne.
