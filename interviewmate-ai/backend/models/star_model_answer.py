# ============================================
# INTERVIEWMATE AI - STAR MODEL ANSWER MODEL
# ============================================

from . import db

class StarModelAnswer(db.Model):
    __tablename__ = 'star_model_answers'
    
    model_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    q_id = db.Column(db.Integer, db.ForeignKey('question_bank.q_id'), nullable=False)
    situation = db.Column(db.Text, nullable=False)
    task = db.Column(db.Text, nullable=False)
    action = db.Column(db.Text, nullable=False)
    result = db.Column(db.Text, nullable=False)
    full_answer = db.Column(db.Text, nullable=False)
    keywords_covered = db.Column(db.JSON)
    
    def to_dict(self):
        return {
            'id': self.model_id,
            'situation': self.situation,
            'task': self.task,
            'action': self.action,
            'result': self.result,
            'fullAnswer': self.full_answer,
            'keywords': self.keywords_covered
        }
    
    def __repr__(self):
        return f'<StarModelAnswer {self.model_id}>'