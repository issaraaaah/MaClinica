import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TopBar from '../components/TopBar';
import { getAllAppointments, updateAppointment, deleteAppointment } from '../services/api';

const statusConfig = {
  pending:   { label: 'En attente', bg: '#fff3e0', color: '#e65100' },
  confirmed: { label: 'Confirmé',   bg: '#e8f5e9', color: '#1b5e20' },
  cancelled: { label: 'Annulé',     bg: '#fce4ec', color: '#880e4f' },
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data } = await getAllAppointments();
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

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await deleteAppointment(id);
      toast.success('Supprimé');
      fetchAppointments();
    } catch {
      toast.error('Erreur suppression');
    }
  };

  const filtered = appointments.filter(a =>
    filter === 'all' ? true : a.status === filter
  );

  return (
    <div>
      <TopBar title="📅 Rendez-vous" subtitle={`${appointments.length} rendez-vous au total`} />

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { key: 'all',       label: 'Tous'        },
          { key: 'pending',   label: '⏳ En attente' },
          { key: 'confirmed', label: '✅ Confirmés'  },
          { key: 'cancelled', label: '❌ Annulés'    },
        ].map(f => (
          <motion.button
            key={f.key}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '8px 18px', borderRadius: '20px',
              border: '1.5px solid',
              borderColor: filter === f.key ? 'var(--blue)' : '#e2e8f0',
              background: filter === f.key ? 'var(--blue-light)' : '#fff',
              color: filter === f.key ? 'var(--blue)' : '#64748b',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#fff', borderRadius: '20px',
          border: '1px solid #f1f5f9', overflow: 'hidden',
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Chargement...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Aucun rendez-vous</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['Patient', 'Médecin', 'Date / Heure', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '14px 18px', textAlign: 'left',
                    fontSize: '12px', fontWeight: 600,
                    color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, i) => {
                const s = statusConfig[appt.status];
                return (
                  <motion.tr
                    key={appt._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: 500 }}>
                      {appt.patientId?.name || '—'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{appt.doctorId?.name || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--blue)' }}>{appt.doctorId?.specialty}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#64748b' }}>
                      📅 {appt.date}<br />⏰ {appt.time}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        background: s.bg, color: s.color,
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 600,
                      }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {appt.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleStatus(appt._id, 'confirmed')}
                            style={{
                              background: '#e8f5e9', color: '#1b5e20',
                              border: 'none', padding: '5px 12px',
                              borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                            }}
                          >
                            ✅ Confirmer
                          </motion.button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleStatus(appt._id, 'cancelled')}
                            style={{
                              background: '#fce4ec', color: '#880e4f',
                              border: 'none', padding: '5px 12px',
                              borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                            }}
                          >
                            ❌ Annuler
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleDelete(appt._id)}
                          style={{
                            background: '#f1f5f9', color: '#64748b',
                            border: 'none', padding: '5px 12px',
                            borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                          }}
                        >
                          🗑️
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default Appointments;