# ============================================
# INTERVIEWMATE AI - KEYWORD EXTRACTOR
# ============================================

from .nlp_utils import NLPUtils

class KeywordExtractor:
    def __init__(self):
        self.nlp_utils = NLPUtils()
    
    def extract(self, text, top_n=10):
        return self.nlp_utils.extract_keywords(text, top_n)
    
    def extract_coverage(self, transcript, expected_keywords):
        if not expected_keywords:
            return {'score': 100, 'matched': [], 'total': 0}
        
        text_lower = transcript.lower()
        matched = [kw for kw in expected_keywords if kw.lower() in text_lower]
        
        coverage = len(matched) / len(expected_keywords) if expected_keywords else 1
        score = coverage * 100
        
        return {
            'score': round(score, 2),
            'matched': matched,
            'total': len(expected_keywords),
            'message': f'Keywords matched: {len(matched)}/{len(expected_keywords)}'
        }
    
    def extract_tech_keywords(self, text):
        tech_keywords = [
            'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node',
            'django', 'flask', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes',
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
            'data science', 'pandas', 'numpy', 'scikit-learn', 'matplotlib',
            'html', 'css', 'bootstrap', 'tailwind', 'typescript', 'go', 'rust',
            'c++', 'c#', '.net', 'php', 'ruby', 'swift', 'kotlin', 'flutter',
            'react native', 'android', 'ios', 'linux', 'bash', 'ansible',
            'terraform', 'elasticsearch', 'redis', 'kafka', 'graphql', 'rest api',
            'microservices', 'serverless', 'ci/cd', 'devops', 'agile', 'scrum'
        ]
        
        text_lower = text.lower()
        return [kw for kw in tech_keywords if kw in text_lower]