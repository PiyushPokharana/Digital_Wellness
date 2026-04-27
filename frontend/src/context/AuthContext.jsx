import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  canUpload: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Email validation for IIITN format: bt2xxxxxxx@iiitn.ac.in
  const isValidEmail = (email) => {
    if (!email) return false;
    const pattern = /^bt2\d{7}@iiitn\.ac\.in$/i;
    return pattern.test(email);
  };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('dw_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('dw_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    if (isValidEmail(userData.email)) {
      setUser(userData);
      localStorage.setItem('dw_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dw_user');
  };

  const canUpload = user && isValidEmail(user.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        canUpload,
        isValidEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
