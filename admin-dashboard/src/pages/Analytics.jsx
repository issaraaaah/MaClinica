import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import TopBar from '../components/TopBar';
import { getAllAppointments, getDoctors } from '../services/api';

const monthNames = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

const Analytics = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [specialtyData, setSpecialtyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, docRes] = await Promise.all([
          getAllAppointments(),
          getDoctors(),
        ]);

        const appts = apptRes.data;
        const doctors = docRes.data;

        // Par mois
        const byMonth = Array(12).fill(null).map((_, i) => ({
          name: monthNames[i],
          total: 0, confirmés: 0, annulés: 0,
        }));
        appts.forEach(a => {
          const m = new Date(a.createdAt).getMonth();
          byMonth[m].total++;
          if (a.status === 'confirmed') byMonth[m].confirmés++;
          if (a.status === 'cancelled') byMonth[m].annulés++;
        });
        setMonthlyData(byMonth);

        // Par spécialité
        const specCount = {};
        appts.forEach(a => {
          const spec = a.doctorId?.specialty || 'Autre';
          specCount[spec] = (specCount[spec] || 0) + 1;
        });
        setSpecialtyData(
          Object.entries(specCount)
            .map(([name, rdv]) => ({ name, rdv }))
            .sort((a, b) => b.rdv - a.rdv)
            .slice(0, 6)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div>
      <TopBar title="📈 Analytiques" />
      <p style={{ textAlign: 'center', color: '#94a3b8', padding: '60px' }}>Chargement...</p>
    </div>
  );

  return (
    <div>
      <TopBar title="📈 Analytiques" subtitle="Statistiques détaillées de la clinique" />

      {/* Graphique lignes mensuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#fff', borderRadius: '20px',
          padding: '28px', border: '1px solid #f1f5f9',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
          📅 Évolution mensuelle des rendez-vous
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
            <Legend formatter={v => <span style={{ fontSize: '12px', color: '#64748b' }}>{v}</span>} />
            <Line type="monotone" dataKey="total"     stroke="#2D9CDB" strokeWidth={2.5} dot={{ r: 4 }} name="Total" />
            <Line type="monotone" dataKey="confirmés" stroke="#27AE60" strokeWidth={2.5} dot={{ r: 4 }} name="Confirmés" />
            <Line type="monotone" dataKey="annulés"   stroke="#EB5757" strokeWidth={2.5} dot={{ r: 4 }} name="Annulés" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Graphique barres spécialités */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: '#fff', borderRadius: '20px',
          padding: '28px', border: '1px solid #f1f5f9',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
          🏥 Rendez-vous par spécialité
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={specialtyData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} />
            <Bar dataKey="rdv" fill="#2D9CDB" radius={[8, 8, 0, 0]} name="Rendez-vous" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Analytics;