// ============================================
// INTERVIEWMATE AI - USE CONFIDENCE SCORE HOOK
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_SCORE_WEIGHTS } from '../utils/constants';

export const useConfidenceScore = (initialWeights = DEFAULT_SCORE_WEIGHTS) => {
  const [scores, setScores] = useState({
    facial: 0,
    speech: 0,
    clarity: 0,
    answer: 0,
    eyeContact: 0
  });

  const [weights, setWeights] = useState(initialWeights);

  // Calculate weighted overall score
  const overallScore = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return 0;

    const weightedSum = Object.entries(scores).reduce((sum, [key, score]) => {
      return sum + (score * (weights[key] || 0));
    }, 0);

    return Math.round((weightedSum / totalWeight) * 100) / 100;
  }, [scores, weights]);

  // Score category
  const scoreCategory = useMemo(() => {
    if (overallScore >= 80) return 'excellent';
    if (overallScore >= 60) return 'good';
    if (overallScore >= 40) return 'average';
    if (overallScore >= 20) return 'needs_improvement';
    return 'poor';
  }, [overallScore]);

  // Update individual score
  const updateScore = useCallback((type, value) => {
    setScores(prev => ({
      ...prev,
      [type]: Math.max(0, Math.min(100, value))
    }));
  }, []);

  // Update multiple scores at once
  const updateScores = useCallback((newScores) => {
    setScores(prev => ({
      ...prev,
      ...Object.entries(newScores).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: Math.max(0, Math.min(100, value))
      }), {})
    }));
  }, []);

  // Update weights
  const updateWeights = useCallback((newWeights) => {
    setWeights(prev => ({
      ...prev,
      ...newWeights
    }));
  }, []);

  // Reset all scores
  const resetScores = useCallback(() => {
    setScores({
      facial: 0,
      speech: 0,
      clarity: 0,
      answer: 0,
      eyeContact: 0
    });
  }, []);

  // Get score breakdown for display
  const scoreBreakdown = useMemo(() => {
    return Object.entries(scores).map(([key, score]) => ({
      type: key,
      score,
      weight: weights[key],
      weightedScore: Math.round(score * weights[key] * 100) / 100,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    }));
  }, [scores, weights]);

  return {
    scores,
    weights,
    overallScore,
    scoreCategory,
    scoreBreakdown,
    updateScore,
    updateScores,
    updateWeights,
    resetScores
  };
};