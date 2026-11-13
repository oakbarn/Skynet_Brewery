# Importer : les pages des éléments et des Widgets {#importer-the-item-and-widget-pages}

Le BruControl Importer ([aide 143](143-brucontrol-importer)) pose des questions sur chacun de vos éléments en petites pages, une sorte à la fois.
Chaque page marche de la même façon, et chaque réponse est gardée un instant après que vous l'avez donnée, donc vous pouvez fermer l'Importer et continuer plus tard.

## Les colonnes de chaque ligne {#the-columns-on-every-line}

| Colonne | Ce que c'est |
|---|---|
| Display Name | les mots que BruControl montrait avec l'élément ; grisé quand il n'y en avait pas (alors son nom BruControl est montré) |
| ✔ | cochez-le pour copier le Display Name dans la case Label |
| Label | vos propres mots pour lui (HLT, Mash Tun ...). C'est le Label dans Skynet et une partie de son Suggested Name. Jamais vide |
| Show | coché : le Label est affiché avec lui sur le Tab. Il commence comme BruControl affichait le nom |
| Skynet Name | le nom Skynet proposé fait avec votre Label ; il change pendant que vous tapez. Tant que vous n'avez pas tapé de Label, il est fait avec le Display Name, grisé |

Il n'y a pas de case « tout cocher », exprès. Chaque élément doit être regardé : un nom BruControl est souvent un code que seul son constructeur
connaît, comme `M_6_B_1`, alors que son Label devrait dire ce qu'il est dans votre brasserie, comme *HLT*.

Une case marquée **(optional)** peut rester vide ; toutes les autres cases doivent être remplies (Règle 18.33). Une case n'est nécessaire que quand le
programme ou la carte en a besoin pour marcher, comme les Pulses d'un débitmètre à effet Hall. Une information pratique, comme les volts, les ampères ou les watts,
est facultative. Une case nécessaire seulement pour certains types est grisée pour les autres ; pour un type qui en a besoin, la laisser vide fait apparaître une
fenêtre, donc vous la remplissez ou vous quittez la page avec **◀ Back**. Chaque liste commence à **Pick one…** ; quand aucun choix ne convient, choisissez **User defined** et tapez vos propres mots.
**Accept ▶** marque une case vide en rouge et vous dit combien il y en a.

## Les pages des Widgets {#the-widget-pages}

Elles viennent juste après **Your Tabs**. Les **Application Elements** de BruControl (des choses sur un Workspace qui ne sont pas câblées à une carte) deviennent
le Widget Skynet qui fait le même travail :

| BruControl | Skynet |
|---|---|
| Timer | Timer Widget |
| Alarm | Alarm Widget |
| Toggle Switch | Switch Widget |
| Script | Process Widget ([aide 173](173-process-widget)) : montre son Process avec Start / Stop ; un clic le démarre ou l'arrête |
| Chart | Graph Widget ([aide 159](159-graph-widget)) |
| Inspector | aucun : il reste un Placeholder gris |

La première page liste chaque sorte de Widget Skynet et combien des vôtres en deviennent un. Puis il y a une page pour chaque sorte trouvée sur
les Tabs que vous importez, donc *Timers (1 of 1)* quand les Timers sont la seule sorte.
Le Suggested Name d'un Widget est `wgt_`, sa sorte, le Label et l'ID du Tab, par exemple `wgt_TMR_Mash~Timer_BH`.

## Les pages des éléments {#the-item-pages}

Une page chacune, dans cet ordre : **Pumps, Heating Elements, Temperature Probes, Valves, Flow Meters, pH Meters, Pressure Sensors
(PSI), Hydrometers, Volume Meters, Floats, Digital Inputs, Other items.**

- **How many ... do you have?** (combien en avez-vous ?) Si vous en avez plus que trouvés, une ligne vide est ajoutée pour chacun. Une ligne vide a une
  liste **Fill with an item…** des éléments qu'aucune page n'a encore pris (depuis Other items).
- **Belongs on** déplace une ligne vers la page où elle va, par exemple un débitmètre arrivé dans Other items.

