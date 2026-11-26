# Fix before next Brew Day (le journal des erreurs de Process) {#fix-before-next-brew-day-the-process-error-log}

**☰ Menu > 🔧 Fix before next Brew Day** est la liste de ce qu'il faut réparer avant votre prochain brassage (Règle Skynet 10.13).
Le nombre à côté est le nombre d'entrées encore ouvertes. Tout le monde peut la lire. Les Brewers et les Admins peuvent y ajouter,
vérifier les entrées et les cocher.

## Chaque erreur de Process est notée ici toute seule {#every-process-error-is-written-here-by-itself}

Quand un Process s'arrête sur une erreur, ou ne démarre pas à cause d'une erreur, une entrée est ajoutée avec :

- l'**heure**, le **Process** et le **numéro de ligne**,
- la **ligne elle-même**, telle qu'elle était quand elle a tourné,
- **ce qu'était l'erreur**, et en dessous **Why:** (pourquoi) en mots simples, quand Skynet peut le dire (par exemple *This line
  asks the Recipe for skn_rcp_Whirlpool_Minutes, but the Recipe has no value with that name* : cette ligne demande à la Recipe
  skn_rcp_Whirlpool_Minutes, mais la Recipe n'a pas de valeur avec ce nom),
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
rouge s'affiche sur tous les écrans avec le Process, la ligne, la ligne elle-même, l'erreur et pourquoi elle a échoué. La première fois qu'une erreur arrive,
Skynet vous attend toujours pour choisir :

- **🔧 Fixed hardware: try line N again** : vous avez réparé ou remplacé ce qui a lâché (une pompe, une vanne, une résistance). Cette
  même ligne tourne de nouveau et le Process continue à partir de là, avec les valeurs qu'il avait. Si elle échoue encore, réparez
  encore et réessayez.
- **✎ Fix Process code** ouvre le Process dans le Process Editor à cette ligne. La ligne s'affiche avec un **fond rouge et un texte
  jaune en gras** tant qu'elle est dans cette liste, que les Colors soient allumées ou non. Ouvrir un Process fait aussi défiler
  jusqu'à sa première ligne dans cette liste. Réparez-la et faites **Save**, puis appuyez sur **🔧 Try again** dans la
  fenêtre : le Process enregistré tourne à partir de cette ligne. Quand un **🧪 Check** ne trouve pas d'erreur (ou que vous cochez
  **✔ Fixed**), la ligne reprend ses couleurs normales.
- **▶ Resume at the next line** saute cette ligne et continue à la suivante (par exemple la ligne 77 échoue, il continue à la 78).
  Servez-vous-en quand vous avez contourné le problème, par exemple en passant par le RIMS.
- **⏭ Ignore this error in any Process and go on** saute la ligne et continue. Ensuite, la même erreur (les mêmes mots), dans
  n'importe quel Process et sur n'importe quelle ligne, est sautée toute seule sans fenêtre jusqu'au redémarrage du Brain. Elle est
  quand même notée dans la Console et dans cette liste. Vous recevez d'abord un seul avertissement : vous êtes responsable, restez
  donc avec le brassage et surveillez-le. Appuyez sur **✔ I take responsibility** (je prends la responsabilité) pour l'ignorer, ou
  sur **Cancel** (annuler) pour le laisser arrêté avec de nouveau les choix.
- **✕** laisse le Process arrêté et ferme la fenêtre sur tous les écrans.

La fenêtre reste jusqu'à ce que quelqu'un choisisse. Redémarrer le Process depuis le début l'abandonne. L'erreur est quand même
notée dans cette liste, pour que vous puissiez réparer le Process avant le prochain brassage.

## Combien de temps elles sont gardées {#how-long-they-are-kept}

La liste est gardée sur le Brain, un redémarrage la garde donc. Les entrées ouvertes restent jusqu'à ce qu'elles soient réparées ou
supprimées. Celles qui sont réparées sont gardées 90 jours.
