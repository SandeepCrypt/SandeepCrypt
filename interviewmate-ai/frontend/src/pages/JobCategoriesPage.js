// ============================================
// INTERVIEWMATE AI - JOB CATEGORIES PAGE
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JOB_CATEGORIES } from '../utils/constants';
import './JobCategoriesPage.css';

const JobCategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = JOB_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="job-categories-page">
      {/* Header */}
      <div className="categories-header">
        <h1>Job Categories</h1>
        <p>Choose your domain and start practicing interview questions</p>
        
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid full">
        {filteredCategories.length === 0 ? (
          <div className="empty-categories">
            <span>🔍</span>
            <p>No categories found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredCategories.map(category => (
            <Link
              key={category.id}
              to={`/interview/setup?category=${category.id}`}
              className="category-card"
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-action">Start Practice →</span>
            </Link>
          ))
        )}
      </div>

      {/* Popular Tags */}
      <div className="popular-tags">
        <h3>Popular Skills</h3>
        <div className="tags-cloud">
          {['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Machine Learning', 'Data Analysis', 'Agile', 'System Design', 'REST APIs'].map(tag => (
            <span key={tag} className="skill-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCategoriesPage;