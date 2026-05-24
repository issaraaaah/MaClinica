import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/doctors', label: 'Médecins' },
    ...(user ? [{ path: '/appointments', label: 'Mes RDV' }] : []),
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(45,156,219,0.12)',
          padding: '0 20px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: scrolled ? '0 4px 24px rgba(45,156,219,0.08)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', fontWeight: 700,
              color: 'var(--blue)',
            }}
          >
            🏥 MaClinica
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          '@media (max-width: 768px)': { display: 'none' },
        }} className="desktop-nav">
          {navLinks.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.span
                whileHover={{ y: -1 }}
                style={{
                  padding: '8px 16px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 500,
                  color: isActive(item.path) ? 'var(--blue)' : '#64748b',
                  background: isActive(item.path) ? 'var(--blue-light)' : 'transparent',
                  display: 'inline-block',
                }}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--blue-light)', padding: '6px 14px',
                borderRadius: '20px',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--blue)', color: '#fff',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--blue)' }}>
                  {user.name?.split(' ')[0]}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={handleLogout}
                style={{
                  background: '#fee2e2', color: '#dc2626',
                  border: 'none', padding: '8px 16px',
                  borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                }}
              >
                Déconnexion
              </motion.button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: 'transparent', color: 'var(--blue)',
                    border: '1.5px solid var(--blue)',
                    padding: '8px 18px', borderRadius: '20px',
                    fontSize: '14px', fontWeight: 600,
                  }}
                >
                  Connexion
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: 'var(--blue)', color: '#fff',
                    border: 'none', padding: '8px 18px',
                    borderRadius: '20px', fontSize: '14px', fontWeight: 600,
                  }}
                >
                  S'inscrire
                </motion.button>
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger"
          style={{
            display: 'none',
            background: 'none', border: 'none',
            fontSize: '24px', cursor: 'pointer',
            color: '#0f172a',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed', top: '64px', left: 0, right: 0,
              background: '#fff', zIndex: 99,
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }}
          >
            {navLinks.map((item) => (
              <Link key={item.path} to={item.path}>
                <div style={{
                  padding: '14px 16px', borderRadius: '12px',
                  fontSize: '15px', fontWeight: 500,
                  color: isActive(item.path) ? 'var(--blue)' : '#374151',
                  background: isActive(item.path) ? 'var(--blue-light)' : 'transparent',
                  marginBottom: '4px',
                }}>
                  {item.label}
                </div>
              </Link>
            ))}

            {user ? (
              <>
                <div style={{
                  padding: '14px 16px', borderRadius: '12px',
                  background: 'var(--blue-light)',
                  fontSize: '14px', fontWeight: 600,
                  color: 'var(--blue)', marginBottom: '8px',
                }}>
                  👤 {user.name}
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
                  Déconnexion
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
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

      {/* CSS pour mobile */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;