# ============================================
# INTERVIEWMATE AI - INTERVIEW SESSION MODEL
# ============================================

from . import db
from datetime import datetime

class InterviewSession(db.Model):
    __tablename__ = 'interview_sessions'
    
    session_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('job_categories.category_id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    duration = db.Column(db.Integer)  # total duration in seconds
    overall_score = db.Column(db.Numeric(5, 2))
    status = db.Column(db.Enum('active', 'completed', 'aborted', name='session_status_enum'), default='active')
    
    # Relationships
    responses = db.relationship('Response', backref='session', lazy='dynamic')
    report = db.relationship('ConfidenceReport', backref='session', uselist=False)
    
    def to_dict(self):
        return {
            'id': self.session_id,
            'date': self.date.isoformat() if self.date else None,
            'duration': self.duration,
            'score': float(self.overall_score) if self.overall_score else None,
            'status': self.status,
            'category': self.category.category_name if self.category else None,
            'company': self.company.company_name if self.company else None
        }
    
    def __repr__(self):
        return f'<InterviewSession {self.session_id}>'