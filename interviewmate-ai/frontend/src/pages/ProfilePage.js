// ============================================
// INTERVIEWMATE AI - PROFILE PAGE
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ToastNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadService } from '../services/uploadService';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { success, error: showError } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: user?.college || '',
    branch: user?.branch || '',
    year: user?.year || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const result = await updateProfile(profileData);
    if (result.success) {
      success('Profile updated successfully!');
    } else {
      showError(result.message);
    }
    setIsUpdating(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    const result = await updatePassword({
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    });
    
    if (result.success) {
      success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      showError(result.message);
    }
    setIsChangingPassword(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadService.uploadAvatar(file);
      success('Profile picture updated!');
    } catch (err) {
      showError(err.message || 'Failed to upload avatar');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="avatar-upload">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <label className="avatar-overlay">
                <span>📷</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  hidden
                />
              </label>
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              🔒 Password
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-form-section">
              <h2>Profile Information</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-row two-col">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>College/University</label>
                  <input
                    type="text"
                    name="college"
                    value={profileData.college}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-row two-col">
                  <div className="form-group">
                    <label>Branch/Department</label>
                    <input
                      type="text"
                      name="branch"
                      value={profileData.branch}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Academic Year</label>
                    <select
                      name="year"
                      value={profileData.year}
                      onChange={handleProfileChange}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? <LoadingSpinner size="sm" color="white" /> : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="profile-form-section">
              <h2>Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? <LoadingSpinner size="sm" color="white" /> : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-form-section">
              <h2>Account Settings</h2>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your progress and new features</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Weekly Progress Report</h4>
                    <p>Get a summary of your weekly interview practice</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider" />
                  </label>
                </div>

                <div className="setting-item danger">
                  <div className="setting-info">
                    <h4>Delete Account</h4>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;