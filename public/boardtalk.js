// Board Talk (OakBarn Brewery, 2026-11-09, Rule 6.27): every line the Brain and a board (Interface) send each other, in plain words.
// BruControl showed no explanation of what to send or what a reply meant; Skynet explains each line. Shared by the Panel's Board Talk
// window, the Brain (lib/hardware.js keeps the lines) and Help 177, which lists every command. No imports, so node can load it too.
// The lines themselves are in docs/DEVICE_PROTOCOL.md.

// Every command: [word, what follows it, sent by ('to' = Brain to board, 'from' = board to Brain, 'both'), plain words]
export const BOARD_COMMANDS = [
  ['HELLO', '', 'to', 'Hello: the Brain asks the board who it is. The board answers HELLO with its name and program version, then reports all its inputs.'],
  ['HELLO', '<name> <program>', 'from', 'Hello back: the board\'s name and the version of its program.'],
  ['PING', '', 'to', 'Are you there? Sent every 2 seconds. A board that hears nothing for its Lost link delay turns every output OFF (a safety).'],
  ['CFG WD', '<seconds> S', 'to', 'Lost link delay: if the board hears nothing from the Brain this many seconds, it turns every output OFF.'],
  ['DO', '<pin> <0|1>', 'both', 'Digital output: pin turned OFF (0) or ON (1). The Brain sends it; the board answers with the same line to say it is done.'],
  ['PWM', '<pin> <0-255>', 'both', 'PWM output: how much power on a pin, 0 (none) to 255 (full). 128 is about half.'],
  ['AO', '<pin> <0-1000>', 'to', 'Analog output in tenths of a percent: 0 = 0 V or 4 mA, 1000 = 10 V or 20 mA.'],
  ['CFG DI', '<pin> <PULLUP|NOPULL> <ms>', 'to', 'Set up a digital input: its pull-up on or off, and how long (ms) a change must hold before it counts (debounce).'],
  ['CFG RTD', '<pin> <2|3|4>', 'to', 'Set up a PT100 / PT1000 probe board (MAX31865) on this chip-select pin, with 2, 3 or 4 wires.'],
  ['CFG TC', '<pin> <type>', 'to', 'Set up a thermocouple board (MAX31856 / MAX31855) on this chip-select pin, with its type letter (K, J, T ...).'],
  ['CFG FLOW', '<pin> S', 'to', 'Raspberry Pi only: count flow meter pulses on this pin.'],
  ['CFG STEP', '<step> <dir> <enable> <flags> <top> <accel> <µs>', 'to', 'Set up a stepper motor on its STEP and DIR pins, with its top speed and how fast it speeds up.'],
  ['CFG STEP4', '<in1> <in2> <in3> <in4> <flags> <top> <accel>', 'to', 'Set up a 4-wire stepper motor board.'],
  ['CFG HOME', '<step> <switch pin> <flags>', 'to', 'A stepper motor\'s home switch.'],
  ['GO', '<step> <position> <steps/s>', 'to', 'Stepper motor: go to this position.'],
  ['RUN', '<step> <steps/s>', 'to', 'Stepper motor: keep turning at this speed (minus = backward, 0 = slow to a stop).'],
  ['STOP', '<step>', 'to', 'Stepper motor: slow down and stop.'],
  ['ZERO', '<step> <position>', 'to', 'Stepper motor: call where it is now this position.'],
  ['HOME', '<step> <steps/s> <max> <position>', 'to', 'Stepper motor: turn until the home switch is hit.'],
  ['EN', '<step> <0|1>', 'to', 'Stepper motor driver off (0, the motor turns freely) or on (1).'],
  ['DI', '<pin> <0|1>', 'from', 'Digital input: the pin reads OFF (0) or ON (1). Sent on every change, and every few seconds.'],
  ['A', '<n> <0-1023>', 'from', 'Analog input A<n>: its reading, 0 (0 V) to 1023 (5 V). Every second.'],
  ['ADS', '<channel> <raw>', 'from', 'ADS1115 analog board, channel 0-3: 0 to 32767 is 0 to 6.144 V. Every second.'],
  ['RTD', '<pin> <raw|NAN>', 'from', 'PT100 / PT1000 probe reading (0-32767). NAN = the probe is not working (a fault).'],
  ['TC', '<pin> <°C|NAN>', 'from', 'Thermocouple temperature in °C. NAN = the probe is open or shorted.'],
  ['T', '<probe id> <°F>', 'from', 'OneWire probe (DS18B20) temperature in °F, by the probe\'s own 16-letter id.'],
  ['P', '<pin> <count>', 'from', 'Flow meter: pulses counted since the board started. Every second.'],
  ['W', '<pin> <raw>', 'from', 'Load-cell (HX711) board on this DT pin: its raw reading. Every second.'],
  ['SP', '<step> <steps> <moving> <homed>', 'from', 'Stepper motor: where it is (in steps), moving (1) or not (0), homed (1) or not (0).'],
  ['SH', '<step> <1|0>', 'from', 'Stepper motor homing done: 1 = found the switch, 0 = gave up.'],
  ['SD', '<0|1>', 'from', 'Ethernet boards: 1 = an SD card is in the shield. SD cards are not supported: take it out (Rule 6.11).'],
  ['ERR', '<text>', 'from', 'The board reports a problem, in its own words.'],
];

