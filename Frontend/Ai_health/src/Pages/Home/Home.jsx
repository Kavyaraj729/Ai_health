import React, { useState } from "react";
import "./home.css";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);

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
                  onChange={() => setIsLogin(!isLogin)}
                />
                <label htmlFor="switch" className="toggle-label">
                  <span className="toggle-text-left">Login</span>
                  <span className="toggle-text-right">Register</span>
                </label>
              </div>
            </div>

            <form>
              {!isLogin && (
                <>
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your full name" />
                </>
              )}
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
              <label>Password</label>
              <input type="password" placeholder="Enter password" />
              {!isLogin && (
                <>
                  <label>Confirm Password</label>
                  <input type="password" placeholder="Confirm your password" />
                </>
              )}
              <button type="submit" className="login-btn">
                {isLogin ? "Login" : "Register"}
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