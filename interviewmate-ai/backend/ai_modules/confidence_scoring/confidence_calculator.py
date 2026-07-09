# ============================================
# INTERVIEWMATE AI - CONFIDENCE CALCULATOR
# ============================================

from .score_aggregator import ScoreAggregator
from .score_normalizer import ScoreNormalizer
from .weight_config import get_weights

class ConfidenceCalculator:
    def __init__(self, experience_level='intermediate'):
        self.aggregator = ScoreAggregator(experience_level)
        self.normalizer = ScoreNormalizer()
        self.experience_level = experience_level
    
    def calculate(self, facial_score, speech_score, eye_contact_score,
                  answer_score, clarity_score, star_score):
        scores = {
            'facial_emotion': facial_score,
            'speech_emotion': speech_score,
            'eye_contact': eye_contact_score,
            'answer_quality': answer_score,
            'speech_clarity': clarity_score,
            'star_compliance': star_score
        }
        
        result = self.aggregator.aggregate_with_details(scores)
        
        weakest = self.aggregator.get_weakest_area(scores)
        strongest = self.aggregator.get_strongest_area(scores)
        
        result['weakest_area'] = weakest
        result['strongest_area'] = strongest
        result['experience_level'] = self.experience_level
        result['improvement_tips'] = self._generate_tips(scores, weakest)
        
        return result
    
    def calculate_from_session(self, session_data):
        scores = {
            'facial_emotion': session_data.get('facial_score', 50),
            'speech_emotion': session_data.get('speech_score', 50),
            'eye_contact': session_data.get('eye_contact_score', 50),
            'answer_quality': session_data.get('answer_score', 50),
            'speech_clarity': session_data.get('clarity_score', 50),
            'star_compliance': session_data.get('star_score', 50)
        }
        
        return self.calculate(**scores)
    
    def _generate_tips(self, scores, weakest):
        tips = []
        
        tip_templates = {
            'facial_emotion': {
                'title': 'Improve Facial Confidence',
                'description': 'Practice maintaining a calm, positive facial expression.',
                'actions': ['Practice smiling naturally', 'Record yourself and review', 'Take deep breaths']
            },
            'speech_emotion': {
                'title': 'Work on Vocal Confidence',
                'description': 'Your voice tone suggests uncertainty. Focus on speaking clearly.',
                'actions': ['Practice speaking louder', 'Record and listen to your voice', 'Work on vocal variety']
            },
            'eye_contact': {
                'title': 'Maintain Better Eye Contact',
                'description': 'Try to maintain consistent eye contact with the camera.',
                'actions': ['Position camera at eye level', 'Look at the camera, not the screen', 'Practice with video calls']
            },
            'answer_quality': {
                'title': 'Strengthen Your Answers',
                'description': 'Your answers need more depth and relevance.',
                'actions': ['Research common questions', 'Prepare specific examples', 'Practice with mock interviews']
            },
            'speech_clarity': {
                'title': 'Improve Speech Clarity',
                'description': 'Focus on speaking clearly and at an optimal pace.',
                'actions': ['Use the STAR method', 'Pause between sentences', 'Avoid filler words']
            },
            'star_compliance': {
                'title': 'Use STAR Method',
                'description': 'Structure your answers using Situation, Task, Action, Result.',
                'actions': ['Practice STAR format', 'Prepare stories in advance', 'Review STAR examples']
            }
        }
        
        if weakest and weakest in tip_templates:
            tips.append(tip_templates[weakest])
        
        for category, score in scores.items():
            if score < 60 and category != weakest and category in tip_templates:
                tips.append(tip_templates[category])
        
        return tips