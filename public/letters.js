// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// A Label's letters made plain for a Name (OakBarn Brewery, 2026-11-20, option A: "ß=ss, æ=ae, ø=o"; Rule 3.4): an accent is
// dropped (é → e, ü → u, å → a), and the letters with no accent to drop are spelled the usual way, so a Name reads like its Label
// (Weiß Bier → Weiss~Bier, Mæsk → Maesk, Søl → Sol) instead of turning into ~, which stands for a space. Names already saved never change.
const SPELL = { ß: 'ss', ẞ: 'SS', æ: 'ae', Æ: 'AE', ø: 'o', Ø: 'O', œ: 'oe', Œ: 'OE', đ: 'd', Đ: 'D', ł: 'l', Ł: 'L', þ: 'th', Þ: 'Th', ð: 'd', Ð: 'D', ı: 'i' };
export const plainLetters = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[ßẞæÆøØœŒđĐłŁþÞðÐı]/g, c => SPELL[c]);
