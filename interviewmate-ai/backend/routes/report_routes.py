# ============================================
# INTERVIEWMATE AI - REPORT ROUTES
# ============================================

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import ConfidenceReport, InterviewSession
from services.report_service import ReportService
from services.pdf_export_service import PDFExportService

report_bp = Blueprint('reports', __name__)
report_service = ReportService()
pdf_service = PDFExportService()

@report_bp.route('/<int:session_id>', methods=['GET'])
@jwt_required()
def get_report(session_id):
    """Get report for a session."""
    report = ConfidenceReport.query.filter_by(session_id=session_id).first()
    
    if not report:
        # Generate report if not exists
        report = report_service.generate_report(session_id)
    
    # Get session details
    session = InterviewSession.query.get(session_id)
    responses = session.responses.all() if session else []
    
    return jsonify({
        'success': True,
        'report': report.to_dict() if report else None,
        'session': session.to_dict() if session else None,
        'responses': [r.to_dict() for r in responses]
    })

@report_bp.route('/<int:session_id>/breakdown', methods=['GET'])
@jwt_required()
def get_score_breakdown(session_id):
    """Get detailed score breakdown."""
    breakdown = report_service.get_breakdown(session_id)
    return jsonify({'success': True, 'breakdown': breakdown})

@report_bp.route('/<int:session_id>/emotions', methods=['GET'])
@jwt_required()
def get_emotion_timeline(session_id):
    """Get emotion timeline data."""
    timeline = report_service.get_emotion_timeline(session_id)
    return jsonify({'success': True, 'timeline': timeline})

@report_bp.route('/<int:session_id>/tips', methods=['GET'])
@jwt_required()
def get_improvement_tips(session_id):
    """Get improvement tips."""
    tips = report_service.generate_tips(session_id)
    return jsonify({'success': True, 'tips': tips})

@report_bp.route('/<int:session_id>/skills', methods=['GET'])
@jwt_required()
def get_skill_radar(session_id):
    """Get skill radar data."""
    radar_data = report_service.get_skill_radar(session_id)
    return jsonify({'success': True, 'radar': radar_data})

@report_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_reports():
    """Get all reports for user."""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # Join with sessions to filter by user
    reports = ConfidenceReport.query\
        .join(InterviewSession)\
        .filter(InterviewSession.user_id == user_id)\
        .order_by(ConfidenceReport.report_id.desc())\
        .paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'success': True,
        'reports': [r.to_dict() for r in reports.items],
        'total': reports.total,
        'pages': reports.pages
    })

@report_bp.route('/compare', methods=['POST'])
@jwt_required()
def compare_sessions():
    """Compare multiple sessions."""
    data = request.get_json()
    session_ids = data.get('session_ids', [])
    
    comparison = report_service.compare_sessions(session_ids)
    return jsonify({'success': True, 'comparison': comparison})