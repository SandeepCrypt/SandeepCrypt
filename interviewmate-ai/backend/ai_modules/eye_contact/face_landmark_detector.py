# ============================================
# INTERVIEWMATE AI - FACE LANDMARK DETECTOR
# ============================================

import cv2
import numpy as np

class FaceLandmarkDetector:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.eye_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_eye.xml'
        )
    
    def detect_face(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            return None
        
        # Return largest face
        return max(faces, key=lambda f: f[2] * f[3])
    
    def detect_eyes(self, face_image):
        gray = cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY) if len(face_image.shape) == 3 else face_image
        eyes = self.eye_cascade.detectMultiScale(gray, 1.1, 3)
        return eyes
    
    def get_face_landmarks(self, image):
        face = self.detect_face(image)
        if face is None:
            return None
        
        x, y, w, h = face
        face_roi = image[y:y+h, x:x+w]
        eyes = self.detect_eyes(face_roi)
        
        return {
            'face': {'x': x, 'y': y, 'width': w, 'height': h},
            'eyes': [{'x': ex, 'y': ey, 'width': ew, 'height': eh} for ex, ey, ew, eh in eyes]
        }
    
    def get_eye_centers(self, landmarks):
        if not landmarks or 'eyes' not in landmarks:
            return []
        
        face_x = landmarks['face']['x']
        face_y = landmarks['face']['y']
        
        centers = []
        for eye in landmarks['eyes']:
            cx = face_x + eye['x'] + eye['width'] // 2
            cy = face_y + eye['y'] + eye['height'] // 2
            centers.append((cx, cy))
        
        return centers