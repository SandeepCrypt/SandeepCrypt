// ============================================
// INTERVIEWMATE AI - IMPROVEMENT TIPS COMPONENT
// ============================================

import React, { useState } from 'react';
import './ImprovementTips.css';

const ImprovementTips = ({ tips = [] }) => {
  const [expandedTip, setExpandedTip] = useState(null);

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'var(--danger-500)',
      medium: 'var(--warning-500)',
      low: 'var(--primary-500)'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityBg = (priority) => {
    const colors = {
      high: 'var(--danger-50)',
      medium: 'var(--warning-50)',
      low: 'var(--primary-50)'
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      facial: '😊',
      speech: '🎙️',
      clarity: '🔊',
      answer: '💡',
      eyeContact: '👁️',
      general: '⭐'
    };
    return icons[category] || '⭐';
  };

  if (tips.length === 0) {
    return (
      <div className="improvement-tips">
        <div className="tips-header">
          <span className="header-icon">🎯</span>
          <h3>Improvement Tips</h3>
        </div>
        <div className="tips-empty">
          <span className="empty-icon">🎉</span>
          <p>Great job! No major improvements needed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="improvement-tips">
      <div className="tips-header">
        <span className="header-icon">🎯</span>
        <h3>Improvement Tips</h3>
        <span className="tips-count">{tips.length} tips</span>
      </div>

      <div className="tips-list">
        {tips.map((tip, index) => (
          <div 
            key={index}
            className={`tip-item ${expandedTip === index ? 'expanded' : ''}`}
            onClick={() => setExpandedTip(expandedTip === index ? null : index)}
          >
            <div className="tip-main">
              <div className="tip-icon-wrapper" style={{ background: getPriorityBg(tip.priority) }}>
                <span className="tip-icon">{getCategoryIcon(tip.category)}</span>
              </div>
              
              <div className="tip-content">
                <div className="tip-header">
                  <span className="tip-category">{tip.category}</span>
                  <span 
                    className="tip-priority"
                    style={{ 
                      background: getPriorityBg(tip.priority),
                      color: getPriorityColor(tip.priority)
                    }}
                  >
                    {tip.priority}
                  </span>
                </div>
                <p className="tip-title">{tip.title}</p>
              </div>

              <span className="tip-expand">
                {expandedTip === index ? '▲' : '▼'}
              </span>
            </div>

            {expandedTip === index && (
              <div className="tip-details">
                <p className="tip-description">{tip.description}</p>
                
                {tip.actionItems && (
                  <div className="tip-actions">
                    <span className="actions-label">Action Items:</span>
                    <ul>
                      {tip.actionItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {tip.resources && (
                  <div className="tip-resources">
                    <span className="resources-label">Resources:</span>
                    {tip.resources.map((resource, i) => (
                      <a key={i} href={resource.url} className="resource-link" target="_blank" rel="noopener noreferrer">
                        📎 {resource.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImprovementTips;