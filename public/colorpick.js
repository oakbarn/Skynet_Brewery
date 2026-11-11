// The Color Picker (OakBarn Brewery, 2026-11-11, Rule 2.48): every color slot on every dialog, in the Skynet Panel and in the
// BruControl Import (its Build page is the Panel's), picks a color of your own with the free Pickr color picker
// (@simonwep/pickr 1.9.1, MIT, public/vendor/pickr, listed in docs/Media_Licenses.csv). It gives the color as RGB (Red, Green,
// Blue, 0 to 255 each) and as a # code; the item saves the # code (#rrggbb) as before, so nothing saved before changes (Rule #1).
// No Pickr (the file did not load)? The browser's own color box opens instead, so a color can always be picked.

// '#rrggbb' -> [r, g, b], or null
export function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
// [r, g, b] -> '#rrggbb' (each number kept to 0 .. 255)
export function rgbToHex(rgb) {
  return '#' + rgb.slice(0, 3).map(v => Math.max(0, Math.min(255, Math.round(+v || 0))).toString(16).padStart(2, '0')).join('');
}
// the RGB words shown beside a color: 'RGB 250 250 250' (empty for Default, None or a name)
export function rgbText(hex) {
  const c = hexToRgb(hex);
  return c ? `RGB ${c.join(' ')}` : '';
}

const PICKR_TEXT = { 'btn:save': 'Save', 'btn:cancel': 'Cancel', 'aria:btn:save': 'Save this color', 'aria:btn:cancel': 'Cancel: keep the color it had',
  'aria:input': 'The color as RGB or a # code', 'aria:hue': 'Pick the color (hue)', 'aria:palette': 'Pick how light and how strong' };

// Opens the Color Picker under `anchor`, starting on `hex`. onChange(hex) runs while you pick (so the swatch follows),
// onSave(hex) on Save, onCancel() on Cancel, Escape or a click outside. cancelText renames Cancel (Pick Cover Color: ◀ Back).
// Only one picker is open at a time.
let open = null;
export function openColorPicker(anchor, hex, { onChange = () => {}, onSave = () => {}, onCancel = () => {}, cancelText = '' } = {}) {
  if (open) open.close(false);
  const start = hexToRgb(hex) ? hex : '#888888';
  const Pickr = typeof window !== 'undefined' ? window.Pickr : null;
  if (!Pickr) return nativePicker(anchor, start, { onChange, onSave, onCancel });
  const box = anchor.closest('dialog') || document.body;      // inside the open dialog, so it is on top and can be clicked
  let saved = false, cur = start;
  const p = Pickr.create({
    el: anchor, useAsButton: true, container: box, theme: 'classic', default: start, defaultRepresentation: 'RGBA',
    lockOpacity: true, comparison: true, position: 'bottom-start', closeOnScroll: false, autoReposition: true, i18n: { ...PICKR_TEXT, ...(cancelText ? { 'btn:cancel': cancelText } : {}) },
    components: { preview: true, opacity: false, hue: true, interaction: { hex: true, rgba: true, input: true, cancel: true, save: true } },
  });
  const hexOf = c => (c ? rgbToHex(c.toRGBA()) : cur);
  const close = keep => {
    if (open?.p !== p) return;
    open = null;
    if (!keep) onCancel();
    setTimeout(() => { try { p.destroyAndRemove(); } catch {} }, 0);
  };
  open = { p, close };
  p.on('init', () => {
    const app = p.getRoot().app;
    const rgb = app.querySelector('.pcr-type[data-type="RGBA"]'); if (rgb) rgb.value = 'RGB';      // no see-through here: plain RGB
    // Enter and Escape belong to the picker, not to the dialog behind it (Enter would Save the dialog, Escape would close it)
    app.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); } });
    p.show();
  });
  p.on('change', c => { cur = hexOf(c); onChange(cur); });
  p.on('save', c => { if (saved) return; saved = true; cur = hexOf(c); onSave(cur); p.hide(); });
  p.on('cancel', () => p.hide());
  p.on('hide', () => close(saved));
  return { close: () => p.hide() };
}

// the browser's own color box, when Pickr is not there
function nativePicker(anchor, hex, { onChange, onSave, onCancel }) {
  const inp = document.createElement('input');
  inp.type = 'color'; inp.value = hex; inp.style.cssText = 'position:absolute;width:0;height:0;opacity:0;border:0;padding:0';
  anchor.after(inp);
  inp.oninput = () => onChange(inp.value);
  inp.onchange = () => { onSave(inp.value); inp.remove(); };
  inp.addEventListener('cancel', () => { onCancel(); inp.remove(); });
  inp.click();
  return { close: () => inp.remove() };
}

// the Color (RGB) box (OakBarn Brewery, 2026-11-11, his drawing): a color as three numbers, "250,250,250"
export function rgbNums(hex) {
  const c = hexToRgb(hex);
  return c ? c.join(',') : '';
}
// what was typed in the Color (RGB) box -> '#rrggbb', or null. "250,250,250", "250 250 250", "rgb(250, 250, 250)" or "#fafafa".
// Pure white (255,255,255) is Skynet White, 250,250,250 (Rule 2.7).
export function parseRgb(text) {
  const t = String(text ?? '').trim();
  let hex = null;
  if (/^#?[0-9a-f]{6}$/i.test(t)) hex = '#' + t.replace('#', '').toLowerCase();
  else {
    const n = t.replace(/^rgba?\(|\)$/gi, '').split(/[\s,;]+/).filter(Boolean);
    if (n.length === 3 && n.every(x => /^\d{1,3}$/.test(x) && +x <= 255)) hex = rgbToHex(n.map(Number));
  }
  return hex === '#ffffff' ? '#fafafa' : hex;
}
