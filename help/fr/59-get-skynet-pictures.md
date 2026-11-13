# Obtenir les images Skynet {#get-skynet-pictures}

Skynet ajoute de temps en temps de nouvelles images (pompes, vannes, cuves ...) sur GitHub. **☰ Menu > Get Skynet pictures** copie celles que votre Brain n'a pas encore, dans `media/Images/Skynet` (voir [Groupes d'images](57-picture-groups)).

- Ça marche pareil sur un Raspberry Pi, Windows, Mac ou Linux. Rien à installer : c'est le Brain qui télécharge.
- **Aucun compte GitHub n'est nécessaire.** Le Brain doit seulement être sur Internet.
- Seules les images Skynet sont copiées. **Une image que vous avez déjà n'est jamais changée, vos propres images ne sont jamais touchées, et rien n'est jamais supprimé.**
- Admins seulement.

## Comment s'en servir {#how-to-use-it}

1. Ouvrez **☰ Menu > Get Skynet pictures**. Il interroge GitHub tout de suite.
2. Vous voyez combien d'images Skynet GitHub a, et la liste de celles que ce Brain n'a pas encore. Chacune montre une petite image et sa taille.
3. Appuyez sur **Get N pictures**. Quand c'est fini, les nouvelles images sont dans chaque liste d'images et dans le sélecteur Alt+P.

Appuyez sur **Check GitHub** pour redemander. Si tout est déjà là, il dit **Nothing to get** (rien à obtenir).

## Bon à savoir {#good-to-know}

- Chaque image est vérifiée avec l'empreinte de GitHub avant d'être enregistrée, donc un téléchargement raté ne remplace jamais une bonne image. Si l'une échoue, elle est listée avec la raison ; appuyez sur **Check GitHub** et obtenez-la à nouveau.
- Skynet ne change jamais une image qu'il a déjà envoyée. Quand un dessin est refait, il vient comme une nouvelle image avec un nouveau nom, donc chaque Schema qui utilise l'ancienne a le même aspect qu'avant.
- Si GitHub dit **too many requests** (trop de demandes), attendez une heure : GitHub laisse chaque adresse Internet demander environ 60 fois par heure sans compte.
- Toutes les images et tous les sons Skynet d'un coup, sans Internet sur le Brain, viennent avec le **Skynet Media Setup** (voir [Le Skynet Media Setup](183-skynet-media-setup)).
- Une toute nouvelle version du panel (les fichiers du programme, pas seulement les images) vient toujours par **Updating** (voir [Passer à une nouvelle version](18-updating)).
