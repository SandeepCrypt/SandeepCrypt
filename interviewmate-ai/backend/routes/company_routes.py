# ============================================
# INTERVIEWMATE AI - COMPANY ROUTES
# ============================================

from flask import Blueprint, jsonify
from models import Company, Question

company_bp = Blueprint('companies', __name__)

@company_bp.route('/', methods=['GET'])
def get_companies():
    """Get all companies."""
    companies = Company.query.all()
    return jsonify({
        'success': True,
        'companies': [c.to_dict() for c in companies]
    })

@company_bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    """Get company details."""
    company = Company.query.get_or_404(company_id)
    return jsonify({
        'success': True,
        'company': company.to_dict()
    })

@company_bp.route('/<int:company_id>/questions', methods=['GET'])
def get_company_questions(company_id):
    """Get company-specific questions."""
    questions = Question.query.filter_by(company_id=company_id).all()
    return jsonify({
        'success': True,
        'questions': [q.to_dict() for q in questions]
    })