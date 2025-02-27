import React, { useState } from 'react';
import './Login.css';

const Login = ({ userName = "shivam singh", role = "Doctor" }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome, {userName}</h1>
            <p>Healthcare Platform Dashboard</p>
          </div>
        </div>
      </header>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <div className="card-icon">
            <i className="fas fa-notes-medical"></i>
          </div>
          <div className="card-content">
            <h3>Medical Records</h3>
            <p>View & Manage</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">
            <i className="fas fa-prescription"></i>
          </div>
          <div className="card-content">
            <h3>Prescriptions</h3>
            <p>Track & Verify</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">
            <i className="fas fa-comments"></i>
          </div>
          <div className="card-content">
            <h3>Chat</h3>
            <p>Communicate</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="card-content">
            <h3>Role</h3>
            <p>{role}</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent Activity
        </button>
      </div>

      {/* Role Information Section */}
      <div className="role-info">
        <h2>Role-Specific Information</h2>
        <p>
          {role === 'Doctor' 
            ? 'View your patient appointments and manage medical records.'
            : 'View your medical history and upcoming appointments.'}
        </p>
      </div>
    </div>
  );
};

export default Login;
