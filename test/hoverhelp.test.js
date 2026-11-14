// Rule 2.38 (Fritz, 2026-11-06): explanations live in hover help. Pure parts here (the hover was checked in a browser)
import assert from 'node:assert/strict';
import { helpOf, placeBubble, helpSnippet, HOVER_DELAY_MS, GAP, helpTarget, FIELD } from '../public/hoverhelp.js';

assert.equal(HOVER_DELAY_MS, 0, 'Fritz: help is always available instantly');
// data-help first; a tip label's old title moves to data-help so the browser's own tooltip does not show too
const attrs = { title: 'The board this Device is wired to.' };
const old = { dataset: {}, classList: { contains: c => c === 'tipLbl' }, getAttribute: k => attrs[k], removeAttribute: k => delete attrs[k] };
assert.equal(helpOf(old), 'The board this Device is wired to.');
assert.equal(old.dataset.help, 'The board this Device is wired to.'); assert.equal(attrs.title, undefined);
assert.equal(helpOf({ dataset: { help: 'Its size on the Tab.' } }), 'Its size on the Tab.');
assert.equal(helpOf({ dataset: {}, classList: { contains: () => false }, getAttribute: () => 'a button title' }), '', 'a plain title is left alone');
assert.equal(helpOf(null), '');
// under the name; above it when there is no room below; never off the screen
const view = { w: 800, h: 600 }, box = { w: 300, h: 80 };
assert.deepEqual(placeBubble({ left: 100, top: 100, bottom: 120 }, box, view), { left: 100, top: 120 + GAP });
assert.deepEqual(placeBubble({ left: 100, top: 560, bottom: 580 }, box, view), { left: 100, top: 560 - GAP - 80 });
assert.equal(placeBubble({ left: 700, top: 100, bottom: 120 }, box, view).left, 800 - 300 - 4);
// too tall for the window: cut to fit on the side with more room, with a scroll bar (OakBarn Brewery, 2026-11-14)
const tall = { w: 300, h: 900 };
assert.deepEqual(placeBubble({ left: 100, top: 100, bottom: 120 }, tall, view), { left: 100, top: 120 + GAP, maxH: 600 - 4 - 120 - GAP });
assert.deepEqual(placeBubble({ left: 100, top: 500, bottom: 520 }, tall, view), { left: 100, top: 4, maxH: 500 - GAP - 4 });
const mid = { w: 300, h: 450 };      // fits above, not below: above, whole, no scroll bar
assert.deepEqual(placeBubble({ left: 100, top: 500, bottom: 520 }, mid, view), { left: 100, top: 500 - GAP - 450 });
const huge = placeBubble({ left: 100, top: 5, bottom: 595 }, tall, view);      // the name fills the window: the whole window height
assert.deepEqual(huge, { left: 100, top: 4, maxH: 592 });
// a snippet of Help for a dialog's title (Fritz: "take a snippet of help and have it in the Hover Dialog")
const md = '# Value, Time and DateTime Widgets\n\nA **Value Widget** shows one [value](98-x) on a Tab.\nA tap sets it.\n\n## Properties\n\n- **The title line:** the lock.\n';
assert.equal(helpSnippet(md), 'A Value Widget shows one value on a Tab. A tap sets it.');
assert.equal(helpSnippet(md, 'Properties'), 'The title line: the lock.');
assert.ok(helpSnippet('# T\n\n' + 'word '.repeat(200)).length <= 322, 'kept short');
assert.equal(helpSnippet(''), '');
assert.equal(helpSnippet('# T\n\nTwo of them:\n\n| Widget | Shows |\n|---|---|\n| **Value** | a number |\n| **Time** | hh:mm |\n\nAdd one.'), 'Two of them: Value, Time.', 'a table after : gives its first column');
assert.equal(helpSnippet('# T\n\nThree Widgets (Skynet Rule 1.23, Fritz 2026-11-05):\n\n- a Value\n- a Time\n\nMore.'), 'Three Widgets: a Value, a Time.', 'a list after : comes along; Rule notes are left out');
assert.equal(helpSnippet('# T\n\n**Semi_Widgets_Devices** are a class.'), 'Semi_Widgets_Devices are a class.', 'underscores in names stay');
console.log('hoverhelp ok');
// a dropdown or a typing box never shows hover help over itself: it would cover its own list of choices (OakBarn Brewery, 2026-11-08)
{
  const fake = (isField, helpEl) => ({ closest: sel => sel === FIELD ? (isField ? {} : null) : helpEl });
  assert.equal(helpTarget(fake(true, { dataset: { help: 'x' } })), null, 'a select with help: none over it');
  const th = { dataset: { help: 'How the valve is built in' } };
  assert.equal(helpTarget(fake(false, th)), th, 'its column heading still has it');
  assert.ok(/select/.test(FIELD) && /textarea/.test(FIELD) && /checkbox/.test(FIELD), 'tick boxes keep theirs');
  console.log('hover help never covers a field: ok');
}
// a balloon with pictures and a bold heading (the Pump Label, 2026-11-11)
{
  const { helpNodes: hn } = await import('../public/hoverhelp.js');
  const mk = tag => ({ tag, className: '', textContent: '', alt: '', src: '' });
  const doc = { createElement: mk, createTextNode: t => ({ tag: '#text', textContent: t }) };
  const n = hn('⟪b:Label⟫Text one.\n\n⟪img:help_pictures/Red_Pump_Label.png⟫\n\nText two ⬢.', doc);
  if (n[0].tag !== 'b' || n[0].textContent !== 'Label') throw new Error('heading');
  const img = n.find(x => x.tag === 'img');
  if (!img || img.src !== '/media?path=' + encodeURIComponent('help_pictures/Red_Pump_Label.png')) throw new Error('picture');
  if (n.some(x => x.tag === '#text' && /^\n|\n$/.test(x.textContent) && n[n.indexOf(x) + 1]?.tag === 'img')) throw new Error('no empty line beside a picture');
  console.log('hover help pictures ok');
}
// hot spots (Rule 2.49, OakBarn Brewery 2026-11-11): words with their own Help page are links, longer words first, once per topic
{
  const { setHelpLinks, hotSpotParts } = await import('../public/hoverhelp.js');
  const { HOT_SPOTS } = await import('../public/helpmap.js');
  setHelpLinks(HOT_SPOTS, () => {});
  const p = hotSpotParts('The board this Device is wired to. Its Interface ID (BM) starts the name; another Interface ID is not linked again.');
  const links = p.filter(x => x.topic);
  assert.deepEqual(links.map(x => x.t), ['Interface ID'], 'Interface ID wins over Interface, and only once');
  assert.deepEqual(links[0].topic, ['interfaces', 'the-interface-id']);
  assert.equal(p.map(x => x.t).join(''), 'The board this Device is wired to. Its Interface ID (BM) starts the name; another Interface ID is not linked again.', 'the words never change');
  assert.equal(hotSpotParts('BM_8_HE_HLT~element_BH and HLT_Vessel.Label').filter(x => x.topic).length, 0, 'never inside a name');
  assert.deepEqual(hotSpotParts('Hysteresis holds the Setpoint.').filter(x => x.topic).map(x => x.t), ['Hysteresis', 'Setpoint']);
  setHelpLinks([], null);
  assert.equal(hotSpotParts('Interface ID').length, 1, 'no list (the BruControl Import): plain words');
  console.log('hover help hot spots ok');
}
