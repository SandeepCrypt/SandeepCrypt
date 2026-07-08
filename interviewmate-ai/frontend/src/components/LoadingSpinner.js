// ============================================
// INTERVIEWMATE AI - LOADING SPINNER COMPONENT
// ============================================

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  text = null,
  fullScreen = false,
  className = '' 
}) => {
  const sizeMap = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
    xl: 'spinner-xl'
  };

  const colorMap = {
    primary: 'spinner-primary',
    white: 'spinner-white',
    success: 'spinner-success'
  };

  const spinnerClasses = [
    'spinner',
    sizeMap[size] || sizeMap.md,
    colorMap[color] || colorMap.primary,
    className
  ].join(' ');

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={spinnerClasses}>
          <div className="spinner-ring" />
          <div className="spinner-ring" />
          <div className="spinner-ring" />
        </div>
        {text && <p className="spinner-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className="spinner-wrapper">
      <div className={spinnerClasses}>
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

// Dots loader variant
export const DotsLoader = ({ size = 'md', color = 'primary' }) => {
  const sizeMap = {
    sm: 'dots-sm',
    md: 'dots-md',
    lg: 'dots-lg'
  };

  return (
    <div className={`dots-loader ${sizeMap[size]}`}>
      <div className={`dot ${color}`} />
      <div className={`dot ${color}`} />
      <div className={`dot ${color}`} />
    </div>
  );
};

// Skeleton loader
export const Skeleton = ({ width = '100%', height = '20px', circle = false, className = '' }) => {
  return (
    <div 
      className={`skeleton ${circle ? 'skeleton-circle' : ''} ${className}`}
      style={{ width, height }}
    />
  );
};

export default LoadingSpinner;