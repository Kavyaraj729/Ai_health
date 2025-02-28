import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('Patient');
  const [activeTab, setActiveTab] = useState('overview');
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const [prescriptions, setPrescriptions] = useState([]); // State to store prescriptions

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email.split('@')[0]);
      } else {
        setUserName('');
      }
    });

    // Mock prescription data (replace with actual API call)
    setPrescriptions([
      { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: 'Twice a day' },
      { id: 2, name: 'Amoxicillin', dosage: '250mg', frequency: 'Once a day' },
    ]);

    return () => unsubscribe();
  }, []);

  const handlePrescriptionClick = () => {
    setIsDialogOpen(true); // Open the dialog box
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog box
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome, {userName || 'User'}</h1>
            <p>Healthcare Platform Dashboard</p>
          </div>
        </div>
      </header>

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

        <div className="card" onClick={handlePrescriptionClick}>
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

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h2>Prescriptions</h2>
            {prescriptions.length > 0 ? (
              <ul>
                {prescriptions.map((prescription) => (
                  <li key={prescription.id}>
                    <strong>{prescription.name}</strong> - {prescription.dosage} ({prescription.frequency})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No prescriptions added.</p>
            )}
            <button onClick={handleCloseDialog}>Close</button>
          </div>
        </div>
      )}

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