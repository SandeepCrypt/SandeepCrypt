// ============================================
// INTERVIEWMATE AI - INTERVIEW CONTROLS COMPONENT
// ============================================

import React from 'react';
import './InterviewControls.css';

const InterviewControls = ({
  isRecording,
  isPaused,
  isActive,
  canStart,
  onStart,
  onPause,
  onResume,
  onStop,
  onEnd,
  onAbort,
  questionNumber,
  totalQuestions
}) => {
  return (
    <div className="interview-controls">
      <div className="controls-progress">
        <span className="progress-text">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="progress-dots">
          {[...Array(totalQuestions)].map((_, i) => (
            <span 
              key={i} 
              className={`progress-dot ${i < questionNumber ? 'completed' : ''} ${i === questionNumber - 1 ? 'current' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="controls-buttons">
        {!isActive && canStart && (
          <button className="control-btn primary" onClick={onStart}>
            <span>▶️</span> Start Interview
          </button>
        )}

        {isActive && !isRecording && (
          <button className="control-btn record" onClick={onStart}>
            <span>🔴</span> Record Answer
          </button>
        )}

        {isActive && isRecording && !isPaused && (
          <>
            <button className="control-btn pause" onClick={onPause}>
              <span>⏸️</span> Pause
            </button>
            <button className="control-btn stop" onClick={onStop}>
              <span>⏹️</span> Stop
            </button>
          </>
        )}

        {isActive && isPaused && (
          <>
            <button className="control-btn resume" onClick={onResume}>
              <span>▶️</span> Resume
            </button>
            <button className="control-btn stop" onClick={onStop}>
              <span>⏹️</span> Stop
            </button>
          </>
        )}

        {isActive && (
          <button className="control-btn end" onClick={onEnd}>
            <span>🏁</span> End Session
          </button>
        )}

        <button className="control-btn abort" onClick={onAbort}>
          <span>❌</span> Abort
        </button>
      </div>
    </div>
  );
};

export default InterviewControls;