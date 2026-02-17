import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import { useFormValidation, validators } from "../../../hooks/useFormValidation.js";
import Input from "../../../components/common/Input.jsx";
import Button from "../../../components/common/Button.jsx";
import { sanitizeInput } from "../../../utils/security.js";
import "./Login.css";

// Validation rules for login form
const loginValidationRules = {
  email: [
    validators.required('Email is required'),
    validators.email('Please enter a valid email address'),
  ],
  password: [
    validators.required('Password is required'),
    validators.minLength(6, 'Password must be at least 6 characters'),
  ],
};

// Validation rules for signup form
const signupValidationRules = {
  username: [
    validators.required('Username is required'),
    validators.minLength(3, 'Username must be at least 3 characters'),
    validators.maxLength(30, 'Username must be no more than 30 characters'),
  ],
  email: [
    validators.required('Email is required'),
    validators.email('Please enter a valid email address'),
  ],
  phone: [
    validators.required('Phone number is required'),
    validators.pattern(/^\d{10,15}$/, 'Please enter a valid phone number'),
  ],
  password: [
    validators.required('Password is required'),
    validators.minLength(8, 'Password must be at least 8 characters'),
  ],
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const toast = useToast();
  const [activeForm, setActiveForm] = useState('login');

  // Login form state
  const loginForm = useFormValidation(
    { email: '', password: '' },
    loginValidationRules
  );

  // Signup form state
  const signupForm = useFormValidation(
    { username: '', email: '', phone: '', password: '' },
    signupValidationRules
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginForm.validateAll()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedData = {
        email: sanitizeInput(loginForm.values.email),
        password: loginForm.values.password, // Don't sanitize passwords
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create complete user object
      const userData = {
        id: Date.now().toString(),
        username: sanitizedData.email.split('@')[0],
        email: sanitizedData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sanitizedData.email}`,
        group: 'Member',
        status: 'Online',
        stats: {
          rating: '0',
          animeWatched: 0,
          comments: 0,
          likesGiven: 0,
          likesReceived: 0,
          hoursWatched: 0,
          addedToList: 0,
          daysOnSite: 1
        }
      };
      
      login(userData);
      toast.success('Welcome back! Login successful');
      
      // Redirect to originally requested page or home
      const from = location.state?.from || '/home';
      navigate(from);
    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!signupForm.validateAll()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedData = {
        username: sanitizeInput(signupForm.values.username),
        email: sanitizeInput(signupForm.values.email),
        phone: sanitizeInput(signupForm.values.phone),
        password: signupForm.values.password,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create complete user object for new signup
      const userData = {
        id: Date.now().toString(),
        username: sanitizedData.username,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sanitizedData.username}`,
        group: 'Member',
        status: 'Online',
        stats: {
          rating: '0',
          animeWatched: 0,
          comments: 0,
          likesGiven: 0,
          likesReceived: 0,
          hoursWatched: 0,
          addedToList: 0,
          daysOnSite: 1
        }
      };
      
      login(userData);
      toast.success('Account created successfully! Welcome to Cadlix');
      navigate('/home');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      console.error('Signup error:', error);
    }
  };

  const switchForm = (form) => {
    setActiveForm(form);
    // Reset forms when switching
    if (form === 'login') {
      signupForm.reset();
    } else {
      loginForm.reset();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Toggle Switch */}
          <div className="form-toggle" role="tablist" aria-label="Login or Signup">
            <button
              role="tab"
              aria-selected={activeForm === 'login'}
              className={`toggle-btn ${activeForm === 'login' ? 'active' : ''}`}
              onClick={() => switchForm('login')}
            >
              Login
            </button>
            <button
              role="tab"
              aria-selected={activeForm === 'signup'}
              className={`toggle-btn ${activeForm === 'signup' ? 'active' : ''}`}
              onClick={() => switchForm('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          <div 
            className={`form-container ${activeForm === 'login' ? 'active' : ''}`}
            role="tabpanel"
            aria-hidden={activeForm !== 'login'}
          >
            <form onSubmit={handleLogin} noValidate>
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Enter your credentials to access your account</p>
              
              <div className="form-fields">
                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={loginForm.values.email}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  error={loginForm.errors.email}
                  touched={loginForm.touched.email}
                  required
                  autoComplete="email"
                  icon="✉"
                />
                
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={loginForm.values.password}
                  onChange={loginForm.handleChange}
                  onBlur={loginForm.handleBlur}
                  error={loginForm.errors.password}
                  touched={loginForm.touched.password}
                  required
                  autoComplete="current-password"
                  icon="🔒"
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="large"
                className="form-submit"
              >
                Login
              </Button>

              <p className="form-footer">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="form-link"
                  onClick={() => switchForm('signup')}
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>

          {/* Signup Form */}
          <div 
            className={`form-container ${activeForm === 'signup' ? 'active' : ''}`}
            role="tabpanel"
            aria-hidden={activeForm !== 'signup'}
          >
            <form onSubmit={handleSignup} noValidate>
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Fill in your details to get started</p>
              
              <div className="form-fields">
                <Input
                  type="text"
                  name="username"
                  label="Username"
                  placeholder="Choose a username"
                  value={signupForm.values.username}
                  onChange={signupForm.handleChange}
                  onBlur={signupForm.handleBlur}
                  error={signupForm.errors.username}
                  touched={signupForm.touched.username}
                  required
                  autoComplete="username"
                  icon="👤"
                />
                
                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={signupForm.values.email}
                  onChange={signupForm.handleChange}
                  onBlur={signupForm.handleBlur}
                  error={signupForm.errors.email}
                  touched={signupForm.touched.email}
                  required
                  autoComplete="email"
                  icon="✉"
                />
                
                <Input
                  type="tel"
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={signupForm.values.phone}
                  onChange={signupForm.handleChange}
                  onBlur={signupForm.handleBlur}
                  error={signupForm.errors.phone}
                  touched={signupForm.touched.phone}
                  required
                  autoComplete="tel"
                  icon="📱"
                />
                
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Create a password"
                  value={signupForm.values.password}
                  onChange={signupForm.handleChange}
                  onBlur={signupForm.handleBlur}
                  error={signupForm.errors.password}
                  touched={signupForm.touched.password}
                  required
                  autoComplete="new-password"
                  icon="🔒"
                  helperText="Must be at least 8 characters"
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="large"
                className="form-submit"
              >
                Create Account
              </Button>

              <p className="form-footer">
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="form-link"
                  onClick={() => switchForm('login')}
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
