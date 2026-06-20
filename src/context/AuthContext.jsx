import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUsers, setUsers, seedDefaultUsers } from '../utils/localStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDefaultUsers(); // ensure admin & sample users exist
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const loggedUser = { ...user, loggedInAt: new Date().toISOString() };
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      setCurrentUser(loggedUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password.' };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const updateUser = (updatedUser) => {
    const users = getUsers();
    const idx = users.findIndex(u => u.username === updatedUser.username);
    if (idx !== -1) {
      users[idx] = updatedUser;
      setUsers(users);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isCitizen: currentUser?.role === 'citizen',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}