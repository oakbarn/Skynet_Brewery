# Stepper motors

A stepper motor turns to an exact position: a motorised ball valve, a dosing pump, a grain mill feeder. It is a **Device** on pins of one board. The board makes the steps; the panel says where to go.

## Add one

**Tabs > Edit layout > Add element > Devices: motors**. Then set:

- **Device** and **Driver board** (A4988, DRV8825, TMC2208 / 2209, TB6600 / DM542, ULN2003 with a 28BYJ-48, L298N). Picking one fills in the usual wiring.
- **Pins**: STEP, DIR and ENABLE, or IN1-IN4 for 4-pin boards.
- **Motor steps per turn** (200 for most NEMA 17 / 23 motors), **Microstepping** (must match the driver's jumpers) and **Gearbox**.
- **Position units** (degrees, %, mm, mL and more) and **Units per output turn**. For a quarter-turn ball valve, 400 % per turn makes 0-100 % = 90°.
- **Top speed**, **Lowest / Highest position allowed**, and an optional **Home switch**.

Power the motor from its own supply, never from the board's 5 V pin.

## On the screen

The stepper shows its position, and "(not homed)" if it has a home switch it has not found yet. Tap it to move to a position, move by an amount, turn at a speed, stop or home.

## In a Process

```
"Valve_M" target = 50        go to 50
"Valve_M" move = -10         go 10 back
"Valve_M" run = 2            keep turning at 2 per second (0 stops)
stop "Valve_M"               stop now
"Valve_M" home = true        find the home switch
wait "Valve_M" moving == false
```

The Mega needs the **AccelStepper** library and `USE_STEPPER` set to 1 in its sketch. The details are in `docs/DEVICE_PROTOCOL.md`. The firmware has not yet been tried on a real motor.
