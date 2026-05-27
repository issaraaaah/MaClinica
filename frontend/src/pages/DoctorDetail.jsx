import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getMyAppointments, cancelAppointment } from '../services/api';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending:   { label: 'En attente', bg: '#fff3e0', color: '#e65100', icon: '⏳' },
  confirmed: { label: 'Confirmé',   bg: '#e8f5e9', color: '#1b5e20', icon: '✅' },
  cancelled: { label: 'Annulé',     bg: '#fce4ec', color: '#880e4f', icon: '❌' },
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await getMyAppointments();
      setAppointments(data);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Annuler ce rendez-vous ?')) return;
    try {
      await cancelAppointment(id);
      toast.success('Rendez-vous annulé');
      fetchAppointments();
    } catch {
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const filtered = appointments.filter(a =>
    filter === 'all' ? true : a.status === filter
  );

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '40px', maxWidth: '800px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: isMobile ? '24px' : '30px',
          fontWeight: 700, color: '#0f172a', marginBottom: '6px',
        }}>
          📅 Mes Rendez-vous
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          {appointments.length} rendez-vous au total
        </p>
      </motion.div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all',       label: 'Tous'          },
          { key: 'pending',   label: '⏳ En attente'  },
          { key: 'confirmed', label: '✅ Confirmés'   },
          { key: 'cancelled', label: '❌ Annulés'     },
        ].map(f => (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '7px 14px', borderRadius: '20px',
              border: '1.5px solid',
              borderColor: filter === f.key ? 'var(--blue)' : '#e2e8f0',
              background: filter === f.key ? 'var(--blue-light)' : '#fff',
              color: filter === f.key ? 'var(--blue)' : '#64748b',
              fontSize: '12px', fontWeight: 600,
            }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Chargement...</p>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '50px 20px',
            background: '#fff', borderRadius: '20px',
            border: '1px solid #f1f5f9',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '16px' }}>
            Aucun rendez-vous trouvé
          </p>
          <Link to="/doctors">
            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'var(--blue)', color: '#fff',
                border: 'none', padding: '12px 28px',
                borderRadius: '12px', fontSize: '14px', fontWeight: 700,
              }}
            >
              Prendre un RDV
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          {filtered.map((appt, i) => {
            const s = statusConfig[appt.status];
            return (
              <motion.div
                key={appt._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: '#fff', borderRadius: '18px',
                  padding: isMobile ? '16px' : '22px',
                  marginBottom: '12px',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: '14px',
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'var(--blue-light)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                }}>
                  👨‍⚕️
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>
                    {appt.doctorId?.name || 'Médecin'}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--blue)', fontWeight: 600, marginBottom: '4px' }}>
                    {appt.doctorId?.specialty}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    📅 {appt.date} · ⏰ {appt.time}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  alignItems: isMobile ? 'center' : 'flex-end',
                  gap: '8px',
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: isMobile ? 'space-between' : 'flex-end',
                }}>
                  <span style={{
                    background: s.bg, color: s.color,
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {s.icon} {s.label}
                  </span>
                  {appt.status !== 'cancelled' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancel(appt._id)}
                      style={{
                        background: '#fee2e2', color: '#dc2626',
                        border: 'none', padding: '6px 14px',
                        borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                      }}
                    >
                      Annuler
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Appointments;