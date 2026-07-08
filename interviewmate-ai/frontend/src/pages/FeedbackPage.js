// ============================================
// INTERVIEWMATE AI - FEEDBACK PAGE
// ============================================

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import ConfidenceScoreCard from '../components/reports/ConfidenceScoreCard';
import EmotionPieChart from '../components/reports/EmotionPieChart';
import EmotionTimelineChart from '../components/reports/EmotionTimelineChart';
import SpeechAnalyticsCard from '../components/reports/SpeechAnalyticsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportService.getReport(sessionId);
        setReport(response.data);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="feedback-loading">
        <LoadingSpinner size="lg" text="Generating your report..." />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="feedback-error">
        <span className="error-icon">😕</span>
        <h2>Report Not Found</h2>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const {
    overallScore,
    facialScore,
    speechScore,
    clarityScore,
    answerScore,
    eyeContactScore,
    emotionDistribution,
    emotionTimeline,
    speechAnalytics,
    improvementTips,
    session
  } = report;

  return (
    <div className="feedback-page">
      {/* Header */}
      <div className="feedback-header">
        <div>
          <h1>Interview Report</h1>
          <p>{formatDate(session?.date)} • {session?.category} • {session?.company || 'Generic'}</p>
        </div>
        <div className="header-actions">
          <Link to={`/report/${sessionId}`} className="btn btn-ghost">
            📊 Detailed View
          </Link>
          <button className="btn btn-primary">
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="overall-section">
        <ConfidenceScoreCard 
          score={overallScore} 
          size="xl" 
          label="Overall Confidence Score"
        />
        <div className="score-breakdown">
          <div className="breakdown-item">
            <ConfidenceScoreCard score={facialScore} size="sm" label="Facial" />
          </div>
          <div className="breakdown-item">
            <ConfidenceScoreCard score={speechScore} size="sm" label="Speech" />
          </div>
          <div className="breakdown-item">
            <ConfidenceScoreCard score={clarityScore} size="sm" label="Clarity" />
          </div>
          <div className="breakdown-item">
            <ConfidenceScoreCard score={answerScore} size="sm" label="Answer" />
          </div>
          <div className="breakdown-item">
            <ConfidenceScoreCard score={eyeContactScore} size="sm" label="Eye Contact" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Emotion Distribution</h3>
          <EmotionPieChart data={emotionDistribution || {}} />
        </div>
        <div className="chart-card">
          <h3>Emotion Timeline</h3>
          <EmotionTimelineChart data={emotionTimeline || []} />
        </div>
      </div>

      {/* Speech Analytics */}
      <SpeechAnalyticsCard {...(speechAnalytics || {})} />

      {/* Improvement Tips */}
      <div className="tips-section">
        <h3>💡 Improvement Tips</h3>
        <div className="tips-list">
          {(improvementTips || []).map((tip, i) => (
            <div key={i} className={`tip-card ${tip.priority}`}>
              <span className="tip-icon">{tip.icon || '💡'}</span>
              <div className="tip-content">
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="feedback-actions">
        <Link to="/interview/setup" className="btn btn-primary btn-lg">
          🎤 Practice Again
        </Link>
        <Link to="/progress" className="btn btn-ghost btn-lg">
          📈 View Progress
        </Link>
      </div>
    </div>
  );
};

export default FeedbackPage;