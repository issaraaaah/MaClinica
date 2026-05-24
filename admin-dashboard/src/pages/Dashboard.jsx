import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import TopBar from '../components/TopBar';
import { getDoctors, getAllAppointments, getUsers } from '../services/api';

const COLORS = ['#2D9CDB', '#27AE60', '#EB5757', '#f59e0b'];

const monthNames = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, boxShadow: `0 12px 28px ${color}22` }}
    style={{
      background: '#fff', borderRadius: '20px',
      padding: '24px', border: '1px solid #f1f5f9',
      transition: 'box-shadow 0.3s',
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
  const [stats, setStats] = useState({
    doctors: 0, patients: 0,
    appointments: 0, pending: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [docRes, apptRes, userRes] = await Promise.all([
          getDoctors(),
          getAllAppointments(),
          getUsers(),
        ]);

        const appts = apptRes.data;
        const doctors = docRes.data;
        const users = userRes.data;

        setStats({
          doctors: doctors.length,
          patients: users.filter(u => u.role === 'patient').length,
          appointments: appts.length,
          pending: appts.filter(a => a.status === 'pending').length,
        });

        setAppointments(appts.slice(0, 5));

        // Données graphique par mois
        const byMonth = Array(12).fill(0);
        appts.forEach(a => {
          const month = new Date(a.createdAt).getMonth();
          byMonth[month]++;
        });
        setChartData(monthNames.map((name, i) => ({ name, rdv: byMonth[i] })));

        // Données pie par statut
        const pending   = appts.filter(a => a.status === 'pending').length;
        const confirmed = appts.filter(a => a.status === 'confirmed').length;
        const cancelled = appts.filter(a => a.status === 'cancelled').length;
        setPieData([
          { name: 'En attente', value: pending },
          { name: 'Confirmés',  value: confirmed },
          { name: 'Annulés',    value: cancelled },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statusStyle = {
    pending:   { bg: '#fff3e0', color: '#e65100', label: 'En attente' },
    confirmed: { bg: '#e8f5e9', color: '#1b5e20', label: 'Confirmé'   },
    cancelled: { bg: '#fce4ec', color: '#880e4f', label: 'Annulé'     },
  };

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Vue d'ensemble de la clinique" />

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px', marginBottom: '28px',
      }}>
        <StatCard icon="👨‍⚕️" label="Médecins"      value={stats.doctors}      color="#2D9CDB" delay={0.1} />
        <StatCard icon="👤"   label="Patients"      value={stats.patients}     color="#27AE60" delay={0.2} />
        <StatCard icon="📅"   label="Rendez-vous"   value={stats.appointments} color="#7c3aed" delay={0.3} />
        <StatCard icon="⏳"   label="En attente"    value={stats.pending}      color="#f59e0b" delay={0.4} />
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: '#fff', borderRadius: '20px',
            padding: '24px', border: '1px solid #f1f5f9',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
            📈 Rendez-vous par mois
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRdv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2D9CDB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2D9CDB" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px', border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
              />
              <Area
                type="monotone" dataKey="rdv"
                stroke="#2D9CDB" strokeWidth={2.5}
                fill="url(#colorRdv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: '#fff', borderRadius: '20px',
            padding: '24px', border: '1px solid #f1f5f9',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
            🥧 Statuts des RDV
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="45%"
                innerRadius={55} outerRadius={85}
                paddingAngle={4} dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                formatter={(value) => (
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{value}</span>
                )}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px', border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Derniers RDV */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{
          background: '#fff', borderRadius: '20px',
          padding: '24px', border: '1px solid #f1f5f9',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
          🕐 Derniers rendez-vous
        </h3>
        {loading ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Chargement...</p>
        ) : appointments.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Aucun rendez-vous</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['Patient', 'Médecin', 'Spécialité', 'Date', 'Statut'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left',
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
              {appointments.map((appt, i) => {
                const s = statusStyle[appt.status];
                return (
                  <motion.tr
                    key={appt._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>
                      {appt.patientId?.name || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: '#374151' }}>
                      {appt.doctorId?.name || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--blue)' }}>
                      {appt.doctorId?.specialty || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#64748b' }}>
                      {appt.date} · {appt.time}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        background: s?.bg, color: s?.color,
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 600,
                      }}>
                        {s?.label}
                      </span>
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

export default Dashboard;