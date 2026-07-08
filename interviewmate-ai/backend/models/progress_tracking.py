# ============================================
# INTERVIEWMATE AI - PROGRESS TRACKING MODEL
# ============================================

from . import db

class ProgressTracking(db.Model):
    __tablename__ = 'progress_tracking'
    
    progress_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    session_count = db.Column(db.Integer, default=0)
    avg_score = db.Column(db.Numeric(5, 2))
    best_score = db.Column(db.Numeric(5, 2))
    weakest_area = db.Column(db.String(100))
    strongest_area = db.Column(db.String(100))
    trend = db.Column(db.JSON)  # Array of {date, score} objects
    
    def to_dict(self):
        return {
            'sessionCount': self.session_count,
            'avgScore': float(self.avg_score) if self.avg_score else 0,
            'bestScore': float(self.best_score) if self.best_score else 0,
            'weakestArea': self.weakest_area,
            'strongestArea': self.strongest_area,
            'trend': self.trend
        }
    
    def __repr__(self):
        return f'<ProgressTracking {self.progress_id}>'