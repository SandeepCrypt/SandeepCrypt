# ============================================
# INTERVIEWMATE AI - QUESTION LOADER
# ============================================

import json
import os
from models import Question, JobCategory, Company, StarModelAnswer
from extensions import db

class QuestionLoader:
    def __init__(self):
        self.category_dir = os.path.join(os.path.dirname(__file__), 'category_data')
        self.company_dir = os.path.join(os.path.dirname(__file__), 'company_data')
    
    def load_all_questions(self):
        self.load_category_questions()
        self.load_company_questions()
    
    def load_category_questions(self):
        if not os.path.exists(self.category_dir):
            return
        
        for filename in os.listdir(self.category_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(self.category_dir, filename)
                with open(filepath, 'r') as f:
                    data = json.load(f)
                
                category_name = data.get('category')
                category = JobCategory.query.filter_by(category_name=category_name).first()
                
                if not category:
                    category = JobCategory(
                        category_name=category_name,
                        description=data.get('description', ''),
                        skills=data.get('skills', [])
                    )
                    db.session.add(category)
                    db.session.flush()
                
                for q_data in data.get('questions', []):
                    question = Question(
                        category_id=category.category_id,
                        question_text=q_data['text'],
                        difficulty=q_data.get('difficulty', 'medium'),
                        question_type=q_data.get('type', 'technical'),
                        expected_keywords=q_data.get('keywords', []),
                        context=q_data.get('context', ''),
                        hints=q_data.get('hints', []),
                        time_limit=q_data.get('time_limit', 120)
                    )
                    db.session.add(question)
                    db.session.flush()
                    
                    if 'star_answer' in q_data:
                        star = StarModelAnswer(
                            q_id=question.q_id,
                            situation=q_data['star_answer'].get('situation', ''),
                            task=q_data['star_answer'].get('task', ''),
                            action=q_data['star_answer'].get('action', ''),
                            result=q_data['star_answer'].get('result', ''),
                            full_answer=q_data['star_answer'].get('full', ''),
                            keywords_covered=q_data['star_answer'].get('keywords', [])
                        )
                        db.session.add(star)
        
        db.session.commit()
    
    def load_company_questions(self):
        if not os.path.exists(self.company_dir):
            return
        
        for filename in os.listdir(self.company_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(self.company_dir, filename)
                with open(filepath, 'r') as f:
                    data = json.load(f)
                
                company_name = data.get('company')
                company = Company.query.filter_by(company_name=company_name).first()
                
                if not company:
                    company = Company(
                        company_name=company_name,
                        type=data.get('type', 'mnc'),
                        description=data.get('description', '')
                    )
                    db.session.add(company)
                    db.session.flush()
                
                for q_data in data.get('questions', []):
                    category = JobCategory.query.filter_by(
                        category_name=q_data.get('category', 'General')
                    ).first()
                    
                    question = Question(
                        category_id=category.category_id if category else 1,
                        company_id=company.company_id,
                        question_text=q_data['text'],
                        difficulty=q_data.get('difficulty', 'medium'),
                        question_type=q_data.get('type', 'technical'),
                        expected_keywords=q_data.get('keywords', []),
                        time_limit=q_data.get('time_limit', 120)
                    )
                    db.session.add(question)
        
        db.session.commit()