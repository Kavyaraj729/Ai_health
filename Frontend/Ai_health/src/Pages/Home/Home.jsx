import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { motion } from 'framer-motion';

const Home = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const toggleForm = (formType) => {
    setActiveForm(formType);
    setSelectedRole(null);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle authentication
    // For now, we'll just navigate to the respective dashboard
    if (selectedRole === 'patient') {
      navigate('/patient');
    } else if (selectedRole === 'doctor') {
      navigate('/doctor');
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Welcome to HealthCare Plus</h1>
          <p>Your trusted partner in digital healthcare solutions</p>
          <div className="cta-buttons">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleForm('login')}
              className="primary-btn"
            >
              Login
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleForm('signup')}
              className="secondary-btn"
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      </div>

      {activeForm && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setActiveForm(null)}
        >
          <motion.div 
            className="modal"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{activeForm === 'login' ? 'Login' : 'Sign Up'}</h2>
              <button className="close-btn" onClick={() => setActiveForm(null)}>×</button>
            </div>
            <div className="modal-content">
              <div className="role-buttons">
                <button 
                  className={`role-btn patient-btn ${selectedRole === 'patient' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('patient')}
                >
                  <i className="fas fa-user"></i>
                  Patient
                </button>
                <button 
                  className={`role-btn doctor-btn ${selectedRole === 'doctor' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('doctor')}
                >
                  <i className="fas fa-user-md"></i>
                  Doctor
                </button>
              </div>
              {activeForm === 'login' ? (
                <form className="auth-form" onSubmit={handleSubmit}>
                  <input type="email" placeholder="Email" required />
                  <input type="password" placeholder="Password" required />
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={!selectedRole}
                  >
                    Login
                  </button>
                </form>
              ) : (
                <form className="auth-form" onSubmit={handleSubmit}>
                  <input type="text" placeholder="Full Name" required />
                  <input type="email" placeholder="Email" required />
                  <input type="password" placeholder="Password" required />
                  <input type="password" placeholder="Confirm Password" required />
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={!selectedRole}
                  >
                    Sign Up
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="features-section">
        <motion.div 
          className="features-grid"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="feature-card">
            <i className="fas fa-user-md"></i>
            <h3>Expert Doctors</h3>
            <p>Connect with qualified healthcare professionals</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-calendar-check"></i>
            <h3>Easy Scheduling</h3>
            <p>Book appointments at your convenience</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-comments"></i>
            <h3>24/7 Support</h3>
            <p>Round-the-clock medical assistance</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;