# ============================================
# INTERVIEWMATE AI - SEED QUESTIONS
# ============================================

import json
import os

def create_seed_data():
    categories = [
        {
            'category': 'Software Development',
            'description': 'Programming, algorithms, system design',
            'skills': ['Python', 'Java', 'Data Structures', 'Algorithms'],
            'questions': [
                {
                    'text': 'Explain the difference between REST and SOAP APIs.',
                    'difficulty': 'medium',
                    'type': 'technical',
                    'keywords': ['rest', 'soap', 'api', 'http', 'xml', 'json'],
                    'context': 'Common question for backend developer roles'
                },
                {
                    'text': 'What is the time complexity of binary search?',
                    'difficulty': 'easy',
                    'type': 'technical',
                    'keywords': ['binary search', 'time complexity', 'O(log n)', 'algorithm'],
                    'context': 'Fundamental algorithm question'
                }
            ]
        },
        {
            'category': 'Data Science',
            'description': 'Machine learning, statistics, data analysis',
            'skills': ['Python', 'Machine Learning', 'Statistics', 'SQL'],
            'questions': [
                {
                    'text': 'Explain the difference between supervised and unsupervised learning.',
                    'difficulty': 'easy',
                    'type': 'technical',
                    'keywords': ['supervised', 'unsupervised', 'labeled data', 'clustering'],
                    'context': 'Basic ML concept question'
                }
            ]
        }
    ]
    
    # Save category questions
    os.makedirs('category_data', exist_ok=True)
    for cat in categories:
        filename = cat['category'].lower().replace(' ', '_') + '.json'
        with open(f'category_data/{filename}', 'w') as f:
            json.dump(cat, f, indent=2)
    
    companies = [
        {
            'company': 'TCS',
            'type': 'service',
            'questions': [
                {
                    'text': 'Why do you want to join TCS?',
                    'difficulty': 'easy',
                    'type': 'hr',
                    'keywords': ['career growth', 'learning', 'opportunities'],
                    'category': 'Software Development'
                }
            ]
        },
        {
            'company': 'Google',
            'type': 'product',
            'questions': [
                {
                    'text': 'Design a URL shortener service.',
                    'difficulty': 'hard',
                    'type': 'technical',
                    'keywords': ['system design', 'hashing', 'database', 'scalability'],
                    'category': 'Software Development'
                }
            ]
        }
    ]
    
    # Save company questions
    os.makedirs('company_data', exist_ok=True)
    for comp in companies:
        filename = comp['company'].lower() + '_questions.json'
        with open(f'company_data/{filename}', 'w') as f:
            json.dump(comp, f, indent=2)

if __name__ == '__main__':
    create_seed_data()
    print("Seed data created successfully!")