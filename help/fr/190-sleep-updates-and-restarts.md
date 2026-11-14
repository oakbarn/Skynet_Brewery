# Veille, Windows Update et redémarrages {#sleep-windows-update-and-restarts}

La plupart des brasseurs commencent avec un PC Windows comme Brain. Un PC se met en veille, Windows le redémarre pour les mises à jour, et parfois vous le redémarrez vous-même. Cette page dit ce que fait Skynet dans chaque cas, et quoi régler sur le PC pour qu'un brassage ne soit pas interrompu.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

Après tout arrêt, vérifiez vos cuves avant de remettre une résistance en marche. Une résistance sans liquide au-dessus peut griller ou provoquer un incendie.

## Ce que Skynet fait pour vous {#what-skynet-does-for-you}

- **Fermer le navigateur n'arrête pas un brassage.** Les Processes, l'Hysteresis, le PID et le reste tournent dans Skynet Brewer sur le Brain, pas dans le navigateur.
- **Le PC reste éveillé pendant que vous brassez.** Tant qu'un Process tourne ou que quelque chose est en marche (une pompe, une résistance, une vanne, une régulation), Skynet demande à Windows de ne pas se mettre en veille. L'écran peut quand même s'éteindre ; ce n'est pas grave. Quand rien ne tourne, le PC peut de nouveau se mettre en veille comme d'habitude.
- **Tout s'arrête quand Skynet s'arrête.** Quand Windows s'éteint ou redémarre, ou depuis ☰ Menu > Close Skynet Panel and the Brain ou Put the Brain in Standby, Skynet arrête toutes les sorties avant de s'arrêter. Si Skynet ne le peut pas (une coupure de courant, un plantage), chaque carte arrête ses propres sorties d'elle-même après son délai **Lost link** (10 secondes au départ, réglé sur la page Devices).
- **Après un redémarrage, tout démarre arrêté.** Rien ne se remet en marche tout seul, et aucun Process ne reprend où il en était avant que vous appuyiez sur **Resume** (plus bas). Un Process que vous avez réglé pour démarrer avec le panneau démarre quand même, depuis son début.
- **Un avis vous dit ce qui s'est passé.** Si Skynet s'est arrêté pendant un brassage, un avis rouge sur chaque écran dit quand il s'est arrêté, ce qui était en marche, et quel Process était à quelle étape et quelle ligne. Fermez-le avec ✕ (il se ferme sur chaque écran).
- **▶ Resume.** Pendant **15 minutes après l'arrêt**, l'avis rouge a un bouton **▶ Resume** (opérateurs et admins). Un clic remet en marche ce qui était en marche (pompes, résistances, vannes, PWM, Hysteresis, PID et autres régulations, minuteurs en cours) et relance chaque Process **à l'étape où il était**, avec ses variables comme elles étaient. Un Process sans étape reprend à la ligne où il était. Un sleep ou un wait à cette étape recommence. Vérifiez d'abord vos cuves. Après 15 minutes le bouton disparaît, et vous remettez les choses en marche vous-même.
- **Réveillé de veille quand même ?** (le couvercle d'un portable, le bouton d'alimentation) Les cartes ont déjà tout arrêté. Skynet arrête aussi tout à l'écran, arrête chaque Process, et montre un avis rouge avec **▶ Resume**. Rien ne se remet en marche tout seul.
- **Windows a une mise à jour en attente.** Quand Windows a installé une mise à jour et attend de redémarrer, un avis jaune le dit. Redémarrez le PC **avant** de brasser, pour que Windows ne le fasse pas pendant un brassage.

## Quoi régler sur un PC de brassage {#what-to-set-on-a-brewing-pc}

Ce sont des réglages Windows. Skynet ne les change pas pour vous.

1. **Démarrer Skynet à l'ouverture de session.** Le Skynet Setup demande *"Start Skynet Brewer by itself each time you sign in to Windows?"* (démarrer Skynet Brewer tout seul à chaque ouverture de session Windows ?). Oui met un raccourci dans votre dossier Démarrage. Relancez le Setup pour changer votre réponse.
2. **Revenir après un redémarrage de mise à jour.** Windows 11 et 10 : **Paramètres > Comptes > Options de connexion**, activez **Utiliser mes informations de connexion pour terminer automatiquement la configuration après une mise à jour**. Alors, après un redémarrage de mise à jour, Windows vous connecte et Skynet redémarre tout seul. (Tous les PC n'ont pas ce réglage.)
3. **Garder les mises à jour hors de vos heures de brassage.** **Paramètres > Windows Update > Options avancées > Heures d'activité** : choisissez **Manuellement** et réglez les heures où vous brassez (jusqu'à 18 heures, par exemple de 6 h à minuit). Windows ne redémarre pas pour les mises à jour pendant les heures d'activité. Vous pouvez aussi **suspendre les mises à jour** pendant une semaine avant un grand jour de brassage.
4. **Couvercle du portable.** **Panneau de configuration > Options d'alimentation > Choisir l'action qui suit la fermeture du capot** : réglez **Lorsque je ferme le capot** sur **Ne rien faire** (sur secteur). Skynet ne peut pas empêcher un couvercle de mettre un portable en veille.
5. **Après une coupure de courant.** Beaucoup de PC ont un réglage dans leur écran de démarrage (BIOS ou UEFI) appelé **Restore on AC Power Loss** ou **After Power Failure** : **Power On** fait démarrer le PC tout seul quand le courant revient. Regardez le manuel de votre PC.
6. **Alimentation des cartes.** Une petite batterie de secours (onduleur) pour le PC et les cartes évite qu'une courte micro-coupure arrête un brassage.

## Le côté technique {#the-technical-side}

- Rester éveillé : Windows `SetThreadExecutionState` (ES_CONTINUOUS et ES_SYSTEM_REQUIRED), tenu par un petit assistant PowerShell seulement pendant le brassage ; un Mac utilise `caffeinate`, Linux utilise `systemd-inhibit`. Un Raspberry Pi ne se met pas en veille.
- Ce qui était en marche et où en était chaque Process est écrit dans `data/brewing_now.json` toutes les quelques secondes pendant le brassage (écrit de façon sûre, donc une coupure de courant laisse la dernière bonne copie). Le démarrage suivant le lit pour l'avis et le bouton Resume. Un moteur pas à pas ne se remet jamais à bouger tout seul.
- La veille est remarquée quand l'horloge de Skynet saute de plus que le plus court délai Lost link de vos cartes (au moins 3 secondes).
- « Mise à jour en attente » est lu dans le registre Windows toutes les 30 minutes (pas besoin de droits d'admin).
- Voir aussi : [Fermer Skynet Brewer et la mise en veille](95-closing-skynet-brewer).
