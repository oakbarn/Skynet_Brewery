// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// The safety buttons in the Help language (Rule 11.11 changed, OakBarn Brewery, 2026-11-20: "Maybe the skynet over ride and STop
// Button label translate", option A): the Override button and the Stop buttons show in the language picked in 🌐 Help language,
// so a brewer reads at once the button that stops or moves on a Process. Every other screen word stays English. A Label the user
// typed is the user's own and is never translated: only the Override button's own Label (Override) is.
// A new Help language (German, Danish, Norwegian, Italian) adds its words here.
import { balloonLang } from './hoverhelp.js';

export const SAFETY_WORDS = {
  fr: { Override: 'Passer', Stop: 'Arrêt', 'Stop all': 'Tout arrêter' },
};
// a safety button's word in the Help language picked (English when that language has none)
export const safetyWord = (en, lang = balloonLang()) => SAFETY_WORDS[lang]?.[en] ?? en;
