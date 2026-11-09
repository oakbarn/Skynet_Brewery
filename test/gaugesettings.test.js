// Gauge settings (Rule 2.40 point 4): the Skynet Dial's shape and tick marks, the Skynet Bar, Skynet color styles, and the Importer.
import assert from 'node:assert/strict';
import { dialSvg, barSvg, dialEnds, dialMajor, dialMinor, gaugeStyle, bruGauge, GAUGE_STYLES } from '../public/dial.js';
import { importBruControl } from '../lib/bruimport.js';

assert.deepEqual(dialEnds({}), [-120, 120], 'Standard = as before');
assert.deepEqual(dialEnds({ dialShape: 'half' }), [-90, 90]);
assert.deepEqual(dialEnds({ dialShape: 'full' }), [-150, 150]);
assert.equal(dialMajor({}), 6); assert.equal(dialMajor({ dialMajor: 11 }), 11); assert.equal(dialMajor({ dialMajor: 99 }), 21);
assert.equal(dialMinor({}), 0); assert.equal(dialMinor({ dialMinor: 4 }), 4);
const count = (svg, s) => svg.split(s).length - 1;
assert.equal(count(dialSvg({ dialMin: 0, dialMax: 100 }, 50), '<text') - 1, 6, 'six numbers unless set');
assert.equal(count(dialSvg({ dialMin: 0, dialMax: 100, dialMajor: 11 }, 50), '<text') - 1, 11);
assert.equal(count(dialSvg({ dialMajor: 11, dialMinor: 4 }, 50), 'stroke-width="1"'), 40, '4 small ticks in each of 10 gaps');
assert.equal(dialSvg({}, 50), dialSvg({ gaugeStyle: '' }, 50), 'Skynet Classic = the look it always had');
assert.ok(dialSvg({ gaugeStyle: 'night' }, 50).includes('#050805'), 'a color style draws its face');
assert.equal(gaugeStyle({ gaugeStyle: 'nope' }), null);
assert.ok(GAUGE_STYLES.every(g => g[1].startsWith('Skynet')), 'every style has a Skynet name, never a copied one');
const b = barSvg({ dialMin: 0, dialMax: 200, units: '°F' }, 100, 150);
assert.ok(b.includes('class="dial bar"') && b.includes('100°F'), 'the Skynet Bar shows the reading');
assert.ok(barSvg({ barOrient: 'horizontal' }, 50).includes('viewBox="0 0 240 110"'), 'side to side');

// the Importer: nearest Skynet settings
assert.deepEqual(bruGauge('CircularGauge', { minValue: '0', maxValue: '220', majorTickCount: '11', minorTickCount: '4', layout: 'Half', style: 'DeepFire' }),
  { gaugeStyle: 'fire', look: 'dial', dialMin: 0, dialMax: 220, dialMajor: 11, dialMinor: 4, dialShape: 'half' });
assert.deepEqual(bruGauge('LinearGauge', { minValue: '0', maxValue: '100', orientation: 'Horizontal', style: 'Default' }), { look: 'bar', dialMin: 0, dialMax: 100, barOrient: 'horizontal' });
assert.deepEqual(bruGauge('DigitalGauge', { style: 'AfricaSunset' }), { gaugeStyle: 'amber', look: 'lcd' });
const port = (id, n) => `<DevicePort i:type="AnalogInPort"><ID>${id}</ID><Number>${n}</Number></DevicePort>`;
const item = (name, portId, kind, opts) => `<Element i:type="DeviceElement"><Name>${name}</Name><PortID>${portId}</PortID><X>0</X><Y>0</Y><Width>100</Width><Height>100</Height>
  <Appearance><DisplayKind>${kind}</DisplayKind><${kind}Options>${opts}</${kind}Options></Appearance></Element>`;
const xml = `<Configuration><Devices><Device><Name>Mega</Name><Ports>${port('p1', 54)}${port('p2', 55)}</Ports></Device></Devices>
<Workspaces><Workspace><Name>Main</Name><Elements>
${item('Level', 'p1', 'LinearGauge', '<MinValue>0</MinValue><MaxValue>50</MaxValue><MajorTickCount>6</MajorTickCount><Orientation>Vertical</Orientation><Style>GothicMat</Style>')}
${item('Press', 'p2', 'DigitalGauge', '<DigitCount>1</DigitCount><Style>ShiningDark</Style>')}
</Elements></Workspace></Workspaces></Configuration>`;
const r = importBruControl(xml), by = l => r.conv.elements.find(e => e.label === l);
assert.equal(by('Level').look, 'bar'); assert.equal(by('Level').gaugeStyle, 'steel'); assert.equal(by('Level').dialMax, 50); assert.equal(by('Level').dialMajor, 6);
assert.equal(by('Level').bru.gauge.style, 'GothicMat', 'the style name is only kept for the record');
assert.equal(by('Press').look, 'lcd'); assert.equal(by('Press').gaugeStyle, 'dark');
assert.ok(JSON.stringify(r).includes('Skynet Bar'), 'the Import notes say so');
console.log('gauge settings tests passed');
