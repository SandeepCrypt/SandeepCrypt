# ============================================
# INTERVIEWMATE AI - COMPANY MODEL
# ============================================

from . import db

class Company(db.Model):
    __tablename__ = 'companies'
    
    company_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_name = db.Column(db.String(100), nullable=False)
    logo = db.Column(db.String(255))
    type = db.Column(db.String(50))  # MNC, Startup, Product, Service
    special_focus = db.Column(db.Text)
    
    # Relationships
    questions = db.relationship('Question', backref='company', lazy='dynamic')
    sessions = db.relationship('InterviewSession', backref='company', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.company_id,
            'name': self.company_name,
            'logo': self.logo,
            'type': self.type,
            'special_focus': self.special_focus
        }
    
    def __repr__(self):
        return f'<Company {self.company_name}>'