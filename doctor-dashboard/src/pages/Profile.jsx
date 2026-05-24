import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TopBar from '../components/TopBar';
import { getMyProfile, updateMyProfile } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    specialty: '', experience: '', availability: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyProfile();
        setProfile(data);
        setForm({
          specialty:    data.specialty || '',
          experience:   data.experience || '',
          availability: data.availability?.join(', ') || '',
        });
      } catch {
        toast.error('Erreur chargement profil');
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMyProfile({
        specialty:    form.specialty,
        experience:   Number(form.experience),
        availability: form.availability.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Profil mis à jour ✅');
    } catch {
      toast.error('Erreur mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    borderRadius: '12px', border: '1.5px solid #e2e8f0',
    fontSize: '14px', background: '#f8fafc',
    outline: 'none', fontFamily: 'inherit',
    transition: 'border 0.2s',
  };

  return (
    <div>
      <TopBar title="👨‍⚕️ Mon Profil" subtitle="Gérez vos informations professionnelles" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>

        {/* Carte profil */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: '#fff', borderRadius: '24px',
            overflow: 'hidden', border: '1px solid #f1f5f9',
            height: 'fit-content',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #064e3b, #27AE60)',
            padding: '40px 24px', textAlign: 'center',
          }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '3px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '40px',
                margin: '0 auto 16px',
              }}
            >
              👨‍⚕️
            </motion.div>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>
              {profile?.name}
            </div>
            <div style={{ color: '#6ee7b7', fontSize: '14px', marginTop: '6px' }}>
              {profile?.specialty}
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            {[
              { label: 'Expérience', value: `${profile?.experience || 0} ans` },
              { label: 'Note',       value: `${profile?.rating || 5.0} ⭐`    },
              { label: 'Statut',     value: profile?.isApproved ? '✅ Approuvé' : '⏳ En attente' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Formulaire modification */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#fff', borderRadius: '24px',
            padding: '32px', border: '1px solid #f1f5f9',
          }}
        >
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px', fontWeight: 700,
            color: '#0f172a', marginBottom: '24px',
          }}>
            ✏️ Modifier mes informations
          </h3>

          <form onSubmit={handleSubmit}>
            {[
              { name: 'specialty',    label: 'Spécialité',               type: 'text',   ph: 'Cardiologie' },
              { name: 'experience',   label: 'Années d\'expérience',     type: 'number', ph: '10'          },
              { name: 'availability', label: 'Disponibilités (séparées par virgule)', type: 'text', ph: 'Lundi 09:00, Mercredi 14:00' },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: '18px' }}>
                <label style={{
                  fontSize: '13px', fontWeight: 600,
                  color: '#374151', display: 'block', marginBottom: '7px',
                }}>
                  {field.label}
                </label>
                <input
                  style={inputStyle}
                  type={field.type}
                  placeholder={field.ph}
                  value={form[field.name]}
                  onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                  onFocus={e => e.target.style.borderColor = 'var(--green)'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#94a3b8' : 'var(--green)',
                color: '#fff', border: 'none',
                borderRadius: '12px', fontSize: '15px',
                fontWeight: 700, marginTop: '8px',
              }}
            >
              {loading ? 'Sauvegarde...' : '💾 Sauvegarder les modifications'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;