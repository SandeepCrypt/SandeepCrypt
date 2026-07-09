# ============================================
# INTERVIEWMATE AI - INTERVIEW CONTROLLER
# ============================================

from flask import request, jsonify
from models import InterviewSession, Question, Response, JobCategory, Company
from extensions import db, mongo
from datetime import datetime

class InterviewController:
    @staticmethod
    def start_session(user_id):
        data = request.get_json()
        
        if not data.get('categoryId'):
            return jsonify({'message': 'Category ID is required'}), 400
        
        session = InterviewSession(
            user_id=user_id,
            category_id=data['categoryId'],
            company_id=data.get('companyId'),
            num_questions=data.get('numQuestions', 10),
            time_per_question=data.get('timePerQuestion', 120),
            difficulty=data.get('difficulty', 'mixed'),
            resume_path=data.get('resumePath')
        )
        
        db.session.add(session)
        db.session.commit()
        
        query = Question.query.filter_by(category_id=data['categoryId'])
        if data.get('companyId'):
            query = query.filter_by(company_id=data['companyId'])
        if data.get('difficulty') and data['difficulty'] != 'mixed':
            query = query.filter_by(difficulty=data['difficulty'])
        
        questions = query.limit(data.get('numQuestions', 10)).all()
        
        question_ids = [q.q_id for q in questions]
        mongo.db.session_questions.insert_one({
            'session_id': session.session_id,
            'question_ids': question_ids,
            'current_index': 0,
            'created_at': datetime.utcnow()
        })
        
        return jsonify({
            'session': session.to_dict(),
            'questions': [q.to_dict() for q in questions]
        }), 201
    
    @staticmethod
    def get_question(session_id, user_id):
        session = InterviewSession.query.get_or_404(session_id)
        if session.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        session_data = mongo.db.session_questions.find_one({'session_id': session_id})
        if not session_data:
            return jsonify({'message': 'Session data not found'}), 404
        
        current_index = session_data.get('current_index', 0)
        question_ids = session_data.get('question_ids', [])
        
        if current_index >= len(question_ids):
            return jsonify({'message': 'No more questions'}), 404
        
        question = Question.query.get(question_ids[current_index])
        star = question.star_answers.first() if question else None
        
        return jsonify({
            'question': question.to_dict() if question else None,
            'star_answer': star.to_dict() if star else None,
            'question_number': current_index + 1,
            'total_questions': len(question_ids)
        }), 200
    
    @staticmethod
    def submit_response(user_id):
        session_id = request.form.get('session_id', type=int)
        question_id = request.form.get('question_id', type=int)
        transcript = request.form.get('transcript', '')
        
        session = InterviewSession.query.get_or_404(session_id)
        if session.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        response = Response(
            session_id=session_id,
            q_id=question_id,
            transcript=transcript,
            answer_score=75.0,
            star_compliance_score=60.0,
            ai_feedback="Answer recorded successfully."
        )
        
        db.session.add(response)
        mongo.db.session_questions.update_one(
            {'session_id': session_id},
            {'$inc': {'current_index': 1}}
        )
        db.session.commit()
        
        return jsonify({
            'response_id': response.response_id,
            'answer_score': response.answer_score,
            'star_compliance_score': response.star_compliance_score,
            'ai_feedback': response.ai_feedback
        }), 201
    
    @staticmethod
    def end_session(session_id, user_id):
        session = InterviewSession.query.get_or_404(session_id)
        if session.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        session.duration = int((datetime.utcnow() - session.created_at).total_seconds())
        session.status = 'completed'
        session.overall_score = 75.0
        db.session.commit()
        
        return jsonify({
            'message': 'Session completed',
            'session': session.to_dict()
        }), 200
    
    @staticmethod
    def get_history(user_id):
        sessions = InterviewSession.query.filter_by(user_id=user_id)\
            .order_by(InterviewSession.created_at.desc()).all()
        
        return jsonify({
            'sessions': [s.to_dict() for s in sessions]
        }), 200