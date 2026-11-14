// Text box attributes (Fritz, 2026-10-21). Every text box has the same attributes, and each one has a Default on the
// ☰ Menu > Default tab, in two parts since 2026-11-14: Labels (names) and Text Boxes (textDefaults below). The text boxes are: the Name and the Value of every Device and Widget, a Label, a Text added with
// "+ Text" in Edit layout, and the Label on vessels and other equipment.
//   .visible     true / false (shown or hidden)
//   .foreColor   the color of the text
//   .backColor   the color behind the text
//   .alignment   Left, Center or Right (word wrap and the text codes \b \L \n ... always work)
//   .width       .height        in pixels
//   .xPosition   .yPosition     in pixels from the left / top of the Tab
// A Process changes them while it runs (Text_1.visible = false, Pump_1.foreColor = "Red", Text_1.xPosition = 300);
// "" puts back what the item's properties say. The Defaults work in two ways:
//   colors, alignment and the fonts: an item left on "Default" follows the Default tab, so changing it there changes them all
//   visible, word wrap, width, height and the X / Y position: copied into a new item when it is made (like the Tab Background
//     Profile), so changing the Default later does not move or hide what is already on your Tabs
// No imports, so node can load it too (lib/store.js and the tests).

export const TB_ALIGNS = ['Left', 'Center', 'Right'];
// the attributes a Process can read and set (written in any capitals: Text_1.ForeColor is the same as Text_1.forecolor)
export const TB_ATTRS = ['visible', 'hidden', 'forecolor', 'backcolor', 'alignment', 'width', 'height', 'xposition', 'yposition', 'layer'];     // .layer: Layer Order (Rule 1.29)
// fonts every computer and phone has (or a close match): [CSS font, name in the list]
export const FONTS = [['', 'Default'], ['system-ui, sans-serif', 'System (the panel\'s normal font)'], ['Arial, Helvetica, sans-serif', 'Arial'],
  ['Verdana, Geneva, sans-serif', 'Verdana'], ['Tahoma, Verdana, sans-serif', 'Tahoma'], ['"Trebuchet MS", sans-serif', 'Trebuchet MS'],
  ['Georgia, serif', 'Georgia'], ['"Times New Roman", Times, serif', 'Times New Roman'], ['"Courier New", Courier, monospace', 'Courier New'],
  ['Consolas, Menlo, monospace', 'Consolas (fixed width)'], ['"Comic Sans MS", "Comic Sans", cursive', 'Comic Sans MS'], ['Impact, "Arial Black", sans-serif', 'Impact']];

// "left justified", "Centered", "centre" ... -> Left / Center / Right; '' stays '' (back to its properties); anything else null
export function tbAlign(v) {
  const t = String(v ?? '').trim().toLowerCase().replace(/\s*justified$/, '');
  if (!t) return '';
  if (t === 'left') return 'Left';
  if (['center', 'centre', 'centered', 'centred', 'middle'].includes(t)) return 'Center';
  if (t === 'right') return 'Right';
  return null;
}
// a number of pixels from a Process ('' = back to its properties); null when it is not a number
export function tbPixels(v) {
  const t = String(v ?? '').trim();
  if (t === '') return '';
  const n = Number(t);
  return Number.isFinite(n) ? Math.round(n) : null;
}

// the Default tab's settings for text boxes, with the panel's own values where nothing is set
// What a fresh install starts with (OakBarn Brewery, 2026-11-14, Default tab markup: "In Fresh Installs set to"). Labels are the
// names and Labels of Devices and Widgets and the Label on vessels; Text Boxes are a Text, a Label Widget and the Value of a Device
// or Widget. A box never set (undefined) gets these; "Default" picked ('') follows the Tab Style, then the panel's normal look.
// Font: '' = the Tab's font (its Tab Style's), then the panel's normal font (OakBarn Brewery picked "the Tab's font first").
export const FRESH_LABEL = { visible: true, fore: '#fafafa', back: '#000000', align: 'Center', bold: false, font: '', size: 11 };
export const FRESH_TEXT = { fore: '#fafafa', back: '#000000', align: 'Center', font: '', size: 11, width: 520, height: 140, wrap: true };
export function textDefaults(d = {}) {
  const px = (v, dflt) => +v > 0 ? +v : dflt, set = (v, dflt) => v === undefined || v === null ? dflt : v;
  const own = (v, fresh) => v === undefined || v === null || String(v).toLowerCase() === fresh ? '' : v;
  return {
    // Labels
    visible: set(d.labelVisible, FRESH_LABEL.visible) !== false,
    labelFore: set(d.labelForeColor, FRESH_LABEL.fore), labelBack: set(d.labelBackColor, FRESH_LABEL.back),
    labelAlign: tbAlign(set(d.labelAlign, FRESH_LABEL.align)) || '', labelBold: set(d.labelBold, FRESH_LABEL.bold) === true,
    labelFont: set(d.labelFont, FRESH_LABEL.font), labelFontSize: px(set(d.labelFontSize, FRESH_LABEL.size), 0),
    // Text Boxes
    foreColor: set(d.textForeColor, FRESH_TEXT.fore), backColor: set(d.textBackColor, FRESH_TEXT.back),
    align: tbAlign(set(d.textAlign, FRESH_TEXT.align)) || '', font: set(d.textFont, FRESH_TEXT.font), fontSize: px(set(d.textFontSize, FRESH_TEXT.size), 0),
    width: px(d.textWidth, FRESH_TEXT.width), height: px(d.textHeight, FRESH_TEXT.height), wrap: set(d.textWrap, FRESH_TEXT.wrap) !== false,
    // the Value of a Device or Widget follows the Text Box colors only once they are changed from the fresh install's (its Black
    // would put a box behind every value on its picture)
    valueFore: own(d.textForeColor, FRESH_TEXT.fore), valueBack: own(d.textBackColor, FRESH_TEXT.back),
    x: 40, y: 40,          // where a new text box starts; on the Build Tab it goes to the center (centerNew in app.js)
  };
}

// the first one that is set: what a Process set, then the item's own setting, then the Default ('' = the panel's normal look)
export const firstSet = (...vals) => vals.find(v => v !== undefined && v !== null && v !== '') ?? '';

// where an item sits and how big it is, after a Process moved or resized it (v = its live values)
export function placeWith(g, v = {}) {
  const n = k => v[k] === undefined || v[k] === null || v[k] === '' ? undefined : +v[k];
  const o = { x: n('xposition') ?? g.x, y: n('yposition') ?? g.y, w: n('width') ?? g.w, h: n('height') ?? g.h };
  return o.x === g.x && o.y === g.y && o.w === g.w && o.h === g.h ? g : { ...g, ...o };
}

// A font from a Process: its name in the list ("Arial", "courier new") or its CSS; '' = back to its properties; null = not a font
export function tbFont(v) {
  const t = String(v ?? '').trim().toLowerCase();
  if (!t) return '';
  const hit = FONTS.find(([css, n]) => css && (n.toLowerCase() === t || n.toLowerCase().replace(/\s*\(.*\)$/, '') === t || css.toLowerCase() === t));
  return hit ? hit[1].replace(/\s*\(.*\)$/, '') : t === 'default' ? '' : null;
}
// the CSS of a font name from tbFont (or a CSS font from Properties)
export const tbFontCss = n => FONTS.find(([css, x]) => css && (x.replace(/\s*\(.*\)$/, '') === n || css === n))?.[0] ?? '';
