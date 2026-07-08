// ============================================
// INTERVIEWMATE AI - INTERVIEW CONTEXT
// ============================================

import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import { interviewService } from '../services/interviewService';
import { DEFAULT_QUESTIONS, DEFAULT_TIME_PER_QUESTION } from '../utils/constants';

const InterviewContext = createContext(null);

const INITIAL_STATE = {
  session: null,
  questions: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  responses: [],
  isRecording: false,
  isPaused: false,
  timeRemaining: 0,
  totalTime: 0,
  facialEmotions: [],
  speechEmotions: [],
  realtimeFeedback: [],
  sessionStatus: 'idle', // idle, setup, active, paused, completed, aborted
  error: null
};

export const InterviewProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);
  const timerRef = useRef(null);
  const emotionIntervalRef = useRef(null);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setupInterview = useCallback(async (config) => {
    try {
      const response = await interviewService.startSession({
        categoryId: config.categoryId,
        companyId: config.companyId,
        numQuestions: config.numQuestions || DEFAULT_QUESTIONS,
        timePerQuestion: config.timePerQuestion || DEFAULT_TIME_PER_QUESTION,
        difficulty: config.difficulty,
        resumePath: config.resumePath
      });

      const { session, questions } = response.data;
      
      updateState({
        session,
        questions,
        currentQuestionIndex: 0,
        currentQuestion: questions[0],
        responses: [],
        timeRemaining: questions[0].timeLimit || DEFAULT_TIME_PER_QUESTION,
        totalTime: questions.reduce((sum, q) => sum + (q.timeLimit || DEFAULT_TIME_PER_QUESTION), 0),
        sessionStatus: 'setup',
        error: null
      });

      return { success: true, session };
    } catch (err) {
      updateState({ error: err.response?.data?.message || 'Failed to start interview' });
      return { success: false, message: err.response?.data?.message };
    }
  }, [updateState]);

  const startInterview = useCallback(() => {
    updateState({ sessionStatus: 'active' });
    startTimer();
    startEmotionTracking();
  }, [updateState]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          // Auto-submit when time runs out
          clearInterval(timerRef.current);
          return { ...prev, timeRemaining: 0, isRecording: false };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  }, []);

  const startEmotionTracking = useCallback(() => {
    // In real implementation, this would connect to WebSocket for real-time emotion data
    if (emotionIntervalRef.current) clearInterval(emotionIntervalRef.current);
    
    emotionIntervalRef.current = setInterval(() => {
      // Mock emotion data - replace with actual WebSocket data
      setState(prev => {
        const mockEmotion = {
          timestamp: Date.now(),
          facial: { emotion: 'neutral', confidence: 0.8 },
          speech: { emotion: 'neutral', confidence: 0.7 }
        };
        return {
          ...prev,
          facialEmotions: [...prev.facialEmotions, mockEmotion.facial],
          speechEmotions: [...prev.speechEmotions, mockEmotion.speech]
        };
      });
    }, 500);
  }, []);

  const pauseInterview = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(emotionIntervalRef.current);
    updateState({ isPaused: true, sessionStatus: 'paused' });
  }, [updateState]);

  const resumeInterview = useCallback(() => {
    updateState({ isPaused: false, sessionStatus: 'active' });
    startTimer();
    startEmotionTracking();
  }, [updateState, startTimer, startEmotionTracking]);

  const startRecording = useCallback(() => {
    updateState({ isRecording: true });
  }, [updateState]);

  const stopRecording = useCallback(async (audioBlob, transcript) => {
    updateState({ isRecording: false });
    
    try {
      const currentQ = state.questions[state.currentQuestionIndex];
      
      // Upload audio and get analysis
      const response = await interviewService.submitResponse({
        sessionId: state.session.id,
        questionId: currentQ.id,
        audioBlob,
        transcript,
        facialEmotions: state.facialEmotions,
        speechEmotions: state.speechEmotions
      });

      const newResponse = response.data;
      
      setState(prev => ({
        ...prev,
        responses: [...prev.responses, newResponse],
        facialEmotions: [],
        speechEmotions: []
      }));

      return { success: true, response: newResponse };
    } catch (err) {
      updateState({ error: 'Failed to submit response' });
      return { success: false, message: err.response?.data?.message };
    }
  }, [state, updateState]);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      
      if (nextIndex >= prev.questions.length) {
        // Interview complete
        clearInterval(timerRef.current);
        clearInterval(emotionIntervalRef.current);
        return {
          ...prev,
          currentQuestionIndex: nextIndex,
          currentQuestion: null,
          sessionStatus: 'completed',
          timeRemaining: 0
        };
      }

      const nextQ = prev.questions[nextIndex];
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQ,
        timeRemaining: nextQ.timeLimit || DEFAULT_TIME_PER_QUESTION,
        facialEmotions: [],
        speechEmotions: []
      };
    });
    
    startTimer();
  }, [startTimer]);

  const endInterview = useCallback(async () => {
    clearInterval(timerRef.current);
    clearInterval(emotionIntervalRef.current);
    
    try {
      await interviewService.endSession(state.session.id);
      updateState({ sessionStatus: 'completed' });
      return { success: true };
    } catch (err) {
      updateState({ error: 'Failed to end session' });
      return { success: false };
    }
  }, [state.session, updateState]);

  const abortInterview = useCallback(async () => {
    clearInterval(timerRef.current);
    clearInterval(emotionIntervalRef.current);
    
    try {
      await interviewService.abortSession(state.session.id);
      updateState({ ...INITIAL_STATE, sessionStatus: 'aborted' });
    } catch (err) {
      updateState({ sessionStatus: 'aborted' });
    }
  }, [state.session, updateState]);

  const addRealtimeFeedback = useCallback((feedback) => {
    setState(prev => ({
      ...prev,
      realtimeFeedback: [...prev.realtimeFeedback.slice(-4), {
        id: Date.now(),
        message: feedback.message,
        type: feedback.type || 'info',
        timestamp: Date.now()
      }]
    }));
  }, []);

  const resetInterview = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(emotionIntervalRef.current);
    setState(INITIAL_STATE);
  }, []);

  const value = {
    ...state,
    setupInterview,
    startInterview,
    pauseInterview,
    resumeInterview,
    startRecording,
    stopRecording,
    nextQuestion,
    endInterview,
    abortInterview,
    addRealtimeFeedback,
    resetInterview,
    progress: state.questions.length > 0 
      ? ((state.currentQuestionIndex) / state.questions.length) * 100 
      : 0
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider');
  }
  return context;
};

export default InterviewContext;