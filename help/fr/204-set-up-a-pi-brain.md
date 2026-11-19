# Installer un Pi Brain {#set-up-a-pi-brain}

Un Raspberry Pi 4 (ou plus récent) peut être le **Brain** : il fait tourner Skynet, garde tous les fichiers et démarre tout
seul dès qu'il a du courant. Vos cartes se branchent sur les prises USB du Pi, et vous ouvrez le panel depuis n'importe quel
navigateur : un PC Windows, un Mac, un iPhone ou un téléphone Android. Faites les étapes dans l'ordre. Comptez environ une
heure, surtout de l'attente.

## Étape 1. Ce qu'il vous faut {#step-1-what-you-need}

| Pièce | Notes |
|---|---|
| Raspberry Pi 4 (2 Go ou plus) ou Pi 5 | 4 Go suffisent largement. |
| Son alimentation | Pi 4 : **5,1 V 3 A, USB-C** (l'alimentation officielle de 15 W). Les chargeurs de téléphone causent des redémarrages au hasard. |
| Carte microSD, **32 Go ou plus, A1 ou A2** | SanDisk ou Samsung. « High Endurance » dure plus longtemps. |
| Un lecteur de cartes pour votre PC | Beaucoup de portables ont une fente. |
| Câble **micro-HDMI vers HDMI**, un écran, un clavier et une souris USB | Seulement pour le premier démarrage. |
| Câble Ethernet vers la box | Le mieux le jour du brassage. Le WiFi marche aussi. |
| Câble USB **A vers B** (prise carrée « imprimante ») | Arduino Mega vers le Pi. Prenez un câble qui transporte les données, pas un câble de charge seulement. |

## Étape 2. Écrire le système du Pi sur la carte (sur votre PC) {#step-2-write-the-pi-s-system-to-the-card-on-your-pc}

1. Installez **Raspberry Pi Imager** (depuis `raspberrypi.com/software`).
2. **Device :** votre Pi. **Operating System :** **Raspberry Pi OS (64-bit)**, celui avec un bureau. **Storage :** la carte. Vérifiez sa taille, pour ne pas effacer un autre disque.
3. **Next > Edit Settings :** Hostname **`skynet`**, un nom d'utilisateur et un mot de passe (notez-les), le WiFi seulement si vous n'utilisez pas l'Ethernet, votre fuseau horaire. Dans l'onglet Services, **Enable SSH** (facultatif).
4. **Save > Yes > Yes**, et attendez **Write Successful**.

## Étape 3. Premier démarrage (sur le Pi) {#step-3-first-start-on-the-pi}

1. La carte dans la fente sous le Pi. L'écran sur la prise HDMI la plus proche de la prise d'alimentation, puis le clavier, la souris et l'Ethernet.
2. Branchez le courant **en dernier**. Le premier démarrage prend quelques minutes et peut redémarrer une fois.
3. Suivez la fenêtre Welcome et laissez-la faire les mises à jour.

**Le terminal :** l'icône d'écran noir en haut, ou **Ctrl + Alt + T**. Tapez une ligne et appuyez sur **Entrée**. Un mot de
passe n'affiche rien pendant que vous tapez ; c'est normal.

## Étape 4. Installer Skynet {#step-4-install-skynet}

1. Dans le navigateur du Pi, ouvrez la page de téléchargement de Skynet (voir [Installer le panel](19-installing)) et enregistrez ces trois fichiers dans **Downloads** : `Skynet_BrewPanel_<date>.zip`, `install-skynet-brewer.sh` et `Skynet_Media_<date>.zip`.
2. Dans le terminal :
   ```
   cd ~/Downloads
   bash install-skynet-brewer.sh
   ```
   Pas de `sudo` devant : il demande le mot de passe du Pi quand il en a besoin.
3. **Install Node.js (LTS) now?** **Yes.** **Démarrer tout seul au démarrage :** **Yes.**
4. Redémarrez le Pi une fois : `sudo reboot`. Ensuite Skynet démarre tout seul chaque fois que le Pi a du courant.

## Étape 5. Première fois dans le panel {#step-5-first-time-in-the-panel}

1. Ouvrez `http://skynet.local:8080` (sur le Pi : **Skynet Brewer** sur son bureau).
2. Créez le **compte admin** et notez le **code de récupération**. Voir [Connexion, utilisateurs et mots de passe](10-login).
3. Choisissez un Schema d'exemple pour commencer.

**Deux Brains :** un Skynet sur Windows et un Skynet sur le Pi sont deux Brains séparés. C'est bien tant que chacun pilote
**ses propres** cartes. Ne branchez jamais une carte sur les deux. Pour amener les Schemas, Processes et images de
l'ordinateur vers le Pi, utilisez [Move Brain](119-move-brain).

## Étape 6. L'ouvrir depuis un PC ou un téléphone {#step-6-open-it-from-a-pc-or-a-phone}

- **À la maison :** n'importe quel navigateur, `http://skynet.local:8080`. iPhone : Safari, puis **Partager > Sur l'écran d'accueil**.
- **Le nom ne s'ouvre pas ?** Tapez `hostname -I` dans le terminal du Pi. Le premier nombre (par exemple `192.168.1.80`) donne `http://192.168.1.80:8080`. Une **réservation DHCP** dans votre box empêche ce nombre de changer.
- **Loin de la maison :** Tailscale. N'ouvrez jamais de port sur votre box. Sur le Pi tapez `curl -fsSL https://tailscale.com/install.sh | sh`, puis `sudo tailscale up`, et connectez-vous avec le **même** compte Tailscale que votre téléphone et votre PC. Ouvrez ensuite `http://skynet:8080`. Voir [Installer Tailscale sur Windows](00-tailscale-windows).

## Étape 7. Une Arduino Mega sur le Pi {#step-7-an-arduino-mega-on-the-pi}

1. Sur votre PC, installez l'**Arduino IDE** et, dans **Tools > Manage Libraries**, **OneWire** et **DallasTemperature**.
2. Ouvrez `BrewPanel\firmware\Mega_BrewPanel\Mega_BrewPanel.ino`. Ne changez rien pour un premier essai.
3. Branchez la Mega sur le PC. **Tools > Board :** Arduino Mega or Mega 2560. **Tools > Port :** son port COM. Cliquez **Upload**.
4. Débranchez-la et branchez-la sur le **Pi**. Le Pi n'a besoin d'aucun pilote.
5. **Devices > Add Interface :** Board **Arduino Mega**, Type **USB**, port `/dev/ttyACM0` (carte d'origine) ou `/dev/ttyUSB0` (clone).

Une Mega qui a encore le firmware d'un autre programme ne parle pas à Skynet tant que le firmware de Skynet n'est pas chargé.
Prenez une Mega de rechange pour les essais, pas une dont votre brasserie a besoin aujourd'hui.

## Étape 8. Un jeu de LED d'essai {#step-8-an-led-test-set}

Des LED remplacent les Pumps, Valves et Heating Elements, pour essayer un Process au bureau, sans rien de mouillé et rien sur
le secteur. Ces broches sont déjà dans le programme Skynet de la Mega, donc rien à changer.

| Usage | LED | Broches de la Mega |
|---|---|---|
| Pumps | rouge, 5 mm | D22, D23, D24, D25 |
| Valves | verte, 5 mm | D2 à D6 |
| Heating Elements (On/Off), ventilateur, lumière | jaune, 5 mm | D7 à D12 |
| Devices PWM (Heating Element en PWM, vitesse de pompe) | **RGB, cathode commune, diffuse** | D44 patte rouge, D45 patte verte, D46 patte bleue |
| Boutons poussoirs | tactiles 6 mm | D30 à D33 |
| Un bouton tournant (entrée analogique) | potentiomètre 10K | A0 |
| Sondes de température | DS18B20 | D40 |

**Câblage :**

- **LED simple :** **5V** → résistance de 330 ohms → patte **longue** de la LED. Patte **courte** → la broche. Skynet allume
  une sortie **en mettant la broche à LOW** (comme une carte relais), donc câblée ainsi la LED s'allume quand le Device est **On**.
- **LED RGB :** la patte la plus longue → **GND**. Chaque patte de couleur → sa propre résistance de 220 ohms → sa broche PWM.
  0 % = éteinte, 100 % = pleine lumière.
- **Bouton poussoir :** une patte → la broche, l'autre → GND. Pas de résistance.
- **Potentiomètre :** pattes extérieures → 5V et GND, patte du milieu → A0.
- **DS18B20 :** rouge → 5V, noir → GND, jaune → D40, et une résistance de 4,7K entre D40 et 5V.

Pas pour Skynet : les rubans de LED **WS2812 / NeoPixel** (Skynet n'a pas de code pour eux) et les LED RGB à **anode commune**
(elles seraient allumées à 0 %). Ne câblez jamais une LED sans sa résistance.

## Le côté technique {#the-technical-side}

- L'installateur ajoute le service `skynet-brewer`. Dans le terminal : `systemctl status skynet-brewer` (tourne-t-il ?),
  `sudo systemctl restart skynet-brewer`, `journalctl -u skynet-brewer -f` (ses messages).
- Plusieurs cartes du même genre : utilisez le nom permanent de la carte, donné par `ls /dev/serial/by-id/`, comme port, pour
  qu'elles ne puissent pas changer de place après un redémarrage.
- Chaque LED simple tire environ 9 mA ; les 15 à la fois font environ 135 mA, sous le total sûr de la Mega d'environ 200 mA.
- Plus de LED plus tard : ajoutez des broches aux listes en haut de `Mega_BrewPanel.ino` et chargez-le à nouveau.
- Éteignez le Pi avec `sudo shutdown -h now`, attendez que la lumière verte s'arrête, puis débranchez-le.
- Les propres broches du Pi peuvent aussi être une Interface (3,3 V, jamais 5 V) : voir [Broches GPIO du Raspberry Pi](78-raspberry-pi-gpio-pins).
- Les mêmes étapes, avec une liste de pièces : `docs/Pi_Brain_Setup_Guide.md` dans le dossier du panel.
