// The boards (Interfaces) Skynet knows, and the Ports (IO pins) of each one (OakBarn Brewery, 2026-11-19: "I want all standard
// Arduino Boards added. Brew Control had a lot"). Every board BruControl listed (Rule 6.16) and today's standard Arduino boards.
// Shared by the browser and the Brain (public/links.js, public/naming.js, lib/bruimport.js).
//
// Each board:
//   name    shown in the Board list          volts   its logic level: 5 or 3.3 (a 3.3 V board gets the 3.3 V warnings, Rule 6.35)
//   pins    its digital Ports, as numbers     pwm     the Ports that make true (hardware) PWM
//   counter the interrupt Ports (flow meters) spi     the SPI Ports RTD and thermocouple boards share ([] = SPI is on its own header)
//   onewire the DS18B20 data Port             i2c     the I2C Ports (ADS1115)
//   analog  its analog Ports, A0 first        a0      the pin number of A0 shown beside it (BruControl's numbers on a Mega), or none
//   usb     Ports the USB link uses           inputOnly Ports that can only read (no outputs)
//   avoid   Ports offered last (start-up pins) strict  a Port not in its lists is refused (ESP boards: some pins are the chip's flash)
//   pwmAll  PWM is plentiful: no Port is kept for it
//   family  'arduino' (Mega-like links), 'wifi' (WiFi built in, ESP32-like links), 'pi'
//   eth     its Ethernet choice's words      noEthernet  no Ethernet choice      wifi  the words of its WiFi choice, when only some have WiFi
//   shield  an Ethernet connection is an Ethernet shield or module on D10 (Rule 6.10 then covers it)
//   label   how a Port is shown: D5, GPIO17
// Pin numbers are the Arduino ones printed on the board. Where a board's own maker lists PWM or interrupt pins, those are used.
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
const D = p => `D${p}`;
const UNO_SHAPE = { pins: range(2, 13), pwm: ['3', '5', '6', '9', '10', '11'], counter: ['2', '3'], spi: ['11', '12', '13'], onewire: '8', i2c: [], usb: ['0', '1'], label: D };

