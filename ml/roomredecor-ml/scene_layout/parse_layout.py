def extract_layout_info(results):
    layout = []
    for box in results.boxes.data:
        x1, y1, x2, y2, conf, cls = box.tolist()
        layout.append({
            'bbox': [x1, y1, x2, y2],
            'class_id': int(cls),
            'confidence': conf
        })
    return layout
