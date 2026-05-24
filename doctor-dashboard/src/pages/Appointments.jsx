import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TopBar from '../components/TopBar';
import { getMyAppointments, updateAppointment } from '../services/api';

const statusConfig = {
  pending:   { label: 'En attente', bg: '#fff3e0', color: '#e65100', icon: '⏳' },
  confirmed: { label: 'Confirmé',   bg: '#e8f5e9', color: '#1b5e20', icon: '✅' },
  cancelled: { label: 'Annulé',     bg: '#fce4ec', color: '#880e4f', icon: '❌' },
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data } = await getMyAppointments();
      setAppointments(data);
    } catch {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      toast.success('Statut mis à jour ✅');
      fetchAppointments();
    } catch {
      toast.error('Erreur mise à jour');
    }
  };

  const filtered = appointments.filter(a =>
    filter === 'all' ? true : a.status === filter
  );

  return (
    <div>
      <TopBar
        title="📅 Mes Rendez-vous"
        subtitle={`${appointments.length} rendez-vous au total`}
      />

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { key: 'all',       label: 'Tous'          },
          { key: 'pending',   label: '⏳ En attente'  },
          { key: 'confirmed', label: '✅ Confirmés'   },
          { key: 'cancelled', label: '❌ Annulés'     },
        ].map(f => (
          <motion.button
            key={f.key}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 18px', borderRadius: '20px',
              border: '1.5px solid',
              borderColor: filter === f.key ? 'var(--green)' : '#e2e8f0',
              background: filter === f.key ? 'var(--green-light)' : '#fff',
              color: filter === f.key ? 'var(--green)' : '#64748b',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Chargement...</p>
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
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Aucun rendez-vous trouvé</p>
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
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
                style={{
                  background: '#fff', borderRadius: '20px',
                  padding: '24px', marginBottom: '14px',
                  border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center',
                  gap: '20px', transition: 'box-shadow 0.3s',
                }}
              >
                {/* Avatar patient */}
                <div style={{
                  width: '54px', height: '54px', borderRadius: '16px',
                  background: 'var(--green-light)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '26px', flexShrink: 0,
                }}>
                  👤
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>
                    {appt.patientId?.name || 'Patient'}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                    📧 {appt.patientId?.email}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    📅 {appt.date} &nbsp;·&nbsp; ⏰ {appt.time}
                  </p>
                  {appt.notes && (
                    <p style={{
                      fontSize: '12px', color: '#94a3b8',
                      marginTop: '6px', fontStyle: 'italic',
                    }}>
                      💬 {appt.notes}
                    </p>
                  )}
                </div>

                {/* Statut + actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{
                    background: s.bg, color: s.color,
                    padding: '5px 14px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {s.icon} {s.label}
                  </span>

                  {appt.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleStatus(appt._id, 'confirmed')}
                        style={{
                          background: '#e8f5e9', color: '#1b5e20',
                          border: 'none', padding: '7px 14px',
                          borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                        }}
                      >
                        ✅ Accepter
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleStatus(appt._id, 'cancelled')}
                        style={{
                          background: '#fce4ec', color: '#880e4f',
                          border: 'none', padding: '7px 14px',
                          borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                        }}
                      >
                        ❌ Refuser
                      </motion.button>
                    </div>
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