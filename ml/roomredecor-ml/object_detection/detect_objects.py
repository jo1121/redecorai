import torch

# Monkey-patch torch.load to disable weights_only safe-loading
_orig_torch_load = torch.load

def _patched_torch_load(f, *args, **kwargs):
    # Force weights_only=False and map_location='cpu'
    kwargs['weights_only'] = False
    kwargs.setdefault('map_location', 'cpu')
    return _orig_torch_load(f, *args, **kwargs)

torch.load = _patched_torch_load

from torch.serialization import add_safe_globals
from ultralytics.nn.tasks import SegmentationModel
from torch.nn.modules.container import Sequential
from ultralytics.nn.modules import Conv

# Allow torch to safely unpickle the required classes
add_safe_globals([SegmentationModel, Sequential, Conv])

from ultralytics import YOLO
from pathlib import Path
from PIL import Image


def detect_objects(image_path, output_dir):
    # Load the YOLOv8 segmentation model
    model = YOLO('yolov8x-seg.pt')
    
    # Run inference
    results = model(image_path)
    
    # Prepare the output path
    image_name = Path(image_path).stem
    ext = Path(image_path).suffix
    output_file = Path(output_dir) / f"{image_name}_detected{ext}"
    
    # Annotate the image: get plotted frame
    annotated = results[0].plot()
    
    # Save the annotated image
    Image.fromarray(annotated).save(str(output_file))
    
    return results[0]
