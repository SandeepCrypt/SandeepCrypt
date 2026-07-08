# ============================================
# INTERVIEWMATE AI - PROGRESS ROUTES
# ============================================

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.progress_service import ProgressService

progress_bp = Blueprint('progress', __name__)
progress_service = ProgressService()

@progress_bp.route('/', methods=['GET'])
@jwt_required()
def get_progress():
    """Get user progress."""
    user_id = get_jwt_identity()
    progress = progress_service.get_user_progress(user_id)
    return jsonify({'success': True, **progress})

@progress_bp.route('/trend', methods=['GET'])
@jwt_required()
def get_trend():
    """Get score trend."""
    user_id = get_jwt_identity()
    trend = progress_service.get_score_trend(user_id)
    return jsonify({'success': True, 'trend': trend})

@progress_bp.route('/areas', methods=['GET'])
@jwt_required()
def get_weak_areas():
    """Get weakest and strongest areas."""
    user_id = get_jwt_identity()
    areas = progress_service.get_skill_areas(user_id)
    return jsonify({'success': True, **areas})