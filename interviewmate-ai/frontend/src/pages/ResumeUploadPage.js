// ============================================
// INTERVIEWMATE AI - RESUME UPLOAD PAGE
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadService } from '../services/uploadService';
import { useToast } from '../components/ToastNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import './ResumeUploadPage.css';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      showError('Please upload PDF or DOCX file');
      return;
    }

    setFile(selectedFile);
    setParsedData(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadService.uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      setParsedData(response.data.parsed);
      success('Resume uploaded and parsed successfully!');
    } catch (err) {
      showError(err.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    navigate('/interview/setup');
  };

  return (
    <div className="resume-upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>📄 Upload Your Resume</h1>
          <p>Our AI will analyze your skills and experience to generate personalized interview questions</p>
        </div>

        {/* Upload Area */}
        <div className="upload-section">
          <input
            type="file"
            id="resume-input"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            hidden
          />
          
          {!file ? (
            <label htmlFor="resume-input" className="upload-dropzone">
              <span className="dropzone-icon">📤</span>
              <span className="dropzone-title">Drop your resume here or click to browse</span>
              <span className="dropzone-hint">Supports PDF, DOC, DOCX (Max 5MB)</span>
            </label>
          ) : (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button 
                  className="file-remove"
                  onClick={() => { setFile(null); setParsedData(null); }}
                >
                  ✕
                </button>
              </div>

              {isUploading && (
                <div className="upload-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}

              {!isUploading && !parsedData && (
                <button className="btn btn-primary" onClick={handleUpload}>
                  🚀 Parse Resume
                </button>
              )}
            </div>
          )}
        </div>

        {/* Parsed Data */}
        {parsedData && (
          <div className="parsed-data">
            <h3>✅ Resume Parsed Successfully</h3>
            
            <div className="parsed-section">
              <h4>Skills Detected</h4>
              <div className="skills-tags">
                {(parsedData.skills || ['JavaScript', 'React', 'Node.js', 'Python']).map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="parsed-section">
              <h4>Experience</h4>
              <p>{parsedData.experience || '3+ years in software development'}</p>
            </div>

            <div className="parsed-section">
              <h4>Education</h4>
              <p>{parsedData.education || 'B.Tech in Computer Science'}</p>
            </div>

            <button className="btn btn-primary btn-lg" onClick={handleContinue}>
              Continue to Interview Setup →
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="upload-tips">
          <h3>💡 Tips for Best Results</h3>
          <ul>
            <li>Use a clean, well-formatted resume</li>
            <li>Include specific skills and technologies</li>
            <li>List quantifiable achievements</li>
            <li>Keep file size under 5MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;