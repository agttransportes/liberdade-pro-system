import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const MOCK_EMAIL = 'admin@liberdadepro.com';
  const MOCK_PASSWORD = 'admin123';

  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('liberdade_pro_token');
      if (token) {
        try {
          const userData = JSON.parse(token);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token inválido:', error);
          sessionStorage.removeItem('liberdade_pro_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        const userData = {
          id: '1',
          name: 'Administrador',
          email: MOCK_EMAIL,
          role: 'admin'
        };
        
        const token = JSON.stringify(userData);
        
        setUser(userData);
        setIsAuthenticated(true);
        sessionStorage.setItem('liberdade_pro_token', token);
        
        return { success: true, user: userData };
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('liberdade_pro_token');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

