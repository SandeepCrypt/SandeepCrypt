// ============================================
// INTERVIEWMATE AI - STAR MODEL ANSWER COMPONENT
// ============================================

import React, { useState } from 'react';
import './StarModelAnswer.css';

const StarModelAnswer = ({ 
  answer,
  userAnswer = '',
  complianceScore = 0,
  keywordsMatched = []
}) => {
  const [activeTab, setActiveTab] = useState('breakdown');

  if (!answer) return null;

  const tabs = [
    { id: 'breakdown', label: 'Breakdown', icon: '📋' },
    { id: 'full', label: 'Full Answer', icon: '📝' },
    { id: 'compare', label: 'Compare', icon: '🔍' }
  ];

  const getComplianceColor = (score) => {
    if (score >= 80) return 'var(--success-500)';
    if (score >= 50) return 'var(--warning-500)';
    return 'var(--danger-500)';
  };

  const getComplianceLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 30) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="star-model-answer">
      <div className="star-header">
        <div className="star-title">
          <span className="star-icon">⭐</span>
          <h3>STAR Model Answer</h3>
        </div>
        
        <div className="compliance-score">
          <div 
            className="score-ring"
            style={{ 
              background: `conic-gradient(${getComplianceColor(complianceScore)} ${complianceScore}%, var(--bg-tertiary) 0)` 
            }}
          >
            <span className="score-value">{Math.round(complianceScore)}%</span>
          </div>
          <span className="score-label">{getComplianceLabel(complianceScore)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="star-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`star-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="star-content">
        {activeTab === 'breakdown' && (
          <div className="star-breakdown">
            <div className="star-component">
              <div className="component-header">
                <span className="component-letter">S</span>
                <span className="component-name">Situation</span>
              </div>
              <p className="component-text">{answer.situation}</p>
            </div>
            
            <div className="star-component">
              <div className="component-header">
                <span className="component-letter">T</span>
                <span className="component-name">Task</span>
              </div>
              <p className="component-text">{answer.task}</p>
            </div>
            
            <div className="star-component">
              <div className="component-header">
                <span className="component-letter">A</span>
                <span className="component-name">Action</span>
              </div>
              <p className="component-text">{answer.action}</p>
            </div>
            
            <div className="star-component">
              <div className="component-header">
                <span className="component-letter">R</span>
                <span className="component-name">Result</span>
              </div>
              <p className="component-text">{answer.result}</p>
            </div>
          </div>
        )}

        {activeTab === 'full' && (
          <div className="star-full-answer">
            <p>{answer.fullAnswer}</p>
            
            {answer.keywords && (
              <div className="keywords-section">
                <h4>Key Keywords</h4>
                <div className="keyword-tags">
                  {answer.keywords.map((keyword, i) => (
                    <span 
                      key={i} 
                      className={`keyword-tag ${keywordsMatched.includes(keyword) ? 'matched' : ''}`}
                    >
                      {keyword}
                      {keywordsMatched.includes(keyword) && ' ✓'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="star-compare">
            <div className="compare-section">
              <h4>Your Answer</h4>
              <div className="compare-box user">
                <p>{userAnswer || 'No answer recorded'}</p>
              </div>
            </div>
            
            <div className="compare-divider">VS</div>
            
            <div className="compare-section">
              <h4>Model Answer</h4>
              <div className="compare-box model">
                <p>{answer.fullAnswer}</p>
              </div>
            </div>

            {keywordsMatched.length > 0 && (
              <div className="compare-keywords">
                <h4>Keywords You Matched</h4>
                <div className="matched-keywords">
                  {keywordsMatched.map((kw, i) => (
                    <span key={i} className="matched-tag">✓ {kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StarModelAnswer;