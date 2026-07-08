// ============================================
// INTERVIEWMATE AI - CATEGORY CARD COMPONENT
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ 
  category,
  onSelect,
  isSelected = false
}) => {
  return (
    <div 
      className={`category-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect?.(category)}
    >
      <div className="category-icon-wrapper">
        <span className="category-icon">{category.icon}</span>
      </div>
      
      <div className="category-info">
        <h3 className="category-name">{category.name}</h3>
        <p className="category-description">{category.description}</p>
      </div>

      {isSelected && (
        <div className="category-check">
          <span>✓</span>
        </div>
      )}

      <div className="category-arrow">→</div>
    </div>
  );
};

export default CategoryCard;