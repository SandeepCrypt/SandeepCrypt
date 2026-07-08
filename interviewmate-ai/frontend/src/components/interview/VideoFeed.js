// ============================================
// INTERVIEWMATE AI - VIDEO FEED COMPONENT
// ============================================

import React, { useEffect, useState } from 'react';
import { useWebcam } from '../../hooks/useWebcam';
import { getEmotionColor } from '../../utils/emotionColors';
import './VideoFeed.css';

const VideoFeed = ({ 
  onFrameCapture, 
  emotionData = null,
  showOverlay = true,
  className = '' 
}) => {
  const { videoRef, isReady, error, startCamera, stopCamera } = useWebcam();
  const [currentEmotion, setCurrentEmotion] = useState('neutral');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Update emotion display
  useEffect(() => {
    if (emotionData?.emotion) {
      setCurrentEmotion(emotionData.emotion);
    }
  }, [emotionData]);

  // Capture frames periodically
  useEffect(() => {
    if (!isReady || !onFrameCapture) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const frameData = canvas.toDataURL('image/jpeg', 0.7);
        onFrameCapture(frameData);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isReady, onFrameCapture, videoRef]);

  const emotionColor = getEmotionColor(currentEmotion);

  if (error) {
    return (
      <div className={`video-feed error ${className}`}>
        <div className="video-error">
          <span className="error-icon">📷❌</span>
          <p className="error-text">{error}</p>
          <button className="btn btn-primary btn-sm" onClick={startCamera}>
            Retry Camera
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-feed ${className}`}>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-element"
        />
        
        {!isReady && (
          <div className="video-loading">
            <LoadingSpinner size="md" text="Starting camera..." />
          </div>
        )}

        {/* Emotion Overlay */}
        {showOverlay && isReady && (
          <div className="video-overlay">
            {/* Emotion Badge */}
            <div 
              className="emotion-badge"
              style={{ 
                background: emotionColor.gradient,
                borderColor: emotionColor.border 
              }}
            >
              <span className="emotion-dot" style={{ background: emotionColor.text }} />
              <span className="emotion-label">
                {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
              </span>
              {emotionData?.confidence && (
                <span className="emotion-confidence">
                  {Math.round(emotionData.confidence * 100)}%
                </span>
              )}
            </div>

            {/* Face Detection Box */}
            {emotionData?.faceBox && (
              <div 
                className="face-box"
                style={{
                  left: `${emotionData.faceBox.x}%`,
                  top: `${emotionData.faceBox.y}%`,
                  width: `${emotionData.faceBox.width}%`,
                  height: `${emotionData.faceBox.height}%`,
                  borderColor: emotionColor.text
                }}
              />
            )}

            {/* Recording Indicator */}
            <div className="recording-indicator">
              <span className="recording-dot" />
              <span className="recording-text">LIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* Camera Status */}
      <div className="video-status">
        <span className={`status-dot ${isReady ? 'active' : 'inactive'}`} />
        <span className="status-text">
          {isReady ? 'Camera Active' : 'Initializing...'}
        </span>
      </div>
    </div>
  );
};

// Simple loading spinner for video
const LoadingSpinner = ({ size, text }) => (
  <div className="video-spinner">
    <div className={`spinner-ring spinner-${size}`} />
    <span>{text}</span>
  </div>
);

export default VideoFeed;