import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem('admin')) || null
  );

  const loginAdmin = (data) => {
    localStorage.setItem('admin', JSON.stringify(data));
    setAdmin(data);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);