// ============================================
// INTERVIEWMATE AI - PROGRESS LINE CHART
// ============================================

import React from 'react';
import { formatDate } from '../../utils/helpers';

const ProgressLineChart = ({ 
  data,
  height = 300,
  showGrid = true,
  showPoints = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="progress-line-chart empty">
        <p>No progress data available yet</p>
        <span>Complete your first interview to see your progress!</span>
      </div>
    );
  }

  const chartWidth = 800;
  const chartHeight = height;
  const padding = { top: 30, right: 40, bottom: 50, left: 50 };

  const scores = data.map(d => d.score);
  const minScore = Math.min(...scores, 0);
  const maxScore = Math.max(...scores, 100);
  const scoreRange = maxScore - minScore || 100;

  const xScale = (index) => {
    return padding.left + (index / (data.length - 1 || 1)) * (chartWidth - padding.left - padding.right);
  };

  const yScale = (score) => {
    return padding.top + (1 - (score - minScore) / scoreRange) * (chartHeight - padding.top - padding.bottom);
  };

  // Generate path
  const pathD = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(d.score);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Area path (for gradient fill)
  const areaD = `${pathD} L ${xScale(data.length - 1)} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  return (
    <div className="progress-line-chart">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid && [0, 25, 50, 75, 100].map(tick => {
          const y = yScale(minScore + (scoreRange * tick) / 100);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {Math.round(minScore + (scoreRange * tick) / 100)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {showPoints && data.map((d, i) => (
          <g key={i}>
            <circle
              cx={xScale(i)}
              cy={yScale(d.score)}
              r="6"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="3"
            />
            {/* Tooltip on hover would go here */}
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={chartHeight - padding.bottom + 20}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
            transform={`rotate(-45, ${xScale(i)}, ${chartHeight - padding.bottom + 20})`}
          >
            {formatDate(d.date, { month: 'short', day: 'numeric' })}
          </text>
        ))}

        {/* Y-axis label */}
        <text
          x={20}
          y={chartHeight / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#6b7280"
          transform={`rotate(-90, 20, ${chartHeight / 2})`}
        >
          Score
        </text>
      </svg>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-line" style={{ background: '#3b82f6' }} />
          <span>Overall Score</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressLineChart;