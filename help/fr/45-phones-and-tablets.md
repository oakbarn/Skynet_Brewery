# Téléphones et tablettes {#phones-and-tablets}

**Un téléphone ou une tablette sert à faire tourner et à surveiller la brasserie, pas à modifier ni à construire** (Règle 2.35). Modifiez et construisez sur un ordinateur (Windows, Mac ou Linux) avec une souris et un clavier.

## Le mode marche (run mode) : ce qui marche sur un téléphone ou une tablette {#run-mode-what-works-on-a-phone-or-tablet}

Quand un Admin se connecte sur un téléphone ou une tablette, le panel marche comme pour un Operator :

- **Changer de Schema** avec le sélecteur Schema de la Menu Bar.
- **Start, Stop et Restart des Processes**, et **Stop all**.
- **Les boutons des Tabs** : les pompes, vannes, interrupteurs, boutons Override, minuteries et le reste marchent d'un toucher.
- Surveiller les Tabs, les alarmes, le Log et la barre du simulateur.

## Ce qui n'est pas sur un téléphone ou une tablette {#what-is-not-on-a-phone-or-tablet}

- Le bouton **Edit layout** (et les écrans ☰ Menu > Build).
- Les **Properties** et les **Tab settings** (le double-clic ou le doigt gardé ne les ouvre pas).
- Les écrans d'Admin, comme **Schema.json**, **File Move** et les parties Admin de Settings.

Le panel affiche une courte note quand il démarre en mode marche, et **☰ Menu > About** indique « run mode on this phone or tablet » à côté de qui est connecté. Rien n'est changé sur le Brain : votre connexion est toujours une connexion Admin, et sur un ordinateur elle marche comme avant.

## Comment le panel le sait {#how-the-panel-knows}

Le navigateur dit au panel si l'écran est utilisé seulement avec un doigt (un téléphone ou une tablette) ou avec une souris ou un pavé tactile (un ordinateur). Cela marche sur iPhone, iPad, Android et les ordinateurs. Un iPad qui demande le site web « ordinateur » compte quand même comme une tablette.

Un ordinateur portable à écran tactile compte comme un ordinateur, car il a aussi une souris ou un pavé tactile. Un iPad avec un clavier et un pavé tactile peut aussi compter comme un ordinateur.

**Settings > Panel settings: screen, Tabs and alerts** montre comme quoi compte l'écran sur lequel vous êtes.

## Modifier quand même sur un téléphone ou une tablette {#editing-on-a-phone-or-tablet-anyway}

Sur un ordinateur, ouvrez **Settings > Panel settings: screen, Tabs and alerts > Phones and tablets**, allumez **Phones and tablets can edit** et appuyez sur **Save**. C'est pour tous les téléphones et toutes les tablettes. Rechargez ensuite le panel sur le téléphone ou la tablette.

Avec ce réglage, Edit layout sur un téléphone ou une tablette ne **déplace ni ne redimensionne toujours rien**, pour qu'un doigt ne puisse pas emporter une pompe ou un tuyau par accident : touchez un élément pour le choisir, gardez le doigt dessus pour ses propriétés, et changez-y **X**, **Y**, **Width** et **Height**. Le second interrupteur, **Phones and tablets can move and resize things in Edit layout**, les laisse aussi déplacer.
