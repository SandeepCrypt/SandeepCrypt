// ============================================
// INTERVIEWMATE AI - EMOTION PIE CHART
// ============================================

import React from 'react';
import { emotionColors } from '../../utils/emotionColors';
import { EMOTIONS } from '../../utils/constants';

const EmotionPieChart = ({ data, size = 200 }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  if (total === 0) {
    return (
      <div className="emotion-pie-chart empty">
        <p>No emotion data available</p>
      </div>
    );
  }

  let currentAngle = 0;
  const radius = size / 2 - 20;
  const center = size / 2;

  const segments = Object.entries(data).map(([emotion, value]) => {
    const percentage = (value / total) * 100;
    const angle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    // Calculate SVG arc path
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      emotion,
      percentage,
      path,
      color: emotionColors[emotion]?.chart || '#9ca3af'
    };
  });

  return (
    <div className="emotion-pie-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((segment, i) => (
          <path
            key={i}
            d={segment.path}
            fill={segment.color}
            stroke="white"
            strokeWidth="2"
            className="pie-segment"
          >
            <title>{segment.emotion}: {Math.round(segment.percentage)}%</title>
          </path>
        ))}
        {/* Center hole for donut effect */}
        <circle cx={center} cy={center} r={radius * 0.5} fill="white" />
      </svg>
      
      <div className="pie-legend">
        {segments.map((segment, i) => (
          <div key={i} className="legend-item">
            <span 
              className="legend-color"
              style={{ background: segment.color }}
            />
            <span className="legend-label">{segment.emotion}</span>
            <span className="legend-value">{Math.round(segment.percentage)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionPieChart;