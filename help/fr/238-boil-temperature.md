# Température d'ébullition selon la pression de l'air {#boil-temperature-from-the-air-pressure}

L'eau bout plus bas quand la pression de l'air est basse : en haut d'une montagne, ou quand une tempête arrive. Au niveau de
la mer l'eau bout à 212 °F (100 °C) ; à 1 600 mètres d'altitude elle bout vers 202 °F (95 °C). Un Process qui attend 212 °F
pourrait donc attendre pour toujours.

Skynet lit le bulletin météo de votre aéroport (son METAR) toutes les 30 minutes, ramène la pression à la hauteur de votre
brasserie et calcule la température à laquelle l'eau bout **ici et maintenant**. Vos Processes l'utilisent sous le nom
`skn_Boil_Temp`. Servez-vous-en pour savoir quand l'ébullition a commencé.

## Mise en place {#set-it-up}

Ouvrez **Settings > Boil temperature (air pressure)** (Admins).

| Case | Quoi y mettre |
|---|---|
| **Airport (ICAO)** | Le code ICAO de 4 lettres de votre aéroport, par exemple `KORD`. C'est la seule façon de choisir la station météo. |
| **Elevation** | La hauteur de votre brasserie au-dessus du niveau de la mer (pieds pour les Units US, mètres pour Metric). Elle commence à la hauteur de l'aéroport. Mettez la vôtre. |
| **Typed air pressure** | Laissez-la vide. Une pression tapée ici est utilisée telle quelle, sans internet. C'est la pression à votre brasserie. Tapez-la en **inHg** (15,9 à 32,05) ou en **hPa** (540 à 1085) ; Skynet sait laquelle par sa taille. |

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

- **Votre téléphone :** sur un iPhone, l'app **Boussole** (Compass) affiche l'altitude en bas de l'écran. Beaucoup d'apps
  gratuites d'altitude ou d'altimètre font de même sur iPhone et Android. Mettez-vous dans la brasserie et lisez-la.
- **Une recherche sur internet :** cherchez **altitude** et votre ville ou votre adresse.

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

Ces Globals internes de Skynet sont mis par Skynet et en lecture seule (Règle 1.18) :

| Nom | Ce que c'est |
|---|---|
| `skn_Boil_Temp` | La température à laquelle l'eau bout ici et maintenant. Un Process l'utilise en °C, comme toute température (Skynet Rule 2.59) ; dans un message (un texte joint avec `+`, ou un `print` de la valeur seule) elle s'affiche dans vos Units (°F pour US, °C pour Metric) |
| `skn_Boil_Temp_C` | La même en °C |
| `skn_Boil_Temp_F` | La même en °F |
| `skn_Air_Pressure` | La pression de l'air à la brasserie maintenant, en hPa |

Attendez que la cuve soit juste sous l'ébullition, puis continuez :

```
wait BK_Temp >= skn_Boil_Temp - 1
```

Seul le code d'aéroport de 4 lettres quitte le Brain. Rien d'autre sur vous ou votre brasserie n'est envoyé.
