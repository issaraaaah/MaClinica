import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/doctors', label: 'Médecins' },
    ...(user ? [{ path: '/appointments', label: 'Mes RDV' }] : []),
  ];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(45,156,219,0.12)',
        padding: '0 16px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(45,156,219,0.06)',
      }}>
        {/* Logo */}
        <Link to="/">
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '18px', fontWeight: 700,
            color: 'var(--blue)',
          }}>
            🏥 MaClinica
          </div>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none', border: 'none',
            fontSize: '22px', cursor: 'pointer',
            color: '#0f172a', padding: '8px',
            display: 'flex', alignItems: 'center',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: '60px', left: 0, right: 0,
              background: '#fff',
              zIndex: 99,
              padding: '12px 16px 20px',
              borderBottom: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}
          >
            {navLinks.map((item) => (
              <Link key={item.path} to={item.path}>
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '15px', fontWeight: 500,
                  color: isActive(item.path) ? 'var(--blue)' : '#374151',
                  background: isActive(item.path) ? 'var(--blue-light)' : 'transparent',
                  marginBottom: '4px',
                }}>
                  {item.label}
                </div>
              </Link>
            ))}

            <div style={{ height: '1px', background: '#e2e8f0', margin: '12px 0' }} />

            {user ? (
              <>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'var(--blue-light)',
                  fontSize: '14px', fontWeight: 600,
                  color: 'var(--blue)', marginBottom: '10px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--blue)', color: '#fff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700,
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '14px',
                    background: '#fee2e2', color: '#dc2626',
                    border: 'none', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 600,
                  }}
                >
                  🚪 Déconnexion
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login">
                  <button style={{
                    width: '100%', padding: '14px',
                    background: 'transparent', color: 'var(--blue)',
                    border: '1.5px solid var(--blue)',
                    borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                  }}>
                    Connexion
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{
                    width: '100%', padding: '14px',
                    background: 'var(--blue)', color: '#fff',
                    border: 'none', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 600,
                  }}>
                    S'inscrire
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;