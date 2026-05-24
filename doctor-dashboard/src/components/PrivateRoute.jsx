import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { doctor } = useAuth();
  if (!doctor) return <Navigate to="/login" />;
  if (doctor.role !== 'doctor') return <Navigate to="/login" />;
  return children;
};

export default PrivateRoute;