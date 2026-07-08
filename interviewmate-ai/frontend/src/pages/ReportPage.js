// ============================================
// INTERVIEWMATE AI - REPORT PAGE
// ============================================

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { pdfService } from '../services/pdfService';
import ConfidenceScoreCard from '../components/reports/ConfidenceScoreCard';
import EmotionPieChart from '../components/reports/EmotionPieChart';
import EmotionTimelineChart from '../components/reports/EmotionTimelineChart';
import SpeechAnalyticsCard from '../components/reports/SpeechAnalyticsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/ToastNotification';
import { formatDate } from '../utils/helpers';
import './ReportPage.css';

const ReportPage = () => {
  const { sessionId } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportService.getReport(sessionId);
        setReport(response.data);
      } catch (err) {
        showError('Failed to load report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [sessionId, showError]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await pdfService.downloadReport(sessionId);
      success('Report downloaded successfully!');
    } catch (err) {
      showError('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="report-loading">
        <LoadingSpinner size="lg" text="Loading report..." />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-error">
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
    session,
    responses
  } = report;

  return (
    <div className="report-page">
      {/* Header */}
      <div className="report-header">
        <div className="header-brand">
          <span className="brand-icon">🎤</span>
          <div>
            <h1>Interview Report</h1>
            <p>Session #{sessionId} • {formatDate(session?.date)}</p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/dashboard" className="btn btn-ghost">← Dashboard</Link>
          <button 
            className="btn btn-primary"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? <LoadingSpinner size="sm" color="white" /> : '📄 Export PDF'}
          </button>
        </div>
      </div>

      {/* Candidate Info */}
      <div className="candidate-info">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Category</span>
            <span className="info-value">{session?.category}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Company</span>
            <span className="info-value">{session?.company || 'Generic'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Duration</span>
            <span className="info-value">{Math.floor(session?.duration / 60)} min</span>
          </div>
          <div className="info-item">
            <span className="info-label">Questions</span>
            <span className="info-value">{responses?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="score-overview">
        <div className="main-score">
          <ConfidenceScoreCard 
            score={overallScore} 
            size="xl" 
            label="Overall Score"
          />
        </div>
        <div className="sub-scores">
          {[
            { label: 'Facial Emotion', score: facialScore, icon: '😊' },
            { label: 'Speech Emotion', score: speechScore, icon: '🗣️' },
            { label: 'Speech Clarity', score: clarityScore, icon: '🔊' },
            { label: 'Answer Quality', score: answerScore, icon: '✍️' },
            { label: 'Eye Contact', score: eyeContactScore, icon: '👁️' }
          ].map(item => (
            <div key={item.label} className="sub-score-item">
              <span className="sub-score-icon">{item.icon}</span>
              <ConfidenceScoreCard 
                score={item.score} 
                size="sm" 
                label={item.label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="analysis-section">
        <h2>Detailed Analysis</h2>
        
        <div className="analysis-grid">
          <div className="analysis-card">
            <h3>Emotion Distribution</h3>
            <EmotionPieChart data={emotionDistribution || {}} size={250} />
          </div>
          
          <div className="analysis-card wide">
            <h3>Emotion Timeline</h3>
            <EmotionTimelineChart data={emotionTimeline || []} height={250} />
          </div>
        </div>

        <div className="analysis-card full">
          <h3>Speech Analytics</h3>
          <SpeechAnalyticsCard {...(speechAnalytics || {})} />
        </div>
      </div>

      {/* Question Responses */}
      <div className="responses-section">
        <h2>Question Responses</h2>
        <div className="responses-list">
          {(responses || []).map((response, index) => (
            <div key={index} className="response-item">
              <div className="response-header">
                <span className="response-number">Q{index + 1}</span>
                <span className="response-question">{response.question}</span>
                <span className="response-score">{response.score}%</span>
              </div>
              <div className="response-details">
                <div className="response-answer">
                  <h4>Your Answer</h4>
                  <p>{response.transcript || 'No transcript available'}</p>
                </div>
                <div className="response-feedback">
                  <h4>AI Feedback</h4>
                  <p>{response.feedback}</p>
                  <div className="response-metrics">
                    <span>STAR: {response.starScore}%</span>
                    <span>Keywords: {response.keywordsMatched}/{response.keywordsTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Plan */}
      <div className="improvement-section">
        <h2>Improvement Plan</h2>
        <div className="improvement-grid">
          {(improvementTips || []).map((tip, i) => (
            <div key={i} className={`improvement-card ${tip.priority}`}>
              <div className="improvement-header">
                <span className="improvement-number">{i + 1}</span>
                <h4>{tip.title}</h4>
              </div>
              <p>{tip.description}</p>
              {tip.resources && (
                <div className="improvement-resources">
                  <span>Recommended:</span>
                  <ul>
                    {tip.resources.map((resource, j) => (
                      <li key={j}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="report-footer">
        <Link to="/interview/setup" className="btn btn-primary btn-lg">
          🎤 Start New Interview
        </Link>
        <Link to="/progress" className="btn btn-ghost btn-lg">
          📈 View Progress
        </Link>
      </div>
    </div>
  );
};

export default ReportPage;