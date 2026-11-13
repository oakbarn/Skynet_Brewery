# Installer Tailscale sous Windows {#installing-tailscale-on-windows}

**Tailscale** permet à votre ordinateur Windows de joindre le Brew Panel de n'importe où : chez un ami, au travail, à l'hôtel. C'est un réseau privé gratuit entre *vos propres* appareils. L'ordinateur parle au Raspberry Pi par un tunnel chiffré, et **votre box (routeur) n'est jamais ouverte à Internet**.

> **N'ajoutez jamais** de redirection de port pour le panel sur votre box. Le panel commande des éléments chauffants, des brûleurs et des pompes. Tailscale vous donne l'accès à distance sans ce risque.

## Avant de commencer {#before-you-start}

- Tailscale doit déjà être installé sur le Pi, connecté à **votre** compte Tailscale (voir la *Part 2* de `docs/REMOTE_ACCESS.md` dans le dossier du panel). Dans ces étapes, le Pi s'appelle `brewpi`.
- Il vous faut **Windows 10 ou Windows 11**, et un compte Windows qui a le droit d'installer des programmes.
- Sachez quel compte vous avez utilisé pour vous connecter à Tailscale sur le Pi (Google, Microsoft, Apple ou GitHub). L'ordinateur Windows doit utiliser **le même**.

## Étape 1 : télécharger Tailscale {#step-1-download-tailscale}

1. Sur l'ordinateur Windows, ouvrez un navigateur et allez sur <https://tailscale.com/download>.
2. Cliquez sur **Windows**, puis sur **Download Tailscale for Windows**.
3. Le programme d'installation (un fichier dont le nom commence par `tailscale-setup`) arrive dans votre dossier **Downloads** (Téléchargements).

## Étape 2 : l'installer {#step-2-install-it}

1. Ouvrez le dossier **Downloads** et double-cliquez sur le fichier `tailscale-setup`.
2. Cochez la case pour accepter la licence et cliquez sur **Install**.
3. Windows demande « Voulez-vous autoriser cette application à apporter des modifications à votre appareil ? ». Cliquez sur **Oui**.
4. Quand il indique que l'installation est terminée, cliquez sur **Close**.

## Étape 3 : se connecter {#step-3-sign-in}

1. Regardez le coin en bas à droite de l'écran, à côté de l'horloge. Trouvez l'**icône Tailscale** (une petite grille de points). Si vous ne la voyez pas, cliquez sur la petite flèche **^** à cet endroit pour afficher les icônes cachées.
2. Cliquez sur l'icône Tailscale et choisissez **Log in**.
3. Votre navigateur s'ouvre. Connectez-vous avec **le même compte que pour le Pi**.
4. S'il vous demande de **Connect** (connecter) cet appareil, cliquez sur **Connect**.
5. Le navigateur indique que vous êtes connecté. Vous pouvez fermer cet onglet du navigateur.

Cliquez de nouveau sur l'icône Tailscale : elle doit indiquer **Connected**, et le Pi (`brewpi`) figure dans la liste de vos appareils du réseau.

> **Astuce :** faites glisser l'icône Tailscale hors de la zone **^** vers la barre des tâches, pour voir d'un coup d'œil si elle est connectée.

## Étape 4 : ouvrir le Brew Panel {#step-4-open-the-brew-panel}

1. Ouvrez n'importe quel navigateur (Edge, Chrome, Firefox).
2. Tapez `http://brewpi:8080` dans la barre d'adresse et appuyez sur Entrée.
3. Connectez-vous avec votre nom d'utilisateur et votre mot de passe du **panel**, les mêmes qu'à la maison.

**Si `brewpi` ne marche pas :** cliquez sur l'icône Tailscale, ouvrez la liste des appareils du réseau et cliquez sur `brewpi`. Cela copie son adresse. Elle commence par `100.`. Tapez ensuite `http://100.x.x.x:8080` avec cette adresse, par exemple `http://100.101.102.103:8080`.

**Si vous avez configuré l'adresse avec cadenas** (`sudo tailscale serve --bg 8080` sur le Pi), utilisez plutôt l'adresse `https://brewpi.....ts.net` qu'il vous a donnée.

Ajoutez-la aux **favoris** du navigateur (appuyez sur Ctrl + D) : la prochaine fois, ce sera un seul clic.

## Ensuite, tous les jours {#every-day-after-that}

- Tailscale démarre tout seul avec Windows et reste connecté. Il n'y a rien à faire.
- Pour le couper un moment, cliquez sur l'icône et choisissez **Disconnect**. Choisissez **Connect** pour le rallumer.
- À la maison, sur le même WiFi que le Pi, le panel fonctionne avec ou sans Tailscale.

## Quand quelque chose ne marche pas {#when-something-doesn-t-work}

| Ce que vous voyez | Que faire |
|---|---|
| La page ne se charge jamais | Cliquez sur l'icône Tailscale. Si elle n'indique pas **Connected**, cliquez sur **Connect**. |
| `brewpi` n'est pas dans la liste des appareils | Le Pi est éteint, ou connecté à un autre compte Tailscale. Vérifiez le compte sur les deux. |
| `brewpi` est dans la liste mais grisé ou « offline » | Le Pi est éteint ou n'a pas Internet. Vérifiez-le à la maison. |
| La page de connexion du panel s'affiche, mais votre mot de passe est refusé | C'est la connexion du panel, pas Tailscale. Voir [Connexion, utilisateurs et mots de passe](10-login). |
| L'ordinateur du travail ou de l'école refuse de l'installer | Leurs règles informatiques peuvent le bloquer. Utilisez plutôt votre téléphone avec l'application Tailscale. |

## Si l'ordinateur est perdu ou vendu {#if-the-computer-is-lost-or-sold}

Allez sur <https://login.tailscale.com/admin/machines>, cliquez sur les **...** à côté de cet ordinateur et choisissez **Remove**. Changez ensuite votre mot de passe du panel dans **Settings > My account**.
