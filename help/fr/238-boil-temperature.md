# Température d'ébullition selon la pression de l'air {#boil-temperature-from-the-air-pressure}

L'eau bout plus bas quand la pression de l'air est basse : en haut d'une montagne, ou quand une tempête arrive. Au niveau de
la mer l'eau bout à 212 °F (100 °C) ; à 1 600 mètres d'altitude elle bout vers 202 °F (95 °C). Un Process qui attend 212 °F
pourrait donc attendre pour toujours.

Skynet lit le bulletin météo de votre aéroport (son METAR) toutes les 30 minutes, ramène la pression à la hauteur de votre
brasserie et calcule la température à laquelle l'eau bout **ici et maintenant**. Vos Processes l'utilisent sous le nom
`skn_Boil_Temp`. Servez-vous-en pour savoir quand l'ébullition a commencé.

## Mise en place {#set-it-up}

Ouvrez **☰ Menu > Default settings > Boil temperature (air pressure)** (Admins).

| Case | Quoi y mettre |
|---|---|
| **Airport (ICAO)** | Le code ICAO de 4 lettres de votre aéroport, par exemple `KORD`. C'est la seule façon de choisir la station météo. |
| **Elevation** | La hauteur de votre brasserie au-dessus du niveau de la mer (pieds pour les Units US, mètres pour Metric). Elle commence à la hauteur de l'aéroport. Mettez la vôtre. |
| **Typed air pressure** | Ce n'est pas un réglage par défaut, donc elle n'a pas de case ici : elle sera demandée le jour de brassage (l'entretien du jour de brassage, pas encore fait). Une pression tapée avant est gardée et utilisée telle quelle, sans internet. Sautée : le bulletin de l'aéroport, ou une journée standard à votre Elevation. |

Appuyez sur **Test**. Skynet va chercher le bulletin tout de suite et affiche l'aéroport, la pression de l'air et la
température d'ébullition. **Save** garde les cases.

Cela ne marche qu'avec un code ICAO d'aéroport correct et une connexion internet. Si cela ne marche pas, l'effet est très
faible : Skynet utilise la pression tapée, ou l'air standard à votre Elevation, et affiche un seul avertissement.

## Trouver le code ICAO de votre aéroport {#how-to-find-your-airport-s-icao-code}

Le code ICAO est le code d'aéroport de 4 lettres des pilotes. Ce n'est pas le code de 3 lettres des étiquettes de bagages,
mais il en est souvent proche :

- **États-Unis :** la plupart sont **K** plus le code de 3 lettres. Chicago O'Hare (ORD) = `KORD`, Milwaukee (MKE) = `KMKE`.
- **Canada :** **C** plus 3 lettres. Toronto Pearson (YYZ) = `CYYZ`.
- **Ailleurs :** cherchez sur internet **code ICAO** et le nom de l'aéroport, par exemple *code ICAO aéroport de Munich*
  (`EDDM`).

Choisissez l'aéroport le plus proche qui a un bulletin météo. La plupart des grands aéroports en ont un ; beaucoup de petits
aérodromes non. Si **Test** dit *Check your Airport code in Skynet Settings*, essayez l'aéroport suivant le plus proche.

## Trouver votre Elevation {#how-to-find-your-elevation}

Votre Elevation est la hauteur de votre brasserie au-dessus du niveau de la mer. La hauteur de l'aéroport est mise au
départ, mais votre brasserie peut être bien plus haut ou plus bas que l'aéroport. Chaque 30 pieds (10 mètres) vaut environ
1 hPa de pression.

Mettez-vous dans la brasserie et lisez-la :

- **iPhone :** ouvrez l'app **Boussole** (Compass). L'altitude s'affiche en bas de l'écran, sous votre position. Le Service
  de localisation doit être activé pour Boussole.
- **Android :** la plupart des téléphones n'affichent pas l'altitude d'origine. Une app GPS gratuite, comme **GPS Status**,
  l'affiche sous le nom *altitude*.
- **Google Earth :** placez un repère sur votre brasserie. L'altitude s'affiche en bas de l'écran. Marche sur un téléphone
  ou un ordinateur.
- **Une recherche sur internet :** cherchez **altitude** et votre ville ou votre adresse.

L'altitude GPS d'un téléphone peut être fausse de 30 à 50 pieds (10 à 15 mètres). Ce n'est pas grave : cela change la
température d'ébullition de moins de 0,1 °F (0,05 °C). Un repère sur une carte, comme Google Earth, est souvent plus stable
que le téléphone.

Tapez-la dans la case **Elevation** et appuyez sur **Save**.

## Les messages {#the-messages}

Seules les vraies pressions de l'air sont utilisées. La plus basse jamais vue au niveau de la mer était d'environ 870 hPa
(25,69 inHg) et la plus haute d'environ 1084 hPa (32,01 inHg) ; en altitude la pression à la brasserie est plus basse,
environ 600 hPa (17,7 inHg) à 4 000 mètres.

| Message | Ce qu'il veut dire | Ce que Skynet utilise |
|---|---|---|
| *Check your Airport code in Skynet Settings.* | Le code n'a pas 4 lettres, ou cet aéroport n'envoie pas de bulletin météo. | L'air standard à votre Elevation |
| *The Pressure is not available from your Airport code set in Skynet Settings.* | Pas d'internet, la station météo de l'aéroport est en panne (aucun bulletin depuis 3 heures), ou son bulletin a une pression qu'aucun aéroport n'a jamais eue (sous 865 ou au-dessus de 1085 hPa). | L'air standard à votre Elevation |
| *No Airport code in Skynet Settings yet.* | La case est vide. | L'air standard à votre Elevation |
| *That is not an air pressure. Type it in inHg (15.9 to 32.05) or hPa (540 to 1085).* | La pression tapée ne peut pas être réelle (par exemple 10,13). Elle n'est pas gardée. | Ce qu'il utilisait avant |

## Dans un Process {#in-a-process}

Ce Global interne de Skynet est mis par Skynet et en lecture seule (Règle 1.18) :

| Nom | Ce que c'est |
|---|---|
| `skn_Boil_Temp` | La température d'ébullition du jour à votre brasserie. Skynet la calcule à partir de la pression de l'air à votre Airport et de votre Elevation, toutes deux réglées dans ☰ Menu > Default settings > Boil temperature. Elle s'affiche dans vos Units (°F pour US, °C pour Metric). |

## La Boil Probe et wait_boil {#the-boil-probe-and-wait-boil}

Ouvrez les Properties de la sonde de température de votre cuve d'ébullition et activez **Boil Probe**. Une seule sonde peut être la
Boil Probe : sur toutes les autres sondes, l'interrupteur est grisé, et la ligne en dessous dit quelle sonde l'a. Pour la changer,
désactivez-la d'abord sur cette sonde.

Dans un Process, cette ligne attend que la Boil Probe soit 1 degré sous la température d'ébullition du jour, puis continue :

```
wait_boil -1
```

Le nombre est dans vos Units : avec US c'est 1 °F, avec Metric 1 °C. `wait_boil` seul attend la température d'ébullition elle-même.
Override et Stop marchent dessus comme sur tout wait. Sans Boil Probe, l'éditeur de Process donne un avertissement.

La forme longue marche toujours : `wait BK_Temp >= skn_Boil_Temp - 1`.

Démarrez ensuite l'horloge d'ébullition avec `start skn_Boil_Timer` : voir [Les Skynet Brew Timers](246-skynet-brew-timers).

Seul le code d'aéroport de 4 lettres quitte le Brain. Rien d'autre sur vous ou votre brasserie n'est envoyé.
