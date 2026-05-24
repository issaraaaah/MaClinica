import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getDoctorById, createAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Grid
gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
padding: isMobile ? '20px 16px' : '40px'
maxWidth: isMobile ? '100%' : '900px'
const DoctorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getDoctorById(id);
        setDoctor(data);
      } catch {
        toast.error('Médecin introuvable');
        navigate('/doctors');
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Connectez-vous pour prendre un RDV');
      return navigate('/login');
    }
    setLoading(true);
    try {
      await createAppointment({ doctorId: id, ...form });
      toast.success('Rendez-vous confirmé ! ✅');
      navigate('/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
      Chargement...
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    borderRadius: '12px', border: '1.5px solid #e2e8f0',
    fontSize: '14px', background: '#f8fafc',
    outline: 'none', fontFamily: 'inherit',
    transition: 'border 0.2s',
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Carte médecin */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#fff', borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #f1f5f9',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #185fa5)',
            padding: '36px 24px',
            textAlign: 'center',
          }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: '90px', height: '90px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '3px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '40px',
                margin: '0 auto 16px',
              }}
            >
              👨‍⚕️
            </motion.div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '22px', fontWeight: 700,
              color: '#fff', marginBottom: '6px',
            }}>
              {doctor.name}
            </h2>
            <p style={{
              color: '#7dd3fc', fontSize: '14px',
              fontWeight: 600,
            }}>
              {doctor.specialty}
            </p>
          </div>

          <div style={{ padding: '24px' }}>
            {[
              { icon: '⏱', label: 'Expérience', value: `${doctor.experience} ans` },
              { icon: '⭐', label: 'Note', value: `${doctor.rating || 5.0} / 5.0` },
              { icon: '📅', label: 'Disponibilités', value: doctor.availability?.length + ' créneaux' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', padding: '12px 0',
                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}

            {doctor.availability?.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, marginBottom: '10px' }}>
                  CRÉNEAUX DISPONIBLES
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {doctor.availability.map((slot, i) => (
                    <span key={i} style={{
                      background: 'var(--blue-light)',
                      color: 'var(--blue)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Formulaire RDV */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#fff', borderRadius: '24px',
            padding: '32px', border: '1px solid #f1f5f9',
          }}
        >
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px', fontWeight: 700,
            color: '#0f172a', marginBottom: '6px',
          }}>
            📅 Prendre un RDV
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '28px' }}>
            Choisissez une date et un créneau
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Date du rendez-vous
              </label>
              <input
                style={inputStyle}
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Heure
              </label>
              <input
                style={inputStyle}
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Notes (optionnel)
              </label>
              <textarea
                style={{ ...inputStyle, height: '90px', resize: 'vertical' }}
                placeholder="Décrivez brièvement votre motif de consultation..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, background: '#1e8a3c' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: loading ? '#94a3b8' : 'var(--green)',
                color: '#fff', border: 'none',
                borderRadius: '14px', fontSize: '15px',
                fontWeight: 700, transition: 'all 0.2s',
              }}
            >
              {loading ? '⏳ Confirmation...' : '✅ Confirmer le rendez-vous'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DoctorDetail;