# Sorties numériques d'alarme : une alarme peut commander un voyant ou un klaxon {#alarm-digital-outputs-an-alarm-can-switch-a-light-or-a-horn}

Une alarme peut mettre jusqu'à **2 Devices** en marche tant qu'elle sonne, et les arrêter quand elle s'arrête (Règle Skynet 7.19). Utilisez-la pour un voyant
d'avertissement, un klaxon, un buzzer ou un relais.

## La régler {#set-it-up}

1. En Edit layout, double-cliquez sur l'Alarm Widget pour ouvrir ses **Alarm Widget Properties**.
2. Choisissez **Digital Output 1** et, si vous voulez, **Digital Output 2**. Chaque liste montre les Devices qui ont un état ON / OFF.
3. Cliquez sur **Save**.

Les deux commencent sur **None**. Un emplacement laissé sur None ne fait rien.

## Ce qui se passe {#what-happens}

| L'alarme | Ses Digital Outputs |
|---|---|
| se déclenche (active) | passent à **ON** |
| s'arrête (arrêtée d'un appui, ou un Process l'arrête) | passent à **OFF** |

Un Process qui fait sonner l'alarme (`alm_Boil = On`) les commande aussi. Si un Device choisi n'a pas d'état ON / OFF, rien n'est commandé
et la Console le dit.

Voir aussi [The Alarm Widget](107-alarm-widget) et [Alarm Email](175-alarm-email).
