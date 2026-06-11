import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import { sanitizeInput } from "../../../utils/security.js";
import { cadlixApi, storeTokens } from "../../../api/cadlixApi.js";
import { mapProfilePayload, mapAuthResponse } from "../../../api/mappers.js";
import { SOCIAL_PROVIDERS } from "../../../constants/ui-data.js";
import "./Login.css";

function SocialButtons({ providers, onSocialLogin }) {
  return (
    <div className="social-login">
      <div className="social-divider">
        <span>or continue with</span>
      </div>
      <div className="social-buttons">
        {providers.map((provider) => (
          <button
            key={provider.name}
            type="button"
            className={`social-btn ${provider.name.toLowerCase()}`}
            onClick={() => onSocialLogin(provider.name)}
          >
            <i className={`bx ${provider.icon}`}></i>
            <span>{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const toast = useToast();
  const [isSignup, setIsSignup] = useState(false);
  const socialProviders = SOCIAL_PROVIDERS

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
      const sanitizedEmail = sanitizeInput(loginData.email);

      const rawResponse = await cadlixApi.login({
        email: sanitizedEmail,
        password: loginData.password,
      });

      const authResponse = mapAuthResponse(rawResponse);

      if (!authResponse || !authResponse.user) {
        toast.error('Invalid email or password.');
        return;
      }

      const tokenValue = authResponse.token;

      storeTokens(tokenValue);

      const profile = mapProfilePayload(await cadlixApi.getProfile(authResponse.user.id));

      const userData = profile || {
        id: authResponse.user.id,
        role: authResponse.user.level === 1 ? 'admin' : 'user',
        username: authResponse.user.name || sanitizedEmail.split('@')[0],
        email: authResponse.user.email || sanitizedEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sanitizedEmail)}`,
        group: authResponse.user.level === 1 ? 'Administrator' : 'Member',
        plan: 'Free',
        status: 'Online',
        stats: {
          score: 0,
          titlesWatched: 0,
          comments: 0,
          likesGiven: 0,
          likesReceived: 0,
          hoursWatched: 0,
          addedToList: 0,
          daysOnSite: 1
        },
        watchList: [],
        watchHistory: [],
      };

      login({
        ...userData,
        id: userData.id ?? authResponse.user.id,
        role: userData.role ?? (authResponse.user.level === 1 ? 'admin' : 'user'),
        username: userData.username ?? authResponse.user.name,
        email: userData.email ?? authResponse.user.email,
      });

      toast.success('Welcome back! Login successful');

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
      const sanitizedData = {
        username: sanitizeInput(signupData.txt),
        email: sanitizeInput(signupData.email),
      };

      const rawResponse = await cadlixApi.createUser({
        name: sanitizedData.username,
        email: sanitizedData.email,
        password: signupData.password,
        level: 0,
        historyId: 0,
        movieListId: 0,
      });

      const authResponse = mapAuthResponse(rawResponse);

      if (!authResponse || !authResponse.user) {
        throw new Error('Invalid response from server');
      }

      const userId = authResponse.user.id;
      const tokenValue = authResponse.token;

      if (tokenValue) {
        storeTokens(tokenValue);
      }

      let profile = null;
      try {
        profile = mapProfilePayload(await cadlixApi.getProfile(userId));
      } catch (err) {
        console.warn('Failed to fetch profile after signup:', err);
      }

      const userData = profile || {
        id: userId,
        role: authResponse.user.level === 1 ? 'admin' : 'user',
        username: authResponse.user.name || sanitizedData.username,
        email: authResponse.user.email || sanitizedData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sanitizedData.username)}`,
        group: authResponse.user.level === 1 ? 'Administrator' : 'Member',
        plan: 'Free',
        status: 'Online',
        stats: {
          score: 0,
          titlesWatched: 0,
          comments: 0,
          likesGiven: 0,
          likesReceived: 0,
          hoursWatched: 0,
          addedToList: 0,
          daysOnSite: 1
        },
        watchList: [],
        watchHistory: [],
      };

      login(userData);
      toast.success('Account created successfully! Welcome to Cadlix');
      navigate('/home');
    } catch (error) {
      if (error.message?.includes('already registered')) {
        toast.error('Email already registered. Please login instead.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
      console.error('Signup error:', error);
    }
  };

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
            <SocialButtons providers={socialProviders} onSocialLogin={handleSocialLogin} />
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
            <SocialButtons providers={socialProviders} onSocialLogin={handleSocialLogin} />
          </form>
        </div>
      </div>
    </div>
  );
}
