// Process classes and scaffolding (step numbers).
//
// Every Process has a class:
//   flow    the brew itself, one Process starting the next (BruControl scr...)
//   looper  runs in the background on its own, never called (looper...)
//   sub     called by Flow Processes for jobs used in more than one place (sub...)
//   repeat  small common helpers, often a wait place in the calling Process (inscpt...)
// The class is guessed from the name and can be changed (config.processClasses).
//
// A line  step "Mash in"  marks a section. Saving renumbers every step in every Process:
// Flow Processes get 1, 2, 3 ... in the order they start each other, and their steps 1.00000, 1.00001 ...
// Subs, Repeats and Loopers count on their own: S1.00000, R1.00000, L1.00000.

export const CLASSES = {
  flow: { label: 'Flow', prefix: '', about: 'The brew itself: one Flow Process starts the next' },
  sub: { label: 'Sub', prefix: 'S', about: 'Called by Flow Processes for jobs used in more than one place' },
  repeat: { label: 'Repeat', prefix: 'R', about: 'Small common helpers, often a wait place in the calling Process' },
  looper: { label: 'Looper', prefix: 'L', about: 'Runs in the background on its own, never called' },
};

export function guessClass(name) {
  const n = String(name).toLowerCase();
  if (/^n?looper/.test(n)) return 'looper';
  if (/^inscpt/.test(n)) return 'repeat';
  if (/^x?scr/.test(n) || /flow/.test(n)) return 'flow';
  return 'sub';
}

export const classOf = (config, name) => {
  const c = config?.processClasses?.[name];
  return CLASSES[c] ? c : guessClass(name);
};

// step lines: indent, optional old number, the rest (the quoted name and any comment)
const STEP_LINE = /^(\s*)step(?=\s|$)(?!\s*(?:[-+*/]?=(?!=)|\.))(?:\s+[A-Za-z]?\d+\.\d+)?\s*(.*)$/i;
const START_LINE = /^\s*start\s+(?:"([^"]+)"|([A-Za-z_]\w*))\s*(?:\/\/.*)?$/i;

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

// Processes a Process starts, in the order they appear
export function startsIn(text) {
  const out = [];
  for (const l of text.split(/\r?\n/)) { const m = START_LINE.exec(l); if (m) out.push(m[1] ?? m[2]); }
  return out;
}

// Order of the Flow Processes: each first Flow Process (one no other Flow Process starts), then
// what it starts, depth first, in the order of its start lines. Flow Processes never reached come last.
export function flowOrder(texts, cls) {
  const flows = [...texts.keys()].filter(n => cls(n) === 'flow').sort(natural);
  const isFlow = new Set(flows);
  const kids = new Map(flows.map(n => [n, startsIn(texts.get(n)).filter(k => isFlow.has(k) && k !== n)]));
  const started = new Set([...kids.values()].flat());
  const order = [], seen = new Set();
  const visit = n => { if (seen.has(n)) return; seen.add(n); order.push(n); for (const k of kids.get(n)) visit(k); };
  for (const n of flows) if (!started.has(n)) visit(n);
  for (const n of flows) visit(n);                     // in a loop of starts, or never started
  return order;
}

// The number of every Process (major) for its class, e.g. { scrStart: '1', sub_Fill: 'S3' }
export function majors(texts, cls) {
  const out = new Map();
  flowOrder(texts, cls).forEach((n, i) => out.set(n, String(i + 1)));
  for (const c of ['sub', 'repeat', 'looper']) {
    [...texts.keys()].filter(n => cls(n) === c).sort(natural).forEach((n, i) => out.set(n, CLASSES[c].prefix + (i + 1)));
  }
  return out;
}

// texts: Map name -> text. Returns Map name -> new text, only for the Processes whose step numbers changed.
export function renumber(texts, cls) {
  const maj = majors(texts, cls), changed = new Map();
  for (const [name, text] of texts) {
    let minor = 0;
    const lines = text.split('\n');
    const out = lines.map(l => {
      const m = STEP_LINE.exec(l);
      if (!m) return l;
      const num = `${maj.get(name)}.${String(minor++).padStart(5, '0')}`;
      return `${m[1]}step ${num}${m[2] ? ' ' + m[2] : ''}`;
    });
    const t = out.join('\n');
    if (t !== text) changed.set(name, t);
  }
  return changed;
}

// "Add steps": a step at the start (after the opening comments) and after every [label] that has none
export function addSteps(text) {
  const lines = text.split('\n');
  const isStep = l => STEP_LINE.test(l ?? '');
  const nextCode = i => { while (i < lines.length && (!lines[i].trim() || lines[i].trim().startsWith('//'))) i++; return i; };
  const out = [];
  const first = nextCode(0);
  for (let i = 0; i < lines.length; i++) {
    if (i === first && !isStep(lines[i]) && !/^\s*\[.*\]\s*$/.test(lines[i])) out.push('step "Start"');
    out.push(lines[i]);
    const lab = /^\s*\[(.*)\]\s*$/.exec(lines[i]);
    if (lab && !isStep(lines[nextCode(i + 1)])) out.push(`step "${lab[1].trim().replace(/_+/g, ' ').replace(/"/g, "'")}"`);
  }
  if (first >= lines.length) out.push('step "Start"');
  return out.join('\n');
}
