// One look for the buttons of every dialog (Fritz, 2026-10-27): each button has an icon AND its word, so it reads at a
// glance on a phone and is still clear to someone who does not know the icons.
//   ✖ Cancel  closes without saving anything        💾 Save   saves and closes
//   ✖ Close   closes a box that has nothing to save   🗑 Delete  deletes (it always asks first)
//   ✔ OK      closes a message after you have read it
// Buttons are written with the plain word; this adds the icon wherever such a button appears, now or later.
export const BUTTON_ICONS = { Cancel: '✖', Close: '✖', Save: '💾', Delete: '🗑', OK: '✔' };

function decorate(b) {
  if (b.childElementCount) return;               // a button with its own markup keeps it
  const t = b.textContent.trim(), icon = BUTTON_ICONS[t];
  if (icon) b.textContent = `${icon} ${t}`;
}
export function decorateButtons(root = document.body) {
  if (root.matches?.('button')) decorate(root);
  for (const b of root.querySelectorAll?.('button') ?? []) decorate(b);
}
export function watchButtons(root = document.body) {
  decorateButtons(root);
  new MutationObserver(list => {
    for (const m of list) {
      if (m.type === 'characterData') { const b = m.target.parentElement?.closest('button'); if (b) decorate(b); continue; }
      if (m.target.nodeName === 'BUTTON') decorate(m.target);
      for (const n of m.addedNodes) if (n.nodeType === 1) decorateButtons(n);
    }
  }).observe(root, { childList: true, subtree: true, characterData: true });
}
