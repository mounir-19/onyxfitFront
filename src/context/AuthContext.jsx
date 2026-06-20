import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout as authLogout } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        console.log('Auth: Loaded user', currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    console.log('Auth: User logged in', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('Auth: User logged out');
    authLogout();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};