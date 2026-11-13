# Densimètres (Tilt, iSpindel, RAPT Pill ...) {#hydrometers-tilt-ispindel-rapt-pill}

Un **Hydrometer** est un seul Device pour toutes les sortes de densimètres flottants (Règle Skynet 6.25). Ajoutez-en un depuis **Add Device >
Hydrometers**, et choisissez son **Template** : la sorte que vous avez. Chaque Hydrometer a les mêmes Properties. Les réglages que son Template
n'utilise pas sont **grisés**, pour que vous voyiez ce qui existe sans pouvoir le changer.

| Template | Comment il communique | Comment Skynet en distingue deux |
|---|---|---|
| Tilt, Tilt Pro, Tilt Pro Mini | Bluetooth | sa **Tilt Color** (Red, Green, Black, Purple, Orange, Blue, Yellow, Pink) |
| iSpindel, Floaty | Wi-Fi : il envoie ses lectures à Skynet | son **Hardware ID** : son Name (iSpindel000 au départ) ou son numéro d'ID |
| GravityMon | Wi-Fi ou Bluetooth | son Hardware ID |
| BrewBrain Float | Wi-Fi, ou le cloud BrewBrain | son Hardware ID |
| RAPT Pill | Bluetooth, ou le cloud RAPT | son Hardware ID (affiché dans l'application RAPT) |
| PLAATO | le cloud PLAATO | son Hardware ID |
| Other hydrometer | n'importe lequel | son Hardware ID |

## Plus d'un {#more-than-one}

La **Tilt Color** d'un Tilt doit être choisie, et le **Hardware ID** de toutes les autres sortes doit être rempli. C'est ainsi qu'une lecture trouve son
Hydrometer, donc deux Hydrometers ne peuvent jamais avoir le même : un Tilt de chaque couleur (un Tilt rouge et un Tilt Pro rouge seraient
identiques), et un Name différent sur chaque iSpindel. Skynet ne se fie jamais à l'adresse IP d'un densimètre, car votre routeur peut la changer.

Laissez vide la **Tilt Color** d'un Tilt et une fenêtre dit **The Color for a Tilt cannot be left blank** (la couleur d'un Tilt ne peut pas rester vide), puis vous ramène à la
case Color. La page Hydrometers de l'Importer fait de même, et grise la case qu'un type n'utilise pas.

Vous n'avez pas à chercher un Hardware ID. Allumez le densimètre et attendez sa première lecture. La case **Hardware ID** propose alors
tous ceux que le Brain a entendus et qu'aucun Hydrometer n'a encore.

## Wi-Fi (iSpindel, GravityMon, Floaty, BrewBrain Float)

Sur la page de configuration du densimètre lui-même, choisissez **HTTP** et envoyez à l'adresse affichée dans ses Properties :
`http://<the Brain's address>:<port>/api/hydrometer` (l'adresse du Brain et son port). Depuis votre réseau domestique, rien d'autre n'est nécessaire. Depuis ailleurs, ajoutez
`?key=` et la clé d'API (☰ Menu > Settings).

## Bluetooth (Tilt, Tilt Pro, Tilt Pro Mini, RAPT Pill)

Un densimètre Bluetooth est entendu par un **récepteur** près du fermenteur, qui envoie ce qu'il a entendu au Brain. Choisissez-en un :

- **Un ESP32** (n'importe quel ESP32 avec Bluetooth, quelques euros). Ouvrez `firmware/ESP32_Hydrometer/ESP32_Hydrometer.ino` dans l'Arduino IDE,
  tapez en haut le nom et le mot de passe de votre Wi-Fi et l'adresse et le port du Brain, choisissez **Tools > Partition Scheme > Huge APP**, et
  Upload. Cela marche quel que soit le système du Brain, Windows aussi.
- **Le Bluetooth propre d'un Raspberry Pi** (le Brain lui-même, ou un autre Pi). Copiez le dossier `firmware/Pi_Bluetooth` sur le Pi et lancez
  `sudo bash install.sh`. Sur un autre Pi, mettez l'adresse du Brain dans son `settings.json`.

Réglez ensuite la **Connection** de l'Hydrometer sur **Bluetooth**. Un Tilt est trouvé par sa **Tilt Color**. Une RAPT Pill est trouvée par son
**Hardware ID** (son adresse Bluetooth) : une fois qu'un récepteur l'a entendue, la case Hardware ID la propose.

Vous pouvez avoir plus d'un récepteur (un dans chaque salle de fermentation). Le Bluetooth passe à quelques mètres à travers un fermenteur en acier, plus
à travers le plastique ou le verre.

## Avant qu'une lecture arrive, et le cloud {#before-a-reading-comes-and-the-cloud}

Un Hydrometer sur une Interface Simulator montre une fermentation simulée (Simulator settings :
`{"og":1.056,"fg":1.012,"hours":96,"tempF":66}`). Dès qu'une vraie lecture arrive, la simulée s'arrête. La lecture par les clouds des
fabricants (RAPT, BrewBrain, PLAATO) arrive dans une étape future.

## Ce qu'il lit {#what-it-reads}

- Sa valeur est sa densité, dans ses **Gravity units** (SG, °Plato ou °Brix). `.sg`, `.plato` et `.brix` sont toujours là aussi.
- `.temperature`, et là où sa sorte les envoie `.battery`, `.rssi` (force du signal) et `.angle` (angle d'inclinaison).
- `.lost` est vrai, et il affiche **No signal**, quand rien n'a été entendu pendant ses minutes **Lost signal after** (Tilts 15, autres 60).
- `.og` est l'**Original Gravity** (densité initiale, en SG ; un Process peut la régler) et `.abv` l'alcool qui en découle.
- **Gravity offset**, **Temperature offset** et **Smoothing weight %** (plus bas = plus lisse ; les Tilts commencent à 20 %) mettent de l'ordre dans ses lectures.

**Database and .API** marchent comme sur tout Device. Un Hydrometer qui communique par le web (Wi-Fi ou un cloud) a toujours son .API **On (Read
Only)**, affiché grisé.

**Sur un Graph**, la ligne d'un Hydrometer a un petit interrupteur **SG / °P / °Bx**. Un clic l'affiche dans les autres unités, les anciennes lectures aussi.
Chaque écran garde son propre choix.

## Une lecture à la main : take_reading {#a-reading-by-hand-take-reading}

Un réfractomètre ou un densimètre en verre est lu par une personne, donc c'est une commande de Process, pas un Device :

    take_reading OG_Value

Le nom qui suit est l'endroit où va la lecture : un Hydrometer, un Value Widget ou un gGlobal. Le Process attend, comme un `wait`, que la
lecture soit enregistrée.

1. Une fenêtre demande **Refractometer** ou **Glass** (cochez-en un).
2. **Refractometer :** la case SG apparaît tout de suite. **Glass :** tapez combien de minutes l'échantillon doit refroidir. Une barre en haut fait le
   compte à rebours (**Read it now** saute l'attente), puis la case SG apparaît.
3. Tapez la densité (par exemple 1.050) et appuyez sur **Save**. Avec **Send to Database now** coché, la lecture est envoyée à la base de données ;
   décoché, Save devient **Exit (No Database)**.

**Pause** cache la fenêtre pour que vous fassiez autre chose. Elle réapparaît dans 5 minutes. Seule une personne peut la mettre en pause.
