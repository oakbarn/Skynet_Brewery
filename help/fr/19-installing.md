# Installer le panel {#installing-the-panel}

Le Skynet Brew Panel tourne sous **Windows, Mac, Linux ou sur un Raspberry Pi**. Chaque version est livrée avec un `ReadMe.txt` (hors du zip) qui contient ces mêmes étapes, pour que vous puissiez les suivre avant que le panel tourne.

**Vous débutez ?** Chaque plateforme a son propre ReadMe pour débutants pour une première installation à la main, avec chaque téléchargement, clic et vérification expliqués, et un fichier de première installation qui vérifie Node.js, récupère la prise en charge des cartes USB, met **Skynet Brewer** sur le Bureau et lance le panel. Ils sont livrés avec chaque version dans des dossiers `First_Install_<platform>`, et se trouvent dans le dossier `install` du panel :

| Plateforme | ReadMe | Fichier de première installation |
|---|---|---|
| Windows | `install/windows/ReadMe_Windows.txt` | `Skynet_First_Install.bat` |
| Mac | `install/mac/ReadMe_Mac.txt` | `Skynet First Install.command` |
| Linux | `install/linux/ReadMe_Linux.txt` | `skynet-first-install.sh` |
| Raspberry Pi | `install/pi/ReadMe_Raspberry_Pi.txt` | `skynet-first-install-pi.sh` (fait aussi démarrer le panel tout seul au démarrage) |

