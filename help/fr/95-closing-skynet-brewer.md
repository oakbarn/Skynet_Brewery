# Fermer Skynet Brewer {#closing-skynet-brewer}

Sous Windows, Skynet Brewer tourne dans une fenêtre noire **Invite de commandes** (Command Prompt) sur le Brain. Votre navigateur ne fait qu'afficher le panel.

Pour arrêter le panel **et** fermer cette fenêtre d'un coup :

1. Ouvrez **☰ Menu**. En bas, choisissez **⏻ Close Skynet Brewer** (Admins seulement).
2. Le panel demande d'abord, et dit combien de Processes tournent. Ils s'arrêtent.
3. Le panel s'arrête et la fenêtre Invite de commandes se ferme toute seule, quel que soit le .bat avec lequel vous l'avez démarré (votre propre .bat dans C:\Brewing marche aussi). Chaque téléphone et ordinateur qui affiche le panel dit **Skynet Brewer is closed** (Skynet Brewer est fermé). La propre fenêtre propre du panel se ferme aussi (voir [Skynet in its own clean window](122-own-clean-window)).

Pour le redémarrer, double-cliquez sur **Skynet Brewer** sur le Bureau.

## Pourquoi fermer le navigateur ne l'arrête pas {#why-closing-the-browser-does-not-stop-it}

Fermer un onglet du navigateur n'arrête jamais le panel. Votre téléphone, un autre PC ou un Process qui tourne l'utilise peut-être encore, et un brassage ne doit pas s'arrêter parce qu'un onglet a été fermé.

## Quand la fenêtre reste ouverte {#when-the-window-stays-open}

- **Le panel s'est arrêté à cause d'une erreur** : la fenêtre reste ouverte pour que vous puissiez lire pourquoi. Appuyez sur une touche pour la fermer.
- **Un Raspberry Pi réglé comme service** (il démarre tout seul avec le Pi) : il n'y a pas de fenêtre, donc le ☰ Menu n'a pas Close Skynet Brewer. Utilisez `sudo systemctl stop skynet-brewer` (voir [Installing](19-installing)).
- **Démarré dans Windows Terminal** (Windows 11 peut le faire) : l'onglet peut rester ouvert avec une ligne qui dit que le programme est terminé. Fermez-le avec son X.

Fermer la fenêtre noire avec son **X**, ou **Ctrl + C** dedans, arrête toujours le panel comme avant.

Quelle que soit la façon dont Skynet s'arrête, il éteint d'abord chaque sortie. Ce qui se passe quand le PC se met en veille ou redémarre pendant un brassage : [Sleep, Windows Update and restarts](190-sleep-updates-and-restarts).
