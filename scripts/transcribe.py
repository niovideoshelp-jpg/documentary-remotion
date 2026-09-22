import sys, json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / '.tools/python'))
from faster_whisper import WhisperModel
model = WhisperModel(r'C:\Users\ELCO\.cache\huggingface\hub\models--Systran--faster-whisper-small\snapshots\536b0662742c02347bc0e980a01041f333bce120', device='cpu', compute_type='int8', cpu_threads=6)
segments, info = model.transcribe(str(root / 'public/audio/intro.mp3'), beam_size=5, word_timestamps=True, vad_filter=True)
result = {'language': info.language, 'duration': info.duration, 'segments': []}
print('Language:', info.language, flush=True)
for s in segments:
    result['segments'].append({'start': s.start, 'end': s.end, 'text': s.text, 'words': [{'start': w.start, 'end': w.end, 'text': w.word} for w in s.words or []]})
    print(f'{s.start:.2f} - {s.end:.2f}: {s.text}', flush=True)
    (root / 'transcript.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
