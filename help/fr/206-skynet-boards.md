# Cartes Skynet {#skynet-boards}

Une **carte** (une **Interface**) est l'Arduino, l'ESP ou le Raspberry Pi auquel vos Devices sont câblés. Vous la choisissez dans **➕ Add Interface > Board**. Skynet règle ensuite le reste d'après la carte : ses choix de **Connection** et ses **Ports** (broches IO), avec les bons Ports PWM, compteur, analogiques et de bus pour cette carte.

**Skynet est prévu et câblé pour l'Arduino Mega 2560** (une carte 5 V). Toutes les autres cartes de la liste peuvent aussi servir. Une carte doit être On et parler au Brain pour faire quoi que ce soit.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

## Les cartes {#the-boards}

| Carte | Volts | Ports (broches IO) | Ports PWM vrais | Ports compteur (débitmètres) | Ports analogiques | Connection |
|---|---|---|---|---|---|---|
| **Arduino Mega 2560** (la norme) | 5 V | D2-D53 | D2-D13, D44-D46 | D2, D3, D18-D21 | A0-A15 (broche 54-69) | USB, shield Ethernet, WiFi par un pont ESP32 |
| Arduino Uno R3 | 5 V | D2-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A5 | USB, shield Ethernet |
| Arduino Uno R4 (Minima ou WiFi) | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A5 | USB, shield Ethernet, WiFi (R4 WiFi seulement) |
| Arduino Nano | 5 V | D2-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A7 | USB, module Ethernet |
| Arduino Nano Every | 5 V | D0-D13 | D3, D5, D6, D9, D10 | tous les Ports | A0-A7 | USB, module Ethernet |
| Arduino Leonardo | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11, D13 | D0-D3, D7 | A0-A5 | USB, shield Ethernet |
| Arduino Micro | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11, D13 | D0-D3, D7 | A0-A5 | USB, module Ethernet |
| Arduino Due | **3,3 V** | D2-D53 | D2-D13 | tous les Ports | A0-A11 | USB, shield Ethernet |
| Arduino GIGA R1 WiFi | **3,3 V** | D0-D53 | D2-D13 | tous les Ports | A0-A11 | USB, shield Ethernet, WiFi |
| Arduino Nano ESP32 | **3,3 V** | D0-D13 | tous les Ports | tous les Ports | A0-A7 | USB, WiFi |
| Adafruit Grand Central M4 | **3,3 V** | D0-D53 | la plupart des Ports (liste d'Adafruit) | D2, D3, D18, D19 | A0-A15 (A0-A7 = broche 67-74, A8-A15 = broche 54-61) | USB, shield Ethernet |
| Adafruit Feather M0 (WiFi) | **3,3 V** | D0, D1, D5, D6, D9-D13 | D5, D6, D9-D13 | tous les Ports | A0-A5 | USB, WiFi (Feather M0 WiFi seulement) |
| ESP32 | **3,3 V** | GPIO 2, 4, 5, 12-19, 21-23, 25-27, 32-36, 39 | tous les Ports de sortie | tous les Ports | A0, A3-A7 (GPIO 36, 39, 32-35) | USB, Ethernet (ESP32 avec prise), WiFi |
| ESP8266 (NodeMCU, Wemos D1) | **3,3 V** | GPIO 0, 2, 4, 5, 12-16 | tous les Ports sauf GPIO16 | tous les Ports sauf GPIO16 | A0 | USB, WiFi |
| Raspberry Pi | **3,3 V** | GPIO 2-27 | tous les Ports | tous les Ports | aucun (utilisez un ADS1115) | Ethernet, WiFi |

- **La liste des Ports ne propose que les Ports que la carte possède.** Un Port que la carte n'a pas est refusé. Sur un ESP32, les GPIO 6-11 sont la mémoire de la carte et ne sont jamais proposés, et les GPIO 34, 35, 36 et 39 ne peuvent que lire (entrées) : une sortie ne peut pas les utiliser.
- **Les broches de démarrage viennent en dernier.** Sur un ESP32 (GPIO 2, 5, 12, 15) et un ESP8266 (GPIO 0, 2, 15), certains Ports décident de la façon dont la carte démarre. Skynet les propose en dernier.
- **L'Ethernet utilise D10.** Sur toute carte avec un shield ou un module Ethernet, D10 est au shield et n'est pas proposé (Règle 6.10).

## Cartes 3,3 V {#3-3-v-boards}

Une carte 3,3 V ne doit jamais recevoir 5 V sur un Port : cela peut la détruire. Quand vous mettez un de ces Devices sur un Port d'une carte 3,3 V, Skynet montre **un seul avertissement**, puis vous décidez :

1. **Une entrée numérique** (un interrupteur, un interrupteur à flotteur, un bouton-poussoir) : câblez-la au 3,3 V, jamais au 5 V. Un interrupteur se place entre le Port et GND (le pull-up de la carte), ou utilisez un convertisseur de niveau.
2. **Un capteur analogique 0-5 V** (par exemple un capteur de pression) : il met plus de 3,3 V sur le Port. Utilisez un diviseur de tension, un capteur 3,3 V ou une carte ADS1115.
3. **Un relais** (un Digital Out ou une sortie PWM) : beaucoup de modules relais 5 V ne commutent pas depuis un Port 3,3 V. Utilisez un module relais fait pour un signal 3,3 V, ou un SSR (la plupart commutent de 3 à 32 V).

**Vous pouvez mélanger des cartes 5 V et 3,3 V.** Chaque carte est sa propre Interface, et les avertissements suivent la carte de chaque Device : un Mega et un Grand Central dans la même brasserie, c'est très bien.

## Le programme sur la carte {#the-program-on-the-board}

La liste des cartes rend justes les listes de Ports du Panel pour chaque carte. Le programme Skynet sur la carte (son firmware) est écrit et testé pour l'**Arduino Mega 2560**. Le programme des autres cartes est la prochaine étape du plan firmware Skynet : un seul programme partagé, écrit en pensant à chaque carte de cette liste.

L'**Arduino Opta** (un PLC avec sorties relais et entrées 0-10 V) n'est pas encore dans la liste : il lui faut d'abord son propre programme.
