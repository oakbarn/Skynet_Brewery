# Dual Throw: a second Port that is always the opposite

Some valves have **two control wires**: one wire drives the valve **open**, the other drives it **closed**. Some motors turn forward
on one relay and backward on another. Both need two outputs that are **never on at the same time**. In Skynet that is one Digital Out
with a **Dual Throw** second Port (Skynet Rule 6.22). It works like BruControl's Dual Throw output.

## How it switches

| The Device is | Its own Port | The second Port |
|---|---|---|
| **ON** | on | off |
| **OFF** | off | on |

When it changes, the Port that goes **off** goes off first. The other Port comes **on** after the **Dual Throw delay**, so the two
Ports are never on together. For a motorized valve, wire the valve's **Open** wire to the Device's own Port and its **Close** wire to
the second Port: ON opens the valve, OFF closes it.

## Setting it up

1. Open the Device's **Properties** (a Digital Out or a Motorized valve), or the **Add Device** box.
2. Pick its **Interface** and **Port**, then click the **⬢** beside the Interface to open **Pin attributes**.
3. Pick the **Dual Throw: second Port**. Only free Ports on the same Interface are listed. **None** means no second Port.
4. Type the **Dual Throw delay** in milliseconds (1000 = 1 second). Empty means 0, both switch at once, the one going off first.

The second Port now belongs to this Device: no other Device can use it (One Interface Port, one Device, Rule 6.1).
**Invert** (pin LOW = on) inverts both Ports.

## Good to know

- **OFF drives the second Port on.** When everything is switched off (another Schema is loaded), a Dual Throw valve goes OFF, so its
  Close wire is powered and the valve closes. Only a lost link between the Brain and the board turns both Ports off.
- A **Heating Element** and a **Manual valve** have no Dual Throw.
- **From BruControl:** the BruControl Importer keeps each Digital Out's Dual Throw port and delay, and lists them in the Import notes.
