// ============================================
// INTERVIEWMATE AI - CONFIDENCE SCORE CARD
// ============================================

import React from 'react';
import { getConfidenceColor, getConfidenceLabel } from '../../utils/emotionColors';
import './ConfidenceScoreCard.css';

const ConfidenceScoreCard = ({ 
  score, 
  label = 'Overall Confidence',
  size = 'lg',
  showLabel = true,
  animate = true 
}) => {
  const color = getConfidenceColor(score);
  const confidenceLabel = getConfidenceLabel(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeMap = {
    sm: { width: 80, fontSize: '1.5rem', labelSize: '0.75rem' },
    md: { width: 120, fontSize: '2rem', labelSize: '0.875rem' },
    lg: { width: 160, fontSize: '2.5rem', labelSize: '1rem' },
    xl: { width: 200, fontSize: '3rem', labelSize: '1.125rem' }
  };

  const { width, fontSize, labelSize } = sizeMap[size];

  return (
    <div className={`confidence-score-card ${animate ? 'animate' : ''}`}>
      <div className="score-ring-wrapper" style={{ width, height: width }}>
        <svg width={width} height={width} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="score-ring-bg"
            cx="50"
            cy="50"
            r="45"
          />
          {/* Progress circle */}
          <circle
            className="score-ring-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: animate ? circumference : strokeDashoffset,
              animation: animate ? `scoreFill 1.5s ease forwards 0.5s` : 'none'
            }}
          />
        </svg>
        <div className="score-content" style={{ fontSize }}>
          <span className="score-value" style={{ color }}>
            {Math.round(score)}
          </span>
          <span className="score-percent">%</span>
        </div>
      </div>
      
      {showLabel && (
        <div className="score-info">
          <span className="score-title" style={{ fontSize: labelSize }}>
            {label}
          </span>
          <span 
            className="score-badge"
            style={{ 
              background: color + '20',
              color: color,
              borderColor: color + '40'
            }}
          >
            {confidenceLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConfidenceScoreCard;