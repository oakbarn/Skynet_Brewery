# Widget Code Value {#code-value-widget}

Un **Code Value Widget** est un Value Widget qui **fait quelque chose** quand vous le réglez (Règle Skynet 1.27). Il montre sa **Value** sur un Tab dans le **Format** que vous choisissez, avec le **Label** normal d'un Value Widget, et il
contient quelques lignes de **code Process** dans son attribut **Code**. Chaque fois que vous réglez la Value, ce code s'exécute une fois.

Par exemple, un Code Value Widget pour le Setpoint de température de la cuve d'ébullition. Le Setpoint appartient à la **résistance** de la cuve (son `.setpoint` ; l'ancien `.target` est pareil), celle qui lit la sonde de température de la cuve :

```
MB_25_DO@H_Element_Brew~Kettle_BH.setpoint = {value}
```

Appuyez sur le Widget, tapez **152**, appuyez sur **Set** : le Widget affiche 152 et le Setpoint de la cuve d'ébullition devient 152.

Ajoutez-en un dans **Edit layout > Add Widget > Value, Time and DateTime Widgets > Code Value Widget**, ou avec **Code Value ➕** sur
le 🔨 Build Tab. Comme tout Widget, il n'existe que dans l'application (pas de port PLC), son Label n'est jamais vide, et un double-clic ouvre
ses Properties. Son Name suit `wgt_CV_` + le Label + l'ID du Tab, par exemple `wgt_CV_Kettle~SP_BH` (Règle 3.14).

## {value} : la Value du Widget {#value-the-value-of-the-widget}

Dans le Code, **`{value}`** représente la Value du Widget qui vient d'être réglée. Utilisez-le autant que vous voulez, sur n'importe quelle ligne :

```
MB_25_DO@H_Element_Brew~Kettle_BH.setpoint = {value}
gV_Strike_Temp = {value} + 2
print "Kettle Setpoint is now " + {value}
```

(Ces lignes règlent la consigne de la cuve, mettent la température d'empâtage 2 degrés plus haut, et écrivent la nouvelle consigne.) Dans un « texte entre guillemets », `{value}` reste tel qu'il est tapé. Écrire le Name du Widget lui-même (`wgt_CV_Kettle~SP_BH.value`) fait la même
chose que `{value}`.

## Quand le Code s'exécute {#when-the-code-runs}

- **Il s'exécute** chaque fois qu'une **personne** règle la Value : un appui et **Set** sur son Tab (même à la même valeur), ou un programme extérieur
  par l'**.API** (Read & Control).
- **Il ne s'exécute pas** quand un **Process** règle la Value (`wgt_CV_Kettle~SP_BH = 150`), donc un Process et un Widget ne peuvent jamais se
  déclencher l'un l'autre sans fin.
- Il s'exécute **une fois**, de la première ligne à la dernière, comme un court Process. Il utilise les mêmes mots qu'un Process (`if`, `wait`,
  `sleep`, `start`, `play` ...). Il n'est **pas** dans la liste des Processes. Si vous réglez une nouvelle Value pendant que l'ancienne exécution est encore dans un
  `sleep` ou un `wait`, l'ancienne s'arrête et la nouvelle commence.
- **Stop All** l'arrête comme tout Process en cours.

## Problèmes dans le Code {#problems-in-the-code}

Quand vous faites **Save** sur ses Properties, le Code est vérifié comme un Process ; un problème s'affiche tout de suite (par exemple « line 1: No element
named ... »), et le Widget est quand même enregistré pour que vous puissiez corriger plus tard. Quand le Code s'exécute, un problème est écrit dans la **Console**
comme `wgt_CV_Kettle~SP_BH (code)`, avec `NOT RUN` et la ligne, et rien du Code n'est fait.

## Properties

Elles ressemblent aux Properties de la pompe (Règle Skynet 18.30), les mêmes que celles d'un Value Widget
([Widgets Value, Time et DateTime](134-value-time-and-datetime-widgets)). Posez la souris sur le nom d'un champ pour voir à quoi il
sert (hover help).

- **La ligne de titre :** le cadenas 🔓, **Visible** et **Hidden Locked**.
- **1. Label** avec ⬆ et ⬢, puis **Label Visible**.
- **2. Tab** et **3. Name**.
- **Format** : comment la Value est affichée et tapée.
  - **Number** : avec **Units**, et son ⬢ contient Decimals, le Step pour − et +, le Lowest et le Highest.
  - **Time** : `hh:mm:ss`.
  - **DateTime** : `mm/dd/yyyy hh:mm:ss`.
- **Start value**, dans le Format choisi.
- **Read only**, avec **Database and .API ⬢** sur sa ligne. Read only activé : un appui ne fait rien, donc le Code ne s'exécute que depuis l'.API.
- **Fore color** de la valeur, et son ⬢ contient la Back color et l'Alignment.
- **Code (runs when the Value is set)** : le code Process.
- **X**, **Y**, **Width** et **Height**, et le **Widget Type** grisé en dernier.

Il garde sa Value quand le Brain redémarre. Un redémarrage n'exécute **pas** le Code.
