// ============================================
// INTERVIEWMATE AI - QUESTION DISPLAY COMPONENT
// ============================================

import React from 'react';
import { DIFFICULTY_LEVELS } from '../../utils/constants';
import './QuestionDisplay.css';

const QuestionDisplay = ({ 
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  isRecording,
  onStartAnswer,
  onSubmitAnswer,
  starAnswer = null
}) => {
  const difficulty = DIFFICULTY_LEVELS.find(d => d.value === question?.difficulty) || DIFFICULTY_LEVELS[1];

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="question-display">
      {/* Progress Header */}
      <div className="question-header">
        <div className="question-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>

        <div className="question-meta">
          <span 
            className="difficulty-badge"
            style={{ 
              background: difficulty.color + '20',
              color: difficulty.color,
              borderColor: difficulty.color + '40'
            }}
          >
            {difficulty.label}
          </span>
          <span className="type-badge">
            {question?.type?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className={`question-timer ${timeRemaining < 30 ? 'urgent' : ''}`}>
        <span className="timer-icon">⏱️</span>
        <span className="timer-value">{formatTime(timeRemaining)}</span>
      </div>

      {/* Question Text */}
      <div className="question-body">
        <h2 className="question-text">{question?.text}</h2>
        
        {question?.context && (
          <p className="question-context">{question.context}</p>
        )}

        {question?.hints && (
          <div className="question-hints">
            <span className="hints-label">💡 Hints:</span>
            <ul>
              {question.hints.map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="question-actions">
        {!isRecording ? (
          <button 
            className="btn btn-primary btn-lg start-btn"
            onClick={onStartAnswer}
          >
            <span className="btn-icon">🎤</span>
            Start Answering
          </button>
        ) : (
          <button 
            className="btn btn-success btn-lg submit-btn"
            onClick={onSubmitAnswer}
          >
            <span className="btn-icon">✓</span>
            Submit Answer
          </button>
        )}
      </div>

      {/* STAR Model Answer (shown after submission) */}
      {starAnswer && (
        <div className="star-answer">
          <div className="star-header">
            <span className="star-icon">⭐</span>
            <h3>STAR Model Answer</h3>
          </div>
          
          <div className="star-components">
            <div className="star-component">
              <span className="star-label">Situation</span>
              <p>{starAnswer.situation}</p>
            </div>
            <div className="star-component">
              <span className="star-label">Task</span>
              <p>{starAnswer.task}</p>
            </div>
            <div className="star-component">
              <span className="star-label">Action</span>
              <p>{starAnswer.action}</p>
            </div>
            <div className="star-component">
              <span className="star-label">Result</span>
              <p>{starAnswer.result}</p>
            </div>
          </div>

          <div className="star-full">
            <span className="star-label">Complete Answer</span>
            <p>{starAnswer.fullAnswer}</p>
          </div>

          <div className="star-keywords">
            <span className="star-label">Keywords Covered</span>
            <div className="keyword-tags">
              {starAnswer.keywords?.map((kw, i) => (
                <span key={i} className="keyword-tag">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default QuestionDisplay;