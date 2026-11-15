# Sécurité Flame Out pour brûleurs à gaz {#flame-out-safety-for-gas-burners}

> **⚠ Le gaz peut exploser ou tuer. OakBarn Brewery et Skynet ne sont ni électriciens, ni plombiers, ni experts en chauffage et climatisation. Consultez un électricien, un plombier ou un professionnel du chauffage et de la climatisation agréé.** (Règle 6.20)

Un brûleur à gaz peut s'éteindre alors que le gaz continue de couler : un coup de vent, un débordement, ou une bouteille presque vide. Le gaz non brûlé
s'échappe alors, et il peut prendre feu ou exploser. La **sécurité Flame Out**, c'est Skynet qui surveille la cuve pour vous (Règle Skynet 6.33).

Un brûleur allumé fait chauffer la cuve. Tant que la vanne de gaz du brûleur est ouverte, Skynet surveille donc la température de la cuve. Si
la température **baisse**, ou **ne monte pas** après quelques minutes de chauffe, la flamme est sans doute éteinte. Skynet alors :

1. **coupe le gaz** (et éteint l'allumeur du brûleur),
2. affiche **« Burner may be out: check the flame. Gas is turned off. »** en rouge sur tous les écrans, avec un bip jusqu'à ce que quelqu'un le ferme,
3. ne **rallume rien tout seul**. Vérifiez la flamme, allumez-la, puis rallumez le brûleur d'un clic.

**Skynet ne voit pas la flamme.** La sécurité Flame Out est une aide, pas un dispositif de sécurité de flamme. Elle peut mettre plusieurs minutes à
remarquer une flamme éteinte. Utilisez un brûleur avec sa propre sécurité de flamme (une vanne de gaz à thermocouple homologuée UL ou CSA, ou un détecteur de flamme).
Ne brassez jamais au gaz à l'intérieur sans air frais, et ne laissez jamais un brûleur allumé sans surveillance.

## Quels brûleurs l'ont {#which-burners-have-it}

- Un **élément chauffant** avec **Gas burner** activé dans ses Properties (un brûleur sur une vanne de gaz). Les brûleurs à gaz du
  Schema Builder l'ont activé.
- Une **électrovanne de gaz** (Device Type DO@Valve_Sgas). Choisissez sa **Temperature Probe** dans ses Properties, pour qu'elle sache quoi surveiller.

## Ses Properties {#its-properties}

Sous **Flame Out safety** :

| Case | Ce qu'elle fait | Au départ |
|---|---|---|
| **Flame safety** | Ce qui coupe le gaz tout seul si la flamme s'éteint : **Thermocouple gas valve (UL or CSA listed)** ou **None (plain solenoid valve)**. Vous le choisissez ; Skynet ne peut pas le vérifier. | None |
| **Flame Out** | **On** surveille ce brûleur tant que son gaz est ouvert. | On |
| **Igniter** | L'allumeur du brûleur, éteint avec le gaz. | None |
| **No rise (minutes)** | Minutes de chauffe pendant lesquelles la température doit monter de la valeur Rise. | 5 |
| **Rise** | De combien elle doit monter. | 1 °F (0,5 °C) |
| **Drop** | Une fois la cuve en train de chauffer, une baisse de cette valeur sous son maximum coupe le gaz. | 1 °F (0,5 °C) |
| **Pause (minutes)** | Combien de temps le bouton Pause arrête la surveillance. | 10 |
| **Smoothing (seconds)** | La lecture est moyennée sur ce nombre de secondes. | 30 |
| **Boil point** | À moins de 3 °F de cette valeur, le test No rise se repose, car une ébullition franche cesse de monter. L'eau bout environ 1 °F plus bas par 500 pieds d'altitude : 212 °F au niveau de la mer, 202 °F à 5 000 pieds. | 212 °F (100 °C) |

Avec **Thermocouple gas valve** choisi, la vanne elle-même est la sécurité de flamme, et le Flame Out de Skynet est son secours. Le Flame
Out reste activé dans les deux cas (OakBarn Brewery, 2026-11-14 : « Also in Skynet have the software backup of decreasing Temp »).

## Le mettre en pause {#pause-it}

Ouvrir le couvercle, ajouter de l'eau froide ou empâter fait baisser la température alors que la flamme est allumée. Cliquez la case du brûleur
(ou un bouton de méthode) pour ouvrir sa fenêtre et appuyez sur **⏸ Pause Flame Out (10 min)**. La surveillance reprend d'elle-même après 10 minutes, et
**▶ Watch now** arrête la pause plus tôt.

## La vanne de gaz à thermocouple (la vraie sécurité de flamme) {#the-thermocouple-gas-valve-the-real-flame-safety}

Une petite **veilleuse** chauffe un **thermocouple**, qui produit une toute petite tension (environ 0 à 30 millivolts). Tant qu'il est chaud, la vanne
laisse passer le gaz. Si la veilleuse s'éteint, la vanne coupe **tout** le gaz d'elle-même, sans l'aide de Skynet. Skynet ne fait qu'allumer et éteindre
le **brûleur principal** par l'entrée 24 V de la vanne. Si la flamme principale s'éteint alors que la veilleuse est allumée, la veilleuse la rallume.
Pour le propane, achetez le modèle LP (propane), ou montez le kit de conversion LP du fabricant.

**La pression du gaz compte.** Ces vannes à veilleuse permanente (par exemple Honeywell / Resideo VR8200, White-Rodgers 36C ou Robertshaw
7000) sont faites pour du gaz à **basse pression**, comme une chaudière ou un chauffe-eau domestique : du propane à environ 11 pouces de colonne d'eau. La plupart
des brûleurs de brassage utilisent un détendeur **haute pression** (plusieurs psi), et une vanne faite pour la basse pression ne doit pas y être montée. La
vanne, le détendeur et le brûleur doivent être assortis. Faites-les choisir et poser par un professionnel du gaz agréé.

La plupart des brûleurs de brassage amateur fonctionnent au propane **haute pression** (OakBarn Brewery, 2026-11-14 : « Unforunately high pressure propane is more
standard for a Home Brewer »). Trois façons de l'installer :

| Façon | Sécurité de flamme | Coût | Dans Skynet, choisir |
|---|---|---|---|
| **1. Haute pression + une électrovanne de gaz 24 V seule** | **Aucune.** Seulement le Flame Out de Skynet, qui est lent : le gaz peut couler plusieurs minutes avant qu'il se déclenche. Restez près du brûleur. | Le plus bas | **None (plain solenoid valve)** |
| **2. Passer en basse pression + une vanne 24 VAC type VR8200** (un détendeur basse pression, environ 11 pouces de colonne d'eau, et les bons injecteurs) | **Réelle** : la vanne coupe le gaz d'elle-même. **La meilleure sécurité pour le prix.** Elle chauffe plus lentement. | Bas | **Thermocouple gas valve (UL or CSA listed)** |
| **3. Haute pression + une vanne de sécurité de veilleuse à thermocouple haute pression (par exemple BASO H19) + une électrovanne de gaz 24 V** | **Réelle**, à pleine puissance. | Élevé | **Thermocouple gas valve (UL or CSA listed)** |

Vérifiez la pression sur la fiche technique de chaque pièce, et faites-les choisir et poser par un professionnel du gaz agréé.

**Conseillé : la façon homologuée UL ou CSA** (façon 2 ou 3), où un dispositif homologué coupe le gaz de lui-même.

La broche de la carte ne peut pas commander la vanne toute seule. Deux façons (OakBarn Brewery, 2026-11-14 : « 24 vdc preferred but 24 vac ... is ok as well ») :

- **24 VDC (préféré) :** seulement pour une vanne dont l'étiquette indique **24 VDC** (la plupart indiquent 24 VAC, et une vanne 24 VAC en courant continu peut ne pas
  s'ouvrir ou griller). Une alimentation 24 VDC et un relais sur une Digital Out.
- **24 VAC :** pour les vannes 24 VAC courantes. Un **vrai transformateur abaisseur 24 VAC** et un relais prévu pour le courant alternatif sur une Digital Out. Les
  ampères de la vanne (sur son étiquette) multipliés par 24 doivent être inférieurs aux VA du transformateur. Un modèle de 40 VA suffit toujours.

Dans les deux cas, dans Skynet le brûleur est sur cette Digital Out, comme n'importe quel autre.

## Pour information seulement : une chaîne haute pression que certains brasseurs amateurs montent {#for-information-only-a-high-pressure-daisy-chain-some-home-brewers-build}

> **⚠ GRANDE MISE EN GARDE. Pour information seulement. Ce n'est PAS une sécurité de flamme homologuée et ce n'est PAS conseillé. C'est seulement une façon dont
> certains brasseurs amateurs font avec du propane haute pression. Utilisez plutôt une sécurité de flamme homologuée UL ou CSA (façon 2 ou 3 ci-dessus).**
>
> **⚠ Le gaz peut exploser ou tuer. OakBarn Brewery et Skynet ne sont ni électriciens, ni plombiers, ni experts en chauffage et climatisation. Consultez un électricien, un plombier ou un professionnel du chauffage et de la climatisation agréé.**

Ce que certains brasseurs amateurs montent :

**Thermocouple de type K dans la flamme → un régulateur de température autonome (entrée type K, sortie relais) → son relais → le relais du
contrôleur de brassage → une électrovanne de gaz 24 V homologuée pour le propane haute pression.**

- Le régulateur garde son relais fermé seulement tant que le thermocouple est chaud. Si la flamme s'éteint, il refroidit, le relais s'ouvre et
  l'électrovanne coupe le gaz.
- Les deux relais sont à la suite (en série) : les deux doivent dire « oui » pour que le gaz passe, et une coupure de courant coupe le gaz.
- Un thermocouple froid garde le gaz coupé, donc ils ajoutent un **contournement d'allumage minuté** : un relais aux bornes du relais du régulateur, fermé seulement
  pendant une courte fenêtre d'allumage (10 secondes au départ ; cela dépend du thermocouple). Si la flamme n'est pas prouvée à temps (le second contact du
  régulateur câblé sur une Digital In), le gaz se coupe. Au plus 3 essais, à au moins 1 minute d'intervalle pour que le gaz non brûlé se dissipe.
- Dans la liste Flame safety c'est **Flame-out cutoff (K-type thermocouple and controller, not listed)**, et le Flame Out reste activé en secours.

Le contournement d'allumage en mots de Process (pour information seulement ; remplacez les noms par les vôtres) :

```
//Gas_Ignition_Bypass
//FOR INFORMATION ONLY. Not a listed flame safety. Not recommended: use a UL or CSA listed flame safety.
//⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.
//Never leave a lit burner alone.
new value vV_Try
new value vV_Window
vV_Window = 10
vV_Try = 0
[Light]
vV_Try += 1
Kettle_burner = on
Kettle_spark = true
Kettle_bypass = true
sleep vV_Window * 1000
Kettle_bypass = false
Kettle_spark = false
sleep 1000
if Kettle_flame == true
	print "Flame proven: the cutoff holds the gas on"
	stop "Gas_Ignition_Bypass"
endif
Kettle_burner = off
alm_Flame_Out = true
print "No flame in the lighting window: gas turned off"
if vV_Try >= 3
	print "3 tries: check the burner before lighting again"
	stop "Gas_Ignition_Bypass"
endif
sleep 60000
ask "No flame. The gas has had 1 minute to clear. Press Done to try again"
alm_Flame_Out = false
goto "Light"
```

## Mots de Process {#process-words}

```
Kettle_burner.flameout = On             watch it (Off: do not)
Kettle_burner.flameout = "pause 10"     rest the watch 10 minutes; it watches again by itself
Kettle_burner.flameout_paused = 0       end the pause now (it reads the minutes left)
Kettle_burner.flameout_tripped          true after Flame Out shut the gas, until the burner is turned back On
```

## Extrait de Process : commande du brûleur à gaz {#process-snippet-gas-burner-control}

Copiez-le dans un nouveau Process et remplacez les noms par les vôtres. Il demande si la veilleuse est allumée, allume le brûleur, met la surveillance en pause pendant
l'empâtage, et déclenche votre propre Alarm si Flame Out coupe le gaz.

```
//Gas_Burner_Control
//MIT License Granted for all Scripts and Configurations
//Copyright © OakBarn Brewery 2026
//⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.
//Skynet's Flame Out is a backup, not a flame safety device. Use a UL or CSA listed thermocouple gas valve.
Kettle_burner.flameout = On
ask "Is the Kettle burner's pilot lit?"
Kettle_burner = on
wait Kettle_temp >= 152
Kettle_burner.flameout = "pause 10"
ask "Dough in, then press Done"
Kettle_burner.flameout_paused = 0
[WatchFlame]
sleep 1000
if Kettle_burner.flameout_tripped == true
	alm_Flame_Out = true
	print "Flame Out shut the gas: check the flame"
	stop "Gas_Burner_Control"
endif
goto "WatchFlame"
```

## Extrait de Process : la sécurité de secours, en mots de Process {#process-snippet-the-software-backup-in-process-words}

Skynet le fait déjà pour chaque brûleur à gaz dont le Flame Out est activé. Cet extrait montre la même idée en mots de Process, pour voir
comment cela marche ou pour surveiller quelque chose que Skynet ne sait pas être au gaz. Toutes les 5 secondes, il lit la sonde, ignore une lecture aberrante
(à plus de 5 °F de la moyenne), fait la moyenne de 6 lectures (30 secondes), et coupe le gaz si la moyenne baisse de 1 °F sous son maximum
tant que le gaz est ouvert.

```
//Gas_Software_Backup
//MIT License Granted for all Scripts and Configurations
//Copyright © OakBarn Brewery 2026
//⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.
//A backup only: it does not see the flame.
new value vV_Sum
new value vV_N
new value vV_Avg
new value vV_Peak
vV_Avg = 0
vV_Peak = 0
[Average]
vV_Sum = 0
vV_N = 0
[Read]
sleep 5000
if vV_Avg > 0 && (Kettle_temp > vV_Avg + 5 || Kettle_temp < vV_Avg - 5)
	goto "Read"
endif
vV_Sum += Kettle_temp
vV_N += 1
if vV_N < 6
	goto "Read"
endif
vV_Avg = vV_Sum / 6
if Kettle_burner == false
	vV_Peak = 0
	goto "Average"
endif
if vV_Avg > vV_Peak
	vV_Peak = vV_Avg
endif
if vV_Avg <= vV_Peak - 1
	Kettle_burner = off
	alm_Flame_Out = true
	print "The temperature fell 1 °F with the gas on: gas turned off"
	stop "Gas_Software_Backup"
endif
goto "Average"
```

### Le côté technique {#the-technical-side}

- Le Brain regarde environ une fois par seconde. Le temps de chauffe ne compte que quand la vanne de gaz est **vraiment ouverte** : en Hysteresis ou en Duty
  Cycle la vanne s'ouvre et se ferme d'elle-même, et le temps fermé ne compte pas.
- **No rise :** après les minutes No rise de chauffe, la lecture lissée doit dépasser de la valeur Rise celle du début du compte. Quand c'est le cas, le compte
  repart. Il se repose à moins de 3 °F (1,5 °C) du Boil point.
- **Drop :** après l'ouverture de la vanne, la cuve peut continuer à refroidir un peu (la chaleur est encore en route). Le test Drop commence une fois la
  lecture lissée remontée de 0,2 °F (0,1 °C) au-dessus de son minimum ; ensuite, une baisse de la valeur Drop sous son maximum coupe le gaz.
- **Lectures aberrantes :** une lecture à plus de 5 °F (2,8 °C) de la dernière lecture et de la moyenne, ou une erreur de sonde, est ignorée.
  Une qui reste 10 secondes est réelle (la sonde a été déplacée), et la moyenne repart d'elle.
- Éteindre le brûleur, ou une pause, fait repartir tous les comptes.
- Après un déclenchement, `.flameout_tripped` vaut true jusqu'à ce que le brûleur soit rallumé. L'avis reste sur tous les écrans jusqu'à ce qu'on le ferme.
  Le Brain ne rallume rien (comme la Règle 6.31).
