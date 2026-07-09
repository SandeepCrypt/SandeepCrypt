# ============================================
# INTERVIEWMATE AI - SENTIMENT ANALYZER
# ============================================

class SentimentAnalyzer:
    def __init__(self):
        self.positive_words = {
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
            'success', 'achieved', 'accomplished', 'improved', 'increased',
            'happy', 'pleased', 'satisfied', 'confident', 'positive',
            'effective', 'efficient', 'successful', 'outstanding', 'superb'
        }
        self.negative_words = {
            'bad', 'poor', 'terrible', 'awful', 'horrible', 'worst',
            'failed', 'failure', 'problem', 'issue', 'difficult', 'hard',
            'sad', 'disappointed', 'frustrated', 'angry', 'negative',
            'ineffective', 'inefficient', 'unsuccessful', 'weak', 'struggle'
        }
    
    def analyze(self, text):
        words = text.lower().split()
        
        pos_count = sum(1 for w in words if w in self.positive_words)
        neg_count = sum(1 for w in words if w in self.negative_words)
        
        total = pos_count + neg_count
        if total == 0:
            return {'label': 'neutral', 'score': 0.5, 'positive': 0, 'negative': 0}
        
        sentiment_score = pos_count / total
        
        if sentiment_score > 0.6:
            label = 'positive'
        elif sentiment_score < 0.4:
            label = 'negative'
        else:
            label = 'neutral'
        
        return {
            'label': label,
            'score': round(sentiment_score, 3),
            'positive': pos_count,
            'negative': neg_count
        }