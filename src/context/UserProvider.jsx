import React, { useState, useEffect, useCallback } from 'react';
import { UserContext } from './UserContext.js';
import { defaultUser } from './userData.js';

// Storage key for localStorage
const USER_STORAGE_KEY = 'cadlix_user';
const AUTH_STORAGE_KEY = 'cadlix_auth';

export function UserProvider({ children }) {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth) : false;
    } catch {
      return false;
    }
  });

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  }, [user]);

  // Persist auth state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
    } catch (error) {
      console.error('Failed to save auth state to localStorage:', error);
    }
  }, [isAuthenticated]);

  const login = useCallback((userData = defaultUser) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear localStorage on logout
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      // Also update localStorage immediately
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to update user in localStorage:', error);
      }
      return updatedUser;
    });
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
