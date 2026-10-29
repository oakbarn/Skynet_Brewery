// Codes inside text (Fritz, 2026-10-21). They work in any text a Process shows: string values on Tabs, Labels,
// print lines in the Process output, pop-ups (a manual valve's message) and text on a Tab.
//   \n     a new line
//   \b     bold on, the next \b turns it off
//   \L     large text on / off (the size is "Large text size" on the ☰ Menu Default tab)
//   \_     subscript on / off
//   \^     superscript on / off
//   \deg   a degree sign °
//   \F     degrees F (°F), \C degrees C (°C); capital letters only (Fritz, 2026-10-29)
//   \ohm   an Ohm sign Ω
//   \+-    a plus-minus sign ±
//   \t     an indent (4 spaces)
//   \i     italic on / off, \u underline on / off, \s strikethrough on / off, \S small text on / off
//   \c{Red}  text in a panel color name (or #hex) until the next \c (Fritz, 2026-10-29)
//   \\     one backslash
// Codes that are not on the list stay as they are typed. No imports, so node can load it too (tests).

const TOGGLE = { b: 'b', B: 'b', L: 'L', l: 'L', _: 'sub', '^': 'sup', i: 'i', u: 'u', s: 's', S: 'sm' };
const LOOKS = ['b', 'L', 'sub', 'sup', 'i', 'u', 's', 'sm'];

// the panel's color names (app.js puts Default and None in front of these for its color dropdowns)
export const NAMED_COLORS = [['Red', '#e74c3c'], ['Green', '#3fbf6a'], ['Blue', '#4fb3ff'], ['Yellow', '#f1c40f'], ['Orange', '#e8a33a'], ['Purple', '#a87ee8'],
  ['Copper', '#d98a4a'], ['Brown', '#8b5a2b'], ['Steel grey', '#8a8f96'], ['Light grey', '#c9ced3'], ['White', '#ffffff'], ['Black', '#000000']];
const key = n => n.toLowerCase().replace(/[^a-z]/g, '').replace('gray', 'grey');
const BY_NAME = Object.fromEntries(NAMED_COLORS.map(([n, c]) => [key(n), c]));
// a color name or #hex -> the color, or null when it is not one
export const textColor = n => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(n.trim()) ? n.trim() : BY_NAME[key(n)] || null;

// text -> [{ t, b, L, sub, sup, i, u, s, sm, color }]: pieces of text with how each one looks
export function richRuns(text) {
  text = String(text ?? '');
  const out = [], st = { ...Object.fromEntries(LOOKS.map(k => [k, false])), color: '' };
  let cur = '';
  const flush = () => { if (cur) out.push({ t: cur, ...st }); cur = ''; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c !== '\\') { cur += c; continue; }
    const nx = text[i + 1];
    if (/^deg/i.test(text.slice(i + 1, i + 4))) { cur += '°'; i += 3; continue; }
    if (/^ohm/i.test(text.slice(i + 1, i + 4))) { cur += 'Ω'; i += 3; continue; }
    if (nx === 'F' || nx === 'C') { cur += '°' + nx; i++; continue; }
    if (nx === '+' && text[i + 2] === '-') { cur += '±'; i += 2; continue; }
    if (nx === 't') { cur += '    '; i++; continue; }
    if (nx === 'c') {                                      // \c{Red} starts a color, a plain \c ends it
      const m = /^c\{([^}]*)\}/.exec(text.slice(i + 1));
      const col = m ? textColor(m[1]) : '';
      if (m && !col) { cur += c; continue; }               // not a color name: it stays as typed
      flush(); st.color = col; i += m ? m[0].length : 1; continue;
    }
    if (nx === 'n') { cur += '\n'; i++; continue; }
    if (nx === '\\') { cur += '\\'; i++; continue; }
    const k = TOGGLE[nx];
    if (!k) { cur += c; continue; }
    flush();
    st[k] = !st[k];
    if (k === 'sub' && st.sub) st.sup = false;            // a letter can't be both up and down
    if (k === 'sup' && st.sup) st.sub = false;
    i++;
  }
  flush();
  return out;
}

// the text without the look codes (\deg still gives °, \n a new line)
export const plainText = text => richRuns(text).map(r => r.t).join('');

// Puts text into a page element with its codes shown. All of it goes in one <span>, so a flex box sees one piece.
export function setRich(node, text) {
  text = String(text ?? '');
  if (!text.includes('\\')) { node.textContent = text; return; }
  const box = document.createElement('span');
  box.className = 'rt';
  for (const r of richRuns(text)) {
    let el = document.createElement(r.sub ? 'sub' : r.sup ? 'sup' : 'span');
    el.textContent = r.t;
    if (r.b) el.classList.add('rt-b');
    if (r.L) el.classList.add('rt-L');
    if (r.i) el.classList.add('rt-i');
    if (r.u) el.classList.add('rt-u');
    if (r.s) el.classList.add('rt-s');
    if (r.sm) el.classList.add('rt-S');
    if (r.color) el.style.color = r.color;
    box.append(el);
  }
  node.replaceChildren(box);
}
