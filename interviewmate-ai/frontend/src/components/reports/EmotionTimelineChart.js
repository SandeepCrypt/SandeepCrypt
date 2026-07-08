// ============================================
// INTERVIEWMATE AI - EMOTION TIMELINE CHART
// ============================================

import React from 'react';
import { emotionColors } from '../../utils/emotionColors';

const EmotionTimelineChart = ({ data, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="emotion-timeline-chart empty">
        <p>No timeline data available</p>
      </div>
    );
  }

  const emotions = [...new Set(data.map(d => d.emotion))];
  const maxTime = Math.max(...data.map(d => d.timestamp));
  const minTime = Math.min(...data.map(d => d.timestamp));
  const timeRange = maxTime - minTime || 1;

  const chartWidth = 800;
  const chartHeight = height;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  const xScale = (timestamp) => {
    return padding.left + ((timestamp - minTime) / timeRange) * (chartWidth - padding.left - padding.right);
  };

  const yScale = (confidence) => {
    return padding.top + (1 - confidence) * (chartHeight - padding.top - padding.bottom);
  };

  return (
    <div className="emotion-timeline-chart">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(tick => (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={yScale(tick)}
              x2={chartWidth - padding.right}
              y2={yScale(tick)}
              stroke="#e5e7eb"
              strokeDasharray="4"
            />
            <text
              x={padding.left - 10}
              y={yScale(tick) + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {Math.round(tick * 100)}%
            </text>
          </g>
        ))}

        {/* Emotion lines */}
        {emotions.map(emotion => {
          const emotionData = data.filter(d => d.emotion === emotion);
          const color = emotionColors[emotion]?.chart || '#9ca3af';

          const pathD = emotionData.map((d, i) => {
            const x = xScale(d.timestamp);
            const y = yScale(d.confidence);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');

          return (
            <g key={emotion}>
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {emotionData.map((d, i) => (
                <circle
                  key={i}
                  cx={xScale(d.timestamp)}
                  cy={yScale(d.confidence)}
                  r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </g>
          );
        })}

        {/* X-axis label */}
        <text
          x={chartWidth / 2}
          y={chartHeight - 5}
          textAnchor="middle"
          fontSize="12"
          fill="#6b7280"
        >
          Time
        </text>
      </svg>

      {/* Legend */}
      <div className="timeline-legend">
        {emotions.map(emotion => (
          <div key={emotion} className="legend-item">
            <span 
              className="legend-line"
              style={{ background: emotionColors[emotion]?.chart }}
            />
            <span className="legend-label">{emotion}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionTimelineChart;