#!/usr/bin/env python3
# Makes the Skynet sound effects in media/sounds/Skynet/Songs from plain math (sine waves, noise, envelopes), so they are
# Skynet's own work with no recording in them (MIT License, Copyright (c) OakBarn Brewery 2026). Each one replaces a
# copyrighted or unknown-source sound from the OakBarn BruControl media (docs/Media_Licenses.csv, Rule 9.12).
# Media is add-only (Rule 9.12): never re-make a file that has shipped; a changed sound gets a new name.
# Usage: python3 tools/make-skynet-sounds.py [out_folder]   (needs numpy and ffmpeg; writes 44.1 kHz mono MP3, 128 kbit/s)
import os, subprocess, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(2026)  # fixed seed: the same file every run


def t(sec):
    return np.arange(int(sec * SR)) / SR


def env(n, a=0.01, r=0.1):
    e = np.ones(n)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def put(buf, sig, at):
    i = int(at * SR)
    if i + len(sig) > len(buf): buf = np.concatenate([buf, np.zeros(i + len(sig) - len(buf))])
    buf[i:i + len(sig)] += sig
    return buf


def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); p = 0.0
    for i, v in enumerate(x): p = (1 - a) * v + a * p; y[i] = p
    return y


def hz(note):  # 'A4' -> 440
    names = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
    n, acc, octv = note[0], note[1:-1], int(note[-1])
    semi = names[n] + (1 if acc == '#' else -1 if acc == 'b' else 0) + 12 * (octv - 4)
    return 440 * 2 ** (semi / 12)


def bell(f, sec=3.0, amp=0.5):  # struck bell: inharmonic partials, each fading at its own rate
    x = t(sec); s = np.zeros_like(x)
    for ratio, a, d in [(0.5, 0.5, 1.2), (1, 1, 1.6), (1.19, 0.5, 2.2), (1.5, 0.35, 2.8), (2, 0.4, 3.5), (2.74, 0.25, 5), (3.76, 0.15, 7)]:
        s += a * np.sin(2 * np.pi * f * ratio * x) * np.exp(-d * x)
    return amp * s * env(len(x), 0.002, 0.05) / 3


def brass(f, sec, amp=0.4):  # brass-like tone: harmonics with a soft top, a little vibrato
    x = t(sec); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * x) * np.clip(x / 0.3, 0, 1)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR; s = np.zeros_like(x)
    for k in range(1, 12): s += np.sin(k * ph) / k ** 1.3
    return amp * s * env(len(x), 0.04, 0.08) / 2


def noise(sec):
    return rng.uniform(-1, 1, int(sec * SR))


def snare(amp=0.5, sec=0.12):
    n = noise(sec); x = t(sec)
    return amp * (0.8 * n * np.exp(-30 * x) + 0.4 * np.sin(2 * np.pi * 190 * x) * np.exp(-40 * x))


def tom(f, amp=0.6, sec=0.35):
    x = t(sec); ff = f * (1 + 0.5 * np.exp(-25 * x))
    return amp * np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-9 * x)


def cymbal(sec=1.8, amp=0.35):
    n = noise(sec); n = n - lowpass(n, 5000); x = t(sec)
    return amp * n * np.exp(-2.2 * x)


# ---- the sounds ------------------------------------------------------------------------------------------------------

def tower_chime():  # the Westminster Quarters tune (1793, public domain), on synthesized bells, then three hour strikes
    tune = ['G#4', 'F#4', 'E4', 'B3', 'E4', 'G#4', 'F#4', 'B3', 'E4', 'F#4', 'G#4', 'E4', 'G#4', 'E4', 'F#4', 'B3']
    buf = np.zeros(1); at = 0.2
    for i, n in enumerate(tune):
        buf = put(buf, bell(hz(n), 3.0, 0.45), at)
        at += 1.6 if i % 4 == 3 else 0.62
    at += 0.6
    for _ in range(3):
        buf = put(buf, bell(hz('E3'), 4.0, 0.7), at); at += 1.9
    return buf


def drum_roll_rimshot():  # snare roll that grows louder, then two toms and a cymbal
    buf = np.zeros(1); at = 0.05; n = 70
    for i in range(n):
        buf = put(buf, snare(0.12 + 0.5 * i / n), at); at += 0.036
    at += 0.15
    buf = put(buf, tom(150), at); buf = put(buf, tom(110), at + 0.22)
    buf = put(buf, cymbal(), at + 0.5); buf = put(buf, snare(0.5), at + 0.5)
    return buf


