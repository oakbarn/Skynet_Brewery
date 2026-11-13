# Pompes : un clic les allume ou les éteint {#pumps-one-click-turns-them-on-or-off}

Sur un Tab (pas en Edit layout), **un clic** (ou un toucher sur un téléphone) sur une **pompe** l'**allume**, et le clic suivant
l'**éteint**, comme une vanne s'ouvre et se ferme. Aucune fenêtre ON / OFF ne s'ouvre d'abord (Règle Skynet 2.33). Un Widget Picture qui
suit une pompe marche de la même façon.

- Le **double-clic** ouvre toujours les Properties de la pompe (Règle Skynet 2.9).
- Seul un operator ou un admin peut allumer ou éteindre une pompe. Une connexion en lecture seule voit une note à la place.
- **Les Heating Elements marchent de la même façon** (depuis le 2026-11-08) : un clic en allume ou en éteint une tout de suite, dans la méthode de chauffe où elle est,
  qu'elle soit seule sur un Tab, suivie par un Widget Picture, ou intégrée dans un Vessel Device. Vérifiez qu'il y a du liquide au-dessus de
  la résistance avant de l'allumer : une résistance à sec peut griller.
- Une **vanne intégrée dans un Vessel Device** s'ouvre ou se ferme d'un clic sur son image, comme toute vanne.

## Dual Action : cliquer ou tenir {#dual-action-click-or-hold}

Le **Toggle** d'une pompe (dans ses Properties) peut être **On/Off** (un clic l'allume ou l'éteint), **Push Button** (allumée seulement tant qu'on appuie),
**Dual Action** ou **None**. Avec **Dual Action**, un clic allume ou éteint la pompe, et appuyer dessus plus d'une demi-seconde
en fait un Push Button : allumée tant que vous tenez, éteinte quand vous lâchez. Pratique pour compléter une cuve avec un peu d'eau à
la main un jour de brassage (Règle Skynet 2.50).

## Pompes faites avant ce changement {#pumps-made-before-this-change}

La première fois que le panel démarre avec cette version, chaque pompe de chaque Schema qui demandait ON / OFF passe à un clic.
Rien d'autre ne change sur la pompe. Les Heating Elements qui demandaient sont changées de la même façon, une fois, la première fois que le panel
démarre avec la version du 2026-11-08.

## Je veux qu'une pompe demande d'abord {#i-want-a-pump-to-ask-first}

Double-cliquez sur la pompe ou la Heating Element (ou ouvrez-la depuis le Build Tab), cliquez sur le **⬢** à côté de **When tapped**, et activez
**Ask before changing (ON / OFF buttons)** (demander avant de changer). Enregistrez. Cette pompe demande à nouveau ; les autres restent à un clic.
