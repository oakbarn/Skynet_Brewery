# Recipe Interview (Entretien de recette) {#recipe-interview}

Le **Recipe Interview** crée la Recette en vous posant des questions, une page à la fois (règle Skynet 17.22) : chaque quantité,
chaque durée et chaque température, comme ce que contient un fichier BeerSmith. Ouvrez-le avec **🧭 INTERVIEW** dans **☰ Menu >
Recipe** (à côté de IMPORT et NEW), ou avec **🧭 Recipe Interview** dans la fenêtre **No Recipe Found** d’un jour de brassage.

## Les branches {#the-branches}

Les réponses choisissent les questions suivantes :

1. **Do you have a Recipe file (BeerXML or BeerSmith) to IMPORT?** Oui : le Tab Recipe s’ouvre et demande le fichier (IMPORT lit
   toute la Recette). Non : l’entretien continue.
2. **Is this an Extract Kit?** Oui : les questions **Extract Kit**.
3. **Is this All Grain?** Oui : les questions **All Grain**. Non : **What are you making?** (Kombucha, Ginger Beer, Cider, Mead, Hard
   Seltzer, Wine Kit, Other ...) et les questions **Other Brews**.

Chaque branche demande ensuite **Ferment** (levure, levain, aération, ensemencement, primaire, secondaire, houblonnage à cru, cold
crash), **Package** (bouteilles et sucre d’amorçage, ou fût) et **Brew Day** (date et heure, l’AAU réel de chaque houblon, tout est
prêt).

Certaines questions ne viennent que si elles conviennent : les grains à infuser seulement pour un kit avec grains, les houblons pas
pour un Can Kit, « Is the grain milled? » seulement quand votre Brewer Type est All Grain (own Grain Mill), le calendrier de
nutriments seulement pour l’hydromel (Mead).

## Comment ça marche {#how-it-works}

- Chaque page a sa question, une courte explication et ses cases. Un choix de 6 ou moins est une case : un clic le choisit. Plus de 6
  est une liste déroulante (règle 2.6).
- Une liste (chaque extrait, chaque grain, chaque houblon ...) est un tableau : **➕ Add another** ajoute une ligne, **🗑** en retire
  une.
- Les quantités se tapent dans vos **Units** (gallons, livres, onces, °F, ou litres, kilogrammes, grammes, °C). Skynet les garde en
  métrique (règle 2.59).
- **◀ Back** revient à la page précédente, **Skip** laisse une page vide, **Next ▶** continue. Les premières questions, celles qui
  choisissent la branche, n’ont pas de Skip.
- **Done** montre chaque page répondue, avec **✎** pour y revenir. **✔ Finish** crée la Recette à son Level (un Can Kit est Level 1,
  un Extract with Hops Level 2, avec grains à infuser Level 3, All Grain Level 4, Other Brews Level 1) et l’ouvre dans le Tab Recipe.
  **Close** ou **✕** ne change rien.

Dans le Tab Recipe, **Calculate** et **Save** fonctionnent comme toujours. **Library ... > 💾 Save this Recipe** la garde dans la
bibliothèque pour la réutiliser (règle 17.21). Un jour de brassage qui attend sur **No Recipe Found** continue dès que la Recette de
l’entretien est créée.

## Réponses sans case de Recette pour l’instant {#answers-with-no-recipe-box-yet}

Certaines réponses n’ont pas encore de case dans le Tab Recipe : quand chaque extrait est ajouté (par exemple 1 lb de DME 15 minutes
avant la fin), l’eau et la température d’infusion, la température d’ajout de l’extrait, l’ébullition de l’eau pour un kit sans
ébullition, la température et la méthode de refroidissement, l’eau mise d’abord dans le fermenteur, l’eau de réhydratation,
l’aération, les températures et jours de primaire et secondaire, le cold crash, le sucre d’amorçage ou le fût, et la garde. Skynet
les garde avec la Recette (en métrique) : rien de ce que vous avez tapé n’est perdu, et elles sont prêtes pour les étapes du jour de
brassage qui les utiliseront.

## Ajouter des questions {#adding-questions}

Les questions sont une liste dans `public/recipeinterview.js`, numérotées comme dans le plan : R1 à R3, E1 à E17, A1 à A17, O1 à O8,
F1 à F10 et B1 à B3. Une nouvelle question prend le prochain numéro libre de sa branche, ou une lettre (E7a). Les numéros ne sont que
des noms et n’ont jamais besoin d’être renumérotés.
