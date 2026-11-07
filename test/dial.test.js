// The Skynet Dial and Timer Digits (Fritz, 2026-11-07, Rule 2.40): Skynet's own drawings, never BruControl's (DevExpress)
import assert from 'node:assert/strict';
import { dialSvg, dialRange, dialZone, dialDecimals } from '../public/dial.js';
import { timerDigits, SKYNET_STYLES, cleanUserStyles } from '../public/styles.js';
import { importBruControl } from '../lib/bruimport.js';

// range: its own Lowest and Highest, else one that fits the units
assert.deepEqual(dialRange({ units: '°F' }), [0, 220]);
assert.deepEqual(dialRange({ units: '°C' }), [-20, 110]);
assert.deepEqual(dialRange({ units: '%' }), [0, 100]);
assert.deepEqual(dialRange({ units: '°F', dialMin: 60, dialMax: 220 }), [60, 220]);
assert.deepEqual(dialRange({ dialMin: 50, dialMax: 10 }), [50, 51], 'a Highest under the Lowest is fixed');
// decimals 0 to 2 (Fritz: "up to 2")
assert.equal(dialDecimals({}), 0); assert.equal(dialDecimals({ precision: 1 }), 1); assert.equal(dialDecimals({ precision: 5 }), 2);
// Fritz: n below the Setpoint blue, n above red, green between
assert.equal(dialZone(160, 170, 2, 2), 'cold');
assert.equal(dialZone(168, 170, 2, 2), 'ok');
assert.equal(dialZone(172, 170, 2, 2), 'ok');
assert.equal(dialZone(172.1, 170, 2, 2), 'hot');
assert.equal(dialZone(165, 170, 5, 1), 'ok', 'the Cooler and Hotter ranges are separate');
assert.equal(dialZone(150, null), '', 'no Setpoint, no color');
const svg = dialSvg({ units: '°F', precision: 1, dialColdColor: '#0000ff' }, 152.26, 170);
assert.match(svg, /152\.3°F/, 'the reading with its decimals and units');
assert.match(svg, /data-zone="cold"/);
assert.match(svg, /fill="#0000ff">152\.3°F/, 'the reading is the Cold color');
assert.match(dialSvg({ units: '°F' }, 170, 170), /data-zone="ok"/);
assert.match(dialSvg({}, null, null, 'FAULT'), />FAULT</);
assert.doesNotMatch(dialSvg({ units: '<b>' }, 1), /<b>/, 'text is made safe');

// Timer Digits: hh:mm:ss or hh:mm; seconds only in the last minute of a countdown
assert.equal(timerDigits('01:30:05'), '01:30:05');
assert.equal(timerDigits('01:30:05', { format: 'hm' }), '01:30');
assert.equal(timerDigits('00:00:45', { format: 'hm', ssLastMinute: true, countdown: true }), '45');
assert.equal(timerDigits('00:00:05', { ssLastMinute: true, countdown: true }), '05');
assert.equal(timerDigits('00:01:00', { ssLastMinute: true, countdown: true }), '00:01:00', 'one whole minute left is not under a minute');
assert.equal(timerDigits('00:00:45', { ssLastMinute: true, countdown: false }), '00:00:45', 'only when counting down');
assert.equal(timerDigits('-00:00:10', { ssLastMinute: true, countdown: true }), '-00:00:10');
// Fritz's frames: every Skynet panel Style has one; a User Style's frame is cleaned
assert.ok(SKYNET_STYLES.timer.filter(s => s.look === 'timer').every(s => s.frame === 'round'));
const u = cleanUserStyles({ timer: [{ id: 'u_f1', name: 'Fritz Purple', look: 'timer', frame: 'squaretop', bezel: '#7b2fbe', back: '#FAFAFA' }, { id: 'u_f2', name: 'Odd', look: 'timer', frame: 'zigzag' }] });
assert.equal(u.timer[0].frame, 'squaretop'); assert.equal(u.timer[0].back, '#FAFAFA');
assert.equal(u.timer[1].frame, 'round', 'an unknown frame is rounded');

// the Importer: a BruControl round gauge is the Skynet Dial with its lowest and highest numbers; digits are LCD digits
const port = (id, n, kind) => `<DevicePort i:type="${kind}"><ID>${id}</ID><Number>${n}</Number></DevicePort>`;
const item = (name, portId, kind, extra) => `<Element i:type="DeviceElement"><Name>${name}</Name><PortID>${portId}</PortID><X>0</X><Y>0</Y><Width>100</Width><Height>100</Height>
  <Appearance><DisplayKind>${kind}</DisplayKind>${extra}<TextDisplayOptions><Precision>1</Precision></TextDisplayOptions></Appearance></Element>`;
const xml = `<Configuration><Devices><Device><Name>Mega</Name><Ports>${port('p1', 54, 'AnalogInPort')}${port('p2', 55, 'AnalogInPort')}${port('p3', 56, 'AnalogInPort')}</Ports></Device></Devices>
<Workspaces><Workspace><Name>Main</Name><Elements>
${item('HLT Temp', 'p1', 'CircularGauge', '<CircularGaugeOptions><MaxValue>220</MaxValue><MinValue>60</MinValue><Style>Default</Style></CircularGaugeOptions>')}
${item('Ferm Temp', 'p2', 'DigitalGauge', '<DigitalGaugeOptions><DigitCount>4</DigitCount><Style>IceColdZone</Style></DigitalGaugeOptions>')}
${item('Mash Temp', 'p3', 'Text', '')}
</Elements></Workspace></Workspaces></Configuration>`;
const r = importBruControl(xml);
const by = l => r.conv.elements.find(e => e.label === l);
assert.equal(by('HLT Temp').look, 'dial'); assert.equal(by('HLT Temp').dialMin, 60); assert.equal(by('HLT Temp').dialMax, 220);
assert.equal(by('HLT Temp').precision, 1);
assert.equal(by('HLT Temp').bru.gauge.style, 'Default', 'the DevExpress style name is only kept for the record');
assert.equal(by('Ferm Temp').look, 'lcd');
assert.equal(by('Mash Temp').look, undefined, 'plain text stays plain');
assert.ok(r.conv.warnings.some(w => /Skynet Dial/.test(w)), 'the Importer says what it did');
console.log('dial ok');
