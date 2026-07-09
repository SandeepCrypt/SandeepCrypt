# ============================================
# INTERVIEWMATE AI - CONFIDENCE SCORING SERVICE
# ============================================

from ai_modules.confidence_scoring.confidence_calculator import ConfidenceCalculator

class ConfidenceScoringService:
    def __init__(self):
        self.calculator = ConfidenceCalculator()
    
    def calculate_session_score(self, session_data):
        facial_score = session_data.get('facial_score', 50)
        speech_score = session_data.get('speech_score', 50)
        eye_contact_score = session_data.get('eye_contact_score', 50)
        answer_score = session_data.get('answer_score', 50)
        clarity_score = session_data.get('clarity_score', 50)
        star_score = session_data.get('star_score', 50)
        
        return self.calculator.calculate(
            facial_score, speech_score, eye_contact_score,
            answer_score, clarity_score, star_score
        )
    
    def calculate_from_responses(self, responses):
        if not responses:
            return self._default_score()
        
        facial_scores = []
        speech_scores = []
        answer_scores = []
        star_scores = []
        
        for response in responses:
            if response.facial_emotion_data:
                facial_scores.append(self._extract_score(response.facial_emotion_data))
            if response.speech_emotion_data:
                speech_scores.append(self._extract_score(response.speech_emotion_data))
            if response.answer_score:
                answer_scores.append(float(response.answer_score))
            if response.star_compliance_score:
                star_scores.append(float(response.star_compliance_score))
        
        avg_facial = sum(facial_scores) / len(facial_scores) if facial_scores else 50
        avg_speech = sum(speech_scores) / len(speech_scores) if speech_scores else 50
        avg_answer = sum(answer_scores) / len(answer_scores) if answer_scores else 50
        avg_star = sum(star_scores) / len(star_scores) if star_scores else 50
        
        return self.calculator.calculate(
            avg_facial * 100, avg_speech * 100, 70,
            avg_answer, avg_answer * 0.8 + 20, avg_star
        )
    
    def _extract_score(self, emotion_data):
        if isinstance(emotion_data, dict):
            return emotion_data.get('confidence', 0.5)
        return 0.5
    
    def _default_score(self):
        return {
            'overall_score': 50,
            'breakdown': {},
            'weakest_area': None,
            'strongest_area': None,
            'improvement_tips': []
        }