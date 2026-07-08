// ============================================
// INTERVIEWMATE AI - EYE CONTACT SCORE CARD
// ============================================

import React from 'react';
import './EyeContactScoreCard.css';

const EyeContactScoreCard = ({ 
  score,
  duration,
  lookingAtCamera,
  lookingAway,
  lookingDown,
  lookingUp
}) => {
  const breakdown = [
    { label: 'Looking at Camera', value: lookingAtCamera, color: 'var(--success-500)', icon: '📷' },
    { label: 'Looking Away', value: lookingAway, color: 'var(--warning-500)', icon: '↔️' },
    { label: 'Looking Down', value: lookingDown, color: 'var(--danger-500)', icon: '⬇️' },
    { label: 'Looking Up', value: lookingUp, color: 'var(--primary-500)', icon: '⬆️' }
  ];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="eye-contact-card">
      <div className="card-header">
        <span className="header-icon">👁️</span>
        <h3>Eye Contact</h3>
      </div>

      <div className="eye-contact-main">
        <div className="eye-score-display">
          <div 
            className="eye-score-ring"
            style={{ 
              background: `conic-gradient(${getScoreColor(score)} ${score}%, var(--bg-tertiary) 0)` 
            }}
          >
            <span className="eye-score-value">{Math.round(score)}%</span>
          </div>
          <span className="eye-score-label">
            {score >= 70 ? 'Great eye contact!' : score >= 40 ? 'Room for improvement' : 'Needs work'}
          </span>
        </div>

        <div className="eye-duration">
          <span className="duration-icon">⏱️</span>
          <span className="duration-text">
            Total analyzed: {formatDuration(duration)}
          </span>
        </div>
      </div>

      <div className="eye-breakdown">
        <h4>Breakdown</h4>
        {breakdown.map(item => (
          <div key={item.label} className="breakdown-item">
            <div className="breakdown-header">
              <span className="breakdown-icon">{item.icon}</span>
              <span className="breakdown-label">{item.label}</span>
            </div>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill"
                style={{ 
                  width: `${item.value}%`,
                  background: item.color
                }}
              />
            </div>
            <span className="breakdown-value">{Math.round(item.value)}%</span>
          </div>
        ))}
      </div>

      <div className="eye-tips">
        <h4>💡 Tips</h4>
        <ul>
          {score < 70 && (
            <>
              <li>Try to look directly at the camera, not the screen</li>
              <li>Position your camera at eye level</li>
              <li>Practice maintaining eye contact for 3-5 seconds at a time</li>
            </>
          )}
          {score >= 70 && (
            <>
              <li>Excellent! You're maintaining great eye contact</li>
              <li>Keep natural blinking - don't stare unnaturally</li>
              <li>Occasional brief glances away are normal and natural</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

const getScoreColor = (score) => {
  if (score >= 70) return 'var(--success-500)';
  if (score >= 40) return 'var(--warning-500)';
  return 'var(--danger-500)';
};

export default EyeContactScoreCard;