def fanfare():  # Skynet's own short fanfare in C (not taken from any piece)
    seq = [('C5', .16), ('E5', .16), ('G5', .16), ('E5', .16), ('G5', .16), ('C6', .55), ('A5', .2), ('B5', .2), ('C6', 1.4)]
    buf = np.zeros(1); at = 0.1
    for n, d in seq:
        buf = put(buf, brass(hz(n), d * 1.05), at); at += d
    end = at - 1.4
    for n in ['C4', 'G4', 'E5']: buf = put(buf, brass(hz(n), 1.4, 0.25), end)
    return buf


def trumpet_call():  # a bugle-style call on the natural notes only (C, G, C, E, G); Skynet's own order, not an army call
    seq = [('G4', .14), ('G4', .14), ('C5', .3), ('E5', .14), ('E5', .14), ('G5', .3), ('E5', .2), ('C5', .2), ('G5', 1.1)]
    buf = np.zeros(1); at = 0.1
    for n, d in seq:
        buf = put(buf, brass(hz(n), d * 0.95, 0.45), at); at += d + 0.03
    return buf


def flowing_water(sec=8.0):  # soft rushing noise with little bubbles
    base = lowpass(noise(sec), 900) * 0.6 + lowpass(noise(sec), 2500) * 0.15
    buf = base * env(len(base), 0.6, 0.8)
    for _ in range(int(sec * 18)):
        d = rng.uniform(0.02, 0.07); f0 = rng.uniform(350, 900); x = t(d)
        f = f0 * (1 + 2.5 * x / d); b = 0.12 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / d * 3)
        buf = put(buf, b * rng.uniform(0.3, 1), rng.uniform(0.3, sec - 0.5))
    return buf[:int(sec * SR)]


def siren(sec=7.0):  # wailing siren, then two horn blasts
    x = t(sec); f = 900 + 500 * np.sin(2 * np.pi * x / 3.2 - np.pi / 2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * 0.35 * env(len(x), 0.3, 0.6)
    buf = s
    for at in (sec - 2.2, sec - 1.2):
        hx = t(0.7); h = sum(np.sign(np.sin(2 * np.pi * fr * hx)) for fr in (220, 277)) * 0.12 * env(len(hx), 0.02, 0.1)
        buf = put(buf, lowpass(h, 2500), at)
    return buf


def alien_warning(sec=4.0):  # wobbly sine with vibrato that sweeps up and down, plus ring-like blips
    x = t(sec); f = 500 + 350 * np.sin(2 * np.pi * 0.6 * x) + 25 * np.sin(2 * np.pi * 7 * x)
    s = 0.45 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.2, 0.4)
    for i in range(6):
        bx = t(0.12); s = put(s, 0.25 * np.sin(2 * np.pi * 1400 * bx) * np.sin(2 * np.pi * 60 * bx) * env(len(bx), 0.005, 0.03), 0.4 + i * 0.6)
    return s


def news_bulletin():  # three rising beeps, twice: a news-flash style signal (plain tones)
    buf = np.zeros(1); at = 0.1
    for _ in range(2):
        for n in ['C5', 'E5', 'G5']:
            x = t(0.18); buf = put(buf, 0.4 * np.sin(2 * np.pi * hz(n) * x) * env(len(x), 0.005, 0.03), at); at += 0.22
        at += 0.4
    return buf


SOUNDS = {
    'Skynet_Tower_Chime': tower_chime,
    'Skynet_Drum_Roll_Rimshot': drum_roll_rimshot,
    'Skynet_Fanfare': fanfare,
    'Skynet_Trumpet_Call': trumpet_call,
    'Skynet_Flowing_Water': flowing_water,
    'Skynet_Siren': siren,
    'Skynet_Alien_Warning': alien_warning,
    'Skynet_News_Bulletin': news_bulletin,
}


def write_mp3(name, sig, out):
    sig = sig / max(1e-9, np.max(np.abs(sig))) * 0.89  # same peak level for every sound
    sig = np.concatenate([sig, np.zeros(int(0.15 * SR))])
    tmp = os.path.join(out, name + '.tmp.wav')
    with wave.open(tmp, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((sig * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-codec:a', 'libmp3lame', '-b:a', '128k', '-map_metadata', '-1',
                    '-metadata', 'artist=Skynet Brewery (OakBarn Brewery)', '-metadata', 'title=' + name.replace('_', ' '),
                    '-metadata', 'copyright=MIT License, Skynet own sound', '-fflags', '+bitexact', '-flags:a', '+bitexact',
                    os.path.join(out, name + '.mp3')], check=True)
    os.remove(tmp)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'media', 'sounds', 'Skynet', 'Songs')
    os.makedirs(out, exist_ok=True)
    for name, fn in SOUNDS.items():
        write_mp3(name, fn(), out); print(name + '.mp3')
