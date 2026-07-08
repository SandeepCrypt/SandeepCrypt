// ============================================
// INTERVIEWMATE AI - STAR COMPLIANCE CHART
// ============================================

import React from 'react';
import './StarComplianceChart.css';

const StarComplianceChart = ({ 
  situation,
  task,
  action,
  result,
  overall
}) => {
  const components = [
    { label: 'Situation', score: situation, letter: 'S', color: '#3b82f6' },
    { label: 'Task', score: task, letter: 'T', color: '#8b5cf6' },
    { label: 'Action', score: action, letter: 'A', color: '#f59e0b' },
    { label: 'Result', score: result, letter: 'R', color: '#10b981' }
  ];

  const maxScore = 100;
  const chartHeight = 200;

  return (
    <div className="star-compliance-chart">
      <div className="chart-header">
        <span className="header-icon">⭐</span>
        <h3>STAR Compliance</h3>
        <div 
          className="overall-badge"
          style={{ 
            background: getScoreBg(overall),
            color: getScoreColor(overall)
          }}
        >
          {Math.round(overall)}%
        </div>
      </div>

      <div className="chart-body">
        {/* Bar Chart */}
        <div className="bar-chart" style={{ height: chartHeight }}>
          {components.map(comp => (
            <div key={comp.label} className="bar-item">
              <div className="bar-wrapper">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${(comp.score / maxScore) * 100}%`,
                    background: comp.color
                  }}
                />
              </div>
              <div className="bar-label">
                <span 
                  className="letter-badge"
                  style={{ background: comp.color + '20', color: comp.color }}
                >
                  {comp.letter}
                </span>
                <span className="score-text">{Math.round(comp.score)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Radar/Summary */}
        <div className="star-summary">
          {components.map(comp => (
            <div key={comp.label} className="summary-item">
              <div className="summary-header">
                <span 
                  className="summary-letter"
                  style={{ background: comp.color, color: 'white' }}
                >
                  {comp.letter}
                </span>
                <span className="summary-name">{comp.label}</span>
              </div>
              <div className="summary-bar">
                <div 
                  className="summary-fill"
                  style={{ 
                    width: `${comp.score}%`,
                    background: comp.color
                  }}
                />
              </div>
              <span className="summary-score">{Math.round(comp.score)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="star-feedback">
        {overall >= 80 ? (
          <p className="feedback-positive">🎉 Excellent STAR structure! Your answers are well-organized and easy to follow.</p>
        ) : overall >= 50 ? (
          <p className="feedback-moderate">⚠️ Good attempt. Try to explicitly mention the Result part more clearly.</p>
        ) : (
          <p className="feedback-negative">📚 Your answers need more structure. Practice using the STAR method: Situation → Task → Action → Result.</p>
        )}
      </div>
    </div>
  );
};

const getScoreColor = (score) => {
  if (score >= 80) return 'var(--success-700)';
  if (score >= 50) return 'var(--warning-700)';
  return 'var(--danger-700)';
};

const getScoreBg = (score) => {
  if (score >= 80) return 'var(--success-100)';
  if (score >= 50) return 'var(--warning-100)';
  return 'var(--danger-100)';
};

export default StarComplianceChart;