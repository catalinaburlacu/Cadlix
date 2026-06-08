import React, { useState, useEffect, useCallback } from 'react';
import { UserContext } from './UserContext.js';
import { cadlixApi, storeTokens, clearTokens } from '../api/cadlixApi.js';
import { mapProfilePayload } from '../api/mappers.js';
import { AUTH_STORAGE_KEY } from '../constants/index.js';

const USER_STORAGE_KEY = 'cadlix_user';

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (!savedUser) return null;
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!savedAuth) return false;
      const parsed = JSON.parse(savedAuth);
      return parsed === true || !!parsed?.token;
    } catch {
      return false;
    }
  });

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

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    const numericId = Number(user.id);
    if (!Number.isFinite(numericId)) {
      return;
    }

    try {
      const rawProfile = await cadlixApi.getProfile(numericId);
      const profile = mapProfilePayload(rawProfile);
      if (profile) {
        setUser(current => current ? {
          ...current,
          ...profile,
          stats: { ...current.stats, ...profile.stats },
          watchList: profile.watchList.length ? profile.watchList : current.watchList,
        } : current);
      }
    } catch (error) {
      console.error('Failed to refresh user profile from API:', error);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    clearTokens();
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
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
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
