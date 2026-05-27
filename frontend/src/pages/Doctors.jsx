import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDoctors } from '../services/api';

const specialties = ['Tous', 'Cardiologie', 'Pédiatrie', 'Neurologie', 'Dermatologie', 'Orthopédie'];
const avatarColors = ['#2D9CDB', '#27AE60', '#7c3aed', '#e05d26', '#0891b2', '#be185d'];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'Tous' || d.specialty === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: 700, color: '#0f172a', marginBottom: '6px',
        }}>
          👨‍⚕️ Nos Médecins
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          {doctors.length} spécialistes disponibles pour vous
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '16px' }}
      >
        <input
          type="text"
          placeholder="🔍  Rechercher par nom ou spécialité..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '13px 16px',
            borderRadius: '14px', border: '1.5px solid #e2e8f0',
            fontSize: '14px', background: '#fff',
            outline: 'none', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          display: 'flex', gap: '8px',
          flexWrap: 'wrap', marginBottom: '24px',
        }}
      >
        {specialties.map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveFilter(s)}
            style={{
              padding: '7px 16px', borderRadius: '20px',
              border: '1.5px solid',
              borderColor: activeFilter === s ? 'var(--blue)' : '#e2e8f0',
              background: activeFilter === s ? 'var(--blue-light)' : '#fff',
              color: activeFilter === s ? 'var(--blue)' : '#64748b',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {s}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          Chargement des médecins...
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <p>Aucun médecin trouvé</p>
        </motion.div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: isMobile ? '12px' : '24px',
        }}>
          <AnimatePresence>
            {filtered.map((doctor, i) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(45,156,219,0.15)' }}
                style={{
                  background: '#fff', borderRadius: '20px',
                  overflow: 'hidden', border: '1px solid #f1f5f9',
                }}
              >
                <div style={{
                  height: isMobile ? '60px' : '80px',
                  background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length]}33, ${avatarColors[i % avatarColors.length]})`,
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: isMobile ? '-20px' : '-28px',
                    left: '50%', transform: 'translateX(-50%)',
                    width: isMobile ? '48px' : '64px',
                    height: isMobile ? '48px' : '64px',
                    borderRadius: '50%',
                    background: avatarColors[i % avatarColors.length],
                    border: '4px solid #fff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '20px' : '26px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}>
                    👨‍⚕️
                  </div>
                </div>

                <div style={{
                  padding: isMobile ? '28px 12px 16px' : '38px 20px 24px',
                  textAlign: 'center',
                }}>
                  <h3 style={{
                    fontSize: isMobile ? '13px' : '16px',
                    fontWeight: 700, color: '#0f172a', marginBottom: '4px',
                  }}>
                    {doctor.name}
                  </h3>
                  <p style={{
                    color: avatarColors[i % avatarColors.length],
                    fontSize: isMobile ? '11px' : '13px',
                    fontWeight: 600, marginBottom: '8px',
                  }}>
                    {doctor.specialty}
                  </p>
                  <div style={{ color: '#f59e0b', fontSize: isMobile ? '11px' : '14px', marginBottom: '8px' }}>
                    {'★'.repeat(5)}
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>
                    ⏱ {doctor.experience} ans
                  </p>
                  <Link to={`/doctors/${doctor._id}`}>
                    <motion.button
                      whileHover={{
                        background: avatarColors[i % avatarColors.length],
                        color: '#fff',
                      }}
                      style={{
                        width: '100%',
                        padding: isMobile ? '8px' : '11px',
                        borderRadius: '12px',
                        background: `${avatarColors[i % avatarColors.length]}18`,
                        color: avatarColors[i % avatarColors.length],
                        border: 'none',
                        fontSize: isMobile ? '11px' : '13px',
                        fontWeight: 700, transition: 'all 0.2s',
                      }}
                    >
                      Prendre RDV →
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Doctors;