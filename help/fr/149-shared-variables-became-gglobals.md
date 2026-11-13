# Les variables partagées sont devenues des gGlobals {#shared-variables-became-gglobals}

Il y avait autrefois une **Shared variable** (variable partagée) : une valeur que les Processes pouvaient se passer, sans place sur un Tab, dans la
base de données ou pour les programmes extérieurs. Un **gGlobal** fait le même travail, donc la Shared variable a complètement disparu de Skynet
(Règle Skynet 1.25).

## Un ancien Schema qui en a encore une {#an-older-schema-that-still-has-one}

Skynet ne transforme une ancienne Shared variable en rien. Quand un ancien Schema qui en a encore une se charge, la Shared
variable est **laissée de côté** et le reste du Schema se charge normalement. La note de démarrage du Brain nomme chacune de celles laissées de côté.
Si un Process l'utilisait, créez un gGlobal (ci-dessous) avec le même Name.

## Passer une valeur entre Processes aujourd'hui {#passing-a-value-between-processes-now}

Créez un **gGlobal** de la sorte qui convient à ce qu'il contient :

| Il contient | Créez un |
|---|---|
| un nombre | gV_Global_Value |
| du texte | gS_Global_String |
| vrai ou faux | gB_Global_Boolean |
| une heure | gT_Global_Time |
| une date et une heure | gD_Global_DateTime |

Utilisez **➕ New gGlobal** dans **☰ Menu > Variables**, ou une ligne `new gV gV_Name` dans un Process (voir
[Créer un gGlobal dans un Process](145-make-a-gglobal-in-a-process)). Un gGlobal n'a pas de .API, donc rien
hors des Processes ne peut le voir. Un gGlobal n'est jamais sur un Tab.
