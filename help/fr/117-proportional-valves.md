# Vannes proportionnelles {#proportional-valves}

Une **Proportional Valve** (vanne proportionnelle) s'ouvre en partie : de **0 %** (fermée) à **100 %** (grande ouverte). C'est une **Analog Output** : Skynet envoie un
signal de commande (une tension) à la vanne, et la vanne tourne pour y correspondre. Au-dessus de 0 %, elle laisse passer le liquide dans ses tuyaux ; à 0 %, elle est
fermée. Vous les trouvez dans la liste **Valves** de la barre Edit layout.

## La Skynet KLD20T Proportional Valve {#the-skynet-kld20t-proportional-valve}

La première **Skynet Proportional Valve** est la **KLD20T** : une vanne à bille motorisée en acier inoxydable (SS304) 1/2 pouce NPT.
Elle est alimentée en **24 VDC** et tourne au % fixé par un signal de commande **0-5 VDC** (0 V = fermée, 5 V = grande ouverte).

C'est un **Template Skynet** (Règle Skynet 5.16), de la même façon que la Skynet Motorized Ball Valve (aide 88) :

- **Fixé par le Template** (pas dans ses Properties) : Kind (Proportional Valve), Service (liquide à température ambiante), Signal **0-5 V**,
  **0 à 100 %**, pas de décimales, ses images et son aspect.
- **Vous réglez :** Name, Label, Show label, Tab, X, Y, Width, Height, Lock, Visible, Hidden, les réglages de la case de texte, Device Type, l'**Interface**
  et la **Pin** (une broche PWM qui alimente un module PWM vers 0-5 V), l'**Orientation** et les **Flips**.
- **Orientation** : Horizontal, Vertical Left, Vertical Right ou 45 degrees. L'image et ses IP suivent.

Son image est celle de la Skynet Motorized Ball Valve pour l'instant (ouverte au-dessus de 0 %, fermée à 0 %).

Dans un Process, elle se règle comme toute Analog Output ; par exemple `PropValve_1.value = 40` l'ouvre à 40 %.

## La User Defined Proportional Valve {#the-user-defined-proportional-valve}

Sous les Skynet Proportional Valves se trouve la **User Defined Proportional Valve**, pour toute autre vanne proportionnelle (par exemple une
vanne 24 V 0-10 V ou 4-20 mA). Elle marche de la même façon, mais vous réglez tout :

- **Interface** et **Pin**, **Signal** (0-10 V, 4-20 mA ou 0-5 V), **Value at lowest signal** et **Value at highest signal**
  (0 et 100 pour des %), **Units**, **Decimals**.
- **Picture when open (above 0 %)** et **Picture when closed (0 %)**, et **Image Path 1, 2, 3** (Règle Skynet 7.10).
- **In IP across % / In IP down %** et **Out IP across % / Out IP down %** : où sont ses deux bouts de tuyau sur l'image, en % de
  sa Width (0 = le bord gauche, 100 = le bord droit) et de sa Height (0 = le haut, 100 = le bas). Laissez-les vides et Skynet
  les place pour vous. Ce sont les mêmes que sur la User Defined Motorized Ball Valve (aide 88).

Elle s'appelait avant « Proportional valve 0-100 % (analog output) » ; les anciens Schemas continuent de marcher tels quels.
