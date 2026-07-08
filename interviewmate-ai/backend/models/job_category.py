# ============================================
# INTERVIEWMATE AI - JOB CATEGORY MODEL
# ============================================

from . import db

class JobCategory(db.Model):
    __tablename__ = 'job_categories'
    
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon_path = db.Column(db.String(255))
    
    # Relationships
    questions = db.relationship('Question', backref='category', lazy='dynamic')
    sessions = db.relationship('InterviewSession', backref='category', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.category_id,
            'name': self.category_name,
            'description': self.description,
            'icon': self.icon_path
        }
    
    def __repr__(self):
        return f'<JobCategory {self.category_name}>'