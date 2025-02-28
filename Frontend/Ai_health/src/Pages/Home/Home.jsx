import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Import Firestore
import { updateProfile } from "firebase/auth";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("patient");
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!isLogin) {
      if (!formData.fullName) {
        setError("Please enter your full name.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }
    if (!otpVerified) {
      setError("Please verify your phone number with OTP.");
      return false;
    }
    return true;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      const confirmation = await signInWithPhoneNumber(auth, formData.phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      alert("OTP sent to your phone!");
    } catch (error) {
      console.error("OTP Error:", error);
      setError("Failed to send OTP. Check phone number.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!confirmationResult) {
      setError("Please request an OTP first.");
      return;
    }

    try {
      await confirmationResult.confirm(formData.otp);
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      if (isLogin) {
        // Login logic
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        // Registration logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Save additional user data (role) in Firestore
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: role, // Save the selected role
        });

        alert("Registration successful!");
        navigate("/dashboard"); // Redirect to dashboard after registration
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setError(error.message);
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
                    setError("");
                    setFormData({
                      fullName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      phone: "",
                      otp: "",
                    });
                    setOtpVerified(false);
                    setShowOtpInput(false);
                  }}
                />
                <label htmlFor="switch" className="toggle-label">
                  <span className="toggle-text-left">Login</span>
                  <span className="toggle-text-right">Register</span>
                </label>
              </div>
            </div>

            {/* Conditionally render role selector only during registration */}
            {!isLogin && (
              <div className="role-selector">
                <button
                  className={`role-btn ${role === "patient" ? "active" : ""}`}
                  onClick={() => setRole("patient")}
                >
                  <i className="fas fa-user"></i> Patient
                </button>
                <button
                  className={`role-btn ${role === "doctor" ? "active" : ""}`}
                  onClick={() => setRole("doctor")}
                >
                  <i className="fas fa-user-md"></i> Doctor
                </button>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleAuth}>
              {!isLogin && (
                <>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
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
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
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
                    required
                  />
                </>
              )}

              <button type="submit" className="login-btn" disabled={!otpVerified}>
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <div className="otp-section">
              {!showOtpInput ? (
                <form onSubmit={sendOtp}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                  <button type="submit" className="login-btn">Send OTP</button>
                </form>
              ) : (
                <form onSubmit={verifyOtp}>
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    required
                  />
                  <button type="submit" className="login-btn">Verify OTP</button>
                </form>
              )}

              {otpVerified && <p className="otp-success">✅ OTP Verified Successfully!</p>}
            </div>

            <div id="recaptcha-container"></div>
          </div>
        </div>
        <div className="right-section">
          <h1>
            Welcome to <span className="highlight">Healthcare Portal</span>
          </h1>
          <p>A secure platform for managing patient records and appointments</p>
          <div className="healthcare-image"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;