# Des sons depuis un lien web {#sounds-from-a-web-link}

Un son n'a pas besoin d'être un fichier sur le Brain. Il peut être un **lien web vers un MP3** (Règle Skynet 7.20). Le navigateur qui affiche le
panneau le joue directement depuis le web, donc le fichier n'a jamais besoin d'être sur votre ordinateur. Utilisez-le quand vous ne voulez pas la musique sur le Brain.

## En utiliser un {#use-one}

Dans n'importe quelle case de son (le **Sound file** d'une alarme, un **Sound Player**, une étape d'Alarm Chain, ou **Settings > Panel settings: screen, Tabs and alerts > Sound before each hop
alert**), choisissez **Add new ...** et collez le lien, par exemple :

```
https://github.com/oakbarn/Skynet_Brewery/releases/download/Skynet-Sounds/My.Song.mp3
```

Le lien doit commencer par `https://` (ou `http://`) et pointer directement sur le fichier MP3, pas sur une page web qui a un lecteur.
Un Process peut aussi en utiliser un :

```
SoundPlayer path = "https://github.com/oakbarn/Skynet_Brewery/releases/download/Skynet-Sounds/My.Song.mp3"
play SoundPlayer
```

## Quand internet est coupé {#when-the-internet-is-down}

Un lien a besoin d'internet. Sans lui :

- **Une alarme** joue à la place le **Missing Alarm Sound** depuis le Brain (une voix qui dit que le son est introuvable), et un
  avertissement dit pourquoi. S'il n'est pas là non plus, elle joue le bip Skynet. Une alarme n'est jamais muette. La même chose se passe quand le
  fichier son d'une alarme manque sur le Brain.
- **Un Sound Player** joue une fois à la place la chanson d'OakBarn Brewery *Find The File - Connecting*, et montre le même avertissement.
- **Le son avant une alerte houblon** est sauté, et la voix de l'alerte parle quand même.

Pour les alarmes **Hop** et **Brew Flow**, un fichier sur le Brain est le choix le plus sûr : il joue avec ou sans internet.

## Un endroit gratuit pour garder vos MP3 {#a-free-place-to-keep-your-mp3s}

Une **GitHub Release** est gratuite et donne à chaque fichier son propre lien durable. Sur GitHub, ouvrez les **Releases** de votre projet, cliquez sur
**Draft a new release**, donnez-lui un tag (par exemple `Skynet-Sounds`), glissez-y les MP3, et cliquez sur **Publish release**. Puis
faites un clic droit sur un fichier de la Release et choisissez **Copy link**. GitHub change les espaces d'un nom de fichier en points, donc copiez le lien au lieu de
le taper.

Ne mettez en ligne que des sons que vous avez le droit de partager (Règle Skynet 9.12).

## Le côté technique {#the-technical-side}

- Un chemin de son qui commence par `http://` ou `https://` est un lien (une URL). Tout le reste est un fichier dans les dossiers media du Brain.
- Le navigateur joue le lien lui-même (un élément HTML `<audio>`). Le Brain ne le télécharge jamais, donc un téléphone sur Tailscale le joue aussi depuis
  le web.
- Un son qui ne se charge pas (un événement `error` : un lien, ou un fichier manquant) fait passer une alarme à `sounds/Skynet/Alarm_Sound_Missing.mp3`,
  puis à `sounds/alarm_beep.wav` si celui-ci échoue aussi, jusqu'à ce que la page soit rouverte.
- Un Sound Player passe à `sounds/Skynet/Find_The_File_Connecting.mp3` et le joue une fois (Repeat est ignoré pour lui).
- **Media > Move** et la liste des fichiers manquants sautent les liens : il n'y a pas de fichier à déplacer ou à trouver.
