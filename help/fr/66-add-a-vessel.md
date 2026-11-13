# Ajouter une cuve {#add-a-vessel}

Une cuve (Vessel) est une bouilloire, un HLT, une cuve d'empâtage, un fermenteur, etc. En **Edit layout**, choisissez **Vessel (kettle, HLT, MLT ...)** dans la liste d'équipement et appuyez sur **Add equipment**. Une fenêtre demande quelle sorte vous voulez :

- **Widget** : vous y ajoutez tout vous-même.
- **Integrated** : toute prête.

Ce que vous choisissez va d'abord sur le 🔨 [Build Tab](55-build-tab), et ses Properties s'ouvrent. Quand c'est fini, appuyez sur **💾 Save Build ...** et choisissez **Move to Tab** (ou **As a Template**).

## Widget

La fenêtre montre les **Skynet Vessel Widgets** en petites images. Cliquez sur l'un pour l'utiliser. Chacun est une image de cuve avec ses IP intégrés et rien d'autre : pas de Devices. Le Skynet Vessel Widget lui-même est fixé par Skynet et ne peut pas être changé, seulement cloné (☰ Menu > Vessel Templates > Clone).

L'image sur laquelle vous avez cliqué est au départ l'image du Widget, mais celui du Build Tab est à vous : ouvrez ses Properties et changez le **Graphic** comme sur tout autre Widget. Ses IP restent sur les ouvertures de l'image Skynet.

Les Skynet Vessel Widgets pour l'instant :

- **Generic_Brew_Vessel_Widget** : une cuve de brassage simple sans orifices.
- **Brew_Vessel_Low_TC_Output_Widget** : la même cuve avec un orifice TC 1.5 (la sortie) en bas au centre, son centre à 1 pouce au-dessus du fond.
- **Brew_Vessel_TC_Temperature_Widget** : celle du dessus plus un orifice de température TC 1.5 (doigt de gant) au centre à 5".
- **Brew_Vessel_TC_Temperature_Tangential_Widget** : celle du dessus plus une entrée tangentielle TC 1.5 à 4", à 1" du côté gauche (elle fait face à l'avant, elle est donc dessinée de face).
- **Brew_Vessel_TC_Thermowell_Tangential_Element_Port_Widget** : celle du dessus plus un orifice de résistance TC 2 sur le côté droit à 6".
- **Brew_Vessel_Big_Mac_Widget** : celle du dessus, faite 10" plus large et 6" plus haute, l'orifice de température remonté à 10", et un TC 2 (rinçage) ajouté sur le côté gauche à 11".

Chacune est construite sur celle d'avant.

Versions NPT (orifices NPT femelle 1/2" au lieu de TC) :

- **Brew_Vessel_Low_NPT_Output_Widget** : comme Brew_Vessel_Low_TC_Output_Widget.
- **Brew_Vessel_NPT_Temperature_Widget** : comme Brew_Vessel_TC_Temperature_Widget. Les pouces d'un orifice sont la hauteur de son centre au-dessus du fond de la cuve.

Un orifice (un trou dans la cuve) est dessiné comme un raccord TC ou NPT, à une taille proportionnelle à la cuve, donc un orifice TC 2 paraît un peu plus gros qu'un TC 1.5.

**Blank_Vessel** est une cuve simple où vous choisissez l'image et réglez chaque orifice vous-même.

Les Devices (une résistance, une sonde de température, une vanne) sont placés sur le Build Tab à côté du Widget et groupés avec lui.

## Integrated

La fenêtre a deux groupes :

- **Skynet Integrated Vessels** : leurs Devices sont intégrés, par exemple la [Bouilloire électrique intégrée Skynet](65-skynet-integrated-electric-kettle). La fenêtre New Device demande l'Interface et les Ports, comme pour tout Device. La plupart des gens utiliseront une de celles-ci.
- **User Bundled Templates** : vos propres cuves. Chacune est construite sur un Skynet Vessel Widget.

## Faire un Template groupé de l'utilisateur {#making-a-user-bundled-template}

Un Template de cuve groupé de l'utilisateur commence toujours à partir d'un Skynet Vessel Widget. Il n'y a pas d'autre moyen d'en faire un :

1. **Add equipment > Vessel > Widget**, et cliquez sur un Skynet Vessel Widget.
2. Sur le Build Tab, ajoutez ce qu'il faut et groupez-le.
3. Appuyez sur **💾 Save Build ...**, choisissez **As a Template**, donnez-lui un nom et enregistrez-le.

Dès lors il est dans le groupe **User Bundled Templates** sous **Integrated**. Un clone de celui-ci (ou d'un Skynet Vessel Widget) est construit sur le même Skynet Vessel Widget.

Une cuve vide, ou une cuve qui ne vient pas d'un Skynet Vessel Widget, ne peut pas être enregistrée comme Template de cuve groupé de l'utilisateur, et **☰ Menu > Vessel Templates > New Vessel Template ...** ne peut pas en faire un vide pour l'utilisateur.
