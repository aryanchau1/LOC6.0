from flask import Flask, request, jsonify
from flask_cors import CORS 
import torch
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load YOLOv5 model
model_yolo = torch.hub.load('ultralytics/yolov5', 'yolov5s', force_reload=True, trust_repo=True)
object_classes = ['refrigerator', 'chair', 'bed', 'dining table', 'tv', 'bottle', 'sink', 'remote', 'bowl', 'cup', 'spoon', 'fork','wine glass','glass']
prob_threshold = 0.2

# Load messy/clean image classification model
MODEL_PATH_MESSY = 'messycleanmodel.h5'
MODEL_DAMAGE_DETECTION = 'DamageDetection.h5'
MODEL_STAIN_DETECTION = 'staindetection.h5'
model_messy = tf.keras.models.load_model(MODEL_PATH_MESSY)
model_damage = tf.keras.models.load_model(MODEL_DAMAGE_DETECTION)
model_stain = tf.keras.models.load_model(MODEL_STAIN_DETECTION)

def preprocess_image(img):
    img = img.resize((150, 150))  # Resize the image to match model's expected sizing
    img = np.array(img) / 255.0  # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img
def preprocess_image2(img):
    img = img.resize((120, 120))  # Resize the image to match model's expected sizing
    img = np.array(img) / 255.0  # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img
@app.route('/detect_objects', methods=['POST'])
def detect_objects():
    try:
        data = request.get_json()
        if 'imageUrl' not in data:
            return jsonify({'error': 'No file path provided'}), 400
        
        file_path = data['imageUrl']

        # Perform inference
        img = Image.open(f'../server/uploads/{file_path}')
        results = model_yolo(img)

        # Count the number of each type of object detected
        object_counts = {obj_class: 0 for obj_class in object_classes}

        for detection in results.pred[0]:
            prob = detection[4].item()  # Probability of detection
            if prob >= prob_threshold:
                obj_class = results.names[int(detection[-1])]
                if obj_class in object_classes:
                    object_counts[obj_class] += 1
        
        non_zero_counts = {obj_class: count for obj_class, count in object_counts.items() if count > 0}

        # Return the non-zero object counts as JSON response
        return jsonify(non_zero_counts)
    except Exception as e:
        print('Error during detection:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/messy_predict', methods=['POST'])
def predict_messy():
    data = request.get_json()
    if 'imageUrl' not in data:
        return jsonify({'error': 'No image URL provided'}), 400
    
    filename = data['imageUrl']
    
    try:
        # Process the image file using the filename
        img = Image.open(f'../server/uploads/{filename}')
        img_array = preprocess_image(img)
        prediction = model_messy.predict(img_array)
        messy = float(prediction[0][0]) 
        return jsonify({'result': messy})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/damage_detection',methods=['POST'])
def find_damage():
    data = request.get_json()
    if 'imageUrl' not in data:
        return jsonify({'error': 'No image URL provided'}), 400
    
    filename = data['imageUrl']
    try:
        # Process the image file using the filename
        img = Image.open(f'../server/uploads/{filename}')
        img_array = preprocess_image2(img)
        prediction1 = model_damage.predict(img_array)
        prediction2 = model_stain.predict(img_array)
        #damage = prediction1[0][0] 
        stain = float(prediction2[0][0])
        damage = float(prediction1[0][0])
        return jsonify({'result': {'stain': stain, 'damage': damage}})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)