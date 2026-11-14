# Fermer Skynet Brewer et la mise en veille (Standby) {#closing-skynet-brewer-and-standby}

Le **Brain** est l'ordinateur (ou le Raspberry Pi) qui fait tourner Skynet. Sur un PC Windows, le Brain tourne **en arrière-plan**, sans fenêtre à lui (règle Skynet 6.32). La fenêtre du panel, comme chaque téléphone ou autre ordinateur, n'est qu'un navigateur qui affiche le Brain.

## Fermer la fenêtre du panel {#closing-the-panel-window}

Fermer la fenêtre du panel avec son **X**, ou fermer un onglet du navigateur, **n'arrête jamais le Brain**. Votre téléphone, un autre ordinateur ou un Process en cours peut encore s'en servir, et un brassage ne doit pas s'arrêter parce qu'une fenêtre a été fermée. Pour rouvrir la fenêtre du panel, double-cliquez sur **Skynet Brewer** sur le Bureau.

## ☰ Menu > ⏻ Close Skynet Panel and the Brain

Sur l'ordinateur du Brain lui-même (Admins seulement) :

1. Ouvrez **☰ Menu**. En bas, choisissez **⏻ Close Skynet Panel and the Brain**.
2. Une boîte liste ce qui va se passer, chaque point avec une case à cocher : tout s'éteint et chaque Process s'arrête ; **si vous brassez**, ce qui est allumé et quels Process tournent ; **si d'autres écrans ont le panel ouvert**, qui ils sont (par exemple *Dana (iPhone)*). Cochez chaque case pour dire que vous l'avez lue. **Back** ne change rien.
3. Cliquez sur **⏻ Close the panel and the Brain**. Chaque sortie est éteinte, le Brain s'arrête et la fenêtre du panel se ferme. Chaque autre écran affiche **Skynet Brewer is closed**.

Pour le relancer, double-cliquez sur **Skynet Brewer** sur cet ordinateur.

Ce choix n'existe que sur l'ordinateur du Brain. Sur un téléphone, une tablette ou un autre ordinateur, vous avez la mise en veille (Standby) à la place.

## ☰ Menu > 💤 Put the Brain in Standby

Sur tout autre écran (et sur un Brain Raspberry Pi), Admins seulement :

1. Ouvrez **☰ Menu**. En bas, choisissez **💤 Put the Brain in Standby**.
2. La même boîte avec ses cases à cocher, et **Back** pour ne rien changer.
3. Cliquez sur **💤 Put the Brain in Standby**. Chaque sortie est éteinte, chaque Process s'arrête et le Brain lâche les cartes. Chaque écran n'affiche plus que **The Brain is in Standby**, avec qui l'a mis en veille et quand.

**Le relancer :** sur la page Standby, un Admin clique sur **▶ Start the Brain**, depuis n'importe quel écran, à la maison ou à distance (par exemple par Tailscale). Quelqu'un qui n'est pas Admin voit **Sign in as an Admin**. Le Brain redémarre normalement, avec tout éteint. S'il a été mis en veille pendant un brassage, l'avis rouge dit ce qui était allumé et propose **▶ Resume** pendant 15 minutes (voir [Veille, Windows Update et redémarrages](190-sleep-updates-and-restarts)).

Le Brain reste en veille, même après un redémarrage ou une coupure de courant, jusqu'à ce qu'un Admin le relance.

## Menu Démarrer > Skynet Brewer > Stop the Skynet Brain {#start-menu-skynet-brewer-stop-the-skynet-brain}

Sur un Brain Windows, ceci arrête le Brain qui tourne en arrière-plan, chaque sortie éteinte d'abord, même quand aucune fenêtre du panel n'est ouverte.

## Quand quelque chose ne va pas {#when-something-goes-wrong}

- **Le Brain n'a pas démarré** : la fenêtre noire qu'ouvre **Skynet Brewer** reste ouverte et montre les dernières lignes écrites par Skynet, pour que vous puissiez lire pourquoi. Appuyez sur une touche pour la fermer. Tout ce que le Brain écrit va dans `data\brain.log` dans le dossier du panel.
- **Un Raspberry Pi réglé comme service** démarre tout seul avec le Pi. Utilisez la mise en veille depuis le panel. Skynet peut aussi être arrêté avec `sudo systemctl stop skynet-brewer` (voir [Installation](19-installing)).

Quelle que soit la façon dont Skynet s'arrête, il éteint d'abord chaque sortie. Ce qui se passe quand le PC se met en veille ou redémarre pendant un brassage : [Veille, Windows Update et redémarrages](190-sleep-updates-and-restarts).
