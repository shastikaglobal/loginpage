import React from 'react';
import './Dashboard.css';

export default function Dashboard({ user, token, onLogout }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="avatar-wrapper">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="status-badge"></div>
          </div>
          <h1>Welcome, {user?.name || 'User'}!</h1>
          <p className="dashboard-subheading">You have successfully authenticated</p>
        </div>

        <div className="dashboard-content">
          <div className="info-section">
            <h2 className="section-title">Account Details</h2>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">User ID</span>
                <span className="info-value mono">{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="token-section">
            <h2 className="section-title">Session Token (JWT)</h2>
            <div className="token-container">
              <code className="token-text">{token}</code>
            </div>
          </div>

          <button onClick={onLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
