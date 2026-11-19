# Bouton DIN : À l'appui {#din-button-on-press}

Un **bouton-poussoir DIN** de votre tableau peut faire **une seule chose** quand on l'appuie, sans écrire de code (Règle Skynet 6.38).
C'est un **Device Digital Input** sur un Port d'une carte, installé comme n'importe quel bouton-poussoir (voir
[Pas à pas : câbler des interrupteurs et des flotteurs](233-step-by-step-wire-switches-and-float-switches)). Sa ligne
**On Press** dans ses Properties choisit ce que fait un appui :

| On Press | Ce que fait un appui |
|---|---|
| **None** (l'habituel) | Rien de plus : son State passe à ON, pour qu'un Process le lise, comme avant. |
| **Run a Process** | Démarre le Process choisi et le laisse aller jusqu'au bout en arrière-plan, exactement comme **▶ Start** sur un [Process Widget](173-process-widget). Un appui pendant qu'il tourne est ignoré : un appui ne l'arrête jamais. |
| **Advance (Override)** | Fonctionne comme un [bouton Override](96-override-button) réglé sur le Process choisi, ou sur **Any**. Il ne fonctionne que si ce Process attend dans un `wait` ou un `sleep`. Si rien n'attend, l'appui est ignoré. |
| **Cancel all alarms** | Chaque Alarm qui sonne est mise sur Off, comme un toucher sur chacune. |

## Exemples {#examples}

- Un bouton **jaune** réglé sur **Run a Process**, Process **Fire_Hose** : un appui lance un Fire Hose de 20 secondes.
- Un bouton **bleu** réglé sur **Advance (Override)**, Process **Any** : un appui fait avancer le brassage quand il vous attend.
- Un bouton **rouge** réglé sur **Cancel all alarms** : un appui arrête toutes les Alarms qui sonnent.

## Installation {#setting-it-up}

1. Câblez le bouton sur un Port libre et ajoutez-le comme **DIN / Pulse button** (Edit layout > Add Device > **Inputs (switches, buttons)**).
2. Double-cliquez dessus pour ouvrir ses Properties.
3. Choisissez **On Press**. Pour **Run a Process** et **Advance (Override)**, choisissez son **Process** dans la ligne en dessous.
4. **Save**, puis **Save layout**.

Si le Process change de nom (✏ Change name), le bouton le suit.

## Bon à savoir {#good-to-know}

- Un appui est un appui : le **lockout** de l'entrée (3 secondes au départ), le **debounce** et le **on delay** passent d'abord,
  donc maintenir le bouton ou un choc n'est pas un second appui.
- Ce que chaque appui a fait est écrit dans la **Console**, par exemple *pressed: Fire_Hose started* ou *pressed: no Brew is
  waiting for an Override, so the press was ignored*.
- Un bouton réglé sur **Advance** compte comme un bouton Override pour son Process, donc ce Process n'a pas de pop-up Override à l'écran.
- En simulation, un clic sur le bouton puis **Simulate: press** fait la même chose qu'un vrai appui.
- Un Process peut toujours lire le State du bouton comme avant (`if BM_30_DI@DIN_Fire~Hose_BH == true`).
