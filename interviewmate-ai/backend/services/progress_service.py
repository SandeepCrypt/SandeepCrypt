# ============================================
# INTERVIEWMATE AI - PROGRESS SERVICE
# ============================================

from models import ProgressTracking, InterviewSession, ConfidenceReport
from extensions import db
from datetime import datetime, timedelta

class ProgressService:
    def __init__(self):
        pass
    
    def get_progress(self, user_id):
        progress = ProgressTracking.query.filter_by(user_id=user_id).first()
        if not progress:
            return None
        return progress.to_dict()
    
    def update_progress(self, user_id, new_score, areas=None):
        progress = ProgressTracking.query.filter_by(user_id=user_id).first()
        if not progress:
            return None
        
        progress.session_count += 1
        
        if progress.avg_score:
            current_avg = float(progress.avg_score)
            progress.avg_score = (current_avg * (progress.session_count - 1) + new_score) / progress.session_count
        else:
            progress.avg_score = new_score
        
        if not progress.best_score or new_score > float(progress.best_score):
            progress.best_score = new_score
        
        trend_entry = {'date': datetime.utcnow().isoformat(), 'score': new_score}
        if progress.trend is None:
            progress.trend = []
        progress.trend.append(trend_entry)
        progress.trend = progress.trend[-50:]
        
        if areas:
            progress.weakest_area = areas.get('weakest')
            progress.strongest_area = areas.get('strongest')
        
        progress.last_session_date = datetime.utcnow()
        db.session.commit()
        
        return progress.to_dict()
    
    def get_dashboard_stats(self, user_id):
        total = InterviewSession.query.filter_by(user_id=user_id).count()
        completed = InterviewSession.query.filter_by(user_id=user_id, status='completed').count()
        
        avg_score = db.session.query(db.func.avg(ConfidenceReport.overall_score))\
            .join(InterviewSession).filter(InterviewSession.user_id == user_id).scalar()
        
        best_score = db.session.query(db.func.max(ConfidenceReport.overall_score))\
            .join(InterviewSession).filter(InterviewSession.user_id == user_id).scalar()
        
        return {
            'totalSessions': total,
            'completedSessions': completed,
            'avgScore': round(float(avg_score), 2) if avg_score else 0,
            'bestScore': round(float(best_score), 2) if best_score else 0
        }
    
    def calculate_streak(self, user_id):
        sessions = InterviewSession.query\
            .filter_by(user_id=user_id, status='completed')\
            .order_by(InterviewSession.created_at.desc()).all()
        
        if not sessions:
            return 0
        
        streak = 0
        today = datetime.utcnow().date()
        check_date = today
        
        for session in sessions:
            session_date = session.created_at.date()
            if session_date == check_date or session_date == check_date - timedelta(days=1):
                if session_date == check_date:
                    streak += 1
                    check_date = session_date - timedelta(days=1)
                elif session_date == check_date - timedelta(days=1):
                    streak += 1
                    check_date = session_date
            else:
                break
        
        return streak