# ============================================
# INTERVIEWMATE AI - EYE CONTACT DETECTOR
# ============================================

import cv2
import numpy as np
import base64
from .gaze_tracker import GazeTracker
from .eye_contact_scorer import EyeContactScorer

class EyeContactDetector:
    def __init__(self):
        self.gaze_tracker = GazeTracker()
        self.scorer = EyeContactScorer()
    
    def analyze_image(self, image_data):
        try:
            # Decode image
            if isinstance(image_data, str) and image_data.startswith('data:image'):
                image_data = base64.b64decode(image_data.split(',')[1])
            
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return self._default_result()
            
            # Track gaze and score
            result = self.scorer.score_frame(img)
            
            return {
                'looking_at_camera': result['looking_at_camera'],
                'gaze_score': result['gaze_score'],
                'eye_contact_score': round(result['gaze_score'] * 100, 1),
                'eye_positions': result.get('eye_positions', [])
            }
            
        except Exception as e:
            print(f"Eye contact detection error: {e}")
            return self._default_result()
    
    def analyze_video_frame(self, frame):
        result = self.scorer.score_frame(frame)
        return {
            'looking_at_camera': result['looking_at_camera'],
            'gaze_score': result['gaze_score'],
            'eye_contact_score': round(result['gaze_score'] * 100, 1)
        }
    
    def get_session_score(self):
        return {
            'final_score': self.scorer.get_final_score(),
            'average_gaze': round(self.scorer.get_average_score(), 3),
            'looking_ratio': round(self.scorer.get_looking_ratio(), 3),
            'feedback': self.scorer.get_feedback()
        }
    
    def reset_session(self):
        self.scorer.reset()
    
    def _default_result(self):
        return {
            'looking_at_camera': False,
            'gaze_score': 0,
            'eye_contact_score': 0,
            'eye_positions': []
        }