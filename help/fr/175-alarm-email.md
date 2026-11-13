# Alarm Email : une alarme peut vous envoyer un e-mail {#alarm-email-an-alarm-can-send-you-an-email}

Une alarme peut envoyer un e-mail chaque fois qu'elle se déclenche (Règle Skynet 7.17). L'e-mail part par **votre propre compte de messagerie et
le serveur de courrier que vous choisissez** : Gmail, Outlook.com ou un autre. Skynet n'utilise jamais un serveur de courrier intégré ni celui de Microsoft que
Windows choisit tout seul.

## 1. Choisir votre serveur de courrier (une fois) {#1-pick-your-mail-server-once}

1. Ouvrez **Settings** et allez à **Sending codes and Alarm emails**.
2. Cliquez sur **Fill in for Gmail** (ou **Fill in for Outlook.com**), ou tapez vous-même le **Mail server**, le **Port** et la **Security**.
3. Tapez votre **Email account**, votre **Password or app password**, et **Send from**.
   - **Gmail :** activez la validation en deux étapes, puis créez un **mot de passe d'application** sur myaccount.google.com/apppasswords et collez-le
     ici. Votre mot de passe Gmail normal ne marche pas ici.
4. Cliquez sur **Save sending settings**, puis **Send me a test** pour vérifier.

Les mêmes réglages envoient les codes de connexion, donc si ceux-ci marchent déjà, les Alarm emails marchent aussi.

## 2. L'activer pour une alarme {#2-turn-it-on-for-an-alarm}

1. En Edit layout, double-cliquez sur l'Alarm Widget pour ouvrir ses **Alarm Widget Properties**.
2. Sous les cases Sound, mettez **Email Notification** sur On.
3. **Email to :** tapez une ou plusieurs adresses séparées par des virgules. Laissez vide pour envoyer à chaque utilisateur qui a un e-mail dans
   **My account**.
4. Cliquez sur **Save**.

Chaque fois que l'alarme se déclenche, un e-mail est envoyé avec le Label de l'alarme et l'heure. Si une alarme se déclenche encore et encore,
Skynet envoie au plus un e-mail par minute pour elle, pour que votre boîte de réception ne soit pas inondée.

## Dans un Process {#in-a-process}

| Ligne | Ce qu'elle fait |
|---|---|
| `alm_Brew.email = true` | Active Email Notification pour cette alarme |
| `alm_Brew.email = false` | La désactive (jusqu'au prochain démarrage ou jusqu'à ce qu'un Process la réactive) |

## Quand il n'arrive pas {#when-it-does-not-arrive}

Le **journal du Process** dit en mots simples ce qui n'a pas marché : pas encore de serveur de courrier configuré, pas d'adresse où envoyer, ou le serveur de courrier
a refusé (souvent un mauvais mot de passe d'application). Vérifiez aussi le dossier des courriers indésirables.
