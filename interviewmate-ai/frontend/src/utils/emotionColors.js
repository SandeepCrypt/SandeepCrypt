// ============================================
// INTERVIEWMATE AI - EMOTION COLOR UTILITIES
// ============================================

import { EMOTIONS } from './constants';

export const emotionColors = {
  [EMOTIONS.HAPPY]: {
    bg: '#ecfdf5',
    text: '#059669',
    border: '#10b981',
    chart: '#10b981',
    gradient: ['#10b981', '#34d399']
  },
  [EMOTIONS.SAD]: {
    bg: '#f3f4f6',
    text: '#4b5563',
    border: '#6b7280',
    chart: '#6b7280',
    gradient: ['#6b7280', '#9ca3af']
  },
  [EMOTIONS.ANGRY]: {
    bg: '#fef2f2',
    text: '#dc2626',
    border: '#ef4444',
    chart: '#ef4444',
    gradient: ['#ef4444', '#f87171']
  },
  [EMOTIONS.FEAR]: {
    bg: '#fffbeb',
    text: '#d97706',
    border: '#f59e0b',
    chart: '#f59e0b',
    gradient: ['#f59e0b', '#fbbf24']
  },
  [EMOTIONS.SURPRISE]: {
    bg: '#f5f3ff',
    text: '#7c3aed',
    border: '#8b5cf6',
    chart: '#8b5cf6',
    gradient: ['#8b5cf6', '#a78bfa']
  },
  [EMOTIONS.DISGUST]: {
    bg: '#f7fee7',
    text: '#65a30d',
    border: '#84cc16',
    chart: '#84cc16',
    gradient: ['#84cc16', '#a3e635']
  },
  [EMOTIONS.NEUTRAL]: {
    bg: '#f9fafb',
    text: '#4b5563',
    border: '#9ca3af',
    chart: '#9ca3af',
    gradient: ['#9ca3af', '#d1d5db']
  }
};

export const getEmotionColor = (emotion) => {
  return emotionColors[emotion] || emotionColors[EMOTIONS.NEUTRAL];
};

export const getEmotionGradient = (emotion) => {
  const colors = getEmotionColor(emotion);
  return `linear-gradient(135deg, ${colors.gradient[0]}, ${colors.gradient[1]})`;
};

export const getConfidenceColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

export const getConfidenceLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Needs Improvement';
  return 'Poor';
};

export const getScoreRingColor = (score) => {
  if (score >= 80) return 'var(--success-500)';
  if (score >= 60) return 'var(--warning-500)';
  return 'var(--danger-500)';
};