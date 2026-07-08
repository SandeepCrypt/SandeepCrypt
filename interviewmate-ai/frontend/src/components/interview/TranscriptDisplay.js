// ============================================
// INTERVIEWMATE AI - TRANSCRIPT DISPLAY COMPONENT
// ============================================

import React, { useEffect, useRef } from 'react';
import './TranscriptDisplay.css';

const TranscriptDisplay = ({ 
  transcript, 
  interimTranscript = '',
  isListening = false,
  confidence = null,
  fillerWords = [],
  maxHeight = 200
}) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  // Highlight filler words
  const highlightText = (text) => {
    if (!fillerWords.length) return text;

    const fillerPattern = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');
    const parts = text.split(fillerPattern);

    return parts.map((part, i) => {
      if (fillerWords.some(fw => fw.toLowerCase() === part.toLowerCase())) {
        return (
          <span key={i} className="filler-word" title="Filler word detected">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const fullText = transcript + interimTranscript;

  return (
    <div className="transcript-display">
      <div className="transcript-header">
        <div className="transcript-title">
          <span className="transcript-icon">📝</span>
          <span>Live Transcript</span>
        </div>
        <div className="transcript-status">
          {isListening && (
            <>
              <span className="listening-dot" />
              <span className="listening-text">Listening...</span>
            </>
          )}
          {confidence !== null && (
            <span className="confidence-badge">
              Confidence: {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      </div>

      <div 
        className="transcript-body"
        ref={scrollRef}
        style={{ maxHeight }}
      >
        {fullText ? (
          <p className="transcript-text">
            {highlightText(fullText)}
            {isListening && interimTranscript && (
              <span className="interim-cursor">|</span>
            )}
          </p>
        ) : (
          <div className="transcript-placeholder">
            <span className="placeholder-icon">🎤</span>
            <p>Start speaking to see your transcript here</p>
            <span className="placeholder-hint">
              Speak clearly for best results
            </span>
          </div>
        )}
      </div>

      {fillerWords.length > 0 && (
        <div className="transcript-footer">
          <span className="filler-warning">
            ⚠️ {fillerWords.length} filler word{fillerWords.length > 1 ? 's' : ''} detected
          </span>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;