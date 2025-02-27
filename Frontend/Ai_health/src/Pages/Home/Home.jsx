import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!isLogin) {
      if (!formData.fullName) {
        setError('Please enter your full name');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
      
      console.log('Sending request to:', endpoint); // Debug log
      console.log('Request data:', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role
      }); // Debug log

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role
        }),
      });

      console.log('Response status:', response.status); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to dashboard
        navigate('/dashboard', { 
          state: { 
            userName: data.user.fullName,
            role: data.user.role 
          }
        });
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      console.error('Detailed error:', err); // Debug log
      setError('Network error. Please ensure the server is running and try again.');
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <div className="left-section">
          <div className="form-box">
            <h2 className="portal-title">Healthcare Portal</h2>
            
            <div className="toggle-container">
              <div className="toggle-switch">
                <input 
                  type="checkbox" 
                  id="switch" 
                  checked={!isLogin}
                  onChange={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({
                      fullName: '',
                      email: '',
                      password: '',
                      confirmPassword: ''
                    });
                  }}
                />
                <label htmlFor="switch" className="toggle-label">
                  <span className="toggle-text-left">Login</span>
                  <span className="toggle-text-right">Register</span>
                </label>
              </div>
            </div>

            <div className="role-selector">
              <button 
                className={`role-btn ${role === 'patient' ? 'active' : ''}`}
                onClick={() => setRole('patient')}
              >
                <i className="fas fa-user"></i>
                Patient
              </button>
              <button 
                className={`role-btn ${role === 'doctor' ? 'active' : ''}`}
                onClick={() => setRole('doctor')}
              >
                <i className="fas fa-user-md"></i>
                Doctor
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name" 
                  />
                </>
              )}
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email" 
              />
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password" 
              />
              {!isLogin && (
                <>
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password" 
                  />
                </>
              )}
              <button type="submit" className="login-btn">
                {isLogin ? `Login as ${role}` : `Register as ${role}`}
              </button>
            </form>
          </div>
        </div>
        <div className="right-section">
          <h1>Welcome to <span className="highlight">Healthcare Portal</span></h1>
          <p>A secure platform for managing patient records and appointments</p>
          <div className="healthcare-image"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;