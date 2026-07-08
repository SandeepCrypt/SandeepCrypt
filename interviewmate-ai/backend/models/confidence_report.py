# ============================================
# INTERVIEWMATE AI - CONFIDENCE REPORT MODEL
# ============================================

from . import db

class ConfidenceReport(db.Model):
    __tablename__ = 'confidence_reports'
    
    report_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    session_id = db.Column(db.Integer, db.ForeignKey('interview_sessions.session_id'), nullable=False)
    facial_score = db.Column(db.Numeric(5, 2))
    speech_score = db.Column(db.Numeric(5, 2))
    clarity_score = db.Column(db.Numeric(5, 2))
    answer_score = db.Column(db.Numeric(5, 2))
    eye_contact_score = db.Column(db.Numeric(5, 2))
    overall_score = db.Column(db.Numeric(5, 2), nullable=False)
    improvement_tips = db.Column(db.JSON)
    pdf_path = db.Column(db.String(255))
    
    def to_dict(self):
        return {
            'id': self.report_id,
            'facialScore': float(self.facial_score) if self.facial_score else 0,
            'speechScore': float(self.speech_score) if self.speech_score else 0,
            'clarityScore': float(self.clarity_score) if self.clarity_score else 0,
            'answerScore': float(self.answer_score) if self.answer_score else 0,
            'eyeContactScore': float(self.eye_contact_score) if self.eye_contact_score else 0,
            'overallScore': float(self.overall_score),
            'tips': self.improvement_tips,
            'pdfPath': self.pdf_path
        }
    
    def __repr__(self):
        return f'<ConfidenceReport {self.report_id}>'