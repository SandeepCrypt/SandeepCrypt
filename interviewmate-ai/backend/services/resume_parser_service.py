# ============================================
# INTERVIEWMATE AI - RESUME PARSER SERVICE
# ============================================

import re
import os
from PyPDF2 import PdfReader
from docx import Document

class ResumeParserService:
    def __init__(self):
        self.skill_keywords = {
            'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js',
            'django', 'flask', 'spring', 'sql', 'mysql', 'postgresql', 'mongodb',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git',
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
            'data science', 'pandas', 'numpy', 'scikit-learn', 'matplotlib',
            'html', 'css', 'bootstrap', 'tailwind', 'typescript', 'go', 'rust',
            'c++', 'c#', '.net', 'php', 'ruby', 'swift', 'kotlin', 'flutter',
            'react native', 'android', 'ios', 'linux', 'bash', 'ansible',
            'terraform', 'elasticsearch', 'redis', 'kafka', 'graphql', 'rest api',
            'microservices', 'serverless', 'ci/cd', 'devops', 'agile', 'scrum'
        }
    
    def parse(self, file_path):
        if not os.path.exists(file_path):
            return {'error': 'File not found'}
        
        ext = file_path.rsplit('.', 1)[1].lower()
        
        if ext == 'pdf':
            text = self._extract_pdf(file_path)
        elif ext in ['doc', 'docx']:
            text = self._extract_docx(file_path)
        else:
            return {'error': 'Unsupported file format'}
        
        if not text:
            return {'error': 'Could not extract text'}
        
        return {
            'raw_text': text[:5000],
            'skills': self._extract_skills(text),
            'education': self._extract_education(text),
            'experience_years': self._extract_experience(text),
            'contact_info': self._extract_contact(text)
        }
    
    def _extract_pdf(self, file_path):
        try:
            reader = PdfReader(file_path)
            return ' '.join([page.extract_text() or '' for page in reader.pages]).strip()
        except Exception as e:
            print(f"PDF extraction error: {e}")
            return ''
    
    def _extract_docx(self, file_path):
        try:
            doc = Document(file_path)
            return ' '.join([p.text for p in doc.paragraphs]).strip()
        except Exception as e:
            print(f"DOCX extraction error: {e}")
            return ''
    
    def _extract_skills(self, text):
        text_lower = text.lower()
        return [skill for skill in self.skill_keywords if skill in text_lower]
    
    def _extract_education(self, text):
        education_keywords = ['bachelor', 'master', 'phd', 'b.tech', 'm.tech', 'b.e', 'm.e', 'b.sc', 'm.sc', 'bca', 'mca']
        text_lower = text.lower()
        return [edu for edu in education_keywords if edu in text_lower]
    
    def _extract_experience(self, text):
        matches = re.findall(r'(\d+)\+?\s*years?\s*(?:of\s*)?experience', text.lower())
        return max([int(m) for m in matches]) if matches else 0
    
    def _extract_contact(self, text):
        contact = {}
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        if emails:
            contact['email'] = emails[0]
        phones = re.findall(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', text)
        if phones:
            contact['phone'] = phones[0]
        return contact