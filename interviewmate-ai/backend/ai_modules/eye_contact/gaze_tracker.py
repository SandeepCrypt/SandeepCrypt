# ============================================
# INTERVIEWMATE AI - GAZE TRACKER
# ============================================

import cv2
import numpy as np
from .face_landmark_detector import FaceLandmarkDetector

class GazeTracker:
    def __init__(self):
        self.landmark_detector = FaceLandmarkDetector()
    
    def track_gaze(self, image):
        landmarks = self.landmark_detector.get_face_landmarks(image)
        
        if not landmarks:
            return {'looking_at_camera': False, 'gaze_score': 0, 'eye_positions': []}
        
        eye_centers = self.landmark_detector.get_eye_centers(landmarks)
        
        if len(eye_centers) < 2:
            return {'looking_at_camera': False, 'gaze_score': 0, 'eye_positions': eye_centers}
        
        face = landmarks['face']
        face_center_x = face['x'] + face['width'] // 2
        face_center_y = face['y'] + face['height'] // 2
        
        # Calculate average eye position
        avg_eye_x = sum(p[0] for p in eye_centers) / len(eye_centers)
        avg_eye_y = sum(p[1] for p in eye_centers) / len(eye_centers)
        
        # Calculate deviation from face center
        x_deviation = abs(avg_eye_x - face_center_x) / (face['width'] / 2)
        y_deviation = abs(avg_eye_y - face_center_y) / (face['height'] / 2)
        
        # Gaze score (1.0 = perfect center)
        gaze_score = max(0, 1 - (x_deviation + y_deviation) / 2)
        
        looking_at_camera = gaze_score > 0.6
        
        return {
            'looking_at_camera': looking_at_camera,
            'gaze_score': round(gaze_score, 3),
            'eye_positions': eye_centers,
            'deviation': {
                'x': round(x_deviation, 3),
                'y': round(y_deviation, 3)
            }
        }
    
    def track_gaze_from_bytes(self, image_bytes):
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {'looking_at_camera': False, 'gaze_score': 0, 'error': 'Invalid image'}
        
        return self.track_gaze(img)