export const BOARD_INFO = {
  mega: { name: 'Arduino Mega 2560', volts: 5, family: 'arduino', shield: true, pins: range(2, 53), pwm: [...range(2, 13), '44', '45', '46'],
    counter: ['2', '3', '18', '19', '20', '21'], spi: ['50', '51', '52'], onewire: '40', i2c: [], analog: 16, a0: 54, usb: ['0', '1'], label: D },
  uno: { name: 'Arduino Uno R3', volts: 5, family: 'arduino', shield: true, ...UNO_SHAPE, analog: 6, a0: 14 },
  unoR4: { name: 'Arduino Uno R4 (Minima or WiFi)', volts: 5, family: 'arduino', shield: true, wifi: 'WiFi (Uno R4 WiFi only)', ...UNO_SHAPE, pins: range(0, 13), counter: ['0', '1', '2', '3', '8'], usb: [], analog: 6, a0: 14 },      // Arduino's Uno R4 Minima and WiFi pinouts: D0-D3, D8 are interrupts on both, each its own
  nano: { name: 'Arduino Nano', volts: 5, family: 'arduino', shield: true, eth: 'Ethernet (W5500 module, CS on D10)', ...UNO_SHAPE, analog: 8, a0: 14 },
  nanoEvery: { name: 'Arduino Nano Every', volts: 5, family: 'arduino', shield: true, eth: 'Ethernet (W5500 module, CS on D10)', ...UNO_SHAPE, pins: range(0, 13), pwm: ['3', '5', '6', '9', '10'], counter: range(0, 13), usb: [], analog: 8, a0: 14 },
  leonardo: { name: 'Arduino Leonardo', volts: 5, family: 'arduino', shield: true, pins: range(0, 13), pwm: ['3', '5', '6', '9', '10', '11', '13'], counter: ['0', '1', '2', '3', '7'],
    spi: [], onewire: '8', i2c: ['2', '3'], analog: 6, a0: 18, usb: [], label: D },
  micro: { name: 'Arduino Micro', volts: 5, family: 'arduino', shield: true, eth: 'Ethernet (W5500 module, CS on D10)', pins: range(0, 13), pwm: ['3', '5', '6', '9', '10', '11', '13'], counter: ['0', '1', '2', '3', '7'],
    spi: [], onewire: '8', i2c: ['2', '3'], analog: 6, a0: 18, usb: [], label: D },
  due: { name: 'Arduino Due', volts: 3.3, family: 'arduino', shield: true, pins: range(2, 53), pwm: range(2, 13), counter: range(2, 53), spi: [], onewire: '40', i2c: ['20', '21'], analog: 12, a0: 54, usb: ['0', '1'], label: D },
  giga: { name: 'Arduino GIGA R1 WiFi', volts: 3.3, family: 'wifi', shield: true, pins: range(0, 53), pwm: range(2, 13), counter: range(0, 53), spi: [], onewire: '40', i2c: ['20', '21'], analog: 12, usb: [], label: D },
  nanoEsp32: { name: 'Arduino Nano ESP32', volts: 3.3, family: 'wifi', noEthernet: true, pins: range(0, 13), pwm: range(0, 13), counter: range(0, 13), spi: ['11', '12', '13'], onewire: '8', i2c: [], analog: 8, usb: [], label: D },
  grandCentral: { name: 'Adafruit Grand Central M4', volts: 3.3, family: 'arduino', shield: true, pins: range(0, 53),
    pwm: [...range(2, 9), '11', ...range(13, 19), ...range(22, 45), '48', ...range(50, 53)], counter: ['2', '3', '18', '19'], spi: ['50', '51', '52'], onewire: '40', i2c: ['20', '21'],
    analog: 16, a0n: i => (i < 8 ? 67 + i : 46 + i), usb: [], label: D },      // BruControl's numbers: A0-A7 = 67-74, A8-A15 = 54-61
  featherM0: { name: 'Adafruit Feather M0 (WiFi)', volts: 3.3, family: 'wifi', pins: ['0', '1', '5', '6', '9', '10', '11', '12', '13'], pwm: ['5', '6', '9', '10', '11', '12', '13'],
    counter: ['0', '1', '5', '6', '9', '10', '11', '12', '13'], spi: [], onewire: '12', i2c: [], analog: 6, usb: [], label: D, wifi: 'WiFi (Feather M0 WiFi only)', noEthernet: true },
  esp32: { name: 'ESP32', volts: 3.3, family: 'wifi', strict: true, pins: ['2', '4', '5', ...range(12, 19), '21', '22', '23', '25', '26', '27', '32', '33', '34', '35', '36', '39'],
    pwm: ['2', '4', '5', ...range(12, 19), '21', '22', '23', '25', '26', '27', '32', '33'], counter: ['2', '4', '5', ...range(12, 19), '21', '22', '23', '25', '26', '27', '32', '33', '34', '35', '36', '39'],
    spi: ['18', '19', '23'], onewire: '4', i2c: ['21', '22'], analog: ['A0', 'A3', 'A4', 'A5', 'A6', 'A7'], aGpio: { A0: 36, A3: 39, A4: 32, A5: 33, A6: 34, A7: 35 },
    inputOnly: ['34', '35', '36', '39'], avoid: ['2', '5', '12', '15'], usb: ['1', '3'], label: p => `GPIO${p}` },
  esp8266: { name: 'ESP8266 (NodeMCU, Wemos D1)', volts: 3.3, family: 'wifi', strict: true, noEthernet: true, pins: ['16', '5', '4', '0', '2', '14', '12', '13', '15'],
    pwm: ['5', '4', '0', '2', '14', '12', '13', '15'], counter: ['5', '4', '0', '2', '14', '12', '13', '15'], spi: ['12', '13', '14'], onewire: '2', i2c: ['4', '5'], analog: 1,
    pwmAll: true, avoid: ['0', '2', '15'], usb: ['1', '3'],      // pwmAll: its PWM is made by the program on every pin but GPIO16, so no pin is kept for it
    label: p => `GPIO${p}` + ({ 16: ' (D0)', 5: ' (D1)', 4: ' (D2)', 0: ' (D3)', 2: ' (D4)', 14: ' (D5)', 12: ' (D6)', 13: ' (D7)', 15: ' (D8)' }[p] || '') },
  pi: { name: 'Raspberry Pi', volts: 3.3, family: 'pi', pins: range(2, 27), pwm: range(2, 27), counter: range(2, 27), spi: ['7', '8', '9', '10', '11'], onewire: '4', i2c: ['2', '3'], analog: 0, usb: [], label: p => `GPIO${p}` },
};
// The Board list, in this order: the Mega first (the board most brewers have), the other Arduino boards, then the ESP and Pi boards
export const BOARD_ORDER = ['mega', 'uno', 'unoR4', 'nano', 'nanoEvery', 'leonardo', 'micro', 'due', 'giga', 'nanoEsp32', 'grandCentral', 'featherM0', 'esp32', 'esp8266', 'pi'];
// the analog Ports of a board, A0 first ('A0', 'A1' ...)
export const analogPins = b => Array.isArray(b?.analog) ? b.analog : Array.from({ length: b?.analog || 0 }, (_, i) => 'A' + i);
// how an analog Port is shown: "A3 = pin 57" on a Mega (BruControl's number), "A3 = GPIO39" on an ESP32, "A3" on a board with no number
export function analogLabel(p, b) {
  const n = +String(p).slice(1);
  if (b?.aGpio?.[p] !== undefined) return `${p} = GPIO${b.aGpio[p]}`;
  if (b?.a0n) return `${p} = pin ${b.a0n(n)}`;
  return b?.a0 !== undefined ? `${p} = pin ${b.a0 + n}` : p;
}
// BruControl's board type names (its Interface "Type") to a Skynet board, for the BruControl Import ('' = not known: the Interface
// pop-up asks for it). Most exact first.
export const BRU_BOARD_NAMES = [[/nano.*esp32/i, 'nanoEsp32'], [/grand\s*central/i, 'grandCentral'], [/feather/i, 'featherM0'], [/esp\s*8266|esp8285|nodemcu|wemos|sonoff/i, 'esp8266'],
  [/esp|m5stack/i, 'esp32'], [/mega/i, 'mega'], [/\bdue\b/i, 'due'], [/giga/i, 'giga'], [/uno.*r4|r4.*(minima|wifi)/i, 'unoR4'], [/\buno\b/i, 'uno'],
  [/nano.*every/i, 'nanoEvery'], [/nano/i, 'nano'], [/leonardo/i, 'leonardo'], [/\bmicro\b/i, 'micro']];
export const boardFromBru = type => BRU_BOARD_NAMES.find(([re]) => re.test(String(type ?? '')))?.[1] ?? '';
