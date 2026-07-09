# ============================================
# INTERVIEWMATE AI - ANSWER ANALYZER
# ============================================

from .nlp_utils import NLPUtils
from .keyword_extractor import KeywordExtractor
from .sentiment_analyzer import SentimentAnalyzer
from .grammar_checker import GrammarChecker
from .relevance_scorer import RelevanceScorer
from .star_compliance_checker import StarComplianceChecker

class AnswerAnalyzer:
    def __init__(self):
        self.keyword_extractor = KeywordExtractor()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.grammar_checker = GrammarChecker()
        self.relevance_scorer = RelevanceScorer()
        self.star_checker = StarComplianceChecker()
        self.nlp_utils = NLPUtils()
    
    def analyze(self, transcript, question, expected_keywords=None):
        if not transcript or not transcript.strip():
            return {
                'score': 0,
                'feedback': 'No answer provided.',
                'details': {}
            }
        
        details = {}
        
        # Relevance
        relevance = self.relevance_scorer.score(transcript, question)
        details['relevance'] = relevance
        
        # Grammar
        grammar = self.grammar_checker.check(transcript)
        details['grammar'] = grammar
        
        # STAR compliance
        star = self.star_checker.check(transcript)
        details['star_compliance'] = star
        
        # Keywords
        keywords = self.keyword_extractor.extract_coverage(transcript, expected_keywords or [])
        details['keywords'] = keywords
        
        # Sentiment
        sentiment = self.sentiment_analyzer.analyze(transcript)
        details['sentiment'] = sentiment
        
        # Length
        word_count = self.nlp_utils.count_words(transcript)
        if 100 <= word_count <= 300:
            length_score = 100
        elif 50 <= word_count < 100:
            length_score = 80
        elif word_count < 50:
            length_score = 50
        else:
            length_score = 85
        details['length'] = {'word_count': word_count, 'score': length_score}
        
        # Calculate overall score
        score = (
            relevance['score'] * 0.25 +
            grammar['score'] * 0.20 +
            star['score'] * 0.25 +
            keywords['score'] * 0.15 +
            length_score * 0.15
        )
        
        feedback = self._generate_feedback(details)
        
        return {
            'score': round(score, 2),
            'feedback': feedback,
            'details': details
        }
    
    def _generate_feedback(self, details):
        parts = []
        
        if details['relevance']['score'] < 50:
            parts.append("Your answer doesn't seem directly related to the question.")
        
        missing = [k for k, v in details['star_compliance']['components'].items() if v == 0]
        if missing:
            parts.append(f"Consider including these STAR components: {', '.join(missing)}.")
        
        if details['grammar']['score'] < 70:
            parts.append("Watch your grammar and sentence structure.")
        
        if details['length']['word_count'] < 50:
            parts.append("Your answer is quite short. Try to elaborate more.")
        
        if not parts:
            return "Great answer! Well-structured and comprehensive."
        
        return " ".join(parts)