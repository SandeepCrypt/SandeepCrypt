// ============================================
// INTERVIEWMATE AI - COMPANY CARD COMPONENT
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyCard.css';

const CompanyCard = ({ company, questionCount = 0, onSelect }) => {
  const { id, name, logo, type, specialFocus } = company;

  const handleClick = () => {
    onSelect?.(company);
  };

  return (
    <div className="company-card" onClick={handleClick}>
      <div className="company-logo">
        {logo ? (
          <img 
            src={`/assets/images/company-logos/${logo}`} 
            alt={`${name} logo`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="logo-fallback" style={{ display: logo ? 'none' : 'flex' }}>
          {name.charAt(0)}
        </div>
      </div>

      <div className="company-info">
        <h3 className="company-name">{name}</h3>
        <span className="company-type">{type}</span>
        
        {specialFocus && (
          <p className="company-focus">{specialFocus}</p>
        )}

        <div className="company-stats">
          <span className="stat-item">
            <span className="stat-icon">❓</span>
            {questionCount} Questions
          </span>
        </div>
      </div>

      <Link 
        to={`/company-prep/${id}`} 
        className="company-link"
        onClick={(e) => e.stopPropagation()}
      >
        Prepare →
      </Link>
    </div>
  );
};

export default CompanyCard;