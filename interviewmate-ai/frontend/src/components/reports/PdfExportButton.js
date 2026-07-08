// ============================================
// INTERVIEWMATE AI - PDF EXPORT BUTTON
// ============================================

import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { useToast } from '../ToastNotification';

const PdfExportButton = ({ 
  sessionId,
  filename,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { success, error } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const result = await reportService.exportPdf(sessionId, filename);
      
      if (result.success) {
        success('Report downloaded successfully!');
      } else {
        error(result.message || 'Failed to export report');
      }
    } catch (err) {
      error('An error occurred while exporting');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline'
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <button
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <span className="spinner-sm" />
          Generating PDF...
        </>
      ) : (
        <>
          <span>📄</span>
          Export PDF
        </>
      )}
    </button>
  );
};

export default PdfExportButton;