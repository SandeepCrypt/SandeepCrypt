// ============================================
// INTERVIEWMATE AI - DASHBOARD PAGE
// ============================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfidenceScoreCard from '../components/reports/ConfidenceScoreCard';
import { formatDate, formatRelativeTime } from '../utils/helpers';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userService.getDashboard();
        setDashboardData(response.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const { recentSessions, stats, upcomingInterviews } = dashboardData || {};

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Here's your interview preparation overview</p>
        </div>
        <Link to="/interview/setup" className="btn btn-primary">
          🎤 Start New Interview
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card dashboard">
          <div className="stat-icon-bg">🎯</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalSessions || 0}</span>
            <span className="stat-label">Total Sessions</span>
          </div>
        </div>
        <div className="stat-card dashboard">
          <div className="stat-icon-bg">⭐</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.avgScore || 0}%</span>
            <span className="stat-label">Avg. Score</span>
          </div>
        </div>
        <div className="stat-card dashboard">
          <div className="stat-icon-bg">🔥</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.bestScore || 0}%</span>
            <span className="stat-label">Best Score</span>
          </div>
        </div>
        <div className="stat-card dashboard">
          <div className="stat-icon-bg">📈</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.streak || 0}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Sessions */}
        <div className="dashboard-card sessions-card">
          <div className="card-header-row">
            <h2>Recent Sessions</h2>
            <Link to="/progress" className="view-link">View All →</Link>
          </div>
          
          {recentSessions?.length === 0 ? (
            <div className="empty-sessions">
              <span className="empty-icon">🎤</span>
              <p>No interviews yet</p>
              <Link to="/interview/setup" className="btn btn-primary btn-sm">
                Start Your First Interview
              </Link>
            </div>
          ) : (
            <div className="sessions-list">
              {recentSessions?.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <span className="session-category">{session.category}</span>
                    <span className="session-company">{session.company}</span>
                    <span className="session-date">
                      {formatRelativeTime(session.date)}
                    </span>
                  </div>
                  <div className="session-score">
                    <ConfidenceScoreCard 
                      score={session.score} 
                      size="sm" 
                      showLabel={false}
                    />
                  </div>
                  <Link 
                    to={`/report/${session.id}`} 
                    className="session-link"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/interview/setup" className="action-item">
              <span className="action-icon">🎤</span>
              <span className="action-label">Start Interview</span>
            </Link>
            <Link to="/resume-upload" className="action-item">
              <span className="action-icon">📄</span>
              <span className="action-label">Upload Resume</span>
            </Link>
            <Link to="/categories" className="action-item">
              <span className="action-icon">🎯</span>
              <span className="action-label">Browse Categories</span>
            </Link>
            <Link to="/company-prep" className="action-item">
              <span className="action-icon">🏢</span>
              <span className="action-label">Company Prep</span>
            </Link>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="dashboard-card chart-card">
          <h2>Performance Trend</h2>
          <div className="chart-placeholder">
            {stats?.trend ? (
              <div className="trend-chart">
                {/* Simple bar chart */}
                {stats.trend.map((point, i) => (
                  <div key={i} className="trend-bar-wrapper">
                    <div 
                      className="trend-bar"
                      style={{ height: `${point.score}%` }}
                    />
                    <span className="trend-label">{i + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart">
                <span>📊</span>
                <p>Complete more interviews to see your trend</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Card */}
        <div className="dashboard-card tips-card">
          <h2>💡 Daily Tip</h2>
          <div className="tip-content">
            <p className="tip-text">
              "Practice the STAR method for behavioral questions. Structure your answers with 
              Situation, Task, Action, and Result to provide clear and compelling responses."
            </p>
            <Link to="/categories" className="tip-link">
              Practice Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;