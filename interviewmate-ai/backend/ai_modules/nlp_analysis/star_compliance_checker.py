# ============================================
# INTERVIEWMATE AI - STAR COMPLIANCE CHECKER
# ============================================

class StarComplianceChecker:
    def __init__(self):
        self.star_keywords = {
            'situation': ['situation', 'context', 'background', 'when', 'where', 'at', 'during', 'while'],
            'task': ['task', 'responsibility', 'role', 'assigned', 'needed', 'had to', 'required', 'challenge'],
            'action': ['action', 'did', 'implemented', 'developed', 'created', 'led', 'managed', 'worked', 'designed'],
            'result': ['result', 'outcome', 'achieved', 'accomplished', 'success', 'improved', 'increased', 'delivered']
        }
    
    def check(self, transcript):
        text_lower = transcript.lower()
        
        components = {}
        for component, keywords in self.star_keywords.items():
            count = sum(1 for kw in keywords if kw in text_lower)
            components[component] = count
        
        present = sum(1 for v in components.values() if v > 0)
        score = (present / 4) * 100
        
        paragraphs = len([p for p in transcript.split('\n\n') if p.strip()])
        if paragraphs >= 4:
            score = min(100, score + 10)
        
        return {
            'score': round(score, 2),
            'components': components,
            'present_count': present,
            'message': f'STAR components found: {present}/4'
        }
    
    def get_missing_components(self, transcript):
        result = self.check(transcript)
        return [k for k, v in result['components'].items() if v == 0]