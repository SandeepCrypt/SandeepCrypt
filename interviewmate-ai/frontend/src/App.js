// ============================================
// INTERVIEWMATE AI - APP COMPONENT
// ============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ToastNotification';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import FeedbackPage from './pages/FeedbackPage';
import ReportPage from './pages/ReportPage';
import ProgressPage from './pages/ProgressPage';
import JobCategoriesPage from './pages/JobCategoriesPage';
import CompanyPrepPage from './pages/CompanyPrepPage';
import ProfilePage from './pages/ProfilePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import AboutPage from './pages/AboutPage';

import './styles/variables.css';
import './styles/animations.css';
import './styles/responsive.css';
import './App.css';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <InterviewProvider>
              <div className="app">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    
                    {/* Auth Routes */}
                    <Route 
                      path="/login" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <LoginPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/register" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <RegisterPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Protected Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/interview/setup" 
                      element={
                        <ProtectedRoute>
                          <InterviewSetupPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/interview/room" 
                      element={
                        <ProtectedRoute>
                          <InterviewRoomPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/feedback/:sessionId" 
                      element={
                        <ProtectedRoute>
                          <FeedbackPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/report/:sessionId" 
                      element={
                        <ProtectedRoute>
                          <ReportPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/progress" 
                      element={
                        <ProtectedRoute>
                          <ProgressPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/categories" 
                      element={
                        <ProtectedRoute>
                          <JobCategoriesPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/company-prep" 
                      element={
                        <ProtectedRoute>
                          <CompanyPrepPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/resume-upload" 
                      element={
                        <ProtectedRoute>
                          <ResumeUploadPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Fallback */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </InterviewProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;