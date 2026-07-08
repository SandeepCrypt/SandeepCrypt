# ============================================
# INTERVIEWMATE AI - QUESTION MODEL
# ============================================

from . import db

class Question(db.Model):
    __tablename__ = 'question_bank'
    
    q_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_id = db.Column(db.Integer, db.ForeignKey('job_categories.category_id'))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=True)
    question_text = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Enum('easy', 'medium', 'hard', name='difficulty_enum'))
    question_type = db.Column(db.Enum('technical', 'behavioral', 'hr', 'situational', name='question_type_enum'))
    expected_keywords = db.Column(db.JSON)
    context = db.Column(db.Text)
    hints = db.Column(db.JSON)
    time_limit = db.Column(db.Integer, default=120)  # seconds
    
    # Relationships
    star_answers = db.relationship('StarModelAnswer', backref='question', lazy='dynamic')
    responses = db.relationship('Response', backref='question', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.q_id,
            'text': self.question_text,
            'difficulty': self.difficulty,
            'type': self.question_type,
            'context': self.context,
            'hints': self.hints,
            'timeLimit': self.time_limit,
            'keywords': self.expected_keywords
        }
    
    def __repr__(self):
        return f'<Question {self.q_id}>'