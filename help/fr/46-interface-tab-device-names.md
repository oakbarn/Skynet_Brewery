# Les noms des Interfaces, des Tabs et des Devices {#interface-tab-and-device-names}

Chaque Interface et chaque Tab a un court **ID**, et un nouveau Device reçoit un nom fait à partir d'eux. Vous voyez d'un coup d'œil à quelle carte, quel port et quel Tab appartient un Device.

## Interface ID

Une **Interface** est une carte (automate, PLC) à laquelle les Devices sont câblés : une Mega en USB, une Mega en Ethernet, un ESP32 et ainsi de suite. Les Interfaces sont sur la page **Devices**.

- L'ID fait **de 1 à 4 lettres**, et s'écrit avec un tiret bas après : `MB_`.
- Chacun doit être **unique**.
- Une nouvelle Interface reçoit la première lettre des deux premiers mots de son nom. **Main Brewery Mega USB** reçoit `MB_`.
- Si cet ID est pris, la suivante reçoit `MB_2`, puis `MB_3`.
- Un Admin peut taper un autre ID en ajoutant l'Interface, ou le changer dans la case **ID** du tableau. Par exemple `MBUB` pour la Mega en USB et `MBET` pour celle en Ethernet.

## Tab ID

- Le Tab ID fait **exactement 2 lettres**, et chacun doit être **unique**. **Sparge** reçoit `SP`, **Batch Hops** reçoit `BH`.
- Un Admin le change dans **Tab settings** (Edit layout, double-cliquez sur un endroit vide du Tab).
- Renommer un Tab garde son ID.

## Les noms des Devices {#device-names}

Quand vous ajoutez un Device (tout ce qui est câblé à un port), la fenêtre **New Device** demande ceci, dans cet ordre :

1. **Interface** (la carte), listée par son nom complet avec son ID après, par exemple *Main Brewery Mega USB (ID MB_)*.
2. **Device Type** (voir la liste plus bas)
3. **Available Ports / Pins** (ports / broches disponibles). La liste ne montre que les broches libres sur cette Interface et qui conviennent à ce Device Type, les meilleures d'abord : des broches simples pour un relais ou un interrupteur, des broches PWM pour une sortie PWM, des broches de comptage pour un débitmètre, A0-A15 pour une entrée analogique. Chaque broche de la liste dit à quoi elle est réservée : **PWM**, **Counter**, **PWM + Counter**, **SPI, for RTD boards** ou **OneWire probes** ; une broche simple n'a pas d'étiquette. Pour un Device qui n'a pas besoin de PWM (une pompe On/Off, une vanne, un relais, une sonde, ou un Device en Pseudo PWM), une broche PWM indique **Save for PWM** (à garder pour le PWM), par exemple **D5 (Save for PWM)** : elle marche, mais gardez-la pour un Device qui a besoin du PWM. Vous pouvez quand même taper une autre broche. Un port de sortie peut avoir plus d'un type, voir plus bas.
4. **Label**, le texte affiché sur le Tab (son interrupteur **Show label** le cache), par exemple *Fly Sparge*.
5. **Suggested Name** (nom proposé), rempli pour vous à partir des cases ci-dessus (voir plus bas). Vous pouvez taper votre propre nom à la place ; il doit être unique.

Appuyez sur **Create**. Le Device est toujours créé d'abord sur le **Build Tab**, de la même façon qu'un nouveau Widget ou Template, et ses **Properties** s'ouvrent tout de suite pour que vous régliez tout le reste. Si vous en créez plusieurs à la suite, chaque nouveau se place un peu plus bas et à droite du précédent, pour qu'aucun ne cache les autres. Appuyez ensuite sur **💾 Save Build ...** et choisissez le Tab : le Device y va et le Tab ID est ajouté à la fin de son nom.

Le **Suggested Name** se remplit au fur et à mesure :

**Interface ID _ Port _ General Type@Device Type ID _ Label _ Tab ID** (un tiret bas entre les parties)

