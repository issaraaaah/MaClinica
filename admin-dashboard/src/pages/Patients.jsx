import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TopBar from '../components/TopBar';
import { getUsers, blockUser } from '../services/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const { data } = await getUsers();
      setPatients(data.filter(u => u.role === 'patient'));
    } catch {
      toast.error('Erreur chargement patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleBlock = async (id, isBlocked) => {
    try {
      await blockUser(id);
      toast.success(isBlocked ? 'Patient débloqué' : 'Patient bloqué');
      fetchPatients();
    } catch {
      toast.error('Erreur');
    }
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const avatarColors = ['#2D9CDB','#27AE60','#7c3aed','#e05d26','#0891b2','#be185d'];

  return (
    <div>
      <TopBar title="👤 Patients" subtitle={`${patients.length} patients enregistrés`} />

      <input
        type="text"
        placeholder="🔍 Rechercher un patient..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '13px 18px',
          borderRadius: '14px', border: '1.5px solid #e2e8f0',
          fontSize: '14px', background: '#fff',
          outline: 'none', fontFamily: 'inherit',
          marginBottom: '24px',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--blue)'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Chargement...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {filtered.map((patient, i) => (
            <motion.div
              key={patient._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
              style={{
                background: '#fff', borderRadius: '18px',
                padding: '24px', border: '1px solid #f1f5f9',
                transition: 'box-shadow 0.3s',
                opacity: patient.isBlocked ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: avatarColors[i % avatarColors.length],
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px',
                  fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {patient.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    {patient.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {patient.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: patient.isBlocked ? '#fce4ec' : '#e8f5e9',
                  color: patient.isBlocked ? '#880e4f' : '#1b5e20',
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: 600,
                }}>
                  {patient.isBlocked ? '🔒 Bloqué' : '✅ Actif'}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleBlock(patient._id, patient.isBlocked)}
                  style={{
                    background: patient.isBlocked ? '#e8f5e9' : '#fce4ec',
                    color: patient.isBlocked ? '#1b5e20' : '#880e4f',
                    border: 'none', padding: '6px 14px',
                    borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                  }}
                >
                  {patient.isBlocked ? '🔓 Débloquer' : '🔒 Bloquer'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;