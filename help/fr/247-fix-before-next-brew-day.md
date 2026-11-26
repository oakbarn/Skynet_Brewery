# Fix before next Brew Day (le journal des erreurs de Process) {#fix-before-next-brew-day-the-process-error-log}

**☰ Menu > 🔧 Fix before next Brew Day** est la liste de ce qu'il faut réparer avant votre prochain brassage (Règle Skynet 10.13).
Le nombre à côté est le nombre d'entrées encore ouvertes. Tout le monde peut la lire. Les Brewers et les Admins peuvent y ajouter,
vérifier les entrées et les cocher.

## Chaque erreur de Process est notée ici toute seule {#every-process-error-is-written-here-by-itself}

Quand un Process s'arrête sur une erreur, ou ne démarre pas à cause d'une erreur, une entrée est ajoutée avec :

- l'**heure**, le **Process** et le **numéro de ligne**,
- la **ligne elle-même**, telle qu'elle était quand elle a tourné,
- **ce qu'était l'erreur**,
- **💡 How to fix** (comment réparer), quand la réparation est claire (par exemple un nom écrit autrement que sur la page Devices,
  ou un `if` sans `endif`).

Le Process, son numéro de ligne et ce qu'était l'erreur sont en **rouge**. Quand l'erreur donne la liste des noms que vous pouvez
utiliser (par exemple une valeur de Recipe mal écrite), la liste commence sur sa propre ligne après **Possible Suggested Replacement
at Line N:** (remplacement suggéré possible à la ligne N) en bleu clair : choisissez celui que vous vouliez et mettez-le dans cette
ligne.

La même erreur sur la même ligne (dans une boucle, par exemple) reste une seule entrée, avec le nombre de fois où elle est arrivée.

**Le numéro de ligne est-il exact ?** C'est la ligne dans le fichier du Process, le même numéro que dans le Process Editor, en
comptant les lignes vides et les lignes de commentaire. Deux choses à savoir :

- Deux commandes sur une ligne (`X = 1; Y = 2`) ont le même numéro de ligne. Le texte de la ligne est montré, vous voyez donc
  laquelle c'était.
- Si vous enregistrez un Process pendant qu'il tourne, la copie qui tourne est l'ancienne, ses numéros de ligne peuvent donc être
  décalés. L'entrée le dit.

## Réparez, puis 🧪 Check {#fix-it-then-check-it}

1. **✎ Open line** ouvre le Process dans le Process Editor à cette ligne. Réparez-la et faites **Save**. L'entrée garde la
   réparation : la ligne telle qu'elle était et telle qu'elle est maintenant.
2. **🧪 Check** fait tourner le Process enregistré dans une **simulation pour vérifier seulement** : chaque Device, Widget et
   gGlobal est lu tel qu'il est maintenant, mais **rien de réel n'est commuté**, rien ne va dans la base de données et rien n'est
   enregistré. Un brassage en cours n'est pas touché.
   - Elle commence **juste au-dessus de la ligne de l'erreur**, avec les valeurs que le Process avait quand l'erreur est arrivée.
   - Elle s'arrête au **prochain wait ou step** (ou un sleep, ou une ligne qui pose une question), à la fin du Process, ou à une
     erreur.
   - Elle montre ce qu'elle aurait réglé, par exemple `HLT_Element = true`.
   - **▶ Override** continue après ce wait, comme le fait la fenêtre Override le jour du brassage, et vérifie jusqu'au suivant.
3. Pas d'erreur : l'entrée passe dans **Fixed**, avec la réparation. Une erreur : l'entrée reste ouverte et montre la nouvelle
   ligne et le message.

**✔ Fixed** coche une entrée à la main (pas besoin de Check), et **↩ Open again** la remet dans la liste. **Delete** la supprime.

## Vos propres problèmes {#your-own-issues}

Tapez un problème dans la case du haut, par exemple *la vanne du HLT colle*, et appuyez sur **➕ Add an issue**. Le Tab où vous
étiez (ou le Process ouvert dans le Process Editor) est noté avec. Il reste dans la liste jusqu'à ce que vous le cochiez.

## Reprendre après une erreur {#resume-after-an-error}

Quand un Process s'arrête sur une erreur pendant un brassage (Règle Skynet 10.14), **tout est laissé tel quel** et une fenêtre
rouge s'affiche sur tous les écrans avec le Process, la ligne, la ligne elle-même et l'erreur. C'est vous qui décidez de la suite :

- **▶ Resume** refait tourner cette même ligne et continue à partir de là. Servez-vous-en après avoir réparé ou remplacé ce qui a
  lâché (une pompe, une vanne, une résistance). Le Process garde les valeurs qu'il avait. S'il s'arrête encore sur la même ligne,
  réparez encore et refaites Resume.
- **⏭ Skip line** saute cette ligne et continue à la ligne suivante. Servez-vous-en quand vous avez contourné le problème (par
  exemple en passant par le RIMS), ou quand la ligne elle-même est fausse.
- **✕** laisse le Process arrêté et ferme la fenêtre sur tous les écrans.

**Next time line N fails** (la prochaine fois que la ligne N échoue) est une liste déroulante sur la fenêtre. La première fois
qu'une ligne échoue, Skynet vous attend toujours. Avant de choisir Resume ou Skip, choisissez ce qui se passe si cette même ligne
échoue à nouveau :

- **Stop and wait for me** (au départ) : la fenêtre de nouveau.
- **Auto: pop-up for 5 s, then go on** : la fenêtre montre un compte à rebours de 5 secondes, puis refait la même chose (Resume ou
  Skip) toute seule. **⏸ Hold** arrête le compte à rebours, et Skynet vous attend de nouveau.
- **Auto: no pop-up, go on** : pas de fenêtre du tout ; après une seconde, il refait la même chose. Pratique pour une petite erreur
  comme un nom de houblon. C'est quand même noté dans la Console et dans cette liste.

Un choix Auto vous donne un seul avertissement : vous êtes responsable, restez donc avec le brassage et surveillez-le. Redémarrer le
Process depuis le début éteint Auto.

La fenêtre reste jusqu'à ce que quelqu'un choisisse. Redémarrer le Process depuis le début abandonne le Resume. L'erreur est quand
même notée dans cette liste, pour que vous puissiez réparer le Process avant le prochain brassage.

## Combien de temps elles sont gardées {#how-long-they-are-kept}

La liste est gardée sur le Brain, un redémarrage la garde donc. Les entrées ouvertes restent jusqu'à ce qu'elles soient réparées ou
supprimées. Celles qui sont réparées sont gardées 90 jours.
