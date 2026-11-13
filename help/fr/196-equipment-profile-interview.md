# L'Equipment Profile Interview {#the-equipment-profile-interview}

L'**Equipment Profile Interview** fait tout un Equipment Profile en posant des questions simples, une page à la fois. Chaque réponse part de vos **Default settings** : appuyer sur **Next ▶** jusqu'au bout fait déjà un profil qui marche. **◀ Back** revient d'une page ; **✖ Cancel** arrête, et rien n'est fait.

Lancez-le depuis **☰ Menu > Equipment Profile > Open > Add new ...** (ou **Add new ...** sur la ligne d'un Tab). **Start from: Answer a few questions (the Interview)** est le premier choix.

## Les pages {#the-pages}

1. **Start** : le nom du profil, le Tab pour lequel il est (ou **➕ A new Tab**), et l'**Interface** (la carte) où les pompes et les vannes sont branchées.
2. **How many Vessels?** (jusqu'à 8).
3. **The type of each Vessel** : HLT, Mash Tun, Brew Kettle, All In One, Whirlpool, Fermentor, Bright Tank ou Other.
4. **Pick or build each Vessel** : d'abord un Vessel Device ou Widget de ce type, puis le **Skynet Vessel Widget** simple, puis **🔨 Build a new Vessel Device** (le [Vessel Device Builder](166-vessel-device-builder) s'ouvre après l'Interview). Aussi son Label, sa taille et son Dead space (un Fermentor : Largest et Smallest batch).
5. **How many Pumps?**
6. **Each Pump** : Type, Cover, Overlay, Label, Label Visible et Toggle.
7. **How many Motorized Valves?**
8. **Each Motorized Valve** : Type (et dans quel sens elle est), Overlay, Label, Label Visible et Toggle.
9. **Manual Valves** : combien, avec une image et un Label pour chacune. Skynet vous demande de les tourner ([Confirmation Widgets](162-confirmation-widgets)).
10. **And so on** : recirculation de l'empâtage (RIMS, HERMS), Chiller et Supply Manifold.
11. **The numbers** : les pertes et les nombres du profil.
12. **Review** : ce qui sera fait, avec le Name et le Port de chaque pompe et vanne. Un problème (un Label utilisé deux fois, pas d'Interface) s'affiche ici ; appuyez sur **◀ Back** pour le corriger.

## 🔨 Build

**🔨 Build** fait le profil, le donne au Tab et met tout sur le **🔨 Build Tab** ([Build Tab](55-build-tab)). Chaque pompe et vanne motorisée est un vrai Device et prend le prochain Port libre de l'Interface. Ensuite appuyez sur **💾 Save Build ... > Move to Tab**, puis **Save layout**. Les tuyaux ne sont pas dessinés : dessinez-les comme les vôtres sont branchés (**Draw pipe**).

## Utiliser le même plan dans un autre Schema {#use-the-same-layout-in-another-schema}

Un Equipment Profile garde aussi ses pompes et ses vannes motorisées : leur aspect et leur place, mais jamais leur Interface, leur Port ou leur Name. Ainsi un plan **3 Vessel 3 Pump** peut être choisi dans la liste d'un Tab d'un autre Schema sans le refaire.

Quand un Tab choisit un profil dont ce Schema n'a pas encore les pompes ou les vannes, Skynet demande leur Interface et donne à chacune le prochain Port libre. La ligne du Tab montre aussi **🔌 Give ... their Ports** jusqu'à ce que ce soit fait. Comme tout nouveau Device, elles commencent sur le 🔨 Build Tab.

Supprimer une de ces pompes d'un Schema la retire du profil. Une pompe à laquelle un autre Schema n'a pas encore donné de Port reste dans le profil.
