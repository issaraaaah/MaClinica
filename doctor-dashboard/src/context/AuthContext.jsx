import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(
    JSON.parse(localStorage.getItem('doctor')) || null
  );

  const loginDoctor = (data) => {
    localStorage.setItem('doctor', JSON.stringify(data));
    setDoctor(data);
  };

  const logoutDoctor = () => {
    localStorage.removeItem('doctor');
    setDoctor(null);
  };

  return (
    <AuthContext.Provider value={{ doctor, loginDoctor, logoutDoctor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);