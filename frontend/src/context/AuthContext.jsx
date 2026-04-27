import { createContext, useContext, useState, useEffect } from 'react';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => { },
  logout: () => { },
  canUpload: false,
  userRole: 'guest',
  getUserRole: () => 'guest',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Email validation for IIITN format: bt + 2-digit year + 3-letter branch + 3-digit roll
  const isValidEmail = (email) => {
    if (!email) return false;
    const pattern = /^bt\d{2}[a-z]{3}\d{3}@iiitn\.ac\.in$/i;
    return pattern.test(email);
  };

  const getUserRole = (email) => {
    if (!email) return 'guest';

    const normalizedEmail = email.trim().toLowerCase();
    if (ADMIN_EMAILS.includes(normalizedEmail)) {
      return 'admin';
    }

    if (isValidEmail(normalizedEmail)) {
      return 'student';
    }

    if (normalizedEmail.endsWith('@iiitn.ac.in')) {
      return 'faculty_staff';
    }

    return 'external';
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
    const role = getUserRole(userData?.email);
    const normalizedUser = {
      ...userData,
      email: userData?.email?.toLowerCase() || '',
      role,
    };

    setUser(normalizedUser);
    localStorage.setItem('dw_user', JSON.stringify(normalizedUser));
    return role;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dw_user');
  };

  const userRole = user?.role || getUserRole(user?.email);
  const canUpload = userRole === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        canUpload,
        userRole,
        getUserRole,
        isValidEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