Chaque méthode a besoin de **Node.js** (gratuit, sur <https://nodejs.org>). Les programmes d'installation l'installent pour vous, ou vous disent comment faire. Sous Windows, `Skynet_Brewer.bat` et `Skynet_First_Install.bat` l'installent aussi tout seuls quand il manque.

**Où le trouver :** <https://github.com/oakbarn/skynet_brewery/releases/latest> a toujours la version la plus récente. Descendez jusqu'à **Assets** et cliquez sur un fichier pour le télécharger. Aucun compte GitHub n'est nécessaire. Les versions plus anciennes sont plus bas dans la liste [Releases](https://github.com/oakbarn/skynet_brewery/releases).

Chaque version sur cette page est une **mise à jour officielle de Skynet** : une fois installée, Skynet vérifie à chaque démarrage que ses fichiers du programme sont toujours ceux qu'OakBarn Brewery a envoyés, et affiche **✓ Official** sur la Menu Bar. Voir [Mises à jour officielles de Skynet](191-official-skynet-updates).

| Fichier de la version | À quoi il sert |
|---|---|
| `Skynet_Brewer_Setup_<date>.exe` | Programme d'installation Windows. Tout le panel est dedans. |
| `Skynet_BrewPanel_<date>.zip` | Le panel lui-même : une première installation ou une mise à jour à la main, et pour Mac, Linux et le Pi. Il n'a pas de dossiers `config`, `data`, `media` ni `processes`, donc le décompresser par-dessus votre panel ne peut pas remplacer les vôtres. |
| `Install Skynet Brewer.command` | Programme d'installation Mac |
| `install-skynet-brewer.sh` | Programme d'installation Linux et Raspberry Pi |
| `Skynet_Brewer.bat` | Fichier de démarrage Windows d'exemple |
| `ReadMe.txt` | Comment installer |
| `First_Install_ReadMes_<date>.zip` | Les ReadMe pour débutants et les fichiers de première installation pour chaque plateforme |
| `Minimum_Equipment_and_Limitations.txt` | Ce que les cartes savent faire aujourd'hui |

Le panel va dans **`C:\Brewing\BrewPanel`** sous Windows, et dans **`Brewing/BrewPanel`** dans votre dossier personnel sur un Mac, sous Linux ou sur un Pi. Chaque programme d'installation met un raccourci **Skynet Brewer** sur le Bureau.

> **Une mise à jour ?** Arrêtez d'abord le panel, puis relancez le même programme d'installation, ou décompressez le zip par-dessus le panel. Ni l'un ni l'autre ne remplace votre disposition et vos réglages (`config`), vos données de brassage, utilisateurs et mots de passe (`data`), vos images et sons (`media`) ou vos Processes (`processes`). Voir [Passer à une nouvelle version](18-updating).

## Windows : le programme d'installation {#windows-the-installer}

1. Fermez le panel s'il tourne (**Ctrl + C** dans sa fenêtre noire, puis fermez-la).
2. Double-cliquez sur `Skynet_Brewer_Setup_<date>.exe`. Windows peut dire **Windows a protégé votre ordinateur** (Windows protected your PC) : cliquez sur **Informations complémentaires** (More info), puis **Exécuter quand même** (Run anyway). Le programme d'installation n'est simplement pas signé avec un certificat payant. Le premier écran montre la **Version** qu'il installe, le même nom que sur la page Releases.
3. Gardez le dossier `C:\Brewing\BrewPanel` et cliquez sur **Install**.
   - Si Node.js manque, il propose de l'installer. Windows demande la permission.
   - Si le panel est déjà là, il demande ce que fait la mise à jour : **1. Start Fresh: delete everything, nothing saved**, **2. Modified Fresh Start** (garde vos réglages par défaut, vos propres Profiles, Recipes, images et sons), **3. Update the program and reset all users**, ou **4. Update the program and keep everything** (le choix normal, déjà choisi). Les choix 1, 2 et 3 montrent d'abord un avertissement, pour que vous puissiez encore reculer (voir [Passer à une nouvelle version](18-updating)).
   - Si vous aviez avant le panel directement dans `C:\Brewing`, il propose de recopier vos données, votre disposition, vos Processes et vos images. L'ancien dossier n'est pas changé.
4. Lancez-le avec **Skynet Brewer** sur le Bureau. La fenêtre noire, c'est le panel qui tourne ; votre navigateur ouvre le panel quelques secondes plus tard.

Pour le désinstaller : **Paramètres > Applications > Skynet Brewer > Désinstaller** (Settings > Apps > Uninstall). Après un avertissement rouge, il supprime **tout** dans `C:\Brewing` : vos Schémas, utilisateurs, journal de brassage, Processus, sauvegardes, images et sons, et le dossier Import avec tous ses fichiers. Copiez ailleurs ce que vous voulez garder. Fermez le panneau avant de commencer, sinon il vous le demande.

## Windows : à la main, avec un fichier .bat {#windows-by-hand-with-a-bat-file}

1. Créez le dossier `C:\Brewing` et copiez-y `Skynet_BrewPanel_<date>.zip`.
2. Clic droit sur le zip, choisissez **Extraire tout…**, et extrayez dans `C:\Brewing`. Il crée tout seul le sous-dossier `C:\Brewing\BrewPanel`. (Si Windows propose `C:\Brewing\Skynet_BrewPanel_<date>`, changez-le en `C:\Brewing`.)
3. Copiez `Skynet_Brewer.bat` de la version (il est aussi dans `C:\Brewing\BrewPanel\install\windows`) dans `C:\Brewing`.
4. Clic droit sur le `.bat`, choisissez **Afficher d'autres options > Envoyer vers > Bureau (créer un raccourci)**, et renommez le raccourci en **Skynet Brewer**.
5. Double-cliquez dessus. Gardez la fenêtre noire ouverte pendant que vous brassez. Une fois le panel démarré et ouvert par le navigateur, la fenêtre se réduit toute seule dans la barre des tâches (cliquez dessus là pour la revoir). Le navigateur ouvre le panel quelques secondes plus tard. Pour arrêter le panel et fermer la fenêtre, utilisez **☰ Menu > Close Skynet Brewer** (voir [Fermer Skynet Brewer](95-closing-skynet-brewer)). Sur un PC qui sert à brasser, lisez aussi [Veille, Windows Update et redémarrages](190-sleep-updates-and-restarts).

**Vous n'avez pas besoin d'installer Node.js d'abord.** Chaque fois que `Skynet_Brewer.bat` démarre, il vérifie Node.js. S'il manque ou s'il est plus ancien que 22.13, il télécharge la version LTS sur nodejs.org et l'installe, puis continue. Il faut Internet et cela prend quelques minutes ; quand Windows demande *« Voulez-vous autoriser cette application à apporter des modifications à votre appareil ? »*, cliquez sur **Oui**. Il récupère aussi la prise en charge des cartes USB la première fois. Si cela échoue un jour, la fenêtre noire le dit et ouvre la page de téléchargement de Node.js pour que vous l'installiez à la main.

Si votre panel n'est pas dans `C:\Brewing\BrewPanel`, ouvrez le `.bat` dans le Bloc-notes et changez la ligne `set "PANEL=C:\Brewing\BrewPanel"`.

## Mac

1. Double-cliquez sur `Skynet_BrewPanel_<date>.zip`. Safari l'a peut-être déjà décompressé dans un dossier **BrewPanel** ; c'est très bien.
2. Mettez `Install Skynet Brewer.command` à côté du zip (ou du dossier BrewPanel), ou utilisez celui qui est dans `BrewPanel/install/mac`.
3. Double-cliquez sur **Install Skynet Brewer.command**. Si macOS dit qu'il ne peut pas être ouvert, faites un clic droit dessus, choisissez **Ouvrir**, puis de nouveau **Ouvrir**.
   - Si Node.js manque, la page Node.js s'ouvre. Installez le **macOS Installer (.pkg)** de la version LTS, puis relancez le programme d'installation.
4. Lancez-le avec **Skynet Brewer** sur le Bureau. La fenêtre Terminal, c'est le panel qui tourne.

## Linux

1. Mettez `install-skynet-brewer.sh` et le zip dans le même dossier.
2. Ouvrez un terminal à cet endroit et lancez `bash install-skynet-brewer.sh`. Ne mettez pas `sudo` devant ; il demande votre mot de passe quand il en a besoin. Sous Debian, Ubuntu, Mint et semblables, il installe Node.js si nécessaire.
3. Il demande si le panel doit démarrer tout seul quand l'ordinateur démarre. Lancez-le avec **Skynet Brewer** sur le Bureau ou dans le menu des applications.

## Raspberry Pi (le Brain) {#raspberry-pi-the-brain}

Utilisez Raspberry Pi OS (64 bits recommandé) sur un Pi 4 ou plus récent.

1. Copiez `install-skynet-brewer.sh` et le zip sur le Pi (une clé USB, ou téléchargez-les sur le Pi).
2. Ouvrez un terminal dans ce dossier et lancez `bash install-skynet-brewer.sh`.
3. Il installe Node.js, laisse le panel utiliser les cartes USB, et règle le panel pour **démarrer tout seul à chaque démarrage du Pi**. Répondez **Yes** quand il le demande.
4. À la fin, il affiche l'adresse du Pi, par exemple `http://192.168.1.50:8080`. Ouvrez-la sur n'importe quel téléphone ou ordinateur de la maison. **Skynet Brewer** sur le bureau du Pi ouvre simplement le panel dans le navigateur du Pi.

| Pour | Tapez dans un terminal sur le Pi |
|---|---|
| Arrêter le panel | `sudo systemctl stop skynet-brewer` |
| Le relancer | `sudo systemctl start skynet-brewer` |
| Voir ses messages | `journalctl -u skynet-brewer -f` |

**Passer d'un ordinateur Brain à un Pi ?** Installez le Pi comme ceci, puis utilisez **☰ Menu > Move Brain** pour tout ramener
depuis l'ordinateur : Schemas, réglages, Processes, images, valeurs enregistrées, connexions et journal de brassage. Voir [Déplacer le Brain](119-move-brain).

## La première fois {#the-first-time}

Le panel vous demande de créer le **compte admin**, puis affiche un **code de secours**. Gardez-le : c'est ainsi que vous revenez si vous oubliez le mot de passe. Voir [Connexion, utilisateurs et mots de passe](10-login). Pour atteindre le panel hors de chez vous, utilisez Tailscale : voir [Installer Tailscale sous Windows](00-tailscale-windows). N'ouvrez jamais de port sur votre box pour lui.

## Faire une version (pour qui construit le panel) {#making-a-release-for-whoever-builds-the-panel}

Sur un ordinateur Linux avec NSIS (`sudo apt install nsis`) et zip, lancez `bash tools/build-release.sh` dans le dossier du panel. Il écrit chaque fichier du tableau ci-dessus dans `release/`. Normalement, vous n'en avez pas besoin : à chaque fusion (merge), GitHub les construit et les attache tout seul à la Release de cette version (`.github/workflows/panel-version.yml`).
