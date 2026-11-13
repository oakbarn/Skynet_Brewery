# Skynet dans sa propre fenêtre propre {#skynet-in-its-own-clean-window}

Sous Windows, Skynet Brewer ouvre le panel dans **une fenêtre à lui** (Règle Skynet 2.36). Elle n'a **ni barre d'adresse, ni barre de favoris, ni onglets**, donc tout l'écran est le panel.

## Comment ça marche {#how-it-works}

- Double-cliquez sur **Skynet Brewer** sur le Bureau. La fenêtre noire Invite de commandes démarre le panel, et quelques secondes plus tard le panel s'ouvre dans sa fenêtre propre, en plein écran.
- La fenêtre est **Microsoft Edge** (ou **Google Chrome** si l'ordinateur n'a pas Edge) en mode « application ».
- Ni Edge ni Chrome sur l'ordinateur : votre navigateur habituel ouvre le panel, comme avant.
- Ça marche quel que soit le .bat avec lequel vous démarrez le panel, votre propre .bat dans C:\Brewing aussi.

## La chope de bière dans la barre des tâches {#the-beer-mug-on-the-taskbar}

La fenêtre propre montre la **chope de bière de Skynet Brewer** (la même chope que le raccourci du Bureau) dans la barre des tâches de Windows, donc quand Skynet est réduit, vous cliquez sur la chope pour le faire revenir. La chope est aussi dans la barre de titre de la fenêtre, sur la page de connexion et sur la fenêtre d'aide.

Si la barre des tâches montre encore l'icône d'Edge ou de Chrome la première fois, fermez la fenêtre propre et double-cliquez à nouveau sur **Skynet Brewer** : la fenêtre prend la chope quand la page du panel se charge.

## Votre navigateur habituel n'est pas changé {#your-normal-browser-is-not-changed}

La fenêtre propre utilise **son propre petit profil de navigateur**, gardé dans `%LOCALAPPDATA%\SkynetBrewer\AppWindow`. Rien n'est touché dans votre Edge ou votre Chrome habituel : sa barre de favoris, ses réglages, ses onglets et ses connexions sont exactement comme avant, pendant que Skynet tourne et après sa fermeture.

Comme elle a son propre profil, **connectez-vous une fois** dans la fenêtre propre la première fois. Elle se souvient de vous ensuite. Si vous la laissez enregistrer votre mot de passe, il est gardé seulement dans la fenêtre propre : la fenêtre ne se synchronise jamais avec votre compte Microsoft ou Google, et le **Start Fresh** de l'installateur la supprime.

## Fermer {#closing}

- **☰ Menu > ⏻ Close Skynet Brewer** arrête le panel, ferme la fenêtre noire et ferme aussi la fenêtre propre (voir [Closing Skynet Brewer](95-closing-skynet-brewer)).
- Fermer la fenêtre noire avec son **X** ferme aussi la fenêtre propre.
- Fermer la **fenêtre propre** avec son X n'arrête **pas** le panel (un brassage ne doit jamais s'arrêter parce qu'une fenêtre a été fermée). Pour la rouvrir, double-cliquez à nouveau sur **Skynet Brewer** : le panel tourne toujours, il ouvre donc simplement sa fenêtre.

## Autres ordinateurs et téléphones {#other-computers-and-phones}

Les téléphones, tablettes et autres ordinateurs ouvrent le panel dans leur propre navigateur, comme avant (par exemple par Tailscale sur un iPhone).
