// One shared Skynet confirm box (Panel Updates entry 29, the last part; Rule 2.64): the big deletes and changes ask here, not in
// the browser's own OK / Cancel box, so the box looks and acts the same everywhere (Rule 2.44). Its buttons are in the upper right,
// as on every Skynet dialog (Rule 2.54): the action (for example 🗑 Delete), then Close and ✕. Close, ✕ and Esc change nothing.
// One box, one question: no second "Are you sure?" (one warning only). It is a modal dialog, so it is on top of everything
// (Rule 18.53). It needs nothing from app.js, so the Media page and the Help window use the same box.

// the question: the first paragraph is the heading, the rest is the text under it (the old messages are kept word for word)
export function splitAsk(msg) {
  const t = String(msg ?? '').trim(), i = t.indexOf('\n\n');
  return i < 0 ? { head: t, text: '' } : { head: t.slice(0, i).trim(), text: t.slice(i + 2).trim() };
}

const CLOSE_TIP = 'Close: nothing is changed.';
const GO_TIP = 'Do it now, as the box says.';

// Resolves true when the action button is pressed, false for Close, ✕ or Esc.
// ok: the action button's words; danger: red (a delete or a big change), else blue
export function skyConfirm(msg, { ok = 'OK', danger = true } = {}) {
  return new Promise(res => {
    const mk = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); e.append(...kids); return e; };
    const { head, text } = splitAsk(msg);
    const d = mk('dialog', { class: 'skyConfirm', 'data-nomenu': '' });
    const go = mk('button', { type: 'button', class: danger ? 'danger' : 'primary', title: GO_TIP }, ok);
    const close = mk('button', { type: 'button', title: CLOSE_TIP }, 'Close');
    const x = mk('button', { type: 'button', class: 'boxX', title: CLOSE_TIP, 'aria-label': 'Close' }, '✕');
    go.onclick = () => d.close('ok'); close.onclick = x.onclick = () => d.close('close');
    d.append(mk('div', { class: 'bar dlgBar' }, mk('h3', { class: 'skyAskHead' }, head), mk('span', { class: 'spacer' }), mk('span', { class: 'dlgBtnGroup' }, go, close, x)),
      ...(text ? [mk('div', { class: 'skyAskText' }, text)] : []));
    d.oncancel = ev => { ev.preventDefault(); d.close('close'); };
    d.onclose = () => { d.remove(); res(d.returnValue === 'ok'); };
    document.body.append(d); d.showModal(); close.focus();
  });
}
