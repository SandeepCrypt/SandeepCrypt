# ============================================
# INTERVIEWMATE AI - REPORT CONTROLLER
# ============================================

from flask import jsonify, send_file
from models import ConfidenceReport, InterviewSession
import os

class ReportController:
    @staticmethod
    def get_report(session_id, user_id):
        session = InterviewSession.query.get_or_404(session_id)
        if session.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        report = ConfidenceReport.query.filter_by(session_id=session_id).first()
        if not report:
            return jsonify({'message': 'Report not found'}), 404
        
        return jsonify({'report': report.to_dict()}), 200
    
    @staticmethod
    def get_all_reports(user_id):
        reports = ConfidenceReport.query\
            .join(InterviewSession)\
            .filter(InterviewSession.user_id == user_id)\
            .order_by(ConfidenceReport.created_at.desc()).all()
        
        return jsonify({'reports': [r.to_dict() for r in reports]}), 200
    
    @staticmethod
    def export_pdf(session_id, user_id):
        session = InterviewSession.query.get_or_404(session_id)
        if session.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        report = ConfidenceReport.query.filter_by(session_id=session_id).first()
        if not report or not report.pdf_path or not os.path.exists(report.pdf_path):
            return jsonify({'message': 'PDF not available'}), 404
        
        return send_file(
            report.pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'interview-report-{session_id}.pdf'
        )