const NUM = s => s !== undefined && /^-?\d+(\.\d+)?$/.test(s);
// Plain words for one line. dir: 'out' (Brain to board) or 'in' (board to Brain)
export function explainLine(line, dir = 'in') {
  const parts = String(line ?? '').trim().split(/\s+/), w = (parts[0] ?? '').toUpperCase(), a = parts[1], b = parts[2];
  if (!w) return '';
  switch (w) {
    case 'HELLO': return dir === 'out' ? 'Hello: who are you?' : `Hello back: this board is "${parts.slice(1).join(' ')}".`;
    case 'PING': return 'Are you there? (every 2 seconds; keeps the outputs on)';
    case 'DO': return `Pin ${a} ${b === '1' ? 'ON' : 'OFF'}${dir === 'in' ? ' (the board says it is done)' : ''}.`;
    case 'PWM': return NUM(b) ? `Pin ${a} power ${Math.round(+b / 255 * 100)} % (${b} of 255).` : `PWM pin ${a}.`;
    case 'AO': return NUM(b) ? `Analog output pin ${a}: ${(+b / 10).toFixed(1)} % (${(+b / 100).toFixed(2)} V on a 0-10 V output).` : `Analog output pin ${a}.`;
    case 'DI': return `Input pin ${a} reads ${b === '1' ? 'ON (1)' : 'OFF (0)'}.`;
    case 'A': return NUM(b) ? `Analog input A${a} reads ${b} of 1023 (about ${(+b / 1023 * 5).toFixed(2)} V).` : `Analog input A${a}.`;
    case 'ADS': return NUM(b) ? `ADS1115 channel ${a} reads ${b} (about ${(+b / 32767 * 6.144).toFixed(3)} V).` : `ADS1115 channel ${a}.`;
    case 'RTD': return /nan/i.test(b) ? `PT100 / PT1000 probe on pin ${a}: FAULT (not working).` : `PT100 / PT1000 probe on pin ${a} reads ${b}.`;
    case 'TC': return /nan/i.test(b) ? `Thermocouple on pin ${a}: FAULT (open or shorted).` : `Thermocouple on pin ${a}: ${b} °C.`;
    case 'T': return `OneWire probe ${a}: ${b} °F.`;
    case 'P': return `Flow meter on pin ${a}: ${b} pulses so far.`;
    case 'W': return `Load-cell board on pin ${a} reads ${b}.`;
    case 'SP': return `Stepper on pin ${a} is at step ${b}, ${parts[3] === '1' ? 'moving' : 'still'}, ${parts[4] === '1' ? 'homed' : 'not homed'}.`;
    case 'SH': return `Stepper on pin ${a}: homing ${b === '1' ? 'found the switch' : 'gave up, no switch found'}.`;
    case 'SD': return a === '1' ? 'An SD card is in the Ethernet shield. Take it out: SD cards are not supported.' : 'No SD card in the Ethernet shield (good).';
    case 'ERR': return `The board reports a problem: ${parts.slice(1).join(' ')}`;
    case 'GO': return `Stepper on pin ${a}: go to step ${b}.`;
    case 'RUN': return `Stepper on pin ${a}: ${+b === 0 ? 'slow to a stop' : `keep turning at ${b} steps a second`}.`;
    case 'STOP': return `Stepper on pin ${a}: stop.`;
    case 'ZERO': return `Stepper on pin ${a}: call this spot step ${b}.`;
    case 'HOME': return `Stepper on pin ${a}: find the home switch.`;
    case 'EN': return `Stepper on pin ${a}: driver ${b === '1' ? 'on' : 'off'}.`;
    case 'CFG': {
      const k = (a ?? '').toUpperCase(), c = BOARD_COMMANDS.find(x => x[0] === 'CFG ' + k);
      if (k === 'WD') return `Lost link delay: all outputs OFF after ${b} seconds without the Brain.`;
      if (k === 'DI') return `Set up input pin ${b}: pull-up ${/^PULLUP$/i.test(parts[3]) ? 'on' : 'off'}, a change must hold ${parts[4] ?? 20} ms.`;
      return c ? c[3] : `A setting for the board (${parts.slice(1).join(' ')}).`;
    }
  }
  return 'The Skynet programs do not use this line. A board running another program may.';
}

// the lines a person may type into Board Talk's box: one line, no more than 120 letters, plain text
export function cleanTalkLine(s) {
  const t = String(s ?? '').replace(/[\r\n]+/g, ' ').trim();
  if (!t) throw new Error('Type a line to send, for example HELLO');
  if (t.length > 120) throw new Error('One line of 120 letters or fewer');
  if (/[^\x20-\x7e]/.test(t)) throw new Error('Only plain letters, numbers and signs');
  return t;
}

// Board settings (Rule 6.27): plain choices and the defaults
export const BAUDS = [9600, 19200, 38400, 57600, 115200, 230400, 250000];
export const BOARD_DEFAULTS = { baud: 115200, netPort: 4100, answerSec: 10 };
export const answerSec = d => { const n = Math.round(Number(d?.answerSec)); return n >= 2 && n <= 600 ? n : BOARD_DEFAULTS.answerSec; };
