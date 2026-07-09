# ============================================
# INTERVIEWMATE AI - STAR ANSWER GENERATOR
# ============================================

class StarAnswerGenerator:
    def __init__(self):
        pass
    
    def generate_star_answer(self, question_text, user_context=None):
        # Generate a STAR-formatted answer template
        return {
            'situation': 'Describe the context and background of the scenario.',
            'task': 'Explain your specific responsibility or challenge.',
            'action': 'Detail the steps you took to address the task.',
            'result': 'Share the outcomes and what you learned.',
            'full_answer': self._build_full_answer(question_text),
            'tips': [
                'Be specific and use concrete examples',
                'Quantify results when possible',
                'Keep it concise but comprehensive'
            ]
        }
    
    def _build_full_answer(self, question):
        return f"""When answering "{question}", structure your response using the STAR method:

SITUATION: Set the scene. Where were you? What was your role?

TASK: What challenge or responsibility did you face?

ACTION: What specific steps did you take? Use "I" statements.

RESULT: What was the outcome? Quantify if possible."""
    
    def analyze_star_compliance(self, answer):
        components = {
            'situation': any(kw in answer.lower() for kw in ['situation', 'when', 'where', 'during', 'while']),
            'task': any(kw in answer.lower() for kw in ['task', 'responsibility', 'needed', 'had to']),
            'action': any(kw in answer.lower() for kw in ['action', 'did', 'implemented', 'developed']),
            'result': any(kw in answer.lower() for kw in ['result', 'outcome', 'achieved', 'success'])
        }
        
        present = sum(1 for v in components.values() if v)
        score = (present / 4) * 100
        
        return {
            'score': round(score, 2),
            'components': components,
            'present_count': present,
            'missing': [k for k, v in components.items() if not v]
        }