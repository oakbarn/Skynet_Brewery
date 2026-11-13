# Connexion, utilisateurs et mots de passe {#login-users-and-passwords}

Personne ne peut rien voir ni rien commuter sans se connecter. Les téléphones et les ordinateurs restent connectés pendant 30 jours sans utilisation.

## La première fois {#first-time}

La première fois que le panel s'ouvre, il vous demande de créer le **compte administrateur** (admin account : un nom d'utilisateur et un mot de passe ; par défaut au moins 8 caractères, voir [Règles des mots de passe](39-password-rules)). Cela ne marche que depuis votre réseau domestique, pour qu'un inconnu ne puisse jamais le créer.

Vous voulez que le panel choisisse un mot de passe pour vous ? Touchez la **clé** dans la case Password. Elle crée un mot de passe solide qui suit les [Règles des mots de passe](39-password-rules), le met dans les deux cases et l'affiche. **Notez-le** avant de toucher **Create admin account** (le navigateur peut aussi proposer de l'enregistrer quand vous vous connectez). Touchez l'œil pour le cacher. La même clé se trouve dans **Forgot password?**, **Settings > My account** et **Settings > Users** (Add user).

(Edge montrait autrefois sa propre clé ici. Elle a besoin d'Edge connecté et synchronisé, et la fenêtre propre de Skynet ne se synchronise jamais, donc Skynet a maintenant sa propre clé.)

## Rôles {#roles}

**Viewer** regarde, **Operator** mène une journée de brassage, **Admin** fait tout. Les Admins ajoutent et modifient les utilisateurs dans **Settings > Users** ; voir [Settings (réglages)](09-settings).

## Votre code de secours {#your-recovery-code}

Juste après la création du compte admin, le panel affiche un **code de secours** (recovery code) comme `K7QM-3XPD-9RTA-WF2H`. Il n'est montré qu'une fois, alors faites **Copy**, **Download** ou **Print**, et cochez **I saved my recovery code** pour continuer. Gardez-le loin du Pi (dans votre portefeuille ou un gestionnaire de mots de passe).

Un Admin peut créer un nouveau code dans **Settings > Recovery code**. L'ancien cesse de marcher.

## Se connecter avec un code par e-mail ou par SMS {#sign-in-with-a-code-by-email-or-text}

Au lieu d'un mot de passe, touchez **Email or text me a code** sur la page de connexion. Le panel envoie un code à 6 chiffres qui marche une fois, pendant 10 minutes.

Pour le configurer une fois, en tant qu'Admin :

1. **Settings > Sending codes** : touchez **Fill in for Gmail** (ou Outlook.com) et tapez votre adresse e-mail et un **mot de passe d'application** (app password ; pour Gmail, activez la validation en deux étapes, puis créez-en un sur https://myaccount.google.com/apppasswords).
2. **Settings > My account > Sign-in codes** : tapez votre e-mail et/ou votre numéro de portable et choisissez votre opérateur téléphonique sous **Send texts through**. Si votre opérateur n'accepte plus les e-mails vers SMS, utilisez plutôt **Twilio** (un service de SMS payant ; remplissez ses cases dans **Sending codes**).
3. Touchez **Send me a test**.

Chaque utilisateur peut régler son propre e-mail et son propre numéro. Les codes sont limités à un par minute et cinq par heure, et cinq essais faux verrouillent le code.

## Mot de passe oublié ? {#forgot-your-password}

**Le plus simple :** sur la page de connexion, touchez **Forgot password?** et entrez votre nom d'utilisateur, le code de secours et un nouveau mot de passe. Cela ne marche que depuis votre réseau domestique ou par Tailscale. Vous êtes connecté, et le panel affiche un **nouveau** code de secours (chacun ne marche qu'une fois), alors enregistrez aussi celui-là.

Un aide a oublié le sien ? Un Admin en règle un nouveau dans **Settings > Users**.

## Les mises à jour gardent vos connexions {#updates-keep-your-logins}

Installer une nouvelle version garde chaque utilisateur, mot de passe, connexion et le code de secours. Ils ne sont supprimés que si vous choisissez **Update the program and reset all users** ou **Start Fresh** dans le programme d'installation et confirmez son avertissement (voir [Passer à une nouvelle version](18-updating)). Le panel vous demande alors de créer à nouveau le compte admin. (L'ancien interrupteur Testing mode, qui effaçait les connexions à chaque nouvelle version, a été retiré le 2026-11-03.)

## Pas de code de secours et aucun Admin ne peut se connecter ? {#no-recovery-code-and-no-admin-can-sign-in}

Sur le Pi, dans le dossier du panel :

```
node tools/reset-password.js            (lists the users)
node tools/reset-password.js Brewer      (asks for a new password for the user Brewer)
sudo systemctl restart brewpanel
```

(La première ligne liste les utilisateurs ; la deuxième demande un nouveau mot de passe pour l'utilisateur Brewer ; la troisième redémarre le panel.)

## Utiliser le panel hors de chez vous {#using-the-panel-away-from-home}

Utilisez **Tailscale**, un réseau privé gratuit entre vos propres appareils. Installez-le sur le Pi et sur votre téléphone, connectés au même compte, et ouvrez `http://brewpi:8080` de n'importe où. Pour un ordinateur Windows, suivez [Installer Tailscale sous Windows](00-tailscale-windows). Les étapes pour le Pi et les téléphones sont dans `docs/REMOTE_ACCESS.md` dans le dossier du panel.

> **N'ajoutez jamais** de redirection de port pour le panel sur votre box, et ne le mettez jamais sur une adresse web publique. Le panel commande des éléments chauffants, des brûleurs et des pompes.
