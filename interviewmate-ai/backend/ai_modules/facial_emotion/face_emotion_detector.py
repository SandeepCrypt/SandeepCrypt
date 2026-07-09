# ============================================
# INTERVIEWMATE AI - FACE EMOTION DETECTOR
# ============================================

import cv2
import numpy as np
import base64
import random
from .face_preprocessor import FacePreprocessor
from .face_emotion_model import FaceEmotionModel
from .emotion_labels import EMOTION_LABELS, EMOTION_CONFIDENCE_MAP

class FaceEmotionDetector:
    def __init__(self, model_path=None):
        self.preprocessor = FacePreprocessor()
        self.model = FaceEmotionModel(model_path)
        self.emotion_labels = EMOTION_LABELS
        self.confidence_map = EMOTION_CONFIDENCE_MAP
    
    def detect_from_image(self, image_data):
        try:
            # Decode image
            if isinstance(image_data, str) and image_data.startswith('data:image'):
                image_data = base64.b64decode(image_data.split(',')[1])
            
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return self._default_result()
            
            # Detect faces
            faces = self.preprocessor.detect_faces(img)
            
            if len(faces) == 0:
                return self._default_result()
            
            # Get largest face
            largest_face = max(faces, key=lambda f: f[2] * f[3])
            x, y, w, h = largest_face
            
            # Extract and preprocess face
            face_roi = self.preprocessor.extract_face(img, largest_face)
            preprocessed = self.preprocessor.preprocess(face_roi)
            
            # Predict
            prediction = self.model.predict(preprocessed)[0]
            emotion_idx = np.argmax(prediction)
            emotion = self.emotion_labels[emotion_idx]
            confidence = float(prediction[emotion_idx])
            
            # Calculate confidence score
            confidence_score = self.confidence_map.get(emotion, 0.5) * confidence
            
            # Calculate face box percentages
            h_img, w_img = img.shape[:2]
            face_box = {
                'x': (x / w_img) * 100,
                'y': (y / h_img) * 100,
                'width': (w / w_img) * 100,
                'height': (h / h_img) * 100
            }
            
            # Full distribution
            distribution = {
                label: float(prediction[i]) 
                for i, label in enumerate(self.emotion_labels)
            }
            
            return {
                'emotion': emotion,
                'confidence': round(confidence_score, 3),
                'raw_confidence': round(confidence, 3),
                'face_box': face_box,
                'distribution': distribution,
                'faces_detected': len(faces)
            }
            
        except Exception as e:
            print(f"Face emotion detection error: {e}")
            return self._default_result()
    
    def detect_from_frame(self, frame):
        _, buffer = cv2.imencode('.jpg', frame)
        return self.detect_from_image(buffer.tobytes())
    
    def _default_result(self):
        return {
            'emotion': 'neutral',
            'confidence': 0.5,
            'raw_confidence': 0.5,
            'face_box': None,
            'distribution': {label: 1.0/7 for label in self.emotion_labels},
            'faces_detected': 0
        }