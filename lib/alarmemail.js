// Alarm Email Notification (OakBarn Brewery, 2026-11-09, Rule 7.17: "Alarm e mail notification could be built in but have user what
// e mail server on his computer he wants to use. The almost always default to the Microsoft internal server when I only use gmail").
// An Alarm with Email Notification on sends one email each time it goes off. It is sent through the mail server the user picked in
// Settings > Sending codes (Gmail, Outlook.com or any other, with an app password), never a built-in Microsoft one. Shared by the
// Brain (server.js) and the BruControl Importer (it keeps BruControl's EmailNotification switch).

// the addresses typed in "Email to" (comma, semicolon or space between them); none = every user with an email in My account
export function alarmRecipients(el, users = []) {
  const typed = String(el?.emailTo ?? '').split(/[,;\s]+/).map(s => s.trim()).filter(s => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s));
  if (typed.length) return [...new Set(typed)];
  return [...new Set(users.map(u => String(u.contact?.email ?? '').trim()).filter(Boolean))];
}
export const alarmSubject = (el, title = 'Skynet') => `${title} alarm: ${el.label || el.name}`;
export const alarmText = (el, when = new Date(), title = 'Skynet') =>
  `${el.label || el.name} went off at ${when.toLocaleString()}.\n\nSent by ${title} (Alarm Email Notification). Turn it off in the Alarm's Properties.`;

// Watches the store: an Alarm going from quiet to active with Email Notification on sends its email (at most once a minute per Alarm,
// so an Alarm a Process turns on and off fast does not flood the inbox). send(to, subject, text) returns a promise.
export function watchAlarmEmails(store, { send, users = () => [], title = () => 'Skynet', log = () => {}, now = () => Date.now() }) {
  const last = new Map();
  store.on('change', (name, prop, v) => {
    if (prop !== 'active' || v !== true) return;
    const el = store.get(name);
    if (el?.type !== 'alarm' || !(el.emailNotify === true || store.getProp(name, 'email') === true)) return;
    if (now() - (last.get(name) ?? -Infinity) < 60000) return;
    last.set(name, now());
    const to = alarmRecipients(el, users());
    if (!to.length) return log(`Alarm ${name}: Email Notification is on, but there is no address (type one in its Properties, or put one in My account)`);
    const t = title();
    for (const a of to) Promise.resolve().then(() => send(a, alarmSubject(el, t), alarmText(el, new Date(), t)))
      .then(() => log(`Alarm ${name}: email sent to ${a}`), e => log(`Alarm ${name}: the email to ${a} was not sent: ${e.message}`));
  });
}
