# Hover help dans les fenêtres {#hover-help-in-dialogs}

Skynet garde ses fenêtres aussi épurées que possible (Règle Skynet 2.38). Une fenêtre montre des noms de champs courts et les
champs eux-mêmes. L'explication d'un champ est dans son **hover help** (l'aide au survol).

## Voir l'aide d'un champ {#see-the-help-of-a-field}

- Un nom de champ **souligné en pointillés** a un hover help.
- **Posez la souris sur le nom** (d'un champ ou d'une liste déroulante). Une petite case jaune montre à quoi sert le champ, immédiatement.
- Les **boutons** (Delete, Cancel, Save, ⬆, ⬢ ...) et le **titre de la fenêtre** ont aussi un hover help. Le titre montre un court extrait de sa page d'aide.
- La case **reste tant que la souris est sur le nom**. Écartez la souris (ou cliquez, appuyez sur une touche ou faites défiler) et elle disparaît.
- **Cliquez sur le nom** pour ouvrir la même aide dans une petite fenêtre avec **Close**, si vous voulez la garder ouverte pendant que vous lisez.

## Les points actifs : aller à l'aide plus complète {#hot-spots-jump-to-the-bigger-help}

Certains mots d'une case d'aide sont **bleus et soulignés**. Ce sont des **points actifs (hot spots)** : chacun a sa propre page d'aide, plus complète.

- Déplacez la souris du nom vers la case d'aide. Une case qui a des points actifs attend un moment, pour que la souris puisse l'atteindre.
- **Cliquez sur un point actif** et la fenêtre d'aide s'ouvre à la partie qui en parle. Exemple : dans l'aide de **Interface**, cliquez sur
  **Interface ID** et l'aide ouvre **Interfaces**, à **The Interface ID**.
- La ligne en haut de l'aide, avec **◀ Back** et **✕ Close**, reste figée pendant que vous faites défiler. Cliquez sur **✕ Close** pour fermer l'aide et
  revenir à votre fenêtre.
- Un mot n'est un point actif que la première fois qu'il apparaît dans une case, pour que la case reste facile à lire.
- La petite fenêtre avec **Close** (un clic ou un appui sur le nom) a les mêmes points actifs.

### Un lien cassé {#a-broken-link}

Un point actif, ou un lien d'une page d'aide à une autre, est vérifié avant de s'ouvrir. Si sa page ou sa partie n'existe pas (ou n'en a pas),
**rien ne s'ouvre et rien ne part sur le web**. Une fenêtre dit **This Help link is broken** (ce lien d'aide est cassé) et montre les détails : où vous avez cliqué,
le lien, ce qui ne va pas, la page, le navigateur et l'heure. Appuyez sur **✉ Send** pour les envoyer à OakBarn Brewery
(support@oakbarnbrewery.com) pour qu'il soit corrigé, ou **✖ Close**. Send utilise l'e-mail du Brain quand il est configuré (Settings > Sending
codes) ; sinon votre propre programme de messagerie s'ouvre avec les détails remplis, et vous appuyez sur son Send. (Règle Skynet 11.10)

L'aide ne renvoie vers une page web hors de Skynet que là où OakBarn Brewery l'a demandé (Règle Skynet 11.10).

## Sur un téléphone ou une tablette {#on-a-phone-or-tablet}

Les téléphones et les tablettes servent à faire tourner la brasserie (Règle 2.35), et ils n'ont pas de souris. **Appuyez sur le nom** pour ouvrir la petite fenêtre
avec **Close**.

## Ce qui reste sur la fenêtre {#what-stays-on-the-dialog}

- Les avertissements sur lesquels vous devez agir, comme **⚠ The Label cannot be blank.**
- Ce qu'est quelque chose maintenant, comme le Suggested Name, ou une vanne OPEN ou CLOSED.
- Le **?** jaune dans le titre, qui ouvre la page d'aide complète.

## Les fenêtres des Widgets {#widget-dialogs}

Les Properties de chaque Widget ressemblent à celles de la pompe (Règle Skynet 18.30) : le cadenas 🔓, Visible et Hidden Locked sur la ligne de titre, puis
**1. Label** (⬆ une case plus grande, ⬢ sa police, sa taille et ses couleurs) et Label Visible, **2. Tab**, **3. Name**, les champs propres au Widget avec
les extras derrière un ⬢, sa position et sa taille, et le **Widget Type** grisé en dernier. Un nouveau Widget est nommé
**wgt_Type_Label_TabID**, par exemple **wgt_DT_DateTime_1_BH** (Règle 3.14).
