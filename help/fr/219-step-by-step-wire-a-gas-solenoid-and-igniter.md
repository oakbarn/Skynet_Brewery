# Pas à pas : câbler une électrovanne gaz et un allumeur {#step-by-step-wire-a-gas-solenoid-and-igniter}

Un **brûleur à gaz** est commandé par une **électrovanne gaz 24 V** et allumé par un **allumeur**, chacun sur son propre relais. Ce guide les câble sur les Ports **D26** (gaz) et **D27** (allumeur). Seul le côté commande basse tension est montré : le côté gaz est pour un professionnel.

> **⚠ Le gaz peut exploser ou tuer. OakBarn Brewery et Skynet ne sont ni électriciens, ni plombiers, ni experts en chauffage et climatisation. Consultez un électricien, un plombier ou un professionnel du chauffage et de la climatisation agréé.** (Règle 6.20)

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Deux **Ports** libres (ce guide : **D26** et **D27**).
- Deux canaux de **module relais** ([Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board)).
- Une **alimentation 24 V** pour l'électrovanne gaz (24 V DC, ou un vrai transformateur 24 V AC pour une vanne 24 V AC).
- Une **électrovanne gaz** : normalement fermée, homologuée pour votre gaz, prévue pour plus que la pression du détendeur (voir [Gas Solenoid Valve](13-glossary#gas-solenoid-valve)).
- Un **allumeur** et sa propre alimentation (voir [Igniter](13-glossary#igniter)).
- Une **sécurité de flamme** : une vanne gaz à thermocouple homologuée est recommandée (voir [Flame out safety](197-flame-out-safety)).

![Câblage : câbler une électrovanne gaz et un allumeur](help_pictures/Step_Wire_Gas_01_Wiring.svg)

## Étape 1. Les relais {#step-1-the-relays}

Câblez une carte à deux relais au Mega, avec **IN1** sur **D26** et **IN2** sur **D27**.

## Étape 2. L'électrovanne gaz {#step-2-the-gas-solenoid}

Câblez le **+** de l'alimentation 24 V par le **COM** et le **NO** du relais 1 vers l'électrovanne, et l'autre fil de l'électrovanne au **-** de l'alimentation.

## Étape 3. L'allumeur {#step-3-the-igniter}

Câblez l'alimentation de l'allumeur par le **COM** et le **NO** du relais 2 de la même façon. Un allumeur 120 V est sur le secteur : un électricien qualifié le câble.

## Étape 4. Le côté gaz {#step-4-the-gas-side}

Bouteille, détendeur, sécurité de flamme, électrovanne et brûleur : **faites-les installer par un plombier ou un professionnel du chauffage agréé**, et testez l'étanchéité de chaque raccord.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : l'électrovanne gaz comme un **Heating Element** avec **Gas burner** sur On (il a alors le Flame Out, voir [Flame out safety](197-flame-out-safety)) sur **D26**, et l'allumeur sur **D27**.

## Étape 6. Vérifier {#step-6-check-it}

**Bouteille de gaz fermée**, mettez le brûleur On : l'électrovanne claque et l'allumeur fait des étincelles. Off : les deux s'arrêtent.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** utilisez une carte relais 3,3 V.
- **Arduino Opta :** utilisez deux de ses relais.

## Le côté technique {#the-technical-side}

- Le Flame Out de Skynet n'est pas une sécurité homologuée UL et ne doit pas être considéré comme fiable. Surveillez toujours le brûleur.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), les deux Ports doivent être dans `OUTPUT_PINS`.
