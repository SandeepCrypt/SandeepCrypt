// ============================================
// INTERVIEWMATE AI - REALTIME FEEDBACK COMPONENT
// ============================================

import React, { useEffect, useState } from 'react';
import './RealtimeFeedback.css';

const RealtimeFeedback = ({ 
  feedback = [],
  maxItems = 3,
  autoDismiss = true,
  dismissDelay = 5000
}) => {
  const [visibleFeedback, setVisibleFeedback] = useState([]);

  useEffect(() => {
    if (feedback.length === 0) return;

    const latest = feedback.slice(-maxItems);
    setVisibleFeedback(latest);

    if (autoDismiss) {
      const timers = latest.map((item, index) => {
        return setTimeout(() => {
          setVisibleFeedback(prev => prev.filter(f => f.id !== item.id));
        }, dismissDelay + (index * 1000));
      });

      return () => timers.forEach(clearTimeout);
    }
  }, [feedback, maxItems, autoDismiss, dismissDelay]);

  const getFeedbackIcon = (type) => {
    const icons = {
      positive: '✅',
      warning: '⚠️',
      info: '💡',
      critical: '🔴',
      encouragement: '👍'
    };
    return icons[type] || icons.info;
  };

  const getFeedbackClass = (type) => {
    return `feedback-item ${type}`;
  };

  if (visibleFeedback.length === 0) return null;

  return (
    <div className="realtime-feedback">
      <div className="feedback-header">
        <span className="feedback-title">💬 Live Tips</span>
      </div>
      <div className="feedback-list">
        {visibleFeedback.map((item) => (
          <div 
            key={item.id} 
            className={getFeedbackClass(item.type)}
          >
            <span className="feedback-icon">{getFeedbackIcon(item.type)}</span>
            <span className="feedback-message">{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimeFeedback;