# ============================================
# INTERVIEWMATE AI - QUESTION GENERATOR SERVICE
# ============================================

import random
from models import Question, JobCategory, Company
from extensions import db

class QuestionGeneratorService:
    def __init__(self):
        pass
    
    def generate_questions(self, category_id, company_id=None, num_questions=10, difficulty='mixed', resume_path=None):
        questions = []
        
        # Get from database
        db_questions = self._get_db_questions(category_id, company_id, num_questions, difficulty)
        questions.extend([q.to_dict() for q in db_questions])
        
        # Shuffle and limit
        random.shuffle(questions)
        return questions[:num_questions]
    
    def _get_db_questions(self, category_id, company_id, limit, difficulty):
        query = Question.query.filter_by(category_id=category_id)
        
        if company_id:
            query = query.filter_by(company_id=company_id)
        
        if difficulty != 'mixed':
            query = query.filter_by(difficulty=difficulty)
        
        return query.limit(limit * 2).all()
    
    def generate_custom_questions(self, resume_text, category_id, company_id=None, num_questions=5):
        # Placeholder for AI-generated questions
        category = JobCategory.query.get(category_id)
        category_name = category.category_name if category else "General"
        
        # Return template questions
        return [
            {
                'q_id': 0,
                'question_text': f'Based on your experience, describe a challenging project in {category_name}.',
                'difficulty': 'medium',
                'question_type': 'behavioral',
                'expected_keywords': ['challenge', 'solution', 'result'],
                'time_limit': 180
            }
            for _ in range(num_questions)
        ]