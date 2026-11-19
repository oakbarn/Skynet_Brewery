# Cliquer sur une température pour changer son Setpoint {#click-a-temperature-to-change-its-setpoint}

Quand la brasserie tourne (pas en Edit layout), **un clic** sur une température ouvre la **fenêtre SetPoint** de la résistance
qui tient cette température (Règle Skynet 2.43). Cela marche sur :

- une **Temperature Probe** sur un Tab, et sa lecture (aussi quand elle est affichée en Skynet Dial),
- un **Thermowell** ou un **té à sonde**,
- une **sonde ou un Thermowell intégré à un Vessel Device**, et l'emplacement Probe de la cuve elle-même,
- un **Picture Widget** qui montre une Temperature Probe.

## PV et SV sur l'affichage de la sonde {#pv-and-sv-on-the-probe-s-display}

Sur un Tab en marche, l'affichage de chaque Temperature Probe montre deux lignes, comme un régulateur de tableau (Panel Updates 41) :

- **PV** en haut : ce que la sonde lit maintenant, par exemple **152.3 °F**. Sa couleur montre où il en est par rapport à la consigne de
  ce qui utilise la sonde :
  - **Hysteresis :** **vert** tant que la lecture est à moins de son Offset de la consigne. **PID** et **Precise :** vert à moins d'un
    demi-degré C (un degré F). **Deadband :** vert dans la Deadband. **Fermentor Control :** vert entre ses Heat et Cool Offsets.
    En dehors : **bleu** sous la consigne (trop froid), **rouge** au-dessus (trop chaud).
  - **Duty Cycle**, **Direct** et **PWM :** **rouge** tant qu'une résistance est ON, **bleu** tant qu'un refroidisseur est ON, **gris** à l'arrêt (OFF).
  - Une sonde que rien n'utilise garde la couleur de son affichage.
- **SV** dessous, dans une **case verte** : sa **consigne** (Setpoint), par exemple **152.0 °F**.

Chaque ligne garde tous ses chiffres et son °F ou °C ensemble sur une seule ligne, dans l'affichage ; un long nombre rend les deux lignes
plus petites pour qu'elles tiennent. Il n'y a pas d'interrupteur Visible : PV et SV font partie de l'affichage.

**Un clic sur la case verte SV** permet d'y taper directement une nouvelle consigne (sans fenêtre, Règle 2.44). Appuyez sur **Entrée** pour la
régler (ou cliquez ailleurs après l'avoir changée) ; **Échap** la remet comme avant. Une nouvelle consigne ne met jamais rien en marche ni à
l'arrêt. Un clic ailleurs sur la sonde ouvre toujours la fenêtre SetPoint ci-dessous.

Il n'y a qu'**une seule consigne** :

- Une sonde qu'une **résistance** (ou un Fermentor Control, ou un ancien Device Hysteresis, PID ou Deadband) utilise comme Temperature Probe
  montre **la consigne de celle-ci**. La changer sur la sonde la change sur la résistance, et inversement. Quand deux ou plus utilisent la
  même sonde, le SV est celui qui est ON (sinon le premier).
- Une sonde vers laquelle **rien ne chauffe ni ne refroidit** garde **sa propre consigne**. Elle part du **Setpoint** dans les Properties de
  la sonde (vide affiche **---**), et un Process la lit ou la règle avec **.setpoint** (par exemple `Mash_Probe.setpoint = 152`), pour qu'un
  Process ou une Alarm puisse comparer la lecture avec elle.

Une consigne tapée sur un Tab ou réglée par un Process dure jusqu'au redémarrage du Brain ; ensuite elle repart des Properties, comme celle
d'une résistance. La case SV n'apparaît pas en Edit layout, avec l'aspect Dial ou Bar, ni quand la valeur de la sonde est cachée.

## Quelle résistance {#which-heating-element}

La fenêtre appartient à la résistance dont la **Temperature Probe** (dans ses Properties) est la sonde sur laquelle vous avez cliqué. La sonde propre d'une
cuve va d'abord à la résistance de la cuve. Quand **deux résistances ou plus** lisent la même sonde, une courte liste demande
laquelle. Quand **aucune** ne la lit, une courte note le dit : choisissez la sonde comme Temperature Probe dans les Properties d'une résistance. Sur le
Simulator, une sonde sans résistance ouvre toujours sa fenêtre **Simulated reading**, comme avant.

## La fenêtre SetPoint {#the-setpoint-pop-up}

- En haut : le nom de la sonde et ce qu'elle lit maintenant.
- Dessous : à qui est le Setpoint, s'il est ON ou OFF, et sa méthode de chauffe.
- Le **Setpoint** avec **−** et **+** (ou tapez un nombre ; Entrée le règle).
- **Set + ON** règle le Setpoint et met en marche, **OFF** le règle et arrête, **Set** le règle seulement (ON ou OFF reste comme il
  était). Rien ne se met en marche sauf si vous cliquez sur **Set + ON** (Règle 2.33).
- **Heating method…** ouvre la fenêtre de la résistance (aide 150) pour sa méthode, son Duty cycle et ON / OFF.
- **Cancel** la ferme sans rien changer.

Seules **Hysteresis**, **PID**, **Deadband** et **Precise** utilisent un Setpoint (On/Off et Duty Cycle non). Quand la résistance est en ce moment en
On/Off ou en Duty Cycle, la fenêtre le dit, et **Set** la passe à la première de ses méthodes permises qui tient un Setpoint.
Quand aucune de ses méthodes permises n'en tient, la fenêtre dit d'en cocher une dans ses Properties.

Les opérateurs et les admins peuvent changer un Setpoint ; un compte en lecture seule ne le peut pas. Le double-clic ouvre toujours les Properties en Edit layout
(Règle 2.9).
