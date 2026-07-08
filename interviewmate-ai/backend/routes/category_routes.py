# ============================================
# INTERVIEWMATE AI - CATEGORY ROUTES
# ============================================

from flask import Blueprint, jsonify
from models import JobCategory, Question

category_bp = Blueprint('categories', __name__)

@category_bp.route('/', methods=['GET'])
def get_categories():
    """Get all job categories."""
    categories = JobCategory.query.all()
    return jsonify({
        'success': True,
        'categories': [c.to_dict() for c in categories]
    })

@category_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get category details."""
    category = JobCategory.query.get_or_404(category_id)
    return jsonify({
        'success': True,
        'category': category.to_dict()
    })

@category_bp.route('/<int:category_id>/questions', methods=['GET'])
def get_category_questions(category_id):
    """Get questions for a category."""
    difficulty = request.args.get('difficulty')
    question_type = request.args.get('type')
    
    query = Question.query.filter_by(category_id=category_id)
    
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    if question_type:
        query = query.filter_by(question_type=question_type)
    
    questions = query.all()
    
    return jsonify({
        'success': True,
        'questions': [q.to_dict() for q in questions]
    })