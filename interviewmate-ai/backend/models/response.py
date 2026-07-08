# ============================================
# INTERVIEWMATE AI - RESPONSE MODEL
# ============================================

from . import db

class Response(db.Model):
    __tablename__ = 'responses'
    
    response_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(db.Integer, db.ForeignKey('interview_sessions.session_id'), nullable=False)
    q_id = db.Column(db.Integer, db.ForeignKey('question_bank.q_id'), nullable=False)
    audio_path = db.Column(db.String(255))
    transcript = db.Column(db.Text)
    facial_emotion_data = db.Column(db.JSON)  # MongoDB reference or JSON
    speech_emotion_data = db.Column(db.JSON)
    answer_score = db.Column(db.Numeric(5, 2))
    star_compliance_score = db.Column(db.Numeric(5, 2))
    ai_feedback = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.response_id,
            'question': self.question.question_text if self.question else None,
            'transcript': self.transcript,
            'answerScore': float(self.answer_score) if self.answer_score else None,
            'starScore': float(self.star_compliance_score) if self.star_compliance_score else None,
            'feedback': self.ai_feedback
        }
    
    def __repr__(self):
        return f'<Response {self.response_id}>'