# ============================================
# INTERVIEWMATE AI - GRAMMAR CHECKER
# ============================================

import language_tool_python

class GrammarChecker:
    def __init__(self):
        self.tool = None
        self._init_tool()
    
    def _init_tool(self):
        try:
            self.tool = language_tool_python.LanguageTool('en-US')
        except Exception as e:
            print(f"Failed to initialize LanguageTool: {e}")
    
    def check(self, text):
        if not self.tool:
            return {'score': 70, 'errors': 0, 'message': 'Grammar check unavailable'}
        
        try:
            matches = self.tool.check(text)
            error_count = len(matches)
            
            words = len(text.split())
            error_rate = error_count / max(words, 1)
            
            if error_rate < 0.02:
                score = 95
            elif error_rate < 0.05:
                score = 85
            elif error_rate < 0.10:
                score = 70
            elif error_rate < 0.20:
                score = 50
            else:
                score = 30
            
            return {
                'score': score,
                'errors': error_count,
                'error_rate': round(error_rate, 3),
                'message': f'{error_count} grammar issues found'
            }
        except Exception as e:
            return {'score': 50, 'errors': 0, 'message': f'Grammar check error: {str(e)}'}