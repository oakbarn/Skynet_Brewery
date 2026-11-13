# Processes

Les Processes sont les étapes automatiques d'un brassage : ouvrir des vannes, faire tourner une pompe, attendre une température, lancer une minuterie, faire sonner une alarme. Ce sont des fichiers texte dans le dossier `scripts` du Pi.

## L'écran Processes {#the-processes-screen}

- La liste de gauche montre chaque Process ; celui qui tourne est marqué. Le petit nombre devant chacun est son **Order** (ordre) : tapez un nouveau nombre pour le déplacer, et les autres se renumérotent tout seuls. Voir [L'ordre des Processes (Process Order)](38-process-order).
- **New**, **Rename**, **Delete** (Admins).
- **Save** et **Check** (Admins). Check trouve les erreurs sans lancer le Process.
- **Start**, **Stop** et **Restart** (Operators et Admins). **Stop all** arrête tous les Processes. Restart arrête le Process, efface sa mémoire et le relance depuis le début.
- **Restart if it fails** (Admins) : relancer le Process tout seul s'il s'arrête sur une erreur. Voir *Restarting Processes*.
- **Output** montre ce que les Processes affichent (print). Cochez **all processes** pour voir la sortie de tous les Processes.

**Un Process qui contient une erreur ne démarre pas.** Les erreurs sont listées avec leur numéro de ligne ; cliquez sur l'une d'elles pour y aller.

Le fichier enregistré est relu chaque fois qu'un Process démarre, donc il ne fait jamais tourner une vieille copie. Si vous modifiez un Process en marche, il est marqué « edited since start » (modifié depuis le démarrage) : arrêtez-le et relancez-le (ou appuyez sur Restart) pour utiliser la nouvelle version.

## Les lignes de Process que vous utiliserez le plus {#process-lines-you-will-use-most}

```
new value vVCount              make a number variable
vVCount = 3                    set it
new value vVHops = 10          make one and set it on one line
new gV gV_Strike = 163         make a gGlobal (every Process can use it, Help 145)
V_BK_In = true                 open a valve (turn an output on)
gblS_Msg = "Mash in"           set a variable
tm_Whirlpool = 00:20:00        set a timer
start "tm_Whirlpool"           start a timer
alm_Hops = true                sound an alarm
wait BK_Temp <= 154            wait for a temperature
sleep 1000                     wait 1 second (1000 ms)
my_Widget.visible = false      hide something on the screen
if vVCount > 2 && Pump_Red == true
elseif ...
else
endif
[Label]  and  goto "Label"     jump
step "Mash in"                 mark a step (numbered when you save)
start "Other_Process"          start another process
restart Other_Process          stop it, clear its memory, start it again
restart                        start this process over from the top
print "text"                   write to Output
show tab "Brewery"             switch every screen to a tab
send_db "gGV_Kettle_Temp"      send a reading to the database now
send_db_group Readings        send every item of the Group Readings to the database now, once
start_db_group Mash           the items in the Group Mash are sent by their own setting from now on
stop_db_group Mash            ... until this line (see Database and .API)
// a comment
```

(Dans ce bloc, les mots après chaque ligne expliquent, en anglais, ce qu'elle fait : créer une variable, ouvrir une vanne, attendre une température, sauter à un Label, etc. Le code s'écrit toujours tel quel.)

Le nom seul veut dire sa valeur principale, et les autres attributs utilisent un point. Voir [Le langage des Processes et les étapes](22-process-language) pour la liste complète, la saisie automatique (autofill), les classes de Process et les numéros d'étape.

## Labels

Chaque Device et chaque Widget a un **label** (étiquette) : le nom affiché sur le Tab (vide = son Name). L'ancien mot `displayname` marche toujours et veut dire la même chose. Un Process peut le changer sur n'importe quel type de Device ou de Widget, y compris les gGlobals String, Value et Graphic, les minuteries, les alarmes et les sorties :

```
tm_Delay_W1.label = "1 Minute Delay"
gGS_Brewery_Top.label = "Mash"
```

## Les fichiers qui ne sont pas sur le Brain {#files-that-are-not-on-the-brain}

Quand vous enregistrez un Process avec un nouveau chemin de fichier qui n'est pas sur le Brain (le Raspberry Pi), un avertissement s'affiche. Cela arrive pour un chemin Windows comme `C:\Brewing\Sounds\Hops.wav`, un chemin en dehors des dossiers media, ou un fichier qui n'est pas encore dans un dossier media. Les téléphones et les autres ordinateurs ne peuvent pas atteindre ces fichiers. Mettez le fichier dans un dossier media avec l'écran [Media (images et sons)](07-media) et utilisez son chemin là-bas, par exemple `sounds/Hops.wav`.

Cochez **Do not show this warning again** pour ne plus voir les avertissements. Réactivez-les dans **Settings > Panel settings**.

## Bon à savoir {#good-to-know}

- Les Labels et les gotos peuvent être n'importe où, même à l'intérieur d'un if/endif.
- Lancer un Process qui tourne déjà ne fait rien (il affiche une note).
- Les lectures venant du matériel (entrées, sondes) ne peuvent pas être réglées par les Processes.

## Exemples de Processes {#sample-processes}

L'exemple **Three vessels, one pump** (trois cuves, une pompe) est livré avec `BrewDay_Flow` (une journée de brassage guidée complète), `BrewDay_Stop` (tout éteindre) et `looper_Advance_Switch`. Ouvrez-en un pour voir comment on fait, et appuyez sur Start pour le regarder travailler sur le simulateur. Les Process Templates (☰ Menu > Brew Process) en montrent davantage.
