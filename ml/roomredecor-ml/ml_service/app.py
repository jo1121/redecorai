from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from datetime import datetime
import base64
import io
from PIL import Image
import json

app = Flask(__name__)
CORS(app, origins=["*"])

# Mock object detection model
class MockObjectDetector:
    def __init__(self):
        # Simulate loading a model
        self.model_loaded = True
        self.categories = {
            "furniture": ["chair", "table", "sofa", "bed", "desk", "bookshelf", "cabinet"],
            "electronics": ["tv", "laptop", "phone", "speaker", "lamp"],
            "decor": ["picture", "mirror", "vase", "artwork", "clock"],
            "lighting": ["lamp", "chandelier", "floor_lamp", "table_lamp"],
            "textiles": ["pillow", "blanket", "curtain", "rug", "cushion"],
            "plants": ["plant", "flower", "tree", "succulent"]
        }
    
    def detect(self, image_array):
        """Mock detection - replace with your actual model"""
        height, width = image_array.shape[:2]
        
        # Simulate detecting 1-4 objects
        num_objects = np.random.randint(1, 5)
        objects = []
        
        for i in range(num_objects):
            # Random category and object
            category = np.random.choice(list(self.categories.keys()))
            object_name = np.random.choice(self.categories[category])
            
            # Random bounding box
            x1 = np.random.randint(0, width // 2)
            y1 = np.random.randint(0, height // 2)
            x2 = np.random.randint(x1 + 50, width)
            y2 = np.random.randint(y1 + 50, height)
            
            obj = {
                "name": object_name,
                "category": category,
                "confidence": np.random.uniform(0.7, 0.99),
                "bbox": [x1, y1, x2, y2]
            }
            objects.append(obj)
        
        return objects

# Initialize detector
detector = MockObjectDetector()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "RedecoAI ML Service",
        "model_loaded": detector.model_loaded,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/detect', methods=['POST'])
def detect():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Read and process image
        image_bytes = file.read()
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Perform object detection
        detected_objects = detector.detect(img_array)
        
        result = {
            "success": True,
            "objects": detected_objects,
            "total_objects": len(detected_objects),
            "image_dimensions": {
                "width": image.width,
                "height": image.height
            },
            "processed_at": datetime.now().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": "Detection failed", "details": str(e)}), 500

@app.route('/categories', methods=['GET'])
def get_categories():
    return jsonify({
        "success": True,
        "categories": detector.categories
    })

if __name__ == '__main__':
    port = int(os.getenv('ML_SERVICE_PORT', 5001))
    print(f"Starting ML service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)