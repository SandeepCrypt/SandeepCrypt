// ============================================
// INTERVIEWMATE AI - ABOUT PAGE
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AboutPage.css';

const AboutPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Questions',
      description: 'Our LLM-based engine generates unique, personalized questions based on your resume and target role.'
    },
    {
      icon: '😊',
      title: 'Facial Emotion Detection',
      description: 'Real-time analysis of your facial expressions using OpenCV and deep learning models.'
    },
    {
      icon: '🗣️',
      title: 'Speech Analysis',
      description: 'Advanced audio processing to detect confidence, stress, and clarity in your voice.'
    },
    {
      icon: '⭐',
      title: 'STAR Model Scoring',
      description: 'Automated evaluation of your answers against the Situation-Task-Action-Result framework.'
    },
    {
      icon: '📊',
      title: 'Confidence Scoring',
      description: 'Weighted multi-factor scoring system combining all analysis dimensions.'
    },
    {
      icon: '📄',
      title: 'Detailed Reports',
      description: 'Comprehensive PDF reports with charts, improvement tips, and progress tracking.'
    }
  ];

  const techStack = [
    { category: 'Frontend', items: ['React.js 18', 'WebRTC', 'CSS3 Animations'] },
    { category: 'Backend', items: ['Python Flask', 'REST API', 'JWT Auth'] },
    { category: 'AI/ML', items: ['TensorFlow', 'OpenCV', 'spaCy', 'Librosa'] },
    { category: 'Database', items: ['MySQL', 'MongoDB', 'Redis Cache'] }
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <h1>About InterviewMate AI</h1>
        <p>Revolutionizing interview preparation with artificial intelligence</p>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            We believe everyone deserves a fair chance at their dream job. InterviewMate AI 
            democratizes interview preparation by providing objective, data-driven feedback 
            that was previously only available through expensive coaching services.
          </p>
          <p>
            By combining computer vision, natural language processing, and speech analysis, 
            we help candidates identify their weaknesses, improve their communication skills, 
            and build confidence before the real interview.
          </p>
        </div>
        <div className="mission-stats">
          <div className="mission-stat">
            <span className="stat-number">10,000+</span>
            <span className="stat-desc">Candidates Helped</span>
          </div>
          <div className="mission-stat">
            <span className="stat-number">40%</span>
            <span className="stat-desc">Avg. Score Improvement</span>
          </div>
          <div className="mission-stat">
            <span className="stat-number">95%</span>
            <span className="stat-desc">Accuracy Rate</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-features">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card about">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="about-tech">
        <h2>Technology Stack</h2>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <div key={i} className="tech-card">
              <h4>{tech.category}</h4>
              <ul>
                {tech.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Ready to Transform Your Interview Skills?</h2>
        <p>Join thousands of candidates who have improved their confidence and landed their dream jobs.</p>
        <Link 
          to={isAuthenticated ? "/interview/setup" : "/register"} 
          className="btn btn-primary btn-lg"
        >
          {isAuthenticated ? "Start Practicing" : "Get Started Free"}
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;