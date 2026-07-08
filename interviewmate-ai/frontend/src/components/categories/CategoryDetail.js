// ============================================
// INTERVIEWMATE AI - CATEGORY DETAIL COMPONENT
// ============================================

import React, { useState, useEffect } from 'react';
import { questionService } from '../../services/questionService';
import LoadingSpinner from '../LoadingSpinner';
import './CategoryDetail.css';

const CategoryDetail = ({ categoryId, onBack }) => {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCategoryData();
  }, [categoryId]);

  const loadCategoryData = async () => {
    setIsLoading(true);
    try {
      const [catRes, qRes] = await Promise.all([
        questionService.getCategoryById(categoryId),
        questionService.getQuestionsByCategory(categoryId, { limit: 5 })
      ]);
      setCategory(catRes.data);
      setQuestions(qRes.data.questions);
    } catch (err) {
      console.error('Failed to load category:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner text="Loading category..." />;
  if (!category) return <div>Category not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: 'Sample Questions' },
    { id: 'companies', label: 'Target Companies' }
  ];

  return (
    <div className="category-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to Categories
      </button>

      <div className="category-hero">
        <span className="hero-icon">{category.icon}</span>
        <div className="hero-info">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </div>

      <div className="detail-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`detail-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="info-card">
              <h3>What to Expect</h3>
              <p>{category.whatToExpect || 'Prepare for technical and behavioral questions related to this domain.'}</p>
            </div>
            
            <div className="info-card">
              <h3>Key Skills Tested</h3>
              <div className="skills-tags">
                {(category.skills || ['Problem Solving', 'Communication', 'Technical Knowledge']).map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="info-card">
              <h3>Preparation Tips</h3>
              <ul>
                <li>Review core concepts and fundamentals</li>
                <li>Practice with mock scenarios</li>
                <li>Prepare STAR-format answers for behavioral questions</li>
                <li>Research recent industry trends</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="questions-section">
            <h3>Sample Questions</h3>
            {questions.map((q, i) => (
              <div key={q.id} className="sample-question">
                <span className="question-number">{i + 1}</span>
                <p className="question-text">{q.question_text}</p>
                <div className="question-meta">
                  <span className={`difficulty-badge ${q.difficulty}`}>
                    {q.difficulty}
                  </span>
                  <span className="type-badge">{q.question_type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="companies-section">
            <h3>Companies Hiring for {category.name}</h3>
            <div className="company-grid">
              {(category.companies || ['TCS', 'Infosys', 'Wipro', 'Accenture']).map((company, i) => (
                <div key={i} className="company-chip">
                  <span className="company-logo">🏢</span>
                  <span>{company}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;