# ============================================
# INTERVIEWMATE AI - QUESTION CONTROLLER
# ============================================

from flask import request, jsonify
from models import JobCategory, Company, Question, StarModelAnswer

class QuestionController:
    @staticmethod
    def get_categories():
        categories = JobCategory.query.all()
        return jsonify({'categories': [c.to_dict() for c in categories]}), 200
    
    @staticmethod
    def get_category(category_id):
        category = JobCategory.query.get_or_404(category_id)
        return jsonify({'category': category.to_dict()}), 200
    
    @staticmethod
    def get_questions_by_category(category_id):
        difficulty = request.args.get('difficulty')
        limit = request.args.get('limit', 20, type=int)
        
        query = Question.query.filter_by(category_id=category_id)
        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        
        questions = query.limit(limit).all()
        return jsonify({'questions': [q.to_dict() for q in questions]}), 200
    
    @staticmethod
    def get_companies():
        companies = Company.query.all()
        return jsonify({'companies': [c.to_dict() for c in companies]}), 200
    
    @staticmethod
    def get_company_questions(company_id):
        difficulty = request.args.get('difficulty')
        limit = request.args.get('limit', 20, type=int)
        
        query = Question.query.filter_by(company_id=company_id)
        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        
        questions = query.limit(limit).all()
        return jsonify({'questions': [q.to_dict() for q in questions]}), 200
    
    @staticmethod
    def get_star_answer(question_id):
        star = StarModelAnswer.query.filter_by(q_id=question_id).first()
        if not star:
            return jsonify({'message': 'STAR answer not found'}), 404
        return jsonify({'star_answer': star.to_dict()}), 200