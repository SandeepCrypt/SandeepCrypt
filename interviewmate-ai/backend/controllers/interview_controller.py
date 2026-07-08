# ============================================
# INTERVIEWMATE AI - INTERVIEW CONTROLLER
# ============================================
from models import db, InterviewSession, Response, Question
from datetime import datetime
import os
import uuid

class InterviewController:
    """Handle interview session logic."""
    
    @staticmethod
    def create_session(user_id, config):
        """Create new interview session."""
        session = InterviewSession(
            user_id=user_id,
            category_id=config['categoryId'],
            company_id=config.get('companyId'),
            status='active'
        )
        db.session.add(session)
        db.session.commit()
        return session

    @staticmethod
    def save_response(session_id, question_id, data):
        """Save user response."""
        response = Response(
            session_id=session_id,
            q_id=question_id,
            audio_path=data.get('audio_path'),
            transcript=data.get('transcript'),
            facial_emotion_data=data.get('facial_emotions'),
            speech_emotion_data=data.get('speech_emotions'),
            answer_score=data.get('answer_score'),
            star_compliance_score=data.get('star_score'),
            ai_feedback=data.get('ai_feedback')
        )
        db.session.add(response)
        db.session.commit()
        return response

    @staticmethod
    def end_session(session_id):
        """End session and calculate duration."""
        session = InterviewSession.query.get(session_id)
        if session:
            session.status = 'completed'
            session.duration = int((datetime.utcnow() - session.date).total_seconds())
            db.session.commit()
        return session

    @staticmethod
    def abort_session(session_id):
        """Abort session."""
        session = InterviewSession.query.get(session_id)
        if session:
            session.status = 'aborted'
            db.session.commit()
        return session