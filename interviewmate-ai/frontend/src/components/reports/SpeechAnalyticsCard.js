// ============================================
// INTERVIEWMATE AI - SPEECH ANALYTICS CARD
// ============================================

import React from 'react';
import './SpeechAnalyticsCard.css';

const SpeechAnalyticsCard = ({ 
  clarityScore,
  pace,
  fillerWords,
  pronunciation,
  volume
}) => {
  const metrics = [
    { 
      label: 'Clarity', 
      score: clarityScore, 
      icon: '🔊',
      description: 'How clear and understandable your speech is'
    },
    { 
      label: 'Pace', 
      score: pace.score, 
      value: pace.wpm,
      unit: 'WPM',
      icon: '⏱️',
      description: 'Words per minute (ideal: 120-150)'
    },
    { 
      label: 'Filler Words', 
      score: fillerWords.score, 
      value: fillerWords.count,
      unit: 'count',
      icon: '💬',
      description: 'Um, uh, like, you know, etc.'
    },
    { 
      label: 'Pronunciation', 
      score: pronunciation, 
      icon: '🗣️',
      description: 'Accuracy of word pronunciation'
    },
    { 
      label: 'Volume', 
      score: volume.score, 
      value: volume.level,
      unit: 'dB',
      icon: '📢',
      description: 'Speech volume consistency'
    }
  ];

  return (
    <div className="speech-analytics-card">
      <div className="card-header">
        <span className="header-icon">🎙️</span>
        <h3>Speech Analytics</h3>
      </div>

      <div className="metrics-grid">
        {metrics.map(metric => (
          <div key={metric.label} className="metric-item">
            <div className="metric-header">
              <span className="metric-icon">{metric.icon}</span>
              <div className="metric-info">
                <span className="metric-label">{metric.label}</span>
                <span className="metric-description">{metric.description}</span>
              </div>
            </div>
            
            <div className="metric-score">
              <div className="score-bar-bg">
                <div 
                  className="score-bar-fill"
                  style={{ 
                    width: `${metric.score}%`,
                    background: getScoreColor(metric.score)
                  }}
                />
              </div>
              <span className="score-value">{Math.round(metric.score)}%</span>
            </div>

            {metric.value !== undefined && (
              <span className="metric-value">
                {metric.value} {metric.unit}
              </span>
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

export default SpeechAnalyticsCard;