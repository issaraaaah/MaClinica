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

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(45,156,219,0.12)',
        padding: '0 40px',
        height: '68px',
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
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🏥 MaClinica
        </motion.div>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {[
          { path: '/', label: 'Accueil' },
          { path: '/doctors', label: 'Médecins' },
          ...(user ? [{ path: '/appointments', label: 'Mes RDV' }] : []),
        ].map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.span
              whileHover={{ y: -1 }}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                color: isActive(item.path) ? 'var(--blue)' : '#64748b',
                background: isActive(item.path) ? 'var(--blue-light)' : 'transparent',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
            >
              {item.label}
            </motion.span>
          </Link>
        ))}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--blue-light)', padding: '6px 14px',
              borderRadius: '20px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--blue)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700,
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--blue)' }}>
                {user.name?.split(' ')[0]}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              style={{
                background: '#fee2e2', color: '#dc2626',
                border: 'none', padding: '8px 18px',
                borderRadius: '20px', fontSize: '13px', fontWeight: 600,
              }}
            >
              Déconnexion
            </motion.button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', marginLeft: '8px' }}>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent', color: 'var(--blue)',
                  border: '1.5px solid var(--blue)',
                  padding: '8px 20px', borderRadius: '20px',
                  fontSize: '14px', fontWeight: 600,
                }}
              >
                Connexion
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.03, background: 'var(--blue2)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--blue)', color: '#fff',
                  border: 'none', padding: '8px 20px',
                  borderRadius: '20px', fontSize: '14px', fontWeight: 600,
                }}
              >
                S'inscrire
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;