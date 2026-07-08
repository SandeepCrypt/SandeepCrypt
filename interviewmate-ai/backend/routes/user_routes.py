# ============================================
# INTERVIEWMATE AI - USER ROUTES
# ============================================

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, InterviewSession, ProgressTracking
from services.progress_service import ProgressService

user_bp = Blueprint('user', __name__)
progress_service = ProgressService()

@user_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get user dashboard data."""
    user_id = get_jwt_identity()
    
    # Get recent sessions
    recent_sessions = InterviewSession.query.filter_by(user_id=user_id)\
        .order_by(InterviewSession.date.desc())\
        .limit(5).all()
    
    # Get progress stats
    progress = ProgressTracking.query.filter_by(user_id=user_id).first()
    
    # Calculate stats
    all_sessions = InterviewSession.query.filter_by(user_id=user_id).all()
    scores = [float(s.overall_score) for s in all_sessions if s.overall_score]
    
    stats = {
        'totalSessions': len(all_sessions),
        'avgScore': round(sum(scores) / len(scores), 2) if scores else 0,
        'bestScore': round(max(scores), 2) if scores else 0,
        'streak': progress_service.calculate_streak(user_id) if progress else 0,
        'trend': progress.trend if progress else []
    }
    
    return jsonify({
        'success': True,
        'recentSessions': [s.to_dict() for s in recent_sessions],
        'stats': stats
    })

@user_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    """Get detailed progress data."""
    user_id = get_jwt_identity()
    progress = progress_service.get_user_progress(user_id)
    return jsonify({'success': True, **progress})

@user_bp.route('/sessions/recent', methods=['GET'])
@jwt_required()
def get_recent_sessions():
    """Get recent sessions with limit."""
    user_id = get_jwt_identity()
    limit = request.args.get('limit', 5, type=int)
    
    sessions = InterviewSession.query.filter_by(user_id=user_id)\
        .order_by(InterviewSession.date.desc())\
        .limit(limit).all()
    
    return jsonify({
        'success': True,
        'sessions': [s.to_dict() for s in sessions]
    })

@user_bp.route('/achievements', methods=['GET'])
@jwt_required()
def get_achievements():
    """Get user achievements/badges."""
    user_id = get_jwt_identity()
    # Implementation for achievements
    return jsonify({'success': True, 'achievements': []})

@user_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """Update user settings."""
    user_id = get_jwt_identity()
    data = request.get_json()
    # Implementation for settings update
    return jsonify({'success': True, 'settings': data})

@user_bp.route('/activity', methods=['GET'])
@jwt_required()
def get_activity_log():
    """Get user activity log."""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    # Implementation for activity log
    return jsonify({'success': True, 'activities': []})