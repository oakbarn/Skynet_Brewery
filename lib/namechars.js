// Device names can't have < > : " / \ | ? * in them (Fritz, 2026-10-29), the same as file names (public/names.js):
// safeName gives each one a ~ (Hot/Cold -> Hot~Cold), the same as a Suggested Device name does with its Label.
import { BAD_NAME_CHARS } from '../public/names.js';

const BAD_ALL = new RegExp(BAD_NAME_CHARS.source, 'g');
export const safeName = n => String(n ?? '').replace(BAD_ALL, '~');
