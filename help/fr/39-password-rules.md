# Règles des mots de passe {#password-rules}

Un Admin décide à quoi peut ressembler un nouveau mot de passe, dans **Settings > Password rules**.

## Les règles d'aujourd'hui (par défaut) {#today-s-rules-the-defaults}

- **Allowed characters** (caractères permis) : n'importe quel caractère (lettres, chiffres, symboles et espaces).
- **Min length** (longueur minimum) : 8 caractères.
- **Max length** (longueur maximum) : 200 caractères.

Les noms d'utilisateur sont à part et ne changent pas : lettres, chiffres, espaces et `. _ @ -`, jusqu'à 40.

## Changer les règles {#changing-the-rules}

1. Ouvrez **Settings** et descendez jusqu'à **Password rules** (Admins seulement).
2. Choisissez **Allowed characters** :
   - **Any character (letters, numbers, symbols and spaces)** : n'importe quel caractère
   - **Letters, numbers and keyboard symbols (no spaces)** : lettres, chiffres et symboles du clavier (sans espaces)
   - **Letters and numbers only** : lettres et chiffres seulement
   - **Numbers only (like a PIN)** : chiffres seulement (comme un code PIN)
   - **Only the characters I list** : une case s'ouvre ; tapez chaque caractère qu'un mot de passe a le droit d'utiliser.
3. Réglez **Min length** (4 ou plus) et **Max length** (jusqu'à 200, et pas sous le minimum). Mettez-les égales pour une longueur exacte, par exemple 4 et 4 pour un code PIN à 4 chiffres.
4. Touchez **Save password rules**.

## Où les règles s'appliquent {#where-the-rules-apply}

Elles sont vérifiées chaque fois qu'un mot de passe est **créé ou changé** : la première création de l'admin, **Change password**, **Add user**, **Set password**, et **Forgot password?** sur la page de connexion. Les règles sont affichées en mots simples à côté de chacune de ces cases de mot de passe, et un mot de passe qui ne les respecte pas est refusé avec un message qui dit quels caractères ne sont pas permis.

Les mots de passe créés avant que vous changiez les règles continuent de marcher. Un utilisateur ne rencontre les nouvelles règles que la prochaine fois que son mot de passe est changé.

## Start Fresh

Si vous choisissez **Start Fresh** dans le programme d'installation, chaque connexion est supprimée avec les réglages, donc les règles des mots de passe reviennent à leurs valeurs par défaut. **Update the program and reset all users** supprime les connexions mais garde les règles des mots de passe. Une mise à jour normale garde à la fois les connexions et les règles des mots de passe.

L'outil de secours `node tools/reset-password.js` sur le Brain utilise toujours les règles par défaut, donc vous pouvez revenir même si les règles ont été réglées trop strictes.
