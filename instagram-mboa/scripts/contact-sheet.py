# Planche contact pour vérifier les slides d'un coup d'œil.
import sys, glob, os
from PIL import Image
src, out, cols, w = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
files = sorted(glob.glob(os.path.join(src, "*.png")))
ims = [Image.open(f).convert("RGB") for f in files]
h = int(ims[0].height * w / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w + (cols + 1) * 12, rows * h + (rows + 1) * 12), (40, 40, 40))
for i, im in enumerate(ims):
    r, c = divmod(i, cols)
    sheet.paste(im.resize((w, h), Image.LANCZOS), (12 + c * (w + 12), 12 + r * (h + 12)))
sheet.save(out)
