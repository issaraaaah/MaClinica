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
    const matchFilter =
      activeFilter === 'Tous' || d.specialty === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px', fontWeight: 700,
          color: '#0f172a', marginBottom: '6px',
        }}>
          👨‍⚕️ Nos Médecins
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px' }}>
          {doctors.length} spécialistes disponibles pour vous
        </p>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '20px' }}
      >
        <input
          type="text"
          placeholder="🔍  Rechercher par nom ou spécialité..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 20px',
            borderRadius: '14px', border: '1.5px solid #e2e8f0',
            fontSize: '15px', background: '#fff',
            outline: 'none', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'border 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </motion.div>

      {/* Filtres spécialités */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}
      >
        {specialties.map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveFilter(s)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: '1.5px solid',
              borderColor: activeFilter === s ? 'var(--blue)' : '#e2e8f0',
              background: activeFilter === s ? 'var(--blue-light)' : '#fff',
              color: activeFilter === s ? 'var(--blue)' : '#64748b',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {s}
          </motion.button>
        ))}
      </motion.div>

      {/* Grille médecins */}
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
          <p style={{ fontSize: '16px' }}>Aucun médecin trouvé</p>
        </motion.div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <AnimatePresence>
            {filtered.map((doctor, i) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(45,156,219,0.15)' }}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid #f1f5f9',
                  transition: 'box-shadow 0.3s',
                }}
              >
                {/* Top coloré */}
                <div style={{
                  height: '80px',
                  background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length]}33, ${avatarColors[i % avatarColors.length]})`,
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-28px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    background: avatarColors[i % avatarColors.length],
                    border: '4px solid #fff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}>
                    👨‍⚕️
                  </div>
                </div>

                {/* Corps */}
                <div style={{ padding: '38px 20px 24px', textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: 700,
                    color: '#0f172a', marginBottom: '4px',
                  }}>
                    {doctor.name}
                  </h3>
                  <p style={{
                    color: avatarColors[i % avatarColors.length],
                    fontSize: '13px', fontWeight: 600, marginBottom: '12px',
                  }}>
                    {doctor.specialty}
                  </p>

                  {/* Étoiles */}
                  <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '12px' }}>
                    {'★'.repeat(Math.round(doctor.rating || 5))}
                    {'☆'.repeat(5 - Math.round(doctor.rating || 5))}
                    <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}>
                      ({doctor.rating || '5.0'})
                    </span>
                  </div>

                  {/* Méta */}
                  <div style={{
                    display: 'flex', justifyContent: 'center',
                    gap: '16px', marginBottom: '20px',
                  }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      ⏱ {doctor.experience} ans
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      📅 Disponible
                    </span>
                  </div>

                  <Link to={`/doctors/${doctor._id}`}>
                    <motion.button
                      whileHover={{
                        background: avatarColors[i % avatarColors.length],
                        color: '#fff',
                      }}
                      style={{
                        width: '100%', padding: '11px',
                        borderRadius: '12px',
                        background: `${avatarColors[i % avatarColors.length]}18`,
                        color: avatarColors[i % avatarColors.length],
                        border: 'none', fontSize: '13px',
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