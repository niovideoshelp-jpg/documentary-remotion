"""Paper textures for the v3 look (light enough to run locally).

gen/paper2.jpg      2048 tileable warm paper: mottling, fibres, fine grain
gen/sheet.jpg       1920x1080 multiply layer for paper grounds: crumple facets, two folds, stains, worn edges
gen/sheet-dark.jpg  same idea for the dark sheets (used with overlay blend)
gen/tape.jpg        512 masking-tape fibre texture
"""
import math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

GEN = os.path.join(os.path.dirname(__file__), "..", "remotion-app", "public", "gen")
rng = np.random.default_rng(21)


def noise(h, w, scale, seed, tile=False):
    r = np.random.default_rng(seed)
    sh, sw = max(2, h // scale), max(2, w // scale)
    small = r.random((sh, sw)).astype(np.float32)
    if tile:
        small = np.pad(small, ((0, 1), (0, 1)), mode="wrap")
        img = Image.fromarray((small * 255).astype(np.uint8)).resize((w + w // sw, h + h // sh), Image.BICUBIC)
        return np.asarray(img).astype(np.float32)[:h, :w] / 255.0
    return np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(np.float32) / 255.0


def fibres(h, w, n, seed, length=(6, 30), alpha=(30, 90)):
    r = np.random.default_rng(seed)
    im = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y = r.random() * w, r.random() * h
        a = r.random() * math.pi
        ln = length[0] + r.random() * (length[1] - length[0])
        pts = [(x, y)]
        for k in range(4):
            a += (r.random() - 0.5) * 0.6
            x += math.cos(a) * ln / 4
            y += math.sin(a) * ln / 4
            pts.append((x, y))
        d.line(pts, fill=int(alpha[0] + r.random() * (alpha[1] - alpha[0])), width=1)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(0.5))).astype(np.float32) / 255.0


def paper2():
    s = 2048
    v = np.zeros((s, s), np.float32)
    for sc, amp, seed in [(512, 0.5, 1), (128, 0.35, 2), (32, 0.25, 3), (8, 0.18, 4), (2, 0.14, 5)]:
        v += (noise(s, s, sc, seed, tile=True) - 0.5) * amp
    f = fibres(s, s, 5000, 9)
    f2 = fibres(s, s, 1500, 10, (20, 70), (10, 40))
    v = v - f * 0.35 + f2 * 0.2
    base = np.array([236, 227, 208], np.float32) / 255  # warm uncoated stock
    rgb = base[None, None, :] * (1 + v[..., None] * 0.16)
    rgb[..., 2] -= v * 0.02
    Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(os.path.join(GEN, "paper2.jpg"), quality=90)


def crumple(h, w, n, seed):
    r = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    out = np.zeros((h, w), np.float32)
    for _ in range(n):
        x0, y0 = r.random() * w, r.random() * h
        a = r.random() * math.pi
        nx, ny = -math.sin(a), math.cos(a)
        d = (xx - x0) * nx + (yy - y0) * ny
        width = 30 + r.random() * 180
        amp = 0.006 + r.random() * 0.014
        # along-line falloff: a crease is a local event, not a line across the sheet
        tx, ty = math.cos(a), math.sin(a)
        along = (xx - x0) * tx + (yy - y0) * ty
        span = 150 + r.random() * 500
        local = np.exp(-(along**2) / (2 * span**2))
        out += np.sign(d) * np.exp(-np.abs(d) / width) * amp * local
    return out


def sheet(dark=False):
    h, w = 1080, 1920
    v = np.ones((h, w), np.float32)
    v += crumple(h, w, 28, 31 if not dark else 32)
    # two folds (a sheet folded in thirds, opened)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    for fx in (w * 0.34, w * 0.67):
        d = xx - fx + (yy - h / 2) * 0.012
        v -= np.exp(-np.abs(d) / 2.2) * 0.12
        v += np.where(d > 0, np.exp(-d / 30) * 0.035, -np.exp(d / 30) * 0.02)
    # stains and foxing
    r = np.random.default_rng(40 if not dark else 41)
    st = np.zeros((h, w), np.float32)
    for _ in range(5):
        cx, cy, rad = r.random() * w, r.random() * h, 30 + r.random() * 160
        dist = np.hypot(xx - cx, yy - cy)
        ring = np.exp(-((dist - rad) ** 2) / (2 * (rad * 0.06) ** 2)) * 0.022
        blot = np.exp(-(dist**2) / (2 * (rad * 0.8) ** 2)) * 0.03
        st += ring * (r.random() > 0.7) + blot
    v -= st
    foxing = (noise(h, w, 3, 55) > 0.985).astype(np.float32)
    v -= np.asarray(Image.fromarray((foxing * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255 * 0.25
    # worn edges
    e = np.minimum(np.minimum(xx, w - xx), np.minimum(yy, h - yy))
    v -= np.exp(-e / 90) * 0.12 * (0.6 + noise(h, w, 40, 60) * 0.8)
    v += (noise(h, w, 200, 70) - 0.5) * 0.08
    v = np.clip(v, 0, 1)
    if dark:
        # overlay blend: 0.5 = neutral
        v = 0.5 + (v - 1) * 1.6 + (noise(h, w, 4, 80) - 0.5) * 0.06
        Image.fromarray((np.clip(v, 0, 1) * 255).astype(np.uint8)).save(os.path.join(GEN, "sheet-dark.jpg"), quality=90)
    else:
        rgb = np.stack([v, v * 0.985, v * 0.955], -1)
        Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(os.path.join(GEN, "sheet.jpg"), quality=90)


def tape():
    s = 512
    v = 0.92 + (noise(s, s, 64, 90, True) - 0.5) * 0.08 - fibres(s, s, 700, 91, (4, 18), (20, 60)) * 0.12
    # crepe ridges across the tape
    yy, xx = np.mgrid[0:s, 0:s].astype(np.float32)
    v += np.sin(xx / 3.1 + noise(s, s, 16, 92) * 6) * 0.012
    rgb = np.stack([v * 0.93, v * 0.88, v * 0.74], -1)
    Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(os.path.join(GEN, "tape.jpg"), quality=90)


if __name__ == "__main__":
    paper2()
    sheet(False)
    sheet(True)
    tape()
    print("ok")
