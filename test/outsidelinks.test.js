// Rule 11.10 (OakBarn Brewery, 2026-11-12): no outside links in Help unless OakBarn Brewery directs one; each is in docs/Outside_Links.md.
// A broken Help link opens nothing: the pop-up with Send (public/brokenlink.js).
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const list = fs.readFileSync(new URL('docs/Outside_Links.md', root), 'utf8');
const allowed = new Set([...list.matchAll(/^\| (https?:\/\/\S+) \|/gm)].map(m => m[1]));
const bad = [];
for (const f of fs.readdirSync(new URL('help/', root)).filter(f => f.endsWith('.md'))) {
  const text = fs.readFileSync(new URL('help/' + f, root), 'utf8');
  for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)|<(https?:\/\/[^>\s]+)>/g)) { const u = m[1] || m[2]; if (!allowed.has(u)) bad.push(`${f}: ${u}`); }
}
assert.deepEqual(bad, [], 'a web link in Help that OakBarn Brewery has not directed (add it to docs/Outside_Links.md only when he says)');
// the broken link check
const { topicProblem, helpIndex, SUPPORT_EMAIL } = await import('../public/brokenlink.js');
const idx = helpIndex([{ name: '76-interfaces', text: '# Interfaces\n\n## Ports (IO Pins)\n' }]);
assert.equal(topicProblem(idx, ['interfaces', 'ports-io-pins']), '');
assert.equal(topicProblem(idx, ['76-interfaces']), '');
assert.match(topicProblem(idx, ['nowhere']), /no Help page "nowhere"/);
assert.match(topicProblem(idx, ['interfaces', 'nope']), /has no part "nope"/);
assert.match(topicProblem(idx, []), /no Help page set/);
assert.equal(SUPPORT_EMAIL, 'support@oakbarnbrewery.com');
// every hot spot of the panel goes to a real page and part (else its click would show the pop-up)
const { HOT_SPOTS } = await import('../public/helpmap.js');
const all = fs.readdirSync(new URL('help/', root)).filter(f => f.endsWith('.md')).map(f => ({ name: f.replace(/\.md$/, ''), text: fs.readFileSync(new URL('help/' + f, root), 'utf8') }));
const full = helpIndex(all);
for (const [w, t] of HOT_SPOTS) assert.equal(topicProblem(full, t), '', w);
const app = fs.readFileSync(new URL('public/app.js', root), 'utf8'), srv = fs.readFileSync(new URL('server.js', root), 'utf8');
assert.match(app, /setHelpLinks\(HOT_SPOTS, topic => \{ if \(helpLinkOk\(topic, 'Hover Help'\)\) openHelp\(topic\); \}\)/, 'a hot spot is checked first');
assert.match(srv, /p === '\/ui\/brokenlink' && m === 'POST'/);
console.log('outside link tests passed');
