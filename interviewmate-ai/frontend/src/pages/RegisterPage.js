// ============================================
// INTERVIEWMATE AI - REGISTER PAGE
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ToastNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { isValidEmail, getPasswordStrength } from '../utils/helpers';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    branch: '',
    year: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else {
      const strength = getPasswordStrength(formData.password);
      if (strength.score < 3) {
        newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.college) newErrors.college = 'College is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      showError(result.message);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="register-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span>🎤</span> InterviewMate AI
            </Link>
            <h1>Create Account</h1>
            <p>Start your journey to interview success</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Min 8 chars"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div 
                          key={level}
                          className={`strength-segment ${passwordStrength.score >= level ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="strength-label">{passwordStrength.label}</span>
                  </div>
                )}
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label htmlFor="college">College/University</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  placeholder="Your college name"
                  value={formData.college}
                  onChange={handleChange}
                  className={errors.college ? 'error' : ''}
                />
                {errors.college && <span className="error-text">{errors.college}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="branch">Branch</label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  placeholder="e.g., Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                  className={errors.branch ? 'error' : ''}
                />
                {errors.branch && <span className="error-text">{errors.branch}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="year">Academic Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={errors.year ? 'error' : ''}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="graduated">Graduated</option>
              </select>
              {errors.year && <span className="error-text">{errors.year}</span>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" color="white" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <h2>Start Your Journey</h2>
            <p>Create your account and get access to AI-powered mock interviews, real-time feedback, and detailed performance reports.</p>
            <div className="feature-list">
              <div className="feature-item">✓ AI-generated personalized questions</div>
              <div className="feature-item">✓ Real-time emotion analysis</div>
              <div className="feature-item">✓ STAR model evaluation</div>
              <div className="feature-item">✓ Detailed PDF reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;