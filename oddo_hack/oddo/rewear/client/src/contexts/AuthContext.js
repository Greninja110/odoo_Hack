import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would validate the token here
      setUser({ 
        username: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Placeholder login function
    console.log('Login attempted with:', email, password);
    
    // Simulate successful login
    const demoUser = { 
      username: 'Demo User',
      email: email,
      role: 'user'
    };
    
    setUser(demoUser);
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    return true;
  };

  const register = async (email, username, password) => {
    // Placeholder register function
    console.log('Register attempted with:', email, username, password);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}