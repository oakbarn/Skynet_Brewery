# Superposition du refroidisseur : place_Chiller {#chiller-overlay-place-chiller}

La plupart des brasseurs mettent un refroidisseur à immersion dans la Brew Kettle à la main vers la fin de l'ébullition, y
font passer l'eau du robinet, et laissent l'eau partir à l'égout ou dehors. Puis ils le retirent. Un Process le montre sur le
Tab avec deux lignes (règle Skynet 5.42) :

    place_Chiller = Immersion_Chiller, BK_Vessel
    remove_Chiller = BK_Vessel

## place_Chiller = template, vessel {#place-chiller-template-vessel}

- **template** est un Template de refroidisseur : un refroidisseur qui va dans une cuve (un refroidisseur à immersion à 2 IP, In et Out). Skynet a
  **Immersion_Chiller**. Les refroidisseurs à plaques et à contre-courant, Chillzilla compris (un refroidisseur à contre-courant
  à 4 IP), restent hors de la cuve sur leurs propres tuyaux, ils ne sont donc pas placés de cette façon.
- **vessel** est le Name de la cuve où il va (un Label marche aussi quand une seule cuve l'a).

Le refroidisseur est dessiné **par-dessus la cuve**. Deux flexibles sont dessinés avec lui :

- **In :** de la **Tap Water Valve** (vanne d'eau du robinet) du Tab de la cuve (d'abord celle qui a « chill » dans son Label)
  jusqu'à l'entrée du refroidisseur.
- **Out :** de la sortie du refroidisseur jusqu'à l'**IP d'égout** de ce Tab (une IP avec « Drain » ou « outside » dans son Label).

L'eau traverse le refroidisseur seulement tant que cette Tap Water Valve est ouverte, comme un tuyau (règle 5.41).

Le refroidisseur prend son Name et son Label de son Template : `wgt_CHL_Immersion~chiller_BH`, Label **Immersion chiller**. Ses
flexibles prennent les prochains noms Hose libres (Hose_3, Label hose_3).

Un refroidisseur déjà placé sur cette cuve est d'abord retiré, la ligne peut donc tourner de nouveau sans souci.

## remove_Chiller {#remove-chiller}

- `remove_Chiller = BK_Vessel` retire le refroidisseur, ses IP et ses deux flexibles de cette cuve.
- `remove_Chiller` seul retire tous les refroidisseurs placés par un Process.
- Rien de placé : rien ne se passe.

## Choisir dans l'éditeur de Process {#picking-in-the-process-editor}

Commencez à taper `place_C` et choisissez **place_Chiller** : la liste montre les Templates de refroidisseur. Choisissez-en un
et la liste montre les cuves, avec la **Brew Kettle en premier**. `remove_Chiller` montre aussi les cuves.

## Bon à savoir {#good-to-know}

- Seul le dessin change. Le Process continue tout de suite et n'attend pas. Pour attendre le brasseur, ajoutez une ligne `ask`
  après : `ask "Put the chiller in the kettle and hook up its hoses, then press Done"`.
- Le Process Check vous prévient avant que le Process tourne si le Template ou la cuve n'existe pas, ou si le Tab de la cuve n'a
  pas de Tap Water Valve ou pas d'IP d'égout.
- L'exemple 3 Vessel place l'Immersion chiller dans la Boil kettle 15 minutes avant la fin de l'ébullition et le retire après
  le refroidissement.
