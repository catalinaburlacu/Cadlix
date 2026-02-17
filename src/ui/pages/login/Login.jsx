import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import { sanitizeInput } from "../../../utils/security.js";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const toast = useToast();
  const [isSignup, setIsSignup] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ txt: '', email: '', password: '' });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(loginData.email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create complete user object
      const userData = {
        id: Date.now().toString(),
        username: sanitizedEmail.split('@')[0],
        email: sanitizedEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sanitizedEmail}`,
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
    
    if (!signupData.txt || !signupData.email || !signupData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Sanitize inputs
      const sanitizedData = {
        username: sanitizeInput(signupData.txt),
        email: sanitizeInput(signupData.email),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create complete user object for new signup
      const userData = {
        id: Date.now().toString(),
        username: sanitizedData.username,
        email: sanitizedData.email,
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

  const SocialButtons = () => (
    <div className="social-login">
      <div className="social-divider">
        <span>or continue with</span>
      </div>
      <div className="social-buttons">
        <button 
          type="button" 
          className="social-btn google"
          onClick={() => handleSocialLogin('Google')}
        >
          <i className="bx bxl-google"></i>
          <span>Google</span>
        </button>
        <button 
          type="button" 
          className="social-btn facebook"
          onClick={() => handleSocialLogin('Facebook')}
        >
          <i className="bx bxl-facebook"></i>
          <span>Facebook</span>
        </button>
        <button 
          type="button" 
          className="social-btn apple"
          onClick={() => handleSocialLogin('Apple')}
        >
          <i className="bx bxl-apple"></i>
          <span>Apple</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="login-page">
      <div className="main">
        <input 
          type="checkbox" 
          id="chk" 
          aria-hidden="true"
          checked={isSignup}
          onChange={(e) => setIsSignup(e.target.checked)}
        />

        <div className="signup">
          <form onSubmit={handleSignup}>
            <label htmlFor="chk" aria-hidden="true">Sign up</label>
            <input 
              type="text" 
              name="txt" 
              placeholder="User name" 
              required
              value={signupData.txt}
              onChange={handleSignupChange}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              required
              value={signupData.email}
              onChange={handleSignupChange}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required
              value={signupData.password}
              onChange={handleSignupChange}
            />
            <button type="submit">Sign up</button>
            <SocialButtons />
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLogin}>
            <label htmlFor="chk" aria-hidden="true">Login</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              required
              value={loginData.email}
              onChange={handleLoginChange}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <button type="submit">Login</button>
            <SocialButtons />
          </form>
        </div>
      </div>
    </div>
  );
}
