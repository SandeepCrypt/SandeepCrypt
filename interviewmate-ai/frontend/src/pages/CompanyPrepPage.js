// ============================================
// INTERVIEWMATE AI - COMPANY PREP PAGE
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TARGET_COMPANIES } from '../utils/constants';
import CompanyCard from '../components/companies/CompanyCard';
import './CompanyPrepPage.css';

const CompanyPrepPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const navigate = useNavigate();

  const companyTypes = ['all', ...new Set(TARGET_COMPANIES.map(c => c.type))];

  const filteredCompanies = TARGET_COMPANIES.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.focus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || company.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSelectCompany = (company) => {
    navigate(`/interview/setup?company=${company.id}`);
  };

  return (
    <div className="company-prep-page">
      {/* Header */}
      <div className="company-header">
        <h1>Company Preparation</h1>
        <p>Practice with company-specific interview questions</p>
      </div>

      {/* Filters */}
      <div className="company-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="type-filters">
          {companyTypes.map(type => (
            <button
              key={type}
              className={`type-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="companies-grid">
        {filteredCompanies.length === 0 ? (
          <div className="empty-companies">
            <span>🏢</span>
            <p>No companies found matching your criteria</p>
          </div>
        ) : (
          filteredCompanies.map(company => (
            <CompanyCard
              key={company.id}
              company={company}
              questionCount={50} // Mock data
              onSelect={handleSelectCompany}
            />
          ))
        )}
      </div>

      {/* Tips Section */}
      <div className="prep-tips">
        <h2>💡 Preparation Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📚</span>
            <h4>Research the Company</h4>
            <p>Understand their products, services, culture, and recent news before the interview.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Focus on Core Skills</h4>
            <p>Each company has specific focus areas. Practice questions related to their tech stack.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🗣️</span>
            <h4>Practice STAR Answers</h4>
            <p>Use Situation-Task-Action-Result format for behavioral questions.</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">⏱️</span>
            <h4>Time Your Responses</h4>
            <p>Keep answers concise (2-3 minutes) and practice within time limits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPrepPage;