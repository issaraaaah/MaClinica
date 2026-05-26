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
    if (!window.confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
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
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '28px' }}
      >
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '30px', fontWeight: 700,
          color: '#0f172a', marginBottom: '6px',
        }}>
          📅 Mes Rendez-vous
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          {appointments.length} rendez-vous au total
        </p>
      </motion.div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Tous' },
          { key: 'pending', label: '⏳ En attente' },
          { key: 'confirmed', label: '✅ Confirmés' },
          { key: 'cancelled', label: '❌ Annulés' },
        ].map((f) => (
          <motion.button
            key={f.key}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: '1.5px solid',
              borderColor: filter === f.key ? 'var(--blue)' : '#e2e8f0',
              background: filter === f.key ? 'var(--blue-light)' : '#fff',
              color: filter === f.key ? 'var(--blue)' : '#64748b',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '60px',
            background: '#fff', borderRadius: '20px',
            border: '1px solid #f1f5f9',
          }}
        >
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>📭</div>
          <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '16px' }}>
            Aucun rendez-vous trouvé
          </p>
          <Link to="/doctors">
            <motion.button
              whileHover={{ scale: 1.03 }}
              style={{
                background: 'var(--blue)', color: '#fff',
                border: 'none', padding: '12px 28px',
                borderRadius: '12px', fontSize: '14px',
                fontWeight: 700,
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
                whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '16px',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'box-shadow 0.3s',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '56px', height: '56px',
                  borderRadius: '16px',
                  background: 'var(--blue-light)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '28px',
                  flexShrink: 0,
                }}>
                  👨‍⚕️
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px', fontWeight: 700,
                    color: '#0f172a', marginBottom: '3px',
                  }}>
                    {appt.doctorId?.name || 'Médecin'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--blue)', fontWeight: 600, marginBottom: '6px' }}>
                    {appt.doctorId?.specialty}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    📅 {appt.date} &nbsp;·&nbsp; ⏰ {appt.time}
                  </p>
                </div>

                {/* Status + action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{
                    background: s.bg, color: s.color,
                    padding: '5px 14px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {s.icon} {s.label}
                  </span>
                  {appt.status !== 'cancelled' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCancel(appt._id)}
                      style={{
                        background: '#fee2e2', color: '#dc2626',
                        border: 'none', padding: '6px 14px',
                        borderRadius: '10px', fontSize: '12px',
                        fontWeight: 600,
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