# ============================================
# INTERVIEWMATE AI - PDF ROUTES
# ============================================

from flask import Blueprint, send_file, jsonify
from flask_jwt_extended import jwt_required
from services.pdf_export_service import PDFExportService
import os

pdf_bp = Blueprint('pdf', __name__)
pdf_service = PDFExportService()

@pdf_bp.route('/report/<int:session_id>', methods=['GET'])
@jwt_required()
def download_report(session_id):
    """Download session report as PDF."""
    try:
        pdf_path = pdf_service.generate_report_pdf(session_id)
        
        if not os.path.exists(pdf_path):
            return jsonify({'success': False, 'message': 'PDF not found'}), 404
        
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'interview-report-{session_id}.pdf'
        )
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@pdf_bp.route('/report/<int:session_id>/preview', methods=['GET'])
@jwt_required()
def preview_report(session_id):
    """Preview report PDF."""
    try:
        pdf_path = pdf_service.generate_report_pdf(session_id)
        return send_file(pdf_path, mimetype='application/pdf')
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@pdf_bp.route('/comparison', methods=['POST'])
@jwt_required()
def download_comparison():
    """Download comparison PDF."""
    data = request.get_json()
    session_ids = data.get('session_ids', [])
    
    try:
        pdf_path = pdf_service.generate_comparison_pdf(session_ids)
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='progress-comparison.pdf'
        )
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@pdf_bp.route('/status/<job_id>', methods=['GET'])
@jwt_required()
def get_pdf_status(job_id):
    """Get PDF generation status."""
    status = pdf_service.get_job_status(job_id)
    return jsonify({'success': True, 'status': status})