import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';

import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Profile      from './pages/Profile';

const Layout = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <main style={{
      marginLeft: 'var(--sidebar-width)',
      flex: 1, minHeight: '100vh',
      padding: '36px 40px',
      background: '#f0f4f8',
    }}>
      {children}
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastStyle={{ borderRadius: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
          }/>
          <Route path="/appointments" element={
            <PrivateRoute><Layout><Appointments /></Layout></PrivateRoute>
          }/>
          <Route path="/profile" element={
            <PrivateRoute><Layout><Profile /></Layout></PrivateRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;