| Page | Elle demande |
|---|---|
| Pumps | Pump model et Power, tous deux facultatifs (Power est rempli pour vous quand le modèle est fait pour une seule tension, comme *Topsflo TD5 (24 V DC)*), Control Type |
| Heating Elements | Watts et Volts (tous deux facultatifs), Control Type |
| Temperature Probes | **Probe type** (nécessaire) : les types de sondes Skynet (OneWire, RTD, Thermocouple, les thermistances NTC, LM35, TMP36) |
| Valves | **Connection Type** et **Size** (tous deux nécessaires), Valve type et Voltage (facultatifs) |
| Flow Meters | Meter type (effet Hall, turbine, engrenages ovales, magnétique, ultrasons, massique thermique, vortex) (nécessaire), **Pulses per Gallon or Liter** (nécessaire pour un débitmètre à effet Hall, à turbine ou à engrenages ovales, grisé pour les autres) |
| pH Meters | **Signal to the board** (nécessaire), pH meter type (facultatif) |
| Pressure Sensors (PSI) | **Sensor type** (nécessaire), **Highest pressure it reads** (nécessaire, grisé pour un pressostat) |
| Hydrometers | **Hydrometer type** (nécessaire : Tilt, iSpindel, RAPT Pill, Plaato ...), la **Color** d'un Tilt ou le **Hardware ID** de toute autre sorte (nécessaire) |
| Volume Meters | **How it measures** (nécessaire), **Most it reads** (nécessaire pour un capteur de niveau à ultrasons, à pression ou à flotteur, grisé pour les autres) |
| Floats | **Contact** : Normally Open ou Normally Closed (nécessaire), Float type (facultatif) |
| Digital Inputs | **Input type** (nécessaire) : les types de Digital Input Skynet |

**Set every Valve**, en haut de la page Valves, donne à chaque ligne le même Connection Type, la même Size et le même Voltage d'un coup (par
exemple TC, 1 1/2 pouce, 24 V DC). Chaque fois que vous le changez là, chaque ligne suit ; ensuite, changez toute ligne qui est différente.
Quand le Skynet Panel de cet ordinateur a un **Default pipe size** réglé, une vanne sans Size commence à celui-ci.

**Connection Type** est la façon dont la vanne est montée dans votre collecteur, pas le filetage de la vanne elle-même. Une vanne BSP avec un adaptateur BSP vers
NPT et un TC femelle à chaque bout est une vanne **TC**, car elle se joint au collecteur avec des Tri-Clamps. **Size** va jusqu'à
4 pouces, en pouces avec les millimètres, et les tailles métriques, quelles que soient les unités choisies.

## Control Type (pompes et résistances) {#control-type-pumps-and-heating-elements}

Chaque colonne numérotée est une façon de le commander : **1 On/Off, 2 Speed (PWM), 3 Duty Cycle, 4 Hysteresis, 5 PID, 6 Deadband,
7 Precise.** Cochez chacune qu'il peut utiliser. Le On/Off d'une pompe est toujours coché. Une résistance a toujours son bouton On/Off pour la mettre
en marche, donc sa première colonne est **On/Off Only** : cochez-la quand rien d'autre ne la commande, et les autres colonnes sont grisées ; décochez-la
pour les choisir. Choisissez ensuite la **Primary**, la méthode avec laquelle elle démarre, par son
numéro de colonne.

Une méthode qui n'est pas recommandée se décoche d'elle-même et dit pourquoi, avec un bouton **Use it anyway** (l'utiliser quand même) :

- **Une pompe :** Duty Cycle, PID, Deadband et Precise mettent le moteur en marche et à l'arrêt de nombreuses fois par minute. Utilisez On/Off, Speed (PWM) ou
  Hysteresis (une Cool / Warm Pump, [aide 164](164-cool-warm-pump)).
- **Une résistance :** Speed (PWM) est pour une pompe, un ventilateur ou un moteur ; une résistance sur une broche PWM est commandée par Duty Cycle, PID, Deadband ou Precise.

Une résistance et une Cool / Warm Pump démarrent dans leur méthode Primary, avec un bouton en un clic sur le Tab pour chaque autre méthode cochée.

⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.
