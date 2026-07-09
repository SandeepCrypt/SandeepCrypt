# ============================================
# INTERVIEWMATE AI - REPORT SERVICE
# ============================================

from models import InterviewSession, Response, ConfidenceReport
from extensions import db
from datetime import datetime
import os

class ReportService:
    def __init__(self):
        self.report_folder = os.environ.get('REPORT_FOLDER', 'reports')
        os.makedirs(self.report_folder, exist_ok=True)
    
    def generate_report(self, session_id):
        session = InterviewSession.query.get(session_id)
        if not session:
            return None
        
        responses = Response.query.filter_by(session_id=session_id).all()
        
        if not responses:
            return None
        
        # Calculate scores
        facial_scores = []
        speech_scores = []
        answer_scores = []
        star_scores = []
        
        for response in responses:
            if response.facial_emotion_data:
                facial_scores.append(self._extract_emotion_score(response.facial_emotion_data))
            if response.speech_emotion_data:
                speech_scores.append(self._extract_emotion_score(response.speech_emotion_data))
            if response.answer_score:
                answer_scores.append(float(response.answer_score))
            if response.star_compliance_score:
                star_scores.append(float(response.star_compliance_score))
        
        avg_facial = sum(facial_scores) / len(facial_scores) if facial_scores else 50
        avg_speech = sum(speech_scores) / len(speech_scores) if speech_scores else 50
        avg_answer = sum(answer_scores) / len(answer_scores) if answer_scores else 50
        avg_star = sum(star_scores) / len(star_scores) if star_scores else 50
        
        clarity_score = avg_answer * 0.8 + 20
        eye_contact = 70
        
        weights = {
            'facial': 0.25, 'speech': 0.20, 'clarity': 0.15,
            'answer': 0.25, 'eye_contact': 0.15
        }
        
        overall = (
            avg_facial * weights['facial'] +
            avg_speech * weights['speech'] +
            clarity_score * weights['clarity'] +
            avg_answer * weights['answer'] +
            eye_contact * weights['eye_contact']
        )
        
        scores = {
            'Facial Expressions': avg_facial,
            'Speech Emotion': avg_speech,
            'Speech Clarity': clarity_score,
            'Answer Quality': avg_answer,
            'Eye Contact': eye_contact
        }
        
        weakest = min(scores, key=scores.get)
        strongest = max(scores, key=scores.get)
        
        tips = self._generate_tips(scores)
        timeline = self._create_timeline(responses)
        
        # Save report
        report = ConfidenceReport.query.filter_by(session_id=session_id).first()
        if not report:
            report = ConfidenceReport(session_id=session_id)
            db.session.add(report)
        
        report.facial_score = avg_facial
        report.speech_score = avg_speech
        report.clarity_score = clarity_score
        report.answer_score = avg_answer
        report.eye_contact_score = eye_contact
        report.overall_score = overall
        report.improvement_tips = tips
        report.emotion_timeline = timeline
        
        db.session.commit()
        
        return {
            'report_id': report.report_id,
            'facial_score': avg_facial,
            'speech_score': avg_speech,
            'clarity_score': clarity_score,
            'answer_score': avg_answer,
            'eye_contact_score': eye_contact,
            'overall_score': overall,
            'weakest_area': weakest,
            'strongest_area': strongest,
            'tips': tips,
            'timeline': timeline
        }
    
    def _extract_emotion_score(self, emotion_data):
        if isinstance(emotion_data, dict):
            return emotion_data.get('confidence', 0.5) * 100
        elif isinstance(emotion_data, list) and len(emotion_data) > 0:
            return emotion_data[0].get('confidence', 0.5) * 100
        return 50
    
    def _generate_tips(self, scores):
        tips = []
        if scores['Facial Expressions'] < 60:
            tips.append({
                'category': 'facial',
                'priority': 'high',
                'title': 'Improve Facial Confidence',
                'description': 'Practice maintaining a calm, positive expression.',
                'action_items': ['Practice in mirror', 'Record yourself', 'Take deep breaths']
            })
        if scores['Speech Emotion'] < 60:
            tips.append({
                'category': 'speech',
                'priority': 'high',
                'title': 'Work on Vocal Confidence',
                'description': 'Focus on speaking clearly and with conviction.',
                'action_items': ['Speak louder', 'Record your voice', 'Work on vocal variety']
            })
        if scores['Answer Quality'] < 60:
            tips.append({
                'category': 'answer',
                'priority': 'high',
                'title': 'Strengthen Your Answers',
                'description': 'Add more depth and relevance to your responses.',
                'action_items': ['Research questions', 'Prepare examples', 'Practice mock interviews']
            })
        return tips
    
    def _create_timeline(self, responses):
        timeline = []
        for i, response in enumerate(responses):
            if response.facial_emotion_data:
                timeline.append({
                    'timestamp': i * 30,
                    'emotion': 'neutral',
                    'confidence': 0.5,
                    'type': 'facial'
                })
        return timeline
    
    def get_score_breakdown(self, session_id):
        report = ConfidenceReport.query.filter_by(session_id=session_id).first()
        if not report:
            return {}
        
        return {
            'facial': {'score': float(report.facial_score) or 0, 'weight': 0.25},
            'speech': {'score': float(report.speech_score) or 0, 'weight': 0.20},
            'clarity': {'score': float(report.clarity_score) or 0, 'weight': 0.15},
            'answer': {'score': float(report.answer_score) or 0, 'weight': 0.25},
            'eye_contact': {'score': float(report.eye_contact_score) or 0, 'weight': 0.15},
            'overall': float(report.overall_score) or 0
        }
    
    def get_emotion_timeline(self, session_id):
        report = ConfidenceReport.query.filter_by(session_id=session_id).first()
        return report.emotion_timeline if report else []
    
    def generate_improvement_tips(self, session_id):
        report = ConfidenceReport.query.filter_by(session_id=session_id).first()
        return report.improvement_tips if report else []
    
    def compare_sessions(self, session_ids):
        reports = ConfidenceReport.query.filter(
            ConfidenceReport.session_id.in_(session_ids)
        ).all()
        
        if not reports:
            return {}
        
        comparison = {'sessions': [], 'improvements': {}, 'averages': {}}
        
        for report in reports:
            session = InterviewSession.query.get(report.session_id)
            comparison['sessions'].append({
                'session_id': report.session_id,
                'date': session.created_at.isoformat() if session else None,
                'overall_score': float(report.overall_score) or 0,
                'facial_score': float(report.facial_score) or 0,
                'speech_score': float(report.speech_score) or 0,
                'answer_score': float(report.answer_score) or 0
            })
        
        if len(comparison['sessions']) >= 2:
            first = comparison['sessions'][0]
            last = comparison['sessions'][-1]
            comparison['improvements'] = {
                'overall': round(last['overall_score'] - first['overall_score'], 2),
                'facial': round(last['facial_score'] - first['facial_score'], 2),
                'speech': round(last['speech_score'] - first['speech_score'], 2),
                'answer': round(last['answer_score'] - first['answer_score'], 2)
            }
        
        return comparison