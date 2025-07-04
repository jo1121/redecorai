from object_detection.detect_objects import detect_objects
from scene_layout.parse_layout import extract_layout_info
from rearrangement.generate_layouts import generate_rearranged_layouts
from image_synthesis.render_new_layouts import render_layout_on_image
from utils.io_utils import save_layout

from pathlib import Path
import sys

def main(image_path_str):
    image_path = Path(image_path_str)
    output_dir = Path("data/output_images")
    output_dir.mkdir(parents=True, exist_ok=True)

    print("[1] Running object detection...")
    results = detect_objects(str(image_path), output_dir)

    print("[2] Extracting layout info...")
    layout = extract_layout_info(results)
    save_layout(layout, "data/intermediate/layout.json")

    print("[3] Generating new arrangements...")
    new_layouts = generate_rearranged_layouts(layout, num_versions=4)

    print("[4] Rendering rearranged layouts...")
    render_layout_on_image(str(image_path), new_layouts, str(output_dir))
    print("✅ Done! Check data/output_images for results.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_pipeline.py <path_to_input_image>")
    else:
        main(sys.argv[1])
