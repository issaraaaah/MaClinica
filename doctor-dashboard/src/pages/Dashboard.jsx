import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import { getMyAppointments, getMyProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  pending:   { label: 'En attente', bg: '#fff3e0', color: '#e65100', icon: '⏳' },
  confirmed: { label: 'Confirmé',   bg: '#e8f5e9', color: '#1b5e20', icon: '✅' },
  cancelled: { label: 'Annulé',     bg: '#fce4ec', color: '#880e4f', icon: '❌' },
};

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    style={{
      background: '#fff', borderRadius: '20px',
      padding: '24px', border: '1px solid #f1f5f9',
    }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '14px',
      background: `${color}18`,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '22px',
      marginBottom: '14px',
    }}>
      {icon}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
      {value}
    </div>
    <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
      {label}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { doctor } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [apptRes, profileRes] = await Promise.all([
          getMyAppointments(),
          getMyProfile(),
        ]);
        setAppointments(apptRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayAppts  = appointments.filter(a => a.date === today);
  const pending     = appointments.filter(a => a.status === 'pending');
  const confirmed   = appointments.filter(a => a.status === 'confirmed');

  return (
    <div>
      <TopBar
        title={`Bonjour, ${doctor?.name?.split(' ')[0]} 👋`}
        subtitle={profile?.specialty || 'Médecin'}
      />

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px', marginBottom: '28px',
      }}>
        <StatCard icon="📅" label="Total RDV"        value={appointments.length} color="#2D9CDB" delay={0.1} />
        <StatCard icon="📆" label="Aujourd'hui"      value={todayAppts.length}   color="#27AE60" delay={0.2} />
        <StatCard icon="⏳" label="En attente"       value={pending.length}      color="#f59e0b" delay={0.3} />
        <StatCard icon="✅" label="Confirmés"        value={confirmed.length}    color="#27AE60" delay={0.4} />
      </div>

      {/* Profil + RDV récents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        {/* Carte profil */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: '#fff', borderRadius: '20px',
            border: '1px solid #f1f5f9', overflow: 'hidden',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #064e3b, #27AE60)',
            padding: '32px 24px', textAlign: 'center',
          }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '3px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '36px',
                margin: '0 auto 14px',
              }}
            >
              👨‍⚕️
            </motion.div>
            <div style={{ color: '#fff', fontSize: '17px', fontWeight: 700 }}>
              {doctor?.name}
            </div>
            <div style={{ color: '#6ee7b7', fontSize: '13px', marginTop: '4px' }}>
              {profile?.specialty}
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            {[
              { label: 'Expérience', value: `${profile?.experience || 0} ans` },
              { label: 'Note',       value: `${profile?.rating || 5.0} ⭐` },
              { label: 'Statut',     value: profile?.isApproved ? '✅ Approuvé' : '⏳ En attente' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
              </div>
            ))}

            {/* Disponibilités */}
            {profile?.availability?.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
                  DISPONIBILITÉS
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.availability.map((slot, i) => (
                    <span key={i} style={{
                      background: '#e8f5e9', color: '#1b5e20',
                      padding: '3px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: 600,
                    }}>
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* RDV récents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: '#fff', borderRadius: '20px',
            padding: '24px', border: '1px solid #f1f5f9',
          }}
        >
          <h3 style={{
            fontSize: '16px', fontWeight: 700,
            color: '#0f172a', marginBottom: '20px',
          }}>
            🕐 Rendez-vous récents
          </h3>
          {loading ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Chargement...</p>
          ) : appointments.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
              Aucun rendez-vous pour l'instant
            </p>
          ) : (
            appointments.slice(0, 6).map((appt, i) => {
              const s = statusConfig[appt.status];
              return (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: '14px', padding: '12px 0',
                    borderBottom: i < appointments.slice(0, 6).length - 1 ? '1px solid #f8fafc' : 'none',
                  }}
                >
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: '#e8f5e9', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0,
                  }}>
                    👤
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                      {appt.patientId?.name || 'Patient'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      📅 {appt.date} · ⏰ {appt.time}
                    </div>
                  </div>
                  <span style={{
                    background: s.bg, color: s.color,
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 600,
                  }}>
                    {s.icon} {s.label}
                  </span>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;