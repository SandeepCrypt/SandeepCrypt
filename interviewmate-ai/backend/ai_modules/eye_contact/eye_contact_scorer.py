# ============================================
# INTERVIEWMATE AI - EYE CONTACT SCORER
# ============================================

from .gaze_tracker import GazeTracker
from collections import deque

class EyeContactScorer:
    def __init__(self, history_size=30):
        self.gaze_tracker = GazeTracker()
        self.history = deque(maxlen=history_size)
        self.history_size = history_size
    
    def score_frame(self, image):
        result = self.gaze_tracker.track_gaze(image)
        self.history.append(result)
        return result
    
    def get_average_score(self):
        if not self.history:
            return 0
        
        scores = [h['gaze_score'] for h in self.history]
        return sum(scores) / len(scores)
    
    def get_looking_ratio(self):
        if not self.history:
            return 0
        
        looking = sum(1 for h in self.history if h['looking_at_camera'])
        return looking / len(self.history)
    
    def get_final_score(self):
        avg_score = self.get_average_score()
        looking_ratio = self.get_looking_ratio()
        
        # Weighted combination
        final = (avg_score * 0.6 + looking_ratio * 0.4) * 100
        return round(final, 1)
    
    def get_feedback(self):
        score = self.get_final_score()
        
        if score >= 80:
            return "Excellent eye contact! You appear confident and engaged."
        elif score >= 60:
            return "Good eye contact. Try to maintain it more consistently."
        elif score >= 40:
            return "Fair eye contact. Practice looking at the camera more often."
        else:
            return "Poor eye contact. Position your camera at eye level and look directly at it."
    
    def reset(self):
        self.history.clear()