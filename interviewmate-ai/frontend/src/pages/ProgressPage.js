// ============================================
// INTERVIEWMATE AI - PROGRESS PAGE
// ============================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import ConfidenceScoreCard from '../components/reports/ConfidenceScoreCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, calculateTrend, getTrendInfo } from '../utils/helpers';
import './ProgressPage.css';

const ProgressPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await userService.getProgress();
        setProgressData(response.data);
      } catch (err) {
        console.error('Failed to load progress:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="progress-loading">
        <LoadingSpinner size="lg" text="Loading your progress..." />
      </div>
    );
  }

  const { 
    sessionCount, 
    avgScore, 
    bestScore, 
    weakestArea, 
    strongestArea, 
    trend,
    sessions = []
  } = progressData || {};

  const trendInfo = getTrendInfo(calculateTrend(sessions.map(s => s.score)));

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="progress-header">
        <div>
          <h1>Your Progress</h1>
          <p>Track your interview preparation journey</p>
        </div>
        <div className="trend-badge" style={{ color: trendInfo.color }}>
          <span>{trendInfo.icon}</span>
          <span>{trendInfo.label}</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="progress-overview">
        <div className="overview-card">
          <ConfidenceScoreCard 
            score={avgScore || 0} 
            size="md" 
            label="Average Score"
          />
        </div>
        <div className="overview-card">
          <ConfidenceScoreCard 
            score={bestScore || 0} 
            size="md" 
            label="Best Score"
          />
        </div>
        <div className="overview-card stats">
          <div className="stat-row">
            <span className="stat-label">Total Sessions</span>
            <span className="stat-value">{sessionCount || 0}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Strongest Area</span>
            <span className="stat-value highlight">{strongestArea || 'N/A'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Weakest Area</span>
            <span className="stat-value warning">{weakestArea || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="progress-chart-section">
        <h2>Score Trend</h2>
        <div className="trend-chart-container">
          {sessions.length > 0 ? (
            <div className="trend-chart">
              <svg viewBox={`0 0 ${Math.max(sessions.length * 60, 300)} 200`} preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(tick => (
                  <line
                    key={tick}
                    x1="0"
                    y1={200 - (tick * 2)}
                    x2={Math.max(sessions.length * 60, 300)}
                    y2={200 - (tick * 2)}
                    stroke="#e5e7eb"
                    strokeDasharray="4"
                  />
                ))}
                
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  points={sessions.map((s, i) => `${i * 60 + 30},${200 - s.score * 2}`).join(' ')}
                />
                
                {/* Points */}
                {sessions.map((s, i) => (
                  <circle
                    key={i}
                    cx={i * 60 + 30}
                    cy={200 - s.score * 2}
                    r="6"
                    fill="#2563eb"
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </svg>
              <div className="trend-labels">
                {sessions.map((s, i) => (
                  <span key={i} className="trend-label">
                    {formatDate(s.date, { month: 'short', day: 'numeric' })}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-chart">
              <span>📈</span>
              <p>Complete interviews to see your progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Session History */}
      <div className="history-section">
        <h2>Session History</h2>
        <div className="history-list">
          {sessions.length === 0 ? (
            <div className="empty-history">
              <span>🎤</span>
              <p>No sessions yet. Start your first interview!</p>
              <Link to="/interview/setup" className="btn btn-primary">
                Start Interview
              </Link>
            </div>
          ) : (
            sessions.map((session, index) => (
              <div key={session.id} className="history-item">
                <div className="history-number">{sessions.length - index}</div>
                <div className="history-info">
                  <span className="history-category">{session.category}</span>
                  <span className="history-company">{session.company || 'Generic'}</span>
                  <span className="history-date">{formatDate(session.date)}</span>
                </div>
                <div className="history-score">
                  <ConfidenceScoreCard 
                    score={session.score} 
                    size="sm" 
                    showLabel={false}
                  />
                </div>
                <Link to={`/report/${session.id}`} className="history-link">
                  View Report →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;