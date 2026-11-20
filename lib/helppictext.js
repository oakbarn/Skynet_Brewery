// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Words in a Help picture are real text, in the language picked for Help (Rule 7.25, OakBarn Brewery, 2026-11-20: "remove all text
// that is part of a graphic and add as text (maybe smaller and always translate because German, Danish, Norwegian, and Italian are
// coming"). A Help picture is a hand-made SVG whose words are <text>. Each language has its words in help/<lang>/_pictures.json,
// English text → its text in that language, the same way as the balloons (public/hoverhelp-fr.json). A word printed on a real item
// (a board's name, a pin name, a model) keeps its English as its "translation", so the list says plainly that it was looked at.
// A picture that is a drawing or a screenshot with its words taken out is an SVG with the picture inside (<image href="X.png">) and
// the words on top; a browser does not load another file from an SVG shown as a picture, so the Brain puts the picture inside it as
// it sends it.
import fs from 'node:fs';
import path from 'node:path';
import { langOf } from './help.js';

export const PICTURE_WORDS = '_pictures.json';
const TEXT = /(<(text|tspan)\b[^>]*>)([^<]+)(<)/g;
const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
const encode = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// every word (text) in a Help picture SVG, as it reads in English
export function pictureWords(svg) {
  const out = [];
  for (const m of String(svg).matchAll(TEXT)) { const t = decode(m[3]).trim(); if (t) out.push(t); }
  return out;
}

// a Help picture SVG in another language. A much longer text is drawn smaller so it fits where the English did
// (OakBarn Brewery: "maybe smaller"), never below 60 %.
export function translateSvg(svg, words) {
  if (!words) return svg;
  return String(svg).replace(TEXT, (all, open, tag, body, close) => {
    const en = decode(body).trim(), to = words[en];
    if (typeof to !== 'string' || !to || to === en) return all;
    const lead = body.match(/^\s*/)[0], tail = body.match(/\s*$/)[0];
    return smaller(open, en.length, to.length) + lead + encode(to) + tail + close;
  });
}
function smaller(open, enLen, toLen) {
  if (toLen <= enLen * 0.9 || enLen < 3) return open;
  const k = Math.max(0.6, Math.min(1, 0.88 * enLen / toLen));      // letters are not all as wide: a little to spare
  const own = open.match(/\sfont-size="([\d.]+)(px)?"/);
  if (own) return open.replace(own[0], ` font-size="${+(own[1] * k).toFixed(2)}"`);
  const st = open.match(/font-size:\s*([\d.]+)(px)?/);
  if (st) return open.replace(st[0], `font-size:${+(st[1] * k).toFixed(2)}px`);
  return open.replace(/\s*>$/, ` font-size="${+k.toFixed(2)}em">`);       // the size it takes from the group around it
}

// the pictures an SVG names next to itself (<image href="X.png">) put inside it, so a browser shows them
export function inlineImages(svg, dir) {
  return String(svg).replace(/(<image\b[^>]*?\b(?:xlink:)?href=")([^"]+)(")/g, (all, a, href, b) => {
    if (/^(data|https?):/i.test(href) || href.includes('..') || path.isAbsolute(href)) return all;
    const f = path.join(dir, href), ext = path.extname(f).slice(1).toLowerCase();
    const type = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml' }[ext];
    if (!type) return all;
    try { return a + `data:${type};base64,` + fs.readFileSync(f).toString('base64') + b; } catch { return all; }
  });
}

// the words of one language (cached until the file changes)
const cache = new Map();
export function pictureWordsFor(helpDir, lang) {
  lang = langOf(lang);                                               // only a Help language: never a path
  if (lang === 'en') return null;
  const f = path.join(helpDir, lang, PICTURE_WORDS);
  let st; try { st = fs.statSync(f); } catch { return null; }
  const c = cache.get(f);
  if (c && c.at === st.mtimeMs) return c.words;
  let words = null; try { words = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { }
  cache.set(f, { at: st.mtimeMs, words });
  return words;
}

// a Help picture SVG ready to send: its pictures inside, its words in the language picked
export function helpPictureSvg(file, helpDir, lang) {
  let svg = fs.readFileSync(file, 'utf8');
  if (/<image\b/.test(svg)) svg = inlineImages(svg, path.dirname(file));
  return translateSvg(svg, pictureWordsFor(helpDir, lang));
}
