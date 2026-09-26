import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    
    if (token && storedRole) {
      // In a real app, you would verify the token with the backend here.
      // For now, we trust local storage to restore the session.
      setRole(storedRole);
      setUser({ token, name }); 
    }
    setLoading(false);
  }, []);

  const login = async (email, password, type = 'restaurant') => {
    try {
      const endpoint = type === 'worker' ? '/auth/worker-login' : '/auth/login';
      const response = await api.post(endpoint, { email, password });
      
      const { token, role: userRole, name } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      if (name) localStorage.setItem('name', name);
      
      setRole(userRole);
      setUser({ token, name });
      
      return { success: true, role: userRole };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setRole(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
