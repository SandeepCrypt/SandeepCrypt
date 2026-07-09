# ============================================
# INTERVIEWMATE AI - FACE PREPROCESSOR
# ============================================

import cv2
import numpy as np

class FacePreprocessor:
    def __init__(self, target_size=(48, 48)):
        self.target_size = target_size
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
    
    def detect_faces(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        return faces
    
    def extract_face(self, image, face_box):
        x, y, w, h = face_box
        face = image[y:y+h, x:x+w]
        return face
    
    def preprocess(self, face_image):
        gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY) if len(face_image.shape) == 3 else face_image
        resized = cv2.resize(gray, self.target_size)
        normalized = resized.astype('float32') / 255.0
        return np.expand_dims(np.expand_dims(normalized, axis=0), axis=-1)
    
    def preprocess_batch(self, face_images):
        processed = []
        for img in face_images:
            processed.append(self.preprocess(img)[0])
        return np.array(processed)