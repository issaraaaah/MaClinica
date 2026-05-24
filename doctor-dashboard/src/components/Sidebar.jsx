import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',             icon: '📊', label: 'Dashboard'     },
  { path: '/appointments', icon: '📅', label: 'Rendez-vous'   },
  { path: '/profile',      icon: '👨‍⚕️', label: 'Mon Profil'   },
];

const Sidebar = () => {
  const { doctor, logoutDoctor } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        background: '#064e3b',
        position: 'fixed',
        left: 0, top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '20px', fontWeight: 700, color: '#fff',
          marginBottom: '4px',
        }}>
          🏥 MaClinica
        </div>
        <div style={{
          fontSize: '11px', color: '#6ee7b7',
          fontWeight: 500, letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Espace Médecin
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '12px', padding: '11px 14px',
                  borderRadius: '12px', marginBottom: '4px',
                  background: isActive ? 'rgba(39,174,96,0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--green)' : '3px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{
                  fontSize: '14px', fontWeight: 500,
                  color: isActive ? '#6ee7b7' : '#94a3b8',
                }}>
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Doctor info */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '10px', marginBottom: '12px',
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'var(--green)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: '#fff',
          }}>
            {doctor?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              {doctor?.name}
            </div>
            <div style={{ fontSize: '11px', color: '#6ee7b7' }}>Médecin</div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { logoutDoctor(); navigate('/login'); }}
          style={{
            width: '100%', padding: '10px',
            background: 'rgba(235,87,87,0.15)',
            color: '#f87171', border: 'none',
            borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          }}
        >
          🚪 Déconnexion
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;