// Codes inside text (Fritz, 2026-10-21). They work in any text a Process shows: string values on Tabs, display names,
// print lines in the Process output, pop-ups (a manual valve's message) and text on a Tab.
//   \n     a new line
//   \b     bold on, the next \b turns it off
//   \L     large text on / off (the size is "Large text size" on the ☰ Menu Default tab)
//   \_     subscript on / off
//   \^     superscript on / off
//   \deg   a degree sign °
//   \\     one backslash
// Codes that are not on the list stay as they are typed. No imports, so node can load it too (tests).

const TOGGLE = { b: 'b', B: 'b', L: 'L', l: 'L', _: 'sub', '^': 'sup' };

// text -> [{ t, b, L, sub, sup }]: pieces of text with how each one looks
export function richRuns(text) {
  text = String(text ?? '');
  const out = [], st = { b: false, L: false, sub: false, sup: false };
  let cur = '';
  const flush = () => { if (cur) out.push({ t: cur, ...st }); cur = ''; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c !== '\\') { cur += c; continue; }
    const nx = text[i + 1];
    if (/^deg/i.test(text.slice(i + 1, i + 4))) { cur += '°'; i += 3; continue; }
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
    box.append(el);
  }
  node.replaceChildren(box);
}
