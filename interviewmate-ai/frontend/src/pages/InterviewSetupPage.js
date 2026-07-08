// ============================================
// INTERVIEWMATE AI - INTERVIEW SETUP PAGE
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview';
import { useToast } from '../components/ToastNotification';
import { JOB_CATEGORIES, TARGET_COMPANIES, DIFFICULTY_LEVELS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import './InterviewSetupPage.css';

const InterviewSetupPage = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    categoryId: '',
    companyId: '',
    numQuestions: 10,
    timePerQuestion: 120,
    difficulty: 'mixed',
    resume: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setupInterview } = useInterview();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }
      handleConfigChange('resume', file);
    }
  };

  const handleStart = async () => {
    if (!config.categoryId) {
      showError('Please select a job category');
      return;
    }

    setIsLoading(true);
    const result = await setupInterview({
      ...config,
      resumePath: config.resume ? URL.createObjectURL(config.resume) : null
    });

    if (result.success) {
      navigate('/interview/room');
    } else {
      showError(result.message || 'Failed to start interview');
    }
    setIsLoading(false);
  };

  const steps = [
    { number: 1, title: 'Category', description: 'Select your job domain' },
    { number: 2, title: 'Company', description: 'Choose target company' },
    { number: 3, title: 'Settings', description: 'Configure interview' },
    { number: 4, title: 'Resume', description: 'Upload your resume' }
  ];

  return (
    <div className="interview-setup-page">
      <div className="setup-container">
        {/* Progress Steps */}
        <div className="setup-steps">
          {steps.map((s, i) => (
            <div 
              key={s.number} 
              className={`step-item ${step === s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}
            >
              <div className="step-number">
                {step > s.number ? '✓' : s.number}
              </div>
              <div className="step-info">
                <span className="step-title">{s.title}</span>
                <span className="step-desc">{s.description}</span>
              </div>
              {i < steps.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="setup-content">
          {step === 1 && (
            <div className="step-panel animate-fade-in">
              <h2>Select Job Category</h2>
              <p>Choose the domain you want to practice for</p>
              <div className="categories-grid">
                {JOB_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    className={`category-select-card ${config.categoryId === category.id ? 'selected' : ''}`}
                    onClick={() => handleConfigChange('categoryId', category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-desc">{category.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-panel animate-fade-in">
              <h2>Select Target Company (Optional)</h2>
              <p>Get company-specific questions for better preparation</p>
              <div className="companies-grid">
                <button
                  className={`company-select-card ${config.companyId === '' ? 'selected' : ''}`}
                  onClick={() => handleConfigChange('companyId', '')}
                >
                  <span className="company-icon">🎯</span>
                  <span className="company-name">Generic</span>
                  <span className="company-desc">General questions for all companies</span>
                </button>
                {TARGET_COMPANIES.map(company => (
                  <button
                    key={company.id}
                    className={`company-select-card ${config.companyId === company.id ? 'selected' : ''}`}
                    onClick={() => handleConfigChange('companyId', company.id)}
                  >
                    <span className="company-icon">🏢</span>
                    <span className="company-name">{company.name}</span>
                    <span className="company-desc">{company.focus}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-panel animate-fade-in">
              <h2>Interview Settings</h2>
              <p>Customize your mock interview experience</p>
              
              <div className="settings-form">
                <div className="setting-item">
                  <label>Number of Questions</label>
                  <div className="range-control">
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={config.numQuestions}
                      onChange={(e) => handleConfigChange('numQuestions', parseInt(e.target.value))}
                    />
                    <span className="range-value">{config.numQuestions}</span>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Time per Question</label>
                  <div className="range-control">
                    <input
                      type="range"
                      min="60"
                      max="300"
                      step="30"
                      value={config.timePerQuestion}
                      onChange={(e) => handleConfigChange('timePerQuestion', parseInt(e.target.value))}
                    />
                    <span className="range-value">{Math.floor(config.timePerQuestion / 60)} min</span>
                  </div>
                </div>

                <div className="setting-item">
                  <label>Difficulty Level</label>
                  <div className="difficulty-options">
                    {DIFFICULTY_LEVELS.map(level => (
                      <button
                        key={level.value}
                        className={`difficulty-btn ${config.difficulty === level.value ? 'selected' : ''}`}
                        onClick={() => handleConfigChange('difficulty', level.value)}
                        style={{ '--diff-color': level.color }}
                      >
                        <span className="diff-dot" style={{ background: level.color }} />
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-panel animate-fade-in">
              <h2>Upload Resume (Optional)</h2>
              <p>Our AI will generate personalized questions based on your skills</p>
              
              <div className="upload-area">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  hidden
                />
                <label htmlFor="resume-upload" className="upload-label">
                  {config.resume ? (
                    <div className="file-selected">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{config.resume.name}</span>
                      <span className="file-size">({(config.resume.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <>
                      <span className="upload-icon">📤</span>
                      <span className="upload-text">Click to upload or drag and drop</span>
                      <span className="upload-hint">PDF, DOC, DOCX up to 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className="setup-summary">
                <h3>Interview Summary</h3>
                <div className="summary-items">
                  <div className="summary-item">
                    <span>Category:</span>
                    <strong>{JOB_CATEGORIES.find(c => c.id === config.categoryId)?.name}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Company:</span>
                    <strong>{TARGET_COMPANIES.find(c => c.id === config.companyId)?.name || 'Generic'}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Questions:</span>
                    <strong>{config.numQuestions}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Time per Question:</span>
                    <strong>{Math.floor(config.timePerQuestion / 60)} minutes</strong>
                  </div>
                  <div className="summary-item">
                    <span>Difficulty:</span>
                    <strong>{DIFFICULTY_LEVELS.find(d => d.value === config.difficulty)?.label}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="setup-nav">
          {step > 1 && (
            <button 
              className="btn btn-ghost"
              onClick={() => setStep(step - 1)}
              disabled={isLoading}
            >
              ← Back
            </button>
          )}
          
          {step < 4 ? (
            <button 
              className="btn btn-primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !config.categoryId}
            >
              Next →
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleStart}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" color="white" /> : '🚀 Start Interview'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupPage;