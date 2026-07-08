// ============================================
// INTERVIEWMATE AI - ANSWER QUALITY CARD
// ============================================

import React from 'react';
import './AnswerQualityCard.css';

const AnswerQualityCard = ({ 
  relevance,
  grammar,
  structure,
  keywords,
  length
}) => {
  const aspects = [
    {
      label: 'Relevance',
      score: relevance,
      icon: '🎯',
      description: 'How well your answer addresses the question'
    },
    {
      label: 'Grammar',
      score: grammar,
      icon: '✍️',
      description: 'Grammar and language correctness'
    },
    {
      label: 'Structure',
      score: structure,
      icon: '🏗️',
      description: 'Organization and logical flow'
    },
    {
      label: 'Keywords',
      score: keywords.score,
      matched: keywords.matched,
      total: keywords.total,
      icon: '🔑',
      description: 'Expected keywords covered'
    },
    {
      label: 'Length',
      score: length.score,
      wordCount: length.wordCount,
      idealRange: length.idealRange,
      icon: '📏',
      description: 'Appropriate answer length'
    }
  ];

  return (
    <div className="answer-quality-card">
      <div className="card-header">
        <span className="header-icon">💡</span>
        <h3>Answer Quality</h3>
      </div>

      <div className="quality-aspects">
        {aspects.map(aspect => (
          <div key={aspect.label} className="quality-item">
            <div className="quality-main">
              <span className="quality-icon">{aspect.icon}</span>
              <div className="quality-info">
                <span className="quality-label">{aspect.label}</span>
                <span className="quality-desc">{aspect.description}</span>
              </div>
              <div className="quality-score">
                <div 
                  className="score-circle"
                  style={{ 
                    background: `conic-gradient(${getScoreColor(aspect.score)} ${aspect.score}%, var(--bg-tertiary) 0)`
                  }}
                >
                  <span>{Math.round(aspect.score)}</span>
                </div>
              </div>
            </div>

            {/* Additional details */}
            {aspect.matched !== undefined && (
              <div className="quality-detail">
                <span className="detail-text">
                  Matched {aspect.matched} of {aspect.total} keywords
                </span>
                <div className="keyword-bars">
                  {[...Array(aspect.total)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`keyword-bar ${i < aspect.matched ? 'matched' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {aspect.wordCount !== undefined && (
              <div className="quality-detail">
                <span className="detail-text">
                  {aspect.wordCount} words (ideal: {aspect.idealRange})
                </span>
                <div className="length-bar">
                  <div 
                    className="length-indicator"
                    style={{ 
                      left: `${Math.min((aspect.wordCount / 300) * 100, 100)}%`,
                      background: getScoreColor(aspect.score)
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const getScoreColor = (score) => {
  if (score >= 80) return 'var(--success-500)';
  if (score >= 60) return 'var(--warning-500)';
  return 'var(--danger-500)';
};

export default AnswerQualityCard;