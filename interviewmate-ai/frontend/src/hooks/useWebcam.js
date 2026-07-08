// ============================================
// INTERVIEWMATE AI - USE WEBCAM HOOK
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';

export const useWebcam = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async (constraints = { video: true, audio: false }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check for permissions first
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      
      if (permissionStatus.state === 'denied') {
        throw new Error('Camera access denied. Please enable camera permissions in browser settings.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false,
        ...constraints
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsReady(true);
          setIsLoading(false);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to access camera');
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isReady) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isReady]);

  const getVideoBlob = useCallback(async () => {
    if (!streamRef.current) return null;
    // Return the active stream for MediaRecorder usage
    return streamRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isReady,
    isLoading,
    error,
    startCamera,
    stopCamera,
    captureFrame,
    getVideoBlob
  };
};