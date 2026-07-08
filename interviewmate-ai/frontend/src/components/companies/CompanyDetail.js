// ============================================
// INTERVIEWMATE AI - COMPANY DETAIL COMPONENT
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CompanyDetail.css';

const CompanyDetail = ({ company, questions = [], onStartInterview }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { id, name, logo, type, specialFocus } = company;

  const filteredQuestions = questions.filter(q => {
    const matchesFilter = filter === 'all' || q.difficulty === filter;
    const matchesSearch = !searchQuery || 
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const difficultyCounts = {
    all: questions.length,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length
  };

  return (
    <div className="company-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="header-brand">
          <div className="detail-logo">
            {logo ? (
              <img src={`/assets/images/company-logos/${logo}`} alt={name} />
            ) : (
              <span className="logo-fallback-lg">{name.charAt(0)}</span>
            )}
          </div>
          <div className="header-info">
            <h1>{name}</h1>
            <div className="header-meta">
              <span className="type-badge">{type}</span>
              <span className="count-badge">{questions.length} Questions</span>
            </div>
          </div>
        </div>
        
        <button 
          className="btn btn-primary start-interview-btn"
          onClick={() => onStartInterview?.(id)}
        >
          🎤 Start Company Interview
        </button>
      </div>

      {/* Focus Areas */}
      {specialFocus && (
        <div className="focus-section">
          <h3>Special Hiring Focus</h3>
          <p>{specialFocus}</p>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="difficulty-filters">
          {['all', 'easy', 'medium', 'hard'].map(diff => (
            <button
              key={diff}
              className={`filter-btn ${filter === diff ? 'active' : ''}`}
              onClick={() => setFilter(diff)}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
              <span className="filter-count">{difficultyCounts[diff]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No questions found matching your criteria</p>
          </div>
        ) : (
          filteredQuestions.map((question, index) => (
            <div key={question.id} className="question-item">
              <div className="question-number">{index + 1}</div>
              <div className="question-content">
                <p className="question-text">{question.text}</p>
                <div className="question-tags">
                  <span className={`diff-tag ${question.difficulty}`}>
                    {question.difficulty}
                  </span>
                  <span className="type-tag">{question.type}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;