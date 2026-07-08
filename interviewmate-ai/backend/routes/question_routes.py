# ============================================
# INTERVIEWMATE AI - QUESTION ROUTES
# ============================================

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import Question, StarModelAnswer
from services.question_generator_service import QuestionGeneratorService

question_bp = Blueprint('questions', __name__)
question_generator = QuestionGeneratorService()

@question_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_questions():
    """Generate AI questions based on resume and profile."""
    data = request.get_json()
    
    questions = question_generator.generate_questions(
        category_id=data.get('category_id'),
        company_id=data.get('company_id'),
        num_questions=data.get('num_questions', 5),
        resume_text=data.get('resume_text'),
        skills=data.get('skills', [])
    )
    
    return jsonify({
        'success': True,
        'questions': questions
    })

@question_bp.route('/<int:question_id>/star-answer', methods=['GET'])
@jwt_required()
def get_star_answer(question_id):
    """Get STAR model answer for a question."""
    star_answer = StarModelAnswer.query.filter_by(q_id=question_id).first()
    
    if not star_answer:
        # Generate on the fly
        star_answer = question_generator.generate_star_answer(question_id)
    
    return jsonify({
        'success': True,
        'starAnswer': star_answer.to_dict() if hasattr(star_answer, 'to_dict') else star_answer
    })

@question_bp.route('/<int:question_id>', methods=['GET'])
@jwt_required()
def get_question(question_id):
    """Get question by ID."""
    question = Question.query.get_or_404(question_id)
    return jsonify({
        'success': True,
        'question': question.to_dict()
    })