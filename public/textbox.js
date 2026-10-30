// Text box attributes (Fritz, 2026-10-21). Every text box has the same attributes, and each one has a Default on the
// ☰ Menu > Default tab. The text boxes are: the Name and the Value of every Device and Widget, a Label, a Text added with
// "+ Text" in Edit layout, and the Label on vessels and other equipment.
//   .visible     true / false (shown or hidden)
//   .foreColor   the color of the text
//   .backColor   the color behind the text
//   .alignment   Left, Center or Right (word wrap and the text codes \b \L \n ... always work)
//   .width       .height        in pixels
//   .xPosition   .yPosition     in pixels from the left / top of the Tab
// A Process changes them while it runs (Text_1.visible = false, Pump_1.foreColor = "Red", Text_1.xPosition = 300);
// "" puts back what the item's properties say. The Defaults work in two ways:
//   colors, alignment and the name font: an item left on "Default" follows the Default tab, so changing it there changes them all
//   visible, word wrap, width, height and the X / Y position: copied into a new item when it is made (like the Tab Background
//     Profile), so changing the Default later does not move or hide what is already on your Tabs
// No imports, so node can load it too (lib/store.js and the tests).

export const TB_ALIGNS = ['Left', 'Center', 'Right'];
// the attributes a Process can read and set (written in any capitals: Text_1.ForeColor is the same as Text_1.forecolor)
export const TB_ATTRS = ['visible', 'hidden', 'forecolor', 'backcolor', 'alignment', 'width', 'height', 'xposition', 'yposition'];
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
export function textDefaults(d = {}) {
  const px = (v, dflt) => +v > 0 ? +v : dflt;
  return {
    visible: d.textVisible !== false, wrap: d.textWrap !== false,
    foreColor: d.textForeColor || '', backColor: d.textBackColor || '', align: tbAlign(d.textAlign) || '',
    width: px(d.textWidth, 220), height: px(d.textHeight, 40),
    x: Number.isFinite(+d.textX) && d.textX !== '' && d.textX !== undefined ? Math.max(0, +d.textX) : 40,
    y: Number.isFinite(+d.textY) && d.textY !== '' && d.textY !== undefined ? Math.max(0, +d.textY) : 40,
    nameFont: d.nameFont || '', nameFontSize: px(d.nameFontSize, 0),
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
