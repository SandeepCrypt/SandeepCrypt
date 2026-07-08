// ============================================
// INTERVIEWMATE AI - USE INTERVIEW HOOK
// ============================================

import { useInterview as useInterviewContext } from '../context/InterviewContext';

export const useInterview = () => {
  const interview = useInterviewContext();

  return {
    ...interview,
    // Computed properties
    isIdle: interview.sessionStatus === 'idle',
    isSetup: interview.sessionStatus === 'setup',
    isActive: interview.sessionStatus === 'active',
    isPaused: interview.sessionStatus === 'paused',
    isCompleted: interview.sessionStatus === 'completed',
    isAborted: interview.sessionStatus === 'aborted',
    hasStarted: ['active', 'paused', 'completed'].includes(interview.sessionStatus),
    canStart: interview.sessionStatus === 'setup',
    canPause: interview.sessionStatus === 'active',
    canResume: interview.sessionStatus === 'paused',
    canSubmit: interview.isRecording,
    hasNextQuestion: interview.currentQuestionIndex < interview.questions.length - 1,
    isLastQuestion: interview.currentQuestionIndex === interview.questions.length - 1,
    questionNumber: interview.currentQuestionIndex + 1,
    totalQuestions: interview.questions.length,
    formattedTimeRemaining: formatSeconds(interview.timeRemaining),
    currentResponse: interview.responses[interview.currentQuestionIndex] || null,
    latestFeedback: interview.realtimeFeedback[interview.realtimeFeedback.length - 1] || null
  };
};

const formatSeconds = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};