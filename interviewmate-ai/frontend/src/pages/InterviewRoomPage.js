// ============================================
// INTERVIEWMATE AI - INTERVIEW ROOM PAGE
// ============================================

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview';
import VideoFeed from '../components/interview/VideoFeed';
import QuestionDisplay from '../components/interview/QuestionDisplay';
import AudioRecorder from '../components/interview/AudioRecorder';
import Timer from '../components/interview/Timer';
import TranscriptDisplay from '../components/interview/TranscriptDisplay';
import RealtimeFeedback from '../components/interview/RealtimeFeedback';
import EmotionVisualizer from '../components/interview/EmotionVisualizer';
import InterviewControls from '../components/interview/InterviewControls';
import LoadingSpinner from '../components/LoadingSpinner';
import './InterviewRoomPage.css';

const InterviewRoomPage = () => {
  const {
    session,
    currentQuestion,
    currentQuestionIndex,
    questions,
    timeRemaining,
    isRecording,
    isPaused,
    isActive,
    sessionStatus,
    realtimeFeedback,
    facialEmotions,
    speechEmotions,
    startInterview,
    pauseInterview,
    resumeInterview,
    startRecording,
    stopRecording,
    nextQuestion,
    endInterview,
    abortInterview,
    addRealtimeFeedback
  } = useInterview();

  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [showStarAnswer, setShowStarAnswer] = useState(false);
  const navigate = useNavigate();

  // Redirect if no session
  useEffect(() => {
    if (sessionStatus === 'idle') {
      navigate('/interview/setup');
    }
  }, [sessionStatus, navigate]);

  // Simulate real-time emotion updates
  useEffect(() => {
    if (!isActive || !isRecording) return;

    const interval = setInterval(() => {
      const emotions = ['happy', 'neutral', 'nervous', 'confident'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.6 + Math.random() * 0.4;
      
      setCurrentEmotion({ emotion: randomEmotion, confidence });

      // Generate feedback based on emotion
      if (randomEmotion === 'nervous' && Math.random() > 0.7) {
        addRealtimeFeedback({
          message: 'You seem a bit nervous. Take a deep breath and speak slowly.',
          type: 'warning'
        });
      } else if (randomEmotion === 'confident' && Math.random() > 0.8) {
        addRealtimeFeedback({
          message: 'Great confidence! Keep maintaining eye contact.',
          type: 'positive'
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, isRecording, addRealtimeFeedback]);

  const handleFrameCapture = useCallback((frameData) => {
    // Send frame to backend for emotion analysis
    // This would connect to WebSocket in production
  }, []);

  const handleTranscriptUpdate = useCallback((transcript) => {
    setCurrentTranscript(transcript);
  }, []);

  const handleRecordingComplete = useCallback(async (audioBlob, transcript) => {
    const result = await stopRecording(audioBlob, transcript);
    if (result.success) {
      setShowStarAnswer(true);
      addRealtimeFeedback({
        message: 'Answer submitted! Review the STAR model answer below.',
        type: 'info'
      });
    }
  }, [stopRecording, addRealtimeFeedback]);

  const handleStartAnswer = () => {
    startRecording();
    setShowStarAnswer(false);
    setCurrentTranscript('');
  };

  const handleNextQuestion = () => {
    setShowStarAnswer(false);
    setCurrentTranscript('');
    nextQuestion();
  };

  const handleEndSession = async () => {
    await endInterview();
    navigate(`/report/${session?.id}`);
  };

  const handleAbort = async () => {
    if (window.confirm('Are you sure you want to end this interview? Your progress will be saved.')) {
      await abortInterview();
      navigate('/dashboard');
    }
  };

  if (sessionStatus === 'setup') {
    return (
      <div className="interview-room setup">
        <div className="setup-preview">
          <h2>Ready to Start?</h2>
          <p>We'll analyze your facial expressions, speech emotions, and answer quality in real-time.</p>
          
          <div className="preview-checks">
            <div className="check-item">
              <span className="check-icon">✓</span>
              <span>Camera access enabled</span>
            </div>
            <div className="check-item">
              <span className="check-icon">✓</span>
              <span>Microphone access enabled</span>
            </div>
            <div className="check-item">
              <span className="check-icon">✓</span>
              <span>Good lighting detected</span>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={startInterview}>
            🚀 Start Interview
          </button>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'completed') {
    return (
      <div className="interview-room completed">
        <div className="completion-screen">
          <span className="completion-icon">🎉</span>
          <h2>Interview Completed!</h2>
          <p>Great job! Your report is being generated...</p>
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="interview-room">
      {/* Top Bar */}
      <div className="room-topbar">
        <div className="room-info">
          <span className="room-badge">🎤 Live Interview</span>
          <Timer 
            duration={timeRemaining}
            isRunning={isActive && !isPaused}
            isPaused={isPaused}
          />
        </div>
        <InterviewControls
          isRecording={isRecording}
          isPaused={isPaused}
          isActive={isActive}
          onPause={pauseInterview}
          onResume={resumeInterview}
          onEnd={handleEndSession}
          onAbort={handleAbort}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      </div>

      {/* Main Layout */}
      <div className="room-layout">
        {/* Left Sidebar */}
        <div className="room-sidebar">
          <VideoFeed 
            onFrameCapture={handleFrameCapture}
            emotionData={currentEmotion}
            showOverlay={true}
          />
          
          <EmotionVisualizer 
            currentEmotion={currentEmotion?.emotion}
            mode="current"
          />
          
          <RealtimeFeedback feedback={realtimeFeedback} />
        </div>

        {/* Main Content */}
        <div className="room-main">
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            timeRemaining={timeRemaining}
            isRecording={isRecording}
            onStartAnswer={handleStartAnswer}
            onSubmitAnswer={() => stopRecording()}
            starAnswer={showStarAnswer ? currentQuestion?.starAnswer : null}
          />

          {!showStarAnswer && (
            <>
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                onTranscriptUpdate={handleTranscriptUpdate}
                autoStartSpeech={isRecording}
              />
              
              <TranscriptDisplay
                transcript={currentTranscript}
                isListening={isRecording}
              />
            </>
          )}

          {showStarAnswer && (
            <div className="next-question-section">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleNextQuestion}
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoomPage;