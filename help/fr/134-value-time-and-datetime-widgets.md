# Widgets Value, Time et DateTime {#value-time-and-datetime-widgets}

Trois Widgets qui affichent **une valeur sur un Tab** pour que vous la regardiez (Règle Skynet 1.23) :

| Widget | Affiche | Commence comme |
|---|---|---|
| **Value Widget** | un nombre, avec Units et Decimals | `w_Value_1` |
| **Time Widget** | une heure, `hh:mm:ss` | `w_Time_1` |
| **DateTime Widget** | une date et une heure | `w_DateTime_1` |

Ajoutez-en un dans **Edit layout > Add Widget > Value, Time and DateTime Widgets**. Comme tout Widget, il n'existe que dans l'application (pas de port
PLC), a un **Label** jamais vide, et ouvre ses Properties d'un double-clic.

Un **Code Value Widget** est un Value Widget qui exécute aussi quelques lignes de code Process chaque fois que vous le réglez, par exemple pour envoyer
la valeur au Setpoint d'une résistance : voir [Widget Code Value](161-code-value-widget).

## Le régler {#setting-it}

Sur son Tab, un appui ouvre une case pour taper la nouvelle valeur (un Value Widget a aussi **−** et **+**, selon son Step), puis **Set**.
Activez **Read only** dans ses Properties et un appui ne fait rien : seul un Process le règle.

Chaque Process peut le lire et le régler par son Name, comme tout Device ou Widget : `w_Strike_Volume = 7.5`, `if w_OG > 1.050`.
Il garde sa valeur quand le Brain redémarre.

## Properties

Elles ressemblent aux Properties de la pompe (Règle Skynet 18.30).
Posez la souris sur le nom d'un champ pour voir à quoi il sert (hover help).

- **La ligne de titre :** le cadenas 🔓, **Visible** et **Hidden Locked**.
- **1. Label** avec ⬆ (une case plus grande) et ⬢ (la police, la taille, les couleurs et l'alignement du Label), puis **Label Visible**.
- **2. Tab** et **3. Name** (✏ Change name).
- **Start value**. Un Value Widget a aussi **Units**, et son ⬢ contient Decimals, le Step pour − et +, le Lowest et le Highest.
- **Read only**, avec **Database and .API ⬢** sur sa ligne (voir [Base de données et .API sur chaque Device et Widget](98-database-and-api)) : **When Clicked**
  l'envoie chaque fois que quelqu'un le règle sur son Tab (même à la même valeur) ; dans un **Database Group** il n'est envoyé que lorsqu'un de ses
  Groups est démarré (`start_db_group Group_Name` ... `stop_db_group Group_Name`).
- **Fore color** de la valeur, et son ⬢ contient la Back color et l'Alignment.
- **X**, **Y**, **Width** et **Height**, et le **Widget Type** grisé en dernier.

## Widget, Device ou Clone : à vous de choisir {#widget-device-or-clone-your-choice}

Quand vous mettez une lecture sur un Tab, choisissez ce qui convient à votre brasserie. Skynet ne choisit pas pour vous :

- **Un Device** quand une carte le lit, par exemple un **pH-mètre intelligent** câblé à une Interface : sa lecture arrive toute seule.
- **Un Clone** de ce Device (voir [Devices clonés](71-cloned-devices)) quand vous voulez la même lecture sur un autre Tab, par
  exemple le Tab Reporting. Un Clone affiche toujours la valeur de son Device, sans code Process.
- **Un Value, Time ou DateTime Widget** quand rien ne le lit pour vous, par exemple un **pH-mètre qui n'est pas intelligent** : vous le lisez
  vous-même et tapez la valeur d'un appui. Un Process peut aussi le régler.

L'exemple Three Vessel utilise des Value Widgets pour ses lectures ; une brasserie avec un pH-mètre intelligent y mettrait plutôt un Clone.

## Dans les exemples {#in-the-samples}

Le Tab **Reporting** de l'exemple **Three Vessel** contient les lectures du jour de brassage (Strike volume, Mash pH, Pre-boil volume ...) sous forme de Value
Widgets, envoyés à la base de données When Clicked.
