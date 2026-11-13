# Lisser une lecture qui saute {#smoothing-a-jumpy-reading}

Certaines lectures sautent : une sonde thermistance (NTC) sur un long fil, un débitmètre qui compte des impulsions, une balance avec un agitateur
en marche. Le **Smoothing** (lissage, Règle Skynet 6.24) les calme.

## Comment ça marche {#how-it-works}

**Smoothing %** est le poids de chaque nouvelle lecture :

| Smoothing % | Ce que vous voyez |
|---|---|
| 100 | pas de lissage : le nombre saute à chaque lecture |
| 50 | chaque nouvelle lecture déplace le nombre à mi-chemin |
| 25 | calme : un saut de 4 degrés apparaît comme 1, et un vrai changement se voit quand même en quelques secondes |
| 10 | très calme, mais lent à montrer un vrai changement |

Laissez vide pour la valeur de départ : **25 % pour une sonde thermistance (NTC)**, 100 % (aucun) pour tout le reste.

## Où il se trouve {#where-it-is}

Ouvrez les **Properties** du Device et réglez **Smoothing %**. Il existe sur :

- chaque **Temperature Probe**
- chaque **Analog In**
- un **débitmètre** : son débit est lissé ; son Total compte toujours chaque impulsion
- une **balance (Scale)** : son poids et son volume ; Auto tare marche toujours
- un **Digital In** réglé en **Counter** : voir plus bas

## Le Rate d'un Counter {#a-counter-s-rate}

Un Digital In réglé en **Counter** a maintenant aussi un **Rate** : les comptes par seconde sur sa **Sampling Period** (1 à 10 secondes,
vide = 1). Le Rate est ensuite lissé. Le **Count** lui-même n'est jamais lissé.

## Dans un Process {#in-a-process}

Un Process, une alarme et le Tab voient tous le nombre lissé. La lecture avant lissage est `.raw` :

```
if MB_A0_TEMP@10KNTC_Mash~Tun_MT > 152      (the smoothed reading)
print MB_A0_TEMP@10KNTC_Mash~Tun_MT.raw     (the reading before smoothing)
print Water_Flow.raw                   (a flow meter's rate before smoothing)
print Pulse_Counter.rate               (a Counter's counts per second)
```

(Dans l'ordre : la lecture lissée, la lecture avant lissage, le débit d'un débitmètre avant lissage, et les comptes par seconde d'un Counter.)
