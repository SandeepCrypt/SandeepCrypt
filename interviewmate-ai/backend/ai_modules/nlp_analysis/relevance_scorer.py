# ============================================
# INTERVIEWMATE AI - RELEVANCE SCORER
# ============================================

import spacy

class RelevanceScorer:
    def __init__(self):
        self.nlp = None
        self._load_model()
    
    def _load_model(self):
        try:
            self.nlp = spacy.load('en_core_web_md')
        except Exception as e:
            print(f"Failed to load spaCy model: {e}")
    
    def score(self, answer, question):
        if not self.nlp:
            return {'score': 70, 'similarity': 0.5, 'message': 'Relevance check unavailable'}
        
        try:
            doc_question = self.nlp(question.lower())
            doc_answer = self.nlp(answer.lower())
            
            similarity = doc_question.similarity(doc_answer)
            score = similarity * 100
            
            return {
                'score': round(score, 2),
                'similarity': round(similarity, 3),
                'message': 'High relevance' if score > 70 else 'Moderate relevance' if score > 40 else 'Low relevance'
            }
        except Exception as e:
            return {'score': 50, 'similarity': 0, 'message': f'Error: {str(e)}'}