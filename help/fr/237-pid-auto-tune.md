# PID Auto-tune : laissez Skynet trouver Kp, Ki et Kd {#pid-auto-tune-let-skynet-find-kp-ki-and-kd}

**Auto-tune** calcule pour vous le **Kp**, le **Ki** et le **Kd** d'un Heating Element, pour ne pas avoir à les deviner. **PID** et
**Precise** utilisent les trois mêmes nombres (Règle 6.19), donc un seul Auto-tune sert aux deux. Il trouve aussi le **Hold output %**
dont part Precise (Help 156).

⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.

## Avant de commencer {#before-you-start}

1. **De l'eau au-dessus de l'élément** et la **Temperature Probe dans l'eau**. Auto-tune allume l'élément.
2. Tapez le **Setpoint** auquel vous brassez (par exemple le HLT à 150 °F). Réglez à la température que vous tiendrez : une cuve
   réglée à 150 °F tient le mieux 150 °F.
3. Remplissez la cuve autant que d'habitude. Une autre quantité d'eau demande d'autres nombres.

## Le lancer {#start-it}

1. Ouvrez les Settings **PID** ou **Precise** du Heating Element (Ctrl + Clic dessus, ou son ⬢ dans les Properties).
2. Appuyez sur **🎯 Auto-tune**.
3. Vérifiez la **Highest temperature**. Elle commence au Setpoint plus 10 °F (5 °C). Si la sonde lit plus, Auto-tune s'arrête et
   l'élément s'éteint.
4. Appuyez sur **▶ Start**.

La boîte montre ce qu'il fait : **Warming up to the Setpoint**, puis **Swing 1 of 5** jusqu'à **Swing 5 of 5**. Il tourne sur le
Brain : vous pouvez fermer la boîte et revenir. **■ Stop** l'arrête à tout moment, et éteindre l'élément l'arrête aussi.

## Combien de temps {#how-long}

Une cuve prend environ **30 à 90 minutes** (plus en partant d'eau froide), un tube RIMS quelques minutes. Il abandonne après 3 heures.

## Ce qu'il fait {#what-it-does}

Skynet monte l'élément quand l'eau est un peu sous le Setpoint et le baisse quand elle est un peu au-dessus, cinq fois. Il chronomètre
chaque oscillation et mesure jusqu'où va la température. Une cuve qui oscille lentement demande des nombres doux ; une qui oscille vite
et loin en demande de plus fermes. Il en tire Kp, Ki et Kd.

## Use ou Keep old {#use-or-keep-old}

À la fin l'élément s'éteint, et la boîte montre les nombres **Old** et **New** côte à côte :

| | Old | New |
|---|---|---|
| Kp | 10 | 25.65 |
| Ki | 0.1 | 0.0288 |
| Kd | 0 | 1647.9 |
| Hold output % (Precise) | 0 | 80 |

- **✔ Use new numbers** les enregistre tout de suite.
- **Keep old** ne change rien.

Rien ne change avant d'appuyer sur Use. Les nouveaux nombres restent sur l'élément jusqu'au prochain Auto-tune : un Process peut les
lire avec `.autotune_kp`, `.autotune_ki`, `.autotune_kd` et `.autotune_hold`, et `.autotune` dit ce qu'il fait.

## Conseils {#tips}

- Ces nombres sont calmes, choisis pour peu de dépassement. S'il met du temps à atteindre le Setpoint, montez un peu Kp.
- Un grand Kd fait sauter le % quand une sonde DS18B20 fait un pas de 0,11 °F. L'eau ne s'en soucie pas, mais si vous préférez un %
  calme, utilisez **Precise** (il lisse la sonde) ou baissez Kd.
- Arrêté avec **"the Temperature Probe gave no reading"** : vérifiez la sonde. **"above the Highest temperature"** : montez-la un peu
  ou partez d'une eau plus fraîche.

## Le côté technique {#the-technical-side}

C'est un auto-tune à relais avec biais (Åström et Hägglund). La sortie est bias + d en chauffe et bias − d au repos, avec une petite
bande autour du Setpoint (0,5 °F ou 0,3 °C) pour que les pas de la sonde ne le fassent pas claquer. Un élément chauffe plus vite
qu'une cuve ne refroidit, donc après chaque oscillation le biais bouge jusqu'à ce que les moitiés chauffe et repos durent à peu près
autant ; le biais final est le Hold output %. Chaque oscillation donne Ku = 4 d / (π √(a² − bande²)), où a est la moitié de
l'oscillation, et la période Tu. La première oscillation est la mise en chauffe et n'est pas utilisée ; les trois dernières sont
moyennées. Les règles de Tyreus-Luyben en font Kp = Ku / 2,2, Ki = Kp / (2,2 Tu) et Kd = Kp × Tu / 6,3. Règle 6.39, public/autotune.js.
