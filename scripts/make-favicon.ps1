# Prefer Python transparent favicon generation when available
$root = Join-Path $PSScriptRoot ".."
Push-Location $root
try {
  python -c @"
from PIL import Image

src = r'src/assets/g_emblem_only.png'
img = Image.open(src).convert('RGBA')
pixels = img.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r < 35 and g < 35 and b < 35:
            pixels[x, y] = (0, 0, 0, 0)

img.save(r'public/apple-touch-icon.png', 'PNG')
for size in (16, 32, 48):
    img.resize((size, size), Image.Resampling.LANCZOS).save(rf'public/favicon-{size}.png', 'PNG')
img.resize((32, 32), Image.Resampling.LANCZOS).save(r'public/favicon.png', 'PNG')
print('favicon ready (transparent)')
"@
} finally {
  Pop-Location
}