Chaque partie du nom dit une seule chose simple, toujours à la même place, pour que personne n'ait à deviner laquelle est laquelle. Skynet évite les noms qui se ressemblent ou qui veulent dire le contraire de ce qu'ils disent, la confusion rendue célèbre par le [Who's on First?](https://en.wikipedia.org/wiki/Who%27s_on_First%3F) d'Abbott et Costello ([à voir sur YouTube](https://www.youtube.com/watch?v=5FsJe4DScDs)). Un signe veut aussi dire une seule chose : un Offset négatif est un moins dans la fenêtre, le Schema et un Process.

Le port est toujours dans le nom, et le Device Type vient en troisième. Le Device Type commence par son **General Type et un `@`** : une pompe On/Off affiche son Device Type comme **DO@Pump**, donc dans son nom c'est `DO@Pump` (un `:` ne peut pas être dans un nom, donc `@` le remplace). Une pompe On/Off appelée *Red Pump* sur le port 22 de la Mega `BM`, sur le Tab Brew House `BH`, est `BM_22_DO@Pump_Red~Pump_BH`. Quand le General Type et le Type ID sont le même mot, il est écrit une fois (`PID`, `Hys`). Il y a **un** tiret bas entre chaque partie, et un espace dans le Label devient `~`, pour que les parties soient faciles à distinguer. Une vanne proportionnelle basse température appelée *Fly Sparge*, sur le port 25 de la Mega `MB`, sur le Tab Sparge `SP`, reçoit :

`MB_25_PWM@Valve_L_Fly~Sparge_SP`

Les broches analogiques s'écrivent par leur numéro de broche, A0 = 54 jusqu'à A15 = 69, donc une thermistance 10K appelée *Mash/Tun* sur la broche A0 reçoit `MB_54_TEMP@10KNTC_Mash~Tun_SP`. Vous pouvez toujours taper A0 ou 54 quand vous choisissez la broche. Les sondes DS18B20 partagent toutes un seul fil, donc chaque numéro de sonde est un port virtuel de 700 à 799 (sonde 1 = 700, sonde 2 = 701 ...) : `MB_700_TEMP@1W_HLT_HL`. Un numéro de sonde ne peut appartenir qu'à un seul Device.

Comment le Label est transformé en partie du nom (le Label lui-même reste exactement comme vous l'avez tapé) :

- Les caractères de contrôle et les emoji sont laissés de côté, et les espaces au début et à la fin sont retirés.
- Chacun de `< > : " / \ | ? * . ,` devient `~`. *Fly/Sparge In* devient `Fly~Sparge~In`.
- Les espaces deviennent aussi `~`, pour que le `_` ne serve qu'à séparer les parties du nom : *Mash Tun* devient `Mash~Tun`.

D'autres règles :

- **Pas d'espaces dans les noms de Devices.**
- Si le nom est déjà utilisé, un numéro va après le Label : `MB_25_DO@Pump_Wort_2_BH`.
- Un Admin peut taper un nom à lui à la place. Il est vérifié : il ne doit être utilisé par aucun autre Device ni Widget.
- Un nom qui contient `~` ou `@` marche tel quel dans un Process, sans guillemets : `MB_25_DO@Valve_E_Fly~Sparge_SP = true`.
- Chaque caractère spécial et ce qu'il fait dans un nom : [Special characters in names](https://github.com/oakbarn/Skynet_Brewery/blob/claude/project-thread-vzxi0a/docs/Special_Characters.md).
- Tant qu'un nouveau Device n'est pas encore enregistré, son nom continue de suivre la suggestion si vous changez le Label, le Device Type ou le Tab dans ses propriétés. Une fois que vous tapez votre propre nom, il reste.
- **Un port d'Interface, un Device** (Règle 6.1). Deux Devices ne peuvent pas utiliser le même port sur la même Interface. Un chauffage est un seul Heating Element et vous choisissez sa méthode de chauffe ([Une seule résistance, choisissez comment elle chauffe](150-heating-method)).
- **Les Schemas plus anciens :** deux Devices qui partagent déjà un port continuent de marcher (le dernier allumé gagne, les autres sur ce port sont éteints) et peuvent toujours être enregistrés. Aucun nouveau ne peut être créé.

## Ce que vous apprend le Suggested Name {#what-the-suggested-name-tells-you}

Skynet fournit toujours un Suggested Name, qui est la convention de nommage préférée de Skynet. Cette convention vous apprend beaucoup sur le
Device (ou le Widget) rien que par son nom. Une pompe rouge (Red Pump) sur le port 15 de l'Interface BM (Brewery Mega), sur le Tab Brew House BH :

| Partie | Dans le nom |
|---|---|
| Interfaceid | **BM**_15_DO@Pump_Red~Pump_BH |
| Port | BM_**15**_DO@Pump_Red~Pump_BH |
| Type | BM_15_**DO@Pump**_Red~Pump_BH |
| Label | BM_15_DO@Pump_**Red~Pump**_BH |
| TABid | BM_15_DO@Pump_Red~Pump_**BH** |

D'après BM_15_DO@Pump_Red~Pump_BH ci-dessus, le maître brasseur d'OakBarn sait que le Device Red Pump est branché sur l'Interface BM (Brewery
Mega {Arduino}), sur le port 15, de type pompe, avec le label Red Pump, et enfin sur le Tab BH (le Tab Brew House).

**Predictive Text** (texte prédictif) : dans un Process, vous ne tapez jamais ce long nom. Tapez BM et la liste ne montre que les Devices de l'Interface BM ;
choisissez-y Red Pump. C'est le Suggested Name qui permet cela.

Dans Skynet, un nom se change très facilement : chaque nom a son propre bouton **💾 Update to Suggested** (Règle 3.16), et
**🏷 Suggested Names** en convertit beaucoup d'un coup (plus bas). Plus de détails dans
[Properties du Device Pump (le détail)](115-pump-device-properties#the-name).

## Convertir tous les noms en Suggested Names {#convert-all-names-to-suggested-names}

Dans **Edit layout**, un Admin appuie sur **🏷 Suggested Names** (sur la barre Edit layout). Une liste montre chaque Device et Widget, sur chaque
Tab, dont le Name n'est pas son Suggested Name : son Tab, le Name actuel et le Suggested Name. Chacun commence coché ; décochez ceux que vous voulez
garder (**☑ Tick all** et **☐ Untick all** aident). Appuyez sur **💾 Convert**, puis sur **Save layout**. Chaque Process qui utilise un nom passe
au nouveau nom pour vous, et les Clones suivent leur parent. **Exit** sans enregistrer garde les anciens noms (Règle Skynet 3.18).

Pas dans la liste : les Integrated Instances (leurs noms sont VesselName.DeviceName), et ce qui n'a pas de Suggested Name, comme les cuves,
les tuyaux, les raccords et les Text.

## Les broches réservées aux sondes RTD et OneWire {#pins-kept-for-rtd-and-onewire-probes}

Certaines sondes partagent des broches sur la carte. Sur une Arduino Mega avec le sketch Skynet :

- **Les sondes RTD et les thermocouples** (PT100, PT1000, cartes MAX31855 / MAX31856) utilisent toutes les **broches SPI 50, 51 et 52**. Chaque carte a aussi une broche à elle, sa broche de sélection (CS), et c'est le Port dans son nom, par exemple `MB_48_TEMP@RTD_HLT_HL`. Pour un **thermocouple**, la broche CS peut être n'importe quelle broche libre sauf 50, 51 et 52. Pour une **RTD** (PT100 / PT1000, carte MAX31865) sur une Arduino Mega, la broche CS ne peut être **que** **D14-D17, D22-D39, D41-D43, D47-D49 ou D53** (Règle Skynet 6.9). Ces broches ne sont ni des broches PWM, ni de comptage, ni SPI, ni OneWire (40), ni du shield Ethernet (4, 10). La liste des broches de la fenêtre New Device et des Properties de la RTD ne montre que ces broches, et le panel refuse toute autre broche avec un message.
- **Les sondes DS18B20 (OneWire)** partagent toutes une seule broche de données, la **broche 40**. Chaque sonde reçoit à la place son propre port virtuel 700-799 dans son nom.

Ce que fait le panel :

- **Bloqué :** dès qu'une RTD ou un thermocouple est sur une Interface, les broches 50, 51 et 52 ne peuvent plus servir à rien d'autre sur elle. Dès qu'une sonde DS18B20 est configurée, la broche 40 ne peut plus servir à rien d'autre.
- **Avertissement :** s'il n'y a pas encore de telle sonde et que vous mettez autre chose sur la broche 50, 51, 52 ou 40, le panel demande d'abord. Il vous dit que tant que ce Device est sur la broche, vous ne pouvez pas ajouter de sondes RTD, de thermocouples ou de sondes DS18B20 à cette Interface. Appuyez sur **Cancel** pour choisir une autre broche.
- **Pas permis dans l'autre sens non plus :** si une pompe est déjà sur la broche 51, vous ne pouvez pas ajouter de RTD à cette Interface tant que vous n'avez pas déplacé la pompe.

Sur une Mega en **Ethernet**, la broche **D10** appartient au shield Ethernet et ne peut servir à aucun Device (Règle Skynet 6.10, voir Help : Connection ratings). La broche **D4** est la broche de la carte SD du shield : vous pouvez l'utiliser, mais le panel vous prévient : SD Card Not Supported. Never insert an SD Card! (carte SD non prise en charge, n'insérez jamais de carte SD ; Règle 6.11)

Astuce : gardez libres les broches 40 et 50-52, même si vous n'avez pas encore de telles sondes. Vous pourrez alors les ajouter plus tard sans recâbler.

### Les broches PWM et de comptage {#pwm-and-counter-pins}

Une Mega n'a que 15 **broches PWM** (2-13, 44-46), pour la vitesse des pompes, la puissance des SSR et autres, et seulement 6 **broches de comptage** (2, 3, 18, 19, 20, 21), pour les débitmètres. Si vous mettez sur l'une d'elles un Device qui n'en a pas besoin (un relais, un interrupteur, une vanne), le panel vous prévient et nomme une broche libre qui lui convient mieux, par exemple *Pin 14 is free and fits it* (la broche 14 est libre et lui convient). On propose à une sortie PWM sur la broche 2 ou 3 une broche PWM qui n'est pas une broche de comptage, et à un débitmètre sur 2 ou 3 les broches 18-21.

Appuyez sur **OK** pour garder quand même votre broche, ou sur **Cancel** pour revenir en choisir une autre. Une fois qu'aucune meilleure broche n'est libre, il n'y a plus d'avertissement.

## Les Device Type IDs {#device-type-ids}

Chaque Device Type ID veut dire une seule chose. Le **General Type** devant dit sur quel type de port il est, donc le même ID est utilisé sur chaque type de port : une pompe est `DO@Pump` sur un port On/Off et `PWM@Pump` sur un port PWM (sa vitesse). La case Device Type l'affiche de la même façon. Un Heating Element est `H_Element`, par exemple `MB_25_DO@H_Element_HLT_BH`, quelle que soit la méthode de chauffe qu'il utilise.

**Température :** `1W` DS18B20, `RTD` PT100 / PT1000, `TC` thermocouple, `10KNTC` thermistance NTC 10K (type BCS-462), `5KNTC`, `50KNTC`, `100KNT` (100K, le type des imprimantes 3D), `NTC` toute autre thermistance, `LM35`, `TMP36`.

**Éléments chauffants :** `PID`, `DutyCy` duty cycle (rapport cyclique), `Hys` hysteresis, `H_Element` Heating Element (sa méthode choisie par un clic ou un Process) : `DO@H_Element` sur une sortie marche / arrêt, `PWM@H_Element` sur une sortie PWM, `AO@H_Element` sur un gradateur de puissance 0-10 V (SCR / SSVR).

**Marche / arrêt direct :** `DO`, `H_Element` Heating Element, `Pump`, `CPMP` Cool / Warm Pump (une pompe qu'une température commute, avec une Method, [aide 164](164-cool-warm-pump)), `M_L_Vlv` vanne manuelle basse température, `Valve_E` vanne électrique (vanne à boisseau motorisée, basse température), `M_H_Vlv` vanne manuelle haute température, `Valve_E_H` vanne électrique haute température, `Valve_Sgas` électrovanne de gaz, `Mtr` moteur, `LED`, `Light` lumière, `E_Alm` alarme électrique, `Fan` ventilateur, `Chill` compresseur de refroidisseur / glycol / réfrigérateur, `HtPad` ceinture ou tapis chauffant de fermenteur, `Ignit` allumeur de brûleur.

**Entrées directes :** `DI` simple, `Float` (vrai tant que le flotteur est fermé, faux sans tension), `DIN` bouton poussoir momentané, `PB` bouton poussoir (ON seulement tant qu'on le tient), `Toggle` (bascule), `Latch` (ON jusqu'à remise à zéro), `FlowSw` détecteur de débit, `Intlk` verrouillage de porte / couvercle / sécurité, `EStop` arrêt d'urgence, `Leak` détecteur de fuite, `Count` compteur d'impulsions.

Un **DIN** donne un seul déclenchement par appui, quelle que soit la durée d'appui sur le bouton, et un deuxième ou troisième appui en moins de **3 secondes** ne fait rien. Vous pouvez changer les 3 secondes dans ses propriétés (*Pulse: lockout*).

**PWM :** `PWM` simple, `H_Element` chauffage PWM, `Valve_L` vanne proportionnelle basse température, `Valve_H` vanne proportionnelle haute température, `Pump` vitesse de pompe, `Fan` vitesse de ventilateur, `Mtr` vitesse de moteur, `LED` variateur de LED / de lumière (affiché comme `PWM@Pump` ...).

**Sorties analogiques (0-10 V, 4-20 mA) :** `AO` simple, `H_Element`, `Valve_L`, `Valve_H`, `Pump`, `Fan`, `Mtr` (affiché comme `AO@Pump` ...).

**Entrées analogiques :** `AI` simple, `Pres` pression, `Level` niveau, `Vol` volume, `PH_Met` pH-mètre.

**Autres :** `FlowM` débitmètre, `Scale` balance (cellules de charge), `Step` moteur pas à pas.

**Gardés pour plus tard** (Skynet ne sait pas encore les lire) : `DHT11`, `DHT22`, `Hydro` (un Tilt ou tout autre densimètre).

**Les ports virtuels.** Certains Devices n'ont pas de broche à eux, donc ils reçoivent un port virtuel : les densimètres `200`, `201` ..., les sondes OneWire `700` à `799`. Un Tilt s'appellerait par exemple `MB_200_Hydro_Red_Tilt_FE`.

## Thermistances {#thermistors}

Une thermistance NTC se lit sur une broche analogique avec une résistance en série, à partir de ses **ohms à 25 °C** et de sa valeur **Beta** de la fiche technique. La liste Add a des 10K (Beta 3950), 10K BCS-462 (Beta 3977), 50K et 100K toutes prêtes ; pour toute autre, choisissez **NTC** et tapez ses nombres. La température est calculée en °C, et chaque sonde affiche **°F ou °C**, celle que vous choisissez dans ses propriétés.

## Les Devices que vous avez déjà {#devices-you-already-have}

Les Devices faits avant ceci gardent leurs noms, donc vos Processes marchent toujours. Leurs anciens codes de type (`PmP`, `VlV` ...) sont changés tout seuls en nouveaux Device Type IDs. Leurs propriétés montrent le **Suggested Name** ; vous pouvez leur donner ce nom avec **✏ Change name** à côté du **Name** si vous voulez. Vos Processes passent tout seuls au nouveau nom quand vous enregistrez la disposition (voir [Renommer des Devices et des Widgets](53-renaming)).

Les Interfaces et les Tabs d'avant reçoivent un ID tout seuls la première fois que le Schema s'ouvre. Changer un Interface ID ou un Tab ID plus tard ne renomme pas les Devices qui existent déjà.

## Qui peut changer les choses {#who-can-change-things}

Seul un **Admin** peut modifier un Schema : ajouter ou changer des Interfaces, des Devices, des Widgets et des Tabs, ou déplacer des images dans **Edit layout**. Les Operators font tourner les Processes et commutent les choses ; les Viewers regardent.

Voir aussi [Devices et cartes](03-devices) et [Connexion, utilisateurs et mots de passe](10-login).

## Pas de broche PWM libre {#no-free-pwm-pin}

Un Device qui a besoin d'un vrai PWM (une sortie PWM, un PID ou un Deadband sur une broche PWM) ne se voit proposer que des broches PWM ; chaque autre Device ne se voit proposer que
les broches qui ne savent pas faire de PWM, pour que les broches PWM restent libres. Quand aucune de celles-ci n'est libre, les broches PWM sont proposées, marquées **Save for PWM**. Si l'Interface n'a plus de broche PWM libre, une fenêtre donne deux choix :

1. **➕ Add an Interface** : ajouter une autre carte, et la fenêtre Add Device revient avec celle-ci choisie.
2. **Use Pseudo PWM on a plain pin** (utiliser un pseudo PWM sur une broche simple) : le Brain allume complètement la broche pendant le % du Device de chaque seconde et l'éteint le reste du temps (50 % = ½ s allumé,
   ½ s éteint). Un élément chauffant sur un SSR chauffe pareil en moyenne, mais une pompe ou un ventilateur accélère et ralentit chaque seconde et une LED clignote.
   Ses Properties disent qu'il est en Pseudo PWM. Une sortie analogique ne peut pas l'utiliser.
