// ============================================
// INTERVIEWMATE AI - AUDIO RECORDER COMPONENT
// ============================================

import React from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import './AudioRecorder.css';

const AudioRecorder = ({ 
  onRecordingComplete, 
  onTranscriptUpdate,
  autoStartSpeech = true,
  maxDuration = 300 // 5 minutes
}) => {
  const {
    isRecording,
    isPaused,
    formattedTime,
    audioUrl,
    error: audioError,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    clearRecording
  } = useAudioRecorder();

  const {
    isListening,
    fullTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechToText();

  // Handle start recording
  const handleStart = async () => {
    await startRecording();
    if (autoStartSpeech) {
      startListening();
    }
  };

  // Handle stop recording
  const handleStop = async () => {
    stopRecording();
    stopListening();
    
    // Wait a bit for blob to be ready
    setTimeout(() => {
      const audioBlob = new Blob([audioUrl], { type: 'audio/webm' });
      onRecordingComplete?.(audioBlob, fullTranscript);
    }, 100);
  };

  // Handle pause
  const handlePause = () => {
    pauseRecording();
    stopListening();
  };

  // Handle resume
  const handleResume = () => {
    resumeRecording();
    startListening();
  };

  // Clear everything
  const handleClear = () => {
    clearRecording();
    resetTranscript();
  };

  // Auto-stop at max duration
  React.useEffect(() => {
    if (formattedTime >= maxDuration && isRecording) {
      handleStop();
    }
  }, [formattedTime, maxDuration, isRecording]);

  // Send transcript updates
  React.useEffect(() => {
    onTranscriptUpdate?.(fullTranscript);
  }, [fullTranscript, onTranscriptUpdate]);

  const error = audioError || speechError;

  return (
    <div className="audio-recorder">
      {/* Waveform Visualization */}
      <div className={`waveform ${isRecording ? 'active' : ''}`}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="wave-bar"
            style={{
              animationDelay: `${i * 0.05}s`,
              height: isRecording ? `${Math.random() * 40 + 10}px` : '4px'
            }}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="recorder-timer">
        <span className={`timer-display ${isRecording ? 'recording' : ''}`}>
          {formattedTime}
        </span>
        {isRecording && (
          <span className="max-duration">/ {Math.floor(maxDuration / 60)}:00</span>
        )}
      </div>

      {/* Transcript Preview */}
      {fullTranscript && (
        <div className="transcript-preview">
          <p className="transcript-text">{fullTranscript}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="recorder-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Controls */}
      <div className="recorder-controls">
        {!isRecording ? (
          <button 
            className="control-btn record-btn"
            onClick={handleStart}
            disabled={isRecording}
          >
            <span className="btn-icon">🔴</span>
            <span>Start Recording</span>
          </button>
        ) : (
          <>
            {isPaused ? (
              <button 
                className="control-btn resume-btn"
                onClick={handleResume}
              >
                <span className="btn-icon">▶️</span>
                <span>Resume</span>
              </button>
            ) : (
              <button 
                className="control-btn pause-btn"
                onClick={handlePause}
              >
                <span className="btn-icon">⏸️</span>
                <span>Pause</span>
              </button>
            )}

            <button 
              className="control-btn stop-btn"
              onClick={handleStop}
            >
              <span className="btn-icon">⏹️</span>
              <span>Stop</span>
            </button>
          </>
        )}

        {(audioUrl || fullTranscript) && (
          <button 
            className="control-btn clear-btn"
            onClick={handleClear}
          >
            <span className="btn-icon">🗑️</span>
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div className="audio-playback">
          <audio controls src={audioUrl} className="audio-player" />
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="recording-status">
          <span className="status-pulse" />
          <span>{isPaused ? 'Paused' : 'Recording...'}</span>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;