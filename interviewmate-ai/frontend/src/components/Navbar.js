// ============================================
// INTERVIEWMATE AI - NAVBAR COMPONENT
// ============================================

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../utils/constants';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinks = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊', auth: true },
    { path: ROUTES.CATEGORIES, label: 'Categories', icon: '🎯', auth: true },
    { path: ROUTES.PROGRESS, label: 'Progress', icon: '📈', auth: true },
    { path: ROUTES.ABOUT, label: 'About', icon: 'ℹ️', auth: false }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="navbar-brand">
          <span className="brand-icon">🎤</span>
          <span className="brand-text">InterviewMate</span>
          <span className="brand-ai">AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav desktop-only">
          {navLinks.map(link => (
            (!link.auth || isAuthenticated) && (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            )
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {isAuthenticated ? (
            <>
              {/* Quick Start Button */}
              <Link to={ROUTES.INTERVIEW_SETUP} className="btn btn-primary btn-sm">
                Start Interview
              </Link>

              {/* Profile Dropdown */}
              <div className="profile-dropdown">
                <button 
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span className="avatar-fallback">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="profile-name hide-mobile">{user?.name?.split(' ')[0]}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {isProfileOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <span className="dropdown-name">{user?.name}</span>
                      <span className="dropdown-email">{user?.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to={ROUTES.PROFILE} className="dropdown-item">
                      👤 Profile
                    </Link>
                    <Link to={ROUTES.RESUME_UPLOAD} className="dropdown-item">
                      📄 Resume
                    </Link>
                    <Link to={ROUTES.PROGRESS} className="dropdown-item">
                      📈 My Progress
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="menu-toggle mobile-only"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            (!link.auth || isAuthenticated) && (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            )
          ))}
          {isAuthenticated && (
            <>
              <div className="mobile-divider" />
              <Link to={ROUTES.PROFILE} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                👤 Profile
              </Link>
              <button className="mobile-nav-link danger" onClick={handleLogout}>
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;