// The Chart Widget (Rule 1.26, Fritz 2026-11-08): BruControl Chart properties as attributes, and its picture
import assert from 'node:assert/strict';
import { argbHex, chartSettings, spanText, axisRange, chartSvg, CHART_DEFAULTS } from '../public/chart.js';

assert.equal(argbHex(-16732080), '#00B050', 'a BruControl color number');
assert.equal(argbHex(-1048576), '#F00000');
assert.equal(argbHex(''), '');
assert.equal(spanText(86460), '1 day 1 min');
assert.equal(spanText(5400), '1 h 30 min');

// the Properties, and a Process's attribute wins
const e = { spanSeconds: 432060, refreshInterval: 30, hGridLines: 2, ch1Element: 'Conical_Temp', ch1AutoScale: false, ch1YMin: 30, ch1YMax: 70, ch1LineColor: '#00B050' };
let s = chartSettings(e);
assert.equal(s.spanSeconds, 432060); assert.equal(s.refreshInterval, 30); assert.equal(s.hGridLines, 2); assert.equal(s.vGridLines, 0);
assert.deepEqual(s.channels.map(c => c.element), ['Conical_Temp', '']);
assert.equal(s.channels[0].autoScale, false); assert.equal(s.channels[1].autoScale, true);
assert.equal(s.channels[1].lineColor, CHART_DEFAULTS.lineColors[1]);
s = chartSettings(e, { spanseconds: 86400, ch1element: 'Other' });
assert.equal(s.spanSeconds, 86400); assert.equal(s.channels[0].element, 'Other');
assert.equal(chartSettings({ refreshInterval: 0 }).refreshInterval, 1, 'never faster than once a second');

// the axes: its own numbers with Auto scale off, else the readings with a little room
assert.deepEqual(axisRange({ autoScale: false, yMin: 30, yMax: 70 }, [[0, 50]]), [30, 70]);
const [lo, hi] = axisRange({ autoScale: true, yMin: null, yMax: null }, [[0, 60], [1, 70]]);
assert.ok(lo < 60 && hi > 70);
assert.deepEqual(axisRange({ autoScale: true, yMin: null, yMax: null }, []), [0, 1]);

// the picture: a line per channel with readings, a note when none is picked
const now = 1_000_000_000;
const svg = chartSvg(e, {}, { Conical_Temp: [[now - 3600_000, 50], [now - 1800_000, 52], [now, 51]] }, { now, w: 600, h: 180 });
assert.match(svg, /<polyline [^>]*stroke="#00B050"/);
assert.match(svg, /^<svg class="chartSvg"/);
assert.match(chartSvg({}, {}, {}, { now }), /No Device or Widget picked/);
assert.ok(!/<polyline/.test(chartSvg(e, {}, {}, { now })), 'no readings: no line');
console.log('chart tests passed');

// a BruControl Chart imports as a Chart Widget (lib/bruimport.js), its item drawn is sent to the database
{
  const { importBruControl } = await import('../lib/bruimport.js');
  const xml = `<?xml version="1.0"?><Configuration xmlns:i="http://www.w3.org/2001/XMLSchema-instance"><Devices><Device><Name>Main</Name><Interface>Serial</Interface><Ports>
<DevicePort i:type="AnalogInPort"><ID>p1</ID><Number>62</Number></DevicePort></Ports></Device></Devices>
<Workspaces><Workspace><Name>Conical Temp</Name><Elements>
<Element i:type="DeviceElement"><DisplayName>Ferm Temp</DisplayName><ID>e1</ID><Name>S_Ferm Temp</Name><Width>100</Width><Height>60</Height><X>0</X><Y>0</Y><PortID>p1</PortID></Element>
<Element i:type="ChartElement"><DisplayName></DisplayName><Height>190</Height><ID>c1</ID><Name>Conical 5 Day</Name><Width>610</Width><X>10</X><Y>80</Y>
<Channels><ChartChannelOptions><Appearance><AxisColor>-9424736</AxisColor><LineColor>-16732080</LineColor></Appearance><AutoScale>false</AutoScale><AxisYMax>70</AxisYMax><AxisYMin>30</AxisYMin>
<ChannelID><ElementID>p1</ElementID><Index>0</Index></ChannelID></ChartChannelOptions>
<ChartChannelOptions><Appearance><AxisColor i:nil="true"/><LineColor i:nil="true"/></Appearance><AutoScale>true</AutoScale><AxisYMax>0</AxisYMax><AxisYMin>0</AxisYMin><ChannelID i:nil="true"/></ChartChannelOptions></Channels>
<ChartAppearance><HGridLines>2</HGridLines><VGridLines>0</VGridLines><XAxisColor>-1048576</XAxisColor></ChartAppearance><RefreshInterval>30</RefreshInterval><SpanSeconds>432060</SpanSeconds></Element>
</Elements></Workspace></Workspaces></Configuration>`;
  const r = importBruControl(xml, { names: 'skynet' });
  const ch = r.conv.elements.find(e => e.type === 'chart'), probe = r.conv.elements.find(e => e.type !== 'chart');
  assert.ok(ch, 'the Chart is a Chart Widget, not a Placeholder');
  assert.equal(ch.label, 'Conical 5 Day'); assert.match(ch.name, /^wgt_CHT_Conical~5~Day_/);
  assert.equal(ch.spanSeconds, 432060); assert.equal(ch.refreshInterval, 30); assert.equal(ch.hGridLines, 2); assert.equal(ch.xAxisColor, '#F00000');
  assert.equal(ch.ch1Element, probe.name, 'the channel names the item by its Skynet name');
  assert.equal(ch.ch1AutoScale, false); assert.equal(ch.ch1YMin, 30); assert.equal(ch.ch1YMax, 70); assert.equal(ch.ch1LineColor, '#00B050');
  assert.equal(ch.ch2Element, undefined); assert.equal(ch.ch2AutoScale, true);
  assert.deepEqual(probe.database, { frequency: 'seconds', every: 30 }, 'its item is sent to the database every Refresh interval');
  assert.equal(r.report.charts, 1); assert.ok(!r.report.byKind.Chart);
}
console.log('chart import tests passed');
