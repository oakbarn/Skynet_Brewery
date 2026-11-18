# Makes the 6 Skynet voice lines with Kokoro (Apache 2.0, runs offline, no account).
# Skynet ships the bm_george set (OakBarn Brewery picked it, 2026-11-18). Media is add-only (Rule 9.12): a remade line gets a new name.
# Usage: python tools/make-voice-lines.py MODEL_DIR OUT_DIR voice1 [voice2 ...]   e.g. af_heart bm_george bm_lewis
# Voices starting b (bf_/bm_) speak British English; a (af_/am_) American. Needs: pip install kokoro-onnx soundfile; ffmpeg.
# MODEL_DIR holds kokoro-v1.0.onnx and voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0).
import os, subprocess, sys
import soundfile as sf
from kokoro_onnx import Kokoro

LINES = {  # words from docs/Sound_Copyright_Check.md
    'Skynet_Voice_Self_Destruct': 'Warning. This brewery will self destruct in ten seconds. Just kidding. Please check the brew.',
    'Skynet_Voice_Onward': 'Brewers, onward! A new batch is waiting.',
    'Skynet_Voice_Not_Safe': 'Skynet says no. That step is not safe right now. Please check the brewery.',
    'Skynet_Voice_Off_To_Brew': 'Time to brew! Off to the brew house we go.',
    'Skynet_Voice_Brew_Day_Done': 'And that is the end of brew day. Cheers!',
    'Skynet_Voice_Interrupt': 'We interrupt this brew day for an important message from your brewery.',
}

model_dir, out_root, voices = sys.argv[1], sys.argv[2], sys.argv[3:]
k = Kokoro(os.path.join(model_dir, 'kokoro-v1.0.onnx'), os.path.join(model_dir, 'voices-v1.0.bin'))
for v in voices:
    lang = 'en-gb' if v.startswith('b') else 'en-us'
    out = os.path.join(out_root, v); os.makedirs(out, exist_ok=True)
    for name, text in LINES.items():
        audio, sr = k.create(text, voice=v, speed=1.0, lang=lang)
        wav = os.path.join(out, name + '.wav'); sf.write(wav, audio, sr)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '128k', '-map_metadata', '-1',
                        '-metadata', f'title={name.replace("_", " ")}', '-metadata', f'comment=Kokoro TTS (Apache 2.0), voice {v}',
                        os.path.join(out, name + '.mp3')], check=True)
        os.remove(wav); print(v, name)
