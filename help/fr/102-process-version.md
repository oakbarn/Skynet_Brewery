# Version de Process {#process-version}

Chaque Process peut avoir une **Version**, pour que vous sachiez quelle copie vous faites tourner.

- La Version s'affiche sur la barre du haut de l'éditeur de Process, à côté du nom du Process : **Version 261030_11_58_1**. Un Process qui n'en a jamais eu montre **(none yet)** (pas encore).
- **Update Version** (Admins) donne au Process une nouvelle Version faite de la date et de l'heure actuelles : **YYMMDD_HH_MM_n**. Par exemple `261030_11_58_1` est le 2026-10-30 à 11:58. Une plus tardive, `261030_12_02_1`, finit toujours par `_1` car l'heure la rend unique ; `_n` ne compte vers le haut (`_2`, `_3` ...) que quand vous la mettez à jour deux fois dans la même minute.
- L'heure est celle de l'horloge du Brain.
- La Version est gardée dans le Schema avec le Process. Renommer un Process garde sa Version.
- Update Version n'enregistre pas le texte du Process : appuyez sur **Save** pour cela. S'il y a des changements non enregistrés, on vous demande d'abord.

C'est le même format que la version de Skynet Brewer (voir [Panel version](47-panel-version)).
