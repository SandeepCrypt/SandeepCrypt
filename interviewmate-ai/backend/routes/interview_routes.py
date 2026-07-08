# ============================================
# INTERVIEWMATE AI - INTERVIEW ROUTES
# ============================================

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, InterviewSession, Response, Question
from services.interview_service import InterviewService
from services.question_generator_service import QuestionGeneratorService
from services.confidence_scoring_service import ConfidenceScoringService

interview_bp = Blueprint('interview', __name__)
interview_service = InterviewService()
question_generator = QuestionGeneratorService()
confidence_scorer = ConfidenceScoringService()

@interview_bp.route('/start', methods=['POST'])
@jwt_required()
def start_session():
    """Start a new interview session."""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Create session
        session = interview_service.create_session(user_id, data)
        
        # Generate questions
        questions = question_generator.generate_questions(
            category_id=data['categoryId'],
            company_id=data.get('companyId'),
            num_questions=data.get('numQuestions', 10),
            difficulty=data.get('difficulty', 'mixed'),
            resume_path=data.get('resumePath')
        )
        
        # Save questions to session
        session.questions_data = [q['id'] for q in questions]
        db.session.commit()
        
        return jsonify({
            'success': True,
            'session': session.to_dict(),
            'questions': questions
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@interview_bp.route('/<int:session_id>/question', methods=['GET'])
@jwt_required()
def get_question(session_id):
    """Get next question for session."""
    # Implementation
    return jsonify({'success': True, 'question': {}})

@interview_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_response():
    """Submit response for current question."""
    user_id = get_jwt_identity()
    
    if 'audio' not in request.files:
        return jsonify({'success': False, 'message': 'No audio file'}), 400
    
    audio_file = request.files['audio']
    session_id = request.form.get('session_id')
    question_id = request.form.get('question_id')
    transcript = request.form.get('transcript', '')
    
    try:
        # Save audio
        audio_path = interview_service.save_audio(audio_file, session_id)
        
        # Process response
        response = interview_service.process_response(
            session_id=session_id,
            question_id=question_id,
            audio_path=audio_path,
            transcript=transcript,
            facial_emotions=request.form.get('facial_emotions'),
            speech_emotions=request.form.get('speech_emotions')
        )
        
        return jsonify({
            'success': True,
            'response': response.to_dict()
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@interview_bp.route('/<int:session_id>/end', methods=['POST'])
@jwt_required()
def end_session(session_id):
    """End interview session and generate report."""
    try:
        session = interview_service.end_session(session_id)
        
        # Generate confidence report
        report = confidence_scorer.generate_report(session_id)
        
        # Update progress
        interview_service.update_progress(session.user_id)
        
        return jsonify({
            'success': True,
            'session': session.to_dict(),
            'report': report.to_dict() if report else None
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@interview_bp.route('/<int:session_id>/abort', methods=['POST'])
@jwt_required()
def abort_session(session_id):
    """Abort interview session."""
    try:
        session = interview_service.abort_session(session_id)
        return jsonify({'success': True, 'session': session.to_dict()})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@interview_bp.route('/<int:session_id>/status', methods=['GET'])
@jwt_required()
def get_session_status(session_id):
    """Get session status."""
    session = InterviewSession.query.get_or_404(session_id)
    return jsonify({'success': True, 'status': session.status})

@interview_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get interview history."""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    sessions = InterviewSession.query.filter_by(user_id=user_id)\
        .order_by(InterviewSession.date.desc())\
        .paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'success': True,
        'sessions': [s.to_dict() for s in sessions.items],
        'total': sessions.total,
        'pages': sessions.pages,
        'current_page': page
    })

@interview_bp.route('/<int:session_id>', methods=['GET'])
@jwt_required()
def get_session_details(session_id):
    """Get detailed session information."""
    session = InterviewSession.query.get_or_404(session_id)
    responses = Response.query.filter_by(session_id=session_id).all()
    
    return jsonify({
        'success': True,
        'session': session.to_dict(),
        'responses': [r.to_dict() for r in responses]
    })