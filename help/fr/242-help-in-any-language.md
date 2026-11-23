# L'aide dans n'importe quelle langue {#help-in-any-language}

En plus de l'**anglais** et du **français**, l'aide peut se lire dans une langue de plus, la vôtre : la **User Language**. Vous l'ajoutez vous-même avec n'importe quelle IA (Claude, ChatGPT ...) : Skynet enregistre l'aide en fichiers texte, l'IA les traduit, et Skynet reprend la traduction. Skynet n'a besoin ni d'internet, ni de clé, ni de payer quoi que ce soit.

Seule l'aide est traduite, comme en français : les pages d'aide, les bulles (Hover Help) et les mots des images de l'aide. Les écrans, boutons, libellés et menus restent en anglais. La seule exception sont les boutons de sécurité : **Override** et **Stop** s'affichent dans la langue d'aide choisie, comme en français.

## Trois choix {#three-choices}

**🌐 Help language**, en haut de la liste des pages d'aide, offre alors trois choix : **🌐 English**, **🌐 Français** et la User Language (**🌐 Deutsch**, par exemple). Le **☰ Menu** a les mêmes choix côte à côte, un clic chacun ; tant qu'aucune User Language n'est ajoutée, un Admin y voit **➕ Add a Language**, qui ouvre **🌐 Languages**. La User Language reste sur votre propre Brain : chaque écran qui utilise ce Brain peut la choisir.

## Pas à pas {#step-by-step}

1. Ouvrez l'aide. Les Admins ont **🌐 Languages** sous la liste des pages.
2. **⬇ Export.** Skynet découpe l'aide en parties (**⬇ Part 1 of 35** ...). Enregistrez chaque partie.
3. Collez une partie à la fois dans une IA et demandez : « Traduis ce fichier en allemand. Rends le fichier entier. » Enregistrez chaque réponse comme fichier texte.
4. **⬆ Import.** Choisissez toutes les parties traduites d'un coup. Une fois les fichiers donnés à Skynet, rien d'autre n'est demandé. Le travail se fait en arrière-plan.
5. Choisissez la nouvelle langue dans **🌐 Help language**.

**Only new and changed** n'exporte que ce que la User Language n'a pas encore, ou ce qui a changé depuis sa traduction : une mise à jour plus tard reste petite. **Part size** règle la quantité d'anglais dans chaque partie : réduisez-la si l'IA s'arrête au milieu d'une partie.

## Ce que Skynet vérifie {#what-skynet-checks}

Chaque page et chaque bulle est comparée à son anglais avant d'être prise : les mêmes titres, liens, images, code, parties {0} et marques (⬢ ⬆ ⚠). Un morceau qui échoue reste en anglais, et **un seul** avertissement liste tous les morceaux restés en anglais. Tout ce qui est bon est gardé. Importez de nouveau la partie après un nouvel essai avec l'IA.

L'avertissement électrique en rouge (Rule 6.20) est toujours là : une page traduite utilise la phrase d'avertissement de la langue, ou la phrase anglaise si l'IA n'en a pas donné.

## Mots Keep English {#keep-english-words}

Certains mots de brassage ne sont jamais traduits : **Strike**, **Sparge**, **Mash**, **Wort**, **Vorlauf** et les autres de la liste sous **Keep English**. Une page traduite montre chacun en anglais, avec son sens dans la langue à côté : **Mash (Maische)**. Skynet fait cela en arrière-plan, sans rien vous demander : quoi que l'IA fasse du mot anglais, Skynet le remet.

Les Admins peuvent ajouter leurs propres mots dans **Your own words on this Brain** (un par ligne), puis **Save**. Ils servent au prochain Export.

## Une nouvelle langue {#a-new-language}

Importer une autre langue remplace la User Language. L'ancienne est gardée dans le dossier `data/help_user_backups` du Brain, jamais supprimée. Importer d'autres parties de la même langue la complète.

Toute langue peut être importée. Les langues qui se lisent de droite à gauche (arabe, hébreu, persan, ourdou ...) sont prises, mais ne s'afficheront pas bien : la page devrait être retournée en miroir.

## Polices {#fonts}

L'aide est dessinée par le navigateur de votre téléphone ou PC, et les téléphones, PC et Mac ont les lettres de la plupart des langues. Un écran branché sur le Brain Raspberry Pi peut montrer des cases vides pour le chinois, le japonais, le coréen, le thaï ou l'hindi. Pour ceux-là, le **Skynet Language Fonts Setup** (Windows) ou le **Skynet Language Fonts zip** de la page Releases, à côté de Skynet Brewer Setup, ajoute au Brain les polices Google Noto. Il ne fait qu'ajouter, et le Setup principal reste petit. Le Brain donne ensuite ces polices à chaque écran qui lit l'aide.

**🔤 Add Font to Brain** ajoute un fichier de police à vous (.woff2, .woff, .ttf ou .otf). Son premier écran est un avertissement, avec **▶ Next** pour continuer et **Abandon** pour arrêter : les polices ajoutées ainsi ne sont pas testées et peuvent ne pas marcher, et les langues de droite à gauche ne marcheront pas. **Delete** retire de nouveau une police du Brain (elle est déplacée dans `data/help_user_backups/fonts`).

## Le côté technique {#the-technical-side}

- La User Language est dans le dossier `data/help_user` du Brain : les pages, `_balloons.json`, `_pictures.json`, `_language.json` (son nom, les mots Override et Stop, les notes) et `_source.json` (de quel anglais chaque page a été faite, pour qu'une page dont l'anglais a changé ensuite montre une note). Un Setup n'y touche jamais, et **Move Brain** l'emporte.
- La liste Keep English de Skynet est `help/_keep_english.txt` ; vos propres mots sont dans `data/help_user/_keep_english.txt`.
- À l'Export, chaque mot Keep English est écrit deux fois, comme ⁅Mash⁆ (Mash) : l'IA ne traduit que la copie entre ( ). À l'Import, le mot entre ⁅ ⁆ est remis en anglais à sa place.
- Les Skynet Language Fonts vont dans le dossier `fonts` du panel ; les polices ajoutées par **🔤 Add Font to Brain** vont dans `data/fonts`. Elles ne servent qu'aux pages d'aide et aux bulles, et seulement pour les lettres qui manquent à la police de l'écran.
- Traduction automatique : une note sous chaque page et un avis au choix de la langue le disent, comme en français ([L'aide en français](192-help-in-french)).
