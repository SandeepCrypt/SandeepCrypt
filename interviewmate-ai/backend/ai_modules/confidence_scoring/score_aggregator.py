# ============================================
# INTERVIEWMATE AI - SCORE AGGREGATOR
# ============================================

from .weight_config import get_weights
from .score_normalizer import ScoreNormalizer

class ScoreAggregator:
    def __init__(self, experience_level='intermediate'):
        self.weights = get_weights(experience_level)
        self.normalizer = ScoreNormalizer()
    
    def aggregate(self, scores):
        if not scores:
            return 0
        
        weighted_sum = 0
        total_weight = 0
        
        for category, score in scores.items():
            weight = self.weights.get(category, 0)
            weighted_sum += score * weight
            total_weight += weight
        
        if total_weight == 0:
            return 0
        
        overall = weighted_sum / total_weight
        return round(overall, 2)
    
    def aggregate_with_details(self, scores):
        overall = self.aggregate(scores)
        
        breakdown = {}
        for category, score in scores.items():
            weight = self.weights.get(category, 0)
            breakdown[category] = {
                'raw_score': score,
                'weight': weight,
                'weighted_score': round(score * weight, 2)
            }
        
        return {
            'overall_score': overall,
            'breakdown': breakdown,
            'weights_used': self.weights
        }
    
    def get_weakest_area(self, scores):
        if not scores:
            return None
        return min(scores, key=scores.get)
    
    def get_strongest_area(self, scores):
        if not scores:
            return None
        return max(scores, key=scores.get)