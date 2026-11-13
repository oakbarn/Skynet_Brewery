# Cliquer sur une température pour changer son Setpoint {#click-a-temperature-to-change-its-setpoint}

Quand la brasserie tourne (pas en Edit layout), **un clic** sur une température ouvre la **fenêtre SetPoint** de la résistance
qui tient cette température (Règle Skynet 2.43). Cela marche sur :

- une **Temperature Probe** sur un Tab, et sa lecture (aussi quand elle est affichée en Skynet Dial),
- un **Thermowell** ou un **té à sonde**,
- une **sonde ou un Thermowell intégré à un Vessel Device**, et l'emplacement Probe de la cuve elle-même,
- un **Picture Widget** qui montre une Temperature Probe.

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
