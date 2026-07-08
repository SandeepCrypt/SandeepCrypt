// ============================================
// INTERVIEWMATE AI - FOOTER COMPONENT
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: ROUTES.ABOUT },
      { label: 'Categories', path: ROUTES.CATEGORIES },
      { label: 'Companies', path: ROUTES.COMPANY_PREP },
      { label: 'Pricing', path: '#' }
    ],
    resources: [
      { label: 'Blog', path: '#' },
      { label: 'Guides', path: '#' },
      { label: 'FAQ', path: '#' },
      { label: 'Support', path: '#' }
    ],
    company: [
      { label: 'About Us', path: ROUTES.ABOUT },
      { label: 'Careers', path: '#' },
      { label: 'Contact', path: '#' },
      { label: 'Privacy Policy', path: '#' }
    ]
  };

  const socialLinks = [
    { icon: '𝕏', label: 'Twitter', url: '#' },
    { icon: 'in', label: 'LinkedIn', url: '#' },
    { icon: '📺', label: 'YouTube', url: '#' },
    { icon: '💬', label: 'Discord', url: '#' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to={ROUTES.HOME} className="footer-brand">
              <span className="footer-brand-icon">🎤</span>
              <span className="footer-brand-text">InterviewMate</span>
              <span className="footer-brand-ai">AI</span>
            </Link>
            <p className="footer-description">
              AI-powered mock interview platform helping candidates build confidence 
              and ace their dream job interviews with real-time emotion analysis.
            </p>
            <div className="footer-social">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.url}
                  className="social-link"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Product</h4>
            <ul className="footer-links">
              {footerLinks.product.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              {footerLinks.resources.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} InterviewMate AI. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="#" className="footer-legal-link">Terms of Service</Link>
            <span className="footer-divider">•</span>
            <Link to="#" className="footer-legal-link">Privacy Policy</Link>
            <span className="footer-divider">•</span>
            <Link to="#" className="footer-legal-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;