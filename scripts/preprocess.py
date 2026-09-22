"""Asset preprocessing, run on GitHub Actions (never on the edit notebook).

Outputs go to remotion-app/public/gen:
  cut/<key>.png      background removed (rembg), trimmed, max 2000 px
  sticker/<key>.png  same cutout on a rough, hand-cut paper border
  relief-europe.jpg  grey shaded relief in the project's Mercator frame (K=48 px/deg)
  relief-wide.jpg    same frame, wider extent at K/3
  paper.jpg          tileable paper grain
  grain-*.png        film/print grain frames (transparent)
  tear.png           torn paper sheet used by paper wipes
"""
import io, json, math, os, sys, urllib.request, zipfile
import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "remotion-app", "public")
GEN = os.path.join(PUB, "gen")
os.makedirs(os.path.join(GEN, "cut"), exist_ok=True)
os.makedirs(os.path.join(GEN, "sticker"), exist_ok=True)
Image.MAX_IMAGE_PIXELS = None
rng = np.random.default_rng(7)

# ---------------------------------------------------------------- projection
# Must match remotion-app/src/map/projection.ts
K = 48.0
LON0, LAT_TOP = -25.0, 66.0


def merc(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def inv_merc(y):
    return math.degrees(2 * math.atan(math.exp(y)) - math.pi / 2)


def to_xy(lon, lat):
    return (lon - LON0) * K, (merc(LAT_TOP) - merc(lat)) * K * 180 / math.pi


# --------------------------------------------------------------- utilities
def smooth_noise(h, w, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img).astype(np.float32) / 255.0


def fetch(url, dest):
    if os.path.exists(dest):
        return dest
    print("download", url, flush=True)
    req = urllib.request.Request(url, headers={"User-Agent": "documentary-remotion-ci/1.0"})
    with urllib.request.urlopen(req, timeout=600) as r, open(dest, "wb") as f:
        while True:
            b = r.read(1 << 20)
            if not b:
                break
            f.write(b)
    return dest


# ------------------------------------------------------------------ relief
def relief():
    out_e = os.path.join(GEN, "relief-europe.jpg")
    out_w = os.path.join(GEN, "relief-wide.jpg")
    if os.path.exists(out_e) and os.path.exists(out_w):
        return
    cache = os.path.join(ROOT, ".cache")
    os.makedirs(cache, exist_ok=True)
    z = fetch("https://naciscdn.org/naturalearth/10m/raster/GRAY_HR_SR.zip", os.path.join(cache, "gray.zip"))
    with zipfile.ZipFile(z) as zf:
        name = [n for n in zf.namelist() if n.lower().endswith(".tif")][0]
        src = Image.open(io.BytesIO(zf.read(name))).convert("L")
    src = np.asarray(src)
    H, W = src.shape
    ppd = W / 360.0
    print("relief source", W, H, flush=True)

    ref = {}

    def build(lon_a, lon_b, lat_a, lat_b, k_div, path):
        k = K / k_div
        x0, y0 = to_xy(lon_a, lat_b)
        x1, y1 = to_xy(lon_b, lat_a)
        w = int(round((x1 - x0) / k_div))
        h = int(round((y1 - y0) / k_div))
        xs = x0 + (np.arange(w) + 0.5) * k_div
        ys = y0 + (np.arange(h) + 0.5) * k_div
        lons = xs / K + LON0
        lats = np.array([inv_merc(merc(LAT_TOP) - y / (K * 180 / math.pi)) for y in ys])
        cols = np.clip(((lons + 180) * ppd).astype(np.int64), 0, W - 1)
        rows = np.clip(((90 - lats) * ppd).astype(np.int64), 0, H - 1)
        img = src[rows[:, None], cols[None, :]].astype(np.float32)
        # normalise: flat terrain -> ~0.82, ridges darker/lighter, gentle contrast
        # one reference level for every crop so the rasters match where they overlap
        m = ref.setdefault("m", float(np.median(img)))
        img = 0.82 + (img - m) / 255.0 * 1.35
        img = np.clip(img, 0.35, 1.0)
        Image.fromarray((img * 255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(2, 60, 2)).save(
            path, quality=86
        )
        meta = {"x": x0, "y": y0, "w": w * k_div, "h": h * k_div}
        print(path, w, h, meta, flush=True)
        return meta

    meta = {
        "wide": build(-25, 110, -12, 66, 3, out_w),
        "europe": build(-14, 42, 33, 62, 1, out_e),
    }
    with open(os.path.join(GEN, "relief.json"), "w") as f:
        json.dump(meta, f)


# ---------------------------------------------------------------- textures
def textures():
    p = os.path.join(GEN, "paper.jpg")
    if not os.path.exists(p):
        s = 1024
        base = np.full((s, s), 0.0, np.float32)
        for sc, amp, seed in [(256, 0.35, 1), (64, 0.3, 2), (16, 0.2, 3), (4, 0.15, 4), (1, 0.12, 5)]:
            base += (smooth_noise(s, s, sc, seed) - 0.5) * amp
        # fibres
        fib = Image.new("L", (s, s), 0)
        from PIL import ImageDraw

        d = ImageDraw.Draw(fib)
        for _ in range(900):
            x, y = rng.random(2) * s
            a = rng.random() * math.pi
            ln = 4 + rng.random() * 18
            d.line([(x, y), (x + math.cos(a) * ln, y + math.sin(a) * ln)], fill=int(40 + rng.random() * 60), width=1)
        fib = np.asarray(fib.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255.0
        v = 0.5 + base * 0.5 - fib * 0.25
        # make tileable by blending with rolled copy
        v = (v + np.roll(np.roll(v, s // 2, 0), s // 2, 1)) / 2
        rgb = np.stack([v * 0.1 + 0.9, v * 0.1 + 0.885, v * 0.1 + 0.85], -1)
        rgb = np.clip(rgb - (0.5 - v)[..., None] * 0.18, 0, 1)
        Image.fromarray((rgb * 255).astype(np.uint8)).save(p, quality=90)

    for i in range(4):
        g = os.path.join(GEN, f"grain-{i}.png")
        if os.path.exists(g):
            continue
        s = 960
        r = np.random.default_rng(100 + i)
        n = r.normal(0, 1, (s, s)).astype(np.float32)
        n = np.asarray(Image.fromarray(np.clip(n * 40 + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.55))).astype(np.float32)
        a = np.clip(np.abs(n - 128) * 1.9, 0, 255)
        light = (n > 128).astype(np.float32)
        rgba = np.zeros((s, s, 4), np.uint8)
        rgba[..., 0:3] = (light * 255)[..., None].astype(np.uint8)
        rgba[..., 3] = a.astype(np.uint8)
        Image.fromarray(rgba, "RGBA").save(g)

    t = os.path.join(GEN, "tear.png")
    if not os.path.exists(t):
        w, h = 2600, 1400
        paper = Image.open(p).convert("RGB").resize((1400, 1400))
        sheet = Image.new("RGB", (w, h))
        for x in range(0, w, 1400):
            sheet.paste(paper, (x, 0))
        # torn right edge: jagged profile with fibres
        prof = np.zeros(h)
        for sc, amp, seed in [(300, 28, 11), (60, 12, 12), (9, 5, 13), (2, 2.5, 14)]:
            prof += (smooth_noise(h, 1, sc, seed)[:, 0] - 0.5) * amp * 2
        edge = (w - 80 + prof).astype(int)
        alpha = np.zeros((h, w), np.uint8)
        for y in range(h):
            alpha[y, : edge[y]] = 255
        # lighter torn fibre band (paper core exposed)
        band = np.zeros((h, w), np.float32)
        for y in range(h):
            band[y, max(0, edge[y] - 10) : edge[y]] = 1
        arr = np.asarray(sheet).astype(np.float32)
        arr = arr * (1 - band[..., None] * 0.0) + band[..., None] * 18
        a = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8))
        out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")
        out.putalpha(a)
        out.save(t)


# ----------------------------------------------------------------- cutouts
CUTS = {
    # key: (source path relative to public, crop box fraction or None)
    "typhoon-pair": ("src-photos/typhoon-pair.jpg", (0.12, 0.30, 1.0, 0.92)),
    "typhoon-side": ("src-photos/typhoon-side.jpg", None),
    "typhoon-front": ("src-photos/typhoon-front.jpg", None),
    "typhoon-bear": ("src-photos/typhoon-bear.jpg", None),
    "typhoon-flight": ("photos/typhoon-flight.jpg", None),
    "rafale-m-flight": ("src-photos/rafale-m-flight.jpg", None),
    "rafale-vapor": ("src-photos/rafale-vapor.jpg", None),
    "rafale-croatia": ("src-photos/rafale-croatia.jpg", None),
    "rafale-india": ("src-photos/rafale-india.jpg", None),
    "rafale-taxi": ("photos/rafale-taxi.jpg", (0.0, 0.1, 1.0, 0.75)),
    "rafale-landing": ("photos/rafale-landing.jpg", None),
    "pilot": ("photos/rafale-pilot.jpg", (0.35, 0.0, 1.0, 1.0)),
    "crew": ("photos/crew.jpg", None),
    "captor": ("src-photos/captor.jpg", None),
    "rbe2": ("src-photos/rbe2.jpg", None),
    "exocet": ("src-photos/exocet.jpg", None),
    "meteor": ("src-photos/meteor.jpg", (0.0, 0.0, 1.0, 0.55)),
    "paveway": ("src-photos/typhoon-paveway.jpg", None),
}


def rough_border(alpha, px, seed):
    """Dilate alpha into a paper border with an irregular, hand-cut edge."""
    from scipy import ndimage

    a = alpha > 127
    dist = ndimage.distance_transform_edt(~a)
    h, w = a.shape
    wobble = (smooth_noise(h, w, 90, seed) - 0.5) * px * 0.9 + (smooth_noise(h, w, 14, seed + 1) - 0.5) * px * 0.35
    border = dist < (px + wobble)
    # fill small holes so the paper reads as one sheet
    border = ndimage.binary_closing(border, iterations=int(px * 0.8))
    border = ndimage.binary_fill_holes(border)
    return border


def cutouts():
    try:
        from rembg import remove, new_session
    except ImportError:
        print("rembg missing", file=sys.stderr)
        return
    session = new_session("isnet-general-use")
    meta_path = os.path.join(GEN, "cuts.json")
    meta = json.load(open(meta_path)) if os.path.exists(meta_path) else {}
    paper = Image.open(os.path.join(GEN, "paper.jpg")).convert("RGB")
    for i, (key, (rel, crop)) in enumerate(CUTS.items()):
        out_c = os.path.join(GEN, "cut", key + ".webp")
        out_s = os.path.join(GEN, "sticker", key + ".webp")
        src = os.path.join(PUB, rel)
        if os.path.exists(out_s) or not os.path.exists(src):
            if not os.path.exists(src):
                print("skip (missing)", rel)
            continue
        im = Image.open(src).convert("RGB")
        im = ImageOps.exif_transpose(im)
        if crop:
            W, H = im.size
            im = im.crop((int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H)))
        im.thumbnail((2400, 2400), Image.LANCZOS)
        cut = remove(im, session=session, post_process_mask=True)
        al = np.asarray(cut.getchannel("A"))
        # keep the main component(s): drop specks smaller than 0.5% of the largest
        from scipy import ndimage

        lab, n = ndimage.label(al > 127)
        if n > 1:
            sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
            keep = np.isin(lab, [j + 1 for j, s in enumerate(sizes) if s > sizes.max() * 0.005])
            al = np.where(keep, al, 0).astype(np.uint8)
            cut.putalpha(Image.fromarray(al))
        bbox = Image.fromarray(al).point(lambda v: 255 if v > 20 else 0).getbbox()
        if not bbox:
            print("empty cut", key)
            continue
        pad = 60
        W, H = cut.size
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(W, bbox[2] + pad), min(H, bbox[3] + pad))
        cut = cut.crop(bbox)
        # region of the (cropped) source photo covered by the final image, as fractions,
        # so the edit can lift a cutout exactly off its own photograph
        meta[key] = {
            "crop": list(crop) if crop else [0, 0, 1, 1],
            "region": [(bbox[0] - 40) / W, (bbox[1] - 40) / H, (bbox[2] + 40) / W, (bbox[3] + 40) / H],
        }
        json.dump(meta, open(meta_path, "w"), indent=1)
        # add transparent margin for the paper border
        m = 40
        canvas = Image.new("RGBA", (cut.width + 2 * m, cut.height + 2 * m), (0, 0, 0, 0))
        canvas.paste(cut, (m, m))
        cut = canvas
        cut.thumbnail((2000, 2000), Image.LANCZOS)
        cut.save(out_c, quality=90, method=5)
        al = np.asarray(cut.getchannel("A"))
        bpx = max(8, int(max(cut.size) * 0.011))
        border = rough_border(al, bpx, 40 + i)
        pap = paper.resize(cut.size)
        pap_arr = np.asarray(pap).astype(np.float32)
        base = np.zeros((cut.height, cut.width, 4), np.uint8)
        base[..., :3] = np.clip(pap_arr * 1.02, 0, 255).astype(np.uint8)
        base[..., 3] = (border * 255).astype(np.uint8)
        sheet = Image.fromarray(base, "RGBA").filter(ImageFilter.GaussianBlur(0.5))
        sheet.alpha_composite(cut)
        sheet.save(out_s, quality=90, method=5)
        print("cut", key, cut.size, flush=True)


DOCS = {
    # real, public primary documents used as physical props in the collage
    "nao-typhoon": "https://www.nao.org.uk/wp-content/uploads/2011/03/1011755.pdf",
}


def docs():
    import fitz  # pymupdf

    os.makedirs(os.path.join(GEN, "doc"), exist_ok=True)
    cache = os.path.join(ROOT, ".cache")
    os.makedirs(cache, exist_ok=True)
    for key, url in DOCS.items():
        if os.path.exists(os.path.join(GEN, "doc", key + "-1.jpg")):
            continue
        try:
            pdf = fitz.open(fetch(url, os.path.join(cache, key + ".pdf")))
        except Exception as e:  # keep going: documents are optional props
            print("doc failed", key, e, flush=True)
            continue
        for i in range(min(3, pdf.page_count)):
            pix = pdf[i].get_pixmap(dpi=150)
            Image.frombytes("RGB", (pix.width, pix.height), pix.samples).save(
                os.path.join(GEN, "doc", f"{key}-{i + 1}.jpg"), quality=88
            )
        print("doc", key, pdf.page_count, flush=True)


if __name__ == "__main__":
    steps = sys.argv[1:] or ["textures", "docs", "relief", "cutouts"]
    for s in steps:
        globals()[s]()
