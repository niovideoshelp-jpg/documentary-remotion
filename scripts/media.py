"""CI media helper (never on the edit machine).
Reads scripts/media.json:
  {"videos": {"key": "url", ...}, "clips": [{"key": "name", "src": "videokey", "start": s, "dur": d}]}
- every video gets a contact sheet (one frame every `every` seconds, timestamped) -> out/sheets/<key>-NN.jpg
- every clip is cut to 1920x1080/30p H.264, no audio -> out/clips/<name>.mp4
"""
import json, os, subprocess, urllib.request
cfg = json.load(open("scripts/media.json"))
os.makedirs("out/sheets", exist_ok=True); os.makedirs("out/clips", exist_ok=True); os.makedirs("/tmp/src", exist_ok=True)
def get(key, url):
    p = f"/tmp/src/{key}.webm"
    if not os.path.exists(p):
        req = urllib.request.Request(url, headers={"User-Agent": "documentary-remotion-ci/1.0 (contosdelivros01@gmail.com)"})
        with urllib.request.urlopen(req, timeout=900) as r, open(p, "wb") as f:
            while b := r.read(1 << 20): f.write(b)
    return p
def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode().strip())
every = cfg.get("every", 4)
for key, url in cfg.get("videos", {}).items():
    p = get(key, url)
    if not cfg.get("sheets", True): continue
    d = dur(p); per = 24
    n = int(d // every)
    for sheet in range(0, n, per):
        t0 = sheet * every
        vf = f"select='not(mod(n\,1))',fps=1/{every},scale=384:216,drawtext=text='%{{pts\:hms\:{t0}}}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=6x4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t0), "-t", str(per * every), "-i", p, "-vf", vf, "-frames:v", "1", f"out/sheets/{key}-{sheet // per:02d}.jpg"], check=False)
for c in cfg.get("clips", []):
    p = get(c["src"], cfg["videos"][c["src"]])
    vf = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30"
    if c.get("speed"): vf += f",setpts=PTS/{c['speed']}"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(c["start"]), "-t", str(c["dur"] * (c.get("speed") or 1)), "-i", p, "-an", "-vf", vf, "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", f"out/clips/{c['key']}.mp4"], check=True)
print("done")
