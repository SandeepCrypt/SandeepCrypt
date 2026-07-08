// ============================================
// INTERVIEWMATE AI - HOME PAGE
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { JOB_CATEGORIES, TARGET_COMPANIES } from '../utils/constants';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🤖',
      title: 'AI Question Generation',
      description: 'Get personalized questions based on your resume, job category, and target company'
    },
    {
      icon: '😊',
      title: 'Emotion Analysis',
      description: 'Real-time facial and speech emotion detection to measure your confidence'
    },
    {
      icon: '⭐',
      title: 'STAR Model Evaluation',
      description: 'Structured answer analysis using Situation-Task-Action-Result framework'
    },
    {
      icon: '📊',
      title: 'Confidence Scoring',
      description: 'Weighted multi-factor scoring combining facial, speech, and answer quality'
    },
    {
      icon: '💡',
      title: 'Real-time Feedback',
      description: 'Live tips during interviews to improve on the spot'
    },
    {
      icon: '📄',
      title: 'PDF Reports',
      description: 'Detailed post-session reports with charts and improvement recommendations'
    }
  ];

  const stats = [
    { value: '15+', label: 'Job Categories' },
    { value: '12', label: 'Target Companies' },
    { value: '500+', label: 'AI Questions' },
    { value: '95%', label: 'Accuracy Rate' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Interview Preparation
          </div>
          <h1 className="hero-title">
            Master Your Interviews with{' '}
            <span className="gradient-text">AI Confidence Scoring</span>
          </h1>
          <p className="hero-description">
            Practice with realistic mock interviews, get real-time emotion analysis, 
            and receive detailed feedback to land your dream job at top companies.
          </p>
          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to="/interview/setup" className="btn btn-primary btn-lg">
                🎤 Start Mock Interview
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
          <div className="hero-trust">
            <span className="trust-text">Trusted by students from</span>
            <div className="trust-logos">
              {TARGET_COMPANIES.slice(0, 6).map(company => (
                <span key={company.id} className="trust-logo" title={company.name}>
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mock-interview-card">
            <div className="mock-header">
              <span className="mock-dot red" />
              <span className="mock-dot yellow" />
              <span className="mock-dot green" />
              <span className="mock-title">Interview Room</span>
            </div>
            <div className="mock-body">
              <div className="mock-video">
                <div className="mock-face">😊</div>
                <div className="mock-emotion">Confident: 87%</div>
              </div>
              <div className="mock-question">
                <p>"Tell me about a time you faced a challenging bug..."</p>
                <div className="mock-timer">⏱️ 01:45</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why InterviewMate AI?</h2>
          <p>Everything you need to ace your next interview</p>
        </div>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="categories-preview">
        <div className="section-header">
          <h2>Popular Job Categories</h2>
          <p>Practice for your specific role</p>
        </div>
        <div className="categories-grid">
          {JOB_CATEGORIES.slice(0, 8).map(category => (
            <Link 
              key={category.id} 
              to={`/categories/${category.id}`}
              className="category-preview-card"
            >
              <span className="preview-icon">{category.icon}</span>
              <span className="preview-name">{category.name}</span>
            </Link>
          ))}
        </div>
        <Link to="/categories" className="view-all-link">
          View All Categories →
        </Link>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Ace Your Interview?</h2>
          <p>Join thousands of candidates who improved their confidence scores by 40%+</p>
          <Link to={isAuthenticated ? "/interview/setup" : "/register"} className="btn btn-primary btn-lg">
            {isAuthenticated ? "Start Interview Now" : "Create Free Account"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;