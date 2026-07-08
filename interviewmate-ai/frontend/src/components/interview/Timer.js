// ============================================
// INTERVIEWMATE AI - TIMER COMPONENT
// ============================================

import React, { useEffect, useState } from 'react';
import './Timer.css';

const Timer = ({ 
  duration, 
  isRunning, 
  isPaused,
  onComplete,
  onTick,
  size = 'md',
  showLabel = true
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        // Check if urgent (less than 30 seconds)
        if (newTime <= 30 && !isUrgent) {
          setIsUrgent(true);
        }

        // Notify parent
        onTick?.(newTime);

        // Complete
        if (newTime <= 0) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, onComplete, onTick, isUrgent]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate progress percentage
  const progress = ((duration - timeLeft) / duration) * 100;
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const sizeMap = {
    sm: { width: 80, fontSize: '1rem' },
    md: { width: 120, fontSize: '1.5rem' },
    lg: { width: 160, fontSize: '2rem' }
  };

  const { width, fontSize } = sizeMap[size];

  return (
    <div className={`timer ${isUrgent ? 'urgent' : ''} ${isPaused ? 'paused' : ''}`}>
      <div className="timer-circle" style={{ width, height: width }}>
        <svg width={width} height={width} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="timer-track"
            cx="50"
            cy="50"
            r="45"
          />
          {/* Progress circle */}
          <circle
            className="timer-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }}
          />
        </svg>
        <div className="timer-content" style={{ fontSize }}>
          <span className="timer-value">{formattedTime}</span>
          {isPaused && <span className="timer-paused-label">PAUSED</span>}
        </div>
      </div>
      {showLabel && (
        <span className="timer-label">
          {isPaused ? 'Interview Paused' : 'Time Remaining'}
        </span>
      )}
    </div>
  );
};

export default Timer;