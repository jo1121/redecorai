import json

def save_layout(layout, filepath):
    with open(filepath, 'w') as f:
        json.dump(layout, f, indent=2)

def load_layout(filepath):
    with open(filepath, 'r') as f:
        return json.load(f)
