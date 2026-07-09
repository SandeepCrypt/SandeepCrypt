# ============================================
# INTERVIEWMATE AI - PROGRESS CONTROLLER
# ============================================

from flask import jsonify
from models import ProgressTracking, InterviewSession, ConfidenceReport
from extensions import db

class ProgressController:
    @staticmethod
    def get_progress(user_id):
        progress = ProgressTracking.query.filter_by(user_id=user_id).first()
        if not progress:
            return jsonify({'message': 'No progress data found'}), 404
        return jsonify({'progress': progress.to_dict()}), 200
    
    @staticmethod
    def get_dashboard(user_id):
        from models import User
        user = User.query.get_or_404(user_id)
        
        recent_sessions = InterviewSession.query\
            .filter_by(user_id=user_id)\
            .order_by(InterviewSession.created_at.desc())\
            .limit(5).all()
        
        progress = ProgressTracking.query.filter_by(user_id=user_id).first()
        total_sessions = InterviewSession.query.filter_by(user_id=user_id).count()
        completed = InterviewSession.query.filter_by(user_id=user_id, status='completed').count()
        
        avg_score = db.session.query(db.func.avg(ConfidenceReport.overall_score))\
            .join(InterviewSession)\
            .filter(InterviewSession.user_id == user_id).scalar()
        
        best_score = db.session.query(db.func.max(ConfidenceReport.overall_score))\
            .join(InterviewSession)\
            .filter(InterviewSession.user_id == user_id).scalar()
        
        return jsonify({
            'user': user.to_dict(),
            'stats': {
                'totalSessions': total_sessions,
                'completedSessions': completed,
                'avgScore': round(float(avg_score), 2) if avg_score else 0,
                'bestScore': round(float(best_score), 2) if best_score else 0
            },
            'recentSessions': [s.to_dict() for s in recent_sessions],
            'progress': progress.to_dict() if progress else None
        }), 200