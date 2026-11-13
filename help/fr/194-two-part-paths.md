# Chemins en deux parties (.path et .file) {#two-part-paths-path-and-file}

Chaque image et chaque son a un chemin en deux parties : le **dossier** où il se trouve (**.path** contient le chemin entier) et son **nom de fichier** (**.file**). La plupart du temps, il suffit du nom du fichier : Skynet ajoute le dossier (Skynet Rule 7.23).

## Les quatre dossiers par défaut {#the-four-default-folders}

| Par défaut | Dossier | Peut-on le changer ? |
|---|---|---|
| **Skynet Graphic** | `Images/Skynet` | Non. Les images Skynet sont là. |
| **Skynet Audio** | `sounds/Skynet` | Non. Les sons Skynet sont là. |
| **User Graphic** | `Images` | Oui, dans **Settings > Panel settings > Default folders**. Vos groupes d'images sont des dossiers dedans. |
| **User Audio** | `sounds` | Oui, au même endroit. |

## Dans les Properties {#in-properties}

Une liste d'images ou de sons ne montre **que le nom du fichier** (une image Skynet montre aussi son [numéro](193-skynet-picture-numbers)). Sous la liste, **Folder** montre où se trouve le fichier.

- Une image ou un son Skynet : le Folder est grisé. Il ne peut pas être changé.
- Votre propre image ou son : le Folder peut être tapé. Normalement, c'est le dossier où il se trouve qui sert. Tapez un autre dossier de vos dossiers media pour prendre le même nom de fichier là-bas.

## Dans un Process {#in-a-process}

Le nom du fichier seul suffit :

```
alm_Brew.backpath = "Bell.svg"
alm_Brew.sound = "ding.mp3"
gG_Brew_Day_Picture = "brewery_main.png"
```

Skynet cherche le fichier d'abord dans le dossier **User** (et les dossiers dedans), puis dans le dossier **Skynet** (et ses groupes). Un fichier qui n'est dans aucun des deux est montré par la vérification du Process, et le chemin est le dossier User avec ce nom.

Un chemin entier va dans **.path**. Seul un nom de fichier va dans **.file** :

```
alm_Brew.backpath.path = "Images/Hops/Bell.svg"
alm_Brew.backpath.file = "Bell_Red.svg"
if alm_Brew.sound.file == "ding.mp3"
  SoundPlayer_1.file = "song.mp3"
endif
```

- **.path** lit ou règle le chemin entier.
- **.file** lit ou règle seulement le nom du fichier. Le fichier reste dans le même dossier quand il y est ; sinon, Skynet le cherche comme ci-dessus.

**Les .path et .file de l'élément lui-même.** Sur un Device ou un Widget, `.path` et `.file` sont son Image Path 1 (.backpath), `.path_2` et `.file_2` son Image Path 2, et `.path_3` et `.file_3` son Image Path 3. Sur une Alarm ou un Sound Player, `.path` et `.file` sont son son. Sur un gGlobal Graphic, c'est son image.

```
Pump_1.file = "MyPump.png"
Pump_1.path_2 = "Images/Pumps/MyPump_Blue.png"
alm_Brew.file = "ding.mp3"
```

Chaque attribut d'image ou de son a les deux parties : `.image`, `.backpath`, `.backpath_2`, `.backpath_3`, `.imageon`, `.imageoff`, `.imageoverlay`, `.setgraphic`, le `.sound` d'une Alarm, le son d'un Sound Player (`SoundPlayer_1.path`, `SoundPlayer_1.file`) et un gGlobal Graphic (`gG_Pic.path`, `gG_Pic.file`).

## Le côté technique {#the-technical-side}

Un lien web vers un MP3 (`https://...`) est gardé tel quel : il n'a pas de dossier sur le Brain. Un mot comme `none` est gardé tel quel aussi. Dans Skynet, chaque chemin est gardé entier (dossier et fichier ensemble), donc tout ce qui marchait avec un chemin entier marche toujours. Dans le sélecteur d'images **🖼** de l'éditeur de Process, **Insert** ne met que le nom du fichier quand aucun autre fichier n'a le même nom. Voir aussi [Images de fond (.backpath, .backpath_2, .backpath_3)](25-picture-paths) et [Media (images et sons)](07-media).
