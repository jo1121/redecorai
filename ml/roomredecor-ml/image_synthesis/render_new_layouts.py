from PIL import Image, ImageDraw
import os

def render_layout_on_image(image_path, layouts, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    original = Image.open(image_path).convert("RGB")
    for idx, layout in enumerate(layouts):
        img = original.copy()
        draw = ImageDraw.Draw(img)
        for obj in layout:
            draw.rectangle(obj['bbox'], outline='red', width=3)
        img.save(os.path.join(output_dir, f"layout_{idx+1}.jpg"))
