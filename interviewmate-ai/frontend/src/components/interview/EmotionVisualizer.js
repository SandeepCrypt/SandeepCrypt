// ============================================
// INTERVIEWMATE AI - EMOTION VISUALIZER COMPONENT
// ============================================

import React from 'react';
import { emotionColors, EMOTION_LABELS } from '../../utils/emotionColors';
import { EMOTIONS } from '../../utils/constants';
import './EmotionVisualizer.css';

const EmotionVisualizer = ({ 
  facialEmotions = [],
  speechEmotions = [],
  currentEmotion = null,
  mode = 'current' // 'current', 'timeline', 'distribution'
}) => {
  // Current emotion display
  if (mode === 'current') {
    const emotion = currentEmotion || EMOTIONS.NEUTRAL;
    const colors = emotionColors[emotion] || emotionColors[EMOTIONS.NEUTRAL];
    
    return (
      <div className="emotion-visualizer current">
        <div 
          className="emotion-gauge"
          style={{ background: colors.gradient }}
        >
          <span className="emotion-emoji">{getEmotionEmoji(emotion)}</span>
          <span className="emotion-name">{EMOTION_LABELS[emotion]}</span>
        </div>
      </div>
    );
  }

  // Timeline display
  if (mode === 'timeline') {
    const combined = [...facialEmotions, ...speechEmotions].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    return (
      <div className="emotion-visualizer timeline">
        <h4 className="timeline-title">Emotion Timeline</h4>
        <div className="timeline-chart">
          {combined.map((item, index) => (
            <div 
              key={index}
              className="timeline-bar"
              style={{
                background: emotionColors[item.emotion]?.chart || '#9ca3af',
                height: `${(item.confidence || 0.5) * 100}%`
              }}
              title={`${item.emotion} (${Math.round((item.confidence || 0) * 100)}%)`}
            />
          ))}
        </div>
        <div className="timeline-legend">
          {Object.values(EMOTIONS).map(emotion => (
            <div key={emotion} className="legend-item">
              <span 
                className="legend-dot"
                style={{ background: emotionColors[emotion]?.chart }}
              />
              <span className="legend-label">{emotion}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Distribution display
  if (mode === 'distribution') {
    const allEmotions = [...facialEmotions, ...speechEmotions];
    const distribution = calculateDistribution(allEmotions);

    return (
      <div className="emotion-visualizer distribution">
        <h4 className="distribution-title">Emotion Distribution</h4>
        <div className="distribution-chart">
          {Object.entries(distribution).map(([emotion, count]) => {
            const percentage = (count / allEmotions.length) * 100;
            const colors = emotionColors[emotion];
            
            return (
              <div key={emotion} className="distribution-bar-wrapper">
                <div className="distribution-label">
                  <span>{getEmotionEmoji(emotion)}</span>
                  <span>{emotion}</span>
                </div>
                <div className="distribution-bar-bg">
                  <div 
                    className="distribution-bar-fill"
                    style={{ 
                      width: `${percentage}%`,
                      background: colors?.gradient || '#9ca3af'
                    }}
                  />
                </div>
                <span className="distribution-percentage">
                  {Math.round(percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

const getEmotionEmoji = (emotion) => {
  const emojis = {
    [EMOTIONS.HAPPY]: '😊',
    [EMOTIONS.SAD]: '😢',
    [EMOTIONS.ANGRY]: '😠',
    [EMOTIONS.FEAR]: '😨',
    [EMOTIONS.SURPRISE]: '😲',
    [EMOTIONS.DISGUST]: '🤢',
    [EMOTIONS.NEUTRAL]: '😐'
  };
  return emojis[emotion] || '😐';
};

const calculateDistribution = (emotions) => {
  const dist = {};
  emotions.forEach(e => {
    dist[e.emotion] = (dist[e.emotion] || 0) + 1;
  });
  return dist;
};

export default EmotionVisualizer;