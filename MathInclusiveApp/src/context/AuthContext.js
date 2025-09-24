import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const current = await authService.getCurrentUser();
      setUser(current);
      setLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (email, password) => {
    const u = await authService.signIn(email, password);
    setUser(u);
    return u;
  };

  const signUp = async (email, password) => {
    const u = await authService.signUp(email, password);
    setUser(u);
    return u;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
