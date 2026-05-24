import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const stats = [
  { num: '1 284+', label: 'Patients satisfaits' },
  { num: '47',     label: 'Médecins experts' },
  { num: '12',     label: 'Spécialités' },
  { num: '4.9 ★',  label: 'Note moyenne' },
];

const features = [
  { icon: '📅', title: 'Réservation facile', desc: 'Choisissez votre médecin et confirmez en 3 clics.', color: '#E8F5FD' },
  { icon: '🔔', title: 'Rappels automatiques', desc: 'Recevez des notifications avant chaque rendez-vous.', color: '#e8f5e9' },
  { icon: '🔒', title: '100% sécurisé', desc: 'Vos données médicales sont chiffrées et protégées.', color: '#f3e5f5' },
  { icon: '⚡', title: 'Disponible 24h/24', desc: 'Prenez rendez-vous à toute heure, même le week-end.', color: '#fff3e0' },
  { icon: '👨‍⚕️', title: 'Médecins vérifiés', desc: 'Tous nos praticiens sont diplômés et vérifiés.', color: '#fce4ec' },
  { icon: '📋', title: 'Suivi médical', desc: 'Accédez à tout votre historique en un endroit.', color: '#e8f5e9' },
];

const specialties = [
  { icon: '❤️', name: 'Cardiologie' },
  { icon: '🧠', name: 'Neurologie' },
  { icon: '👶', name: 'Pédiatrie' },
  { icon: '🦷', name: 'Dentisterie' },
  { icon: '👁️', name: 'Ophtalmologie' },
  { icon: '🦴', name: 'Orthopédie' },
];

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
const isMobile = window.innerWidth <= 768;
  return (
    <div>
      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #185fa5 100%)',
        padding: isMobile ? '60px 20px 50px' : '90px 40px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-block',
            background: 'rgba(45,156,219,0.2)',
            color: '#7dd3fc',
            border: '1px solid rgba(45,156,219,0.3)',
            padding: '6px 18px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', marginBottom: '20px',
          }}>
            ✦ Plateforme médicale de confiance
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '32px' : '52px',
            fontWeight: 700, color: '#fff',
            lineHeight: 1.15, marginBottom: '16px',
          }}>
            Votre santé,<br />
            notre <span style={{ color: '#7dd3fc' }}>priorité</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '14px' : '17px',
            color: '#94a3b8', marginBottom: '32px',
            lineHeight: 1.7, padding: isMobile ? '0 10px' : '0',
          }}>
            Prenez rendez-vous avec les meilleurs spécialistes<br />
            en quelques clics, 24h/24 7j/7
          </p>

          <div style={{
            display: 'flex', gap: '12px',
            justifyContent: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            padding: isMobile ? '0 20px' : '0',
          }}>
            <Link to="/doctors">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--blue)', color: '#fff',
                  border: 'none', padding: '15px 36px',
                  borderRadius: '30px', fontSize: '15px',
                  fontWeight: 700, width: isMobile ? '100%' : 'auto',
                }}
              >
                Prendre un RDV
              </motion.button>
            </Link>
            <Link to="/doctors">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent', color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  padding: '15px 36px', borderRadius: '30px',
                  fontSize: '15px', fontWeight: 600,
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                Voir les médecins
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* STATS */}
      <div style={{
        background: '#fff',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            style={{
              padding: isMobile ? '20px 12px' : '28px',
              textAlign: 'center',
              borderRight: (isMobile ? i % 2 !== 1 : i < 3) ? '1px solid #e2e8f0' : 'none',
              borderBottom: isMobile && i < 2 ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <div style={{ fontSize: isMobile ? '22px' : '30px', fontWeight: 700, color: 'var(--blue)' }}>
              {s.num}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* SPÉCIALITÉS */}
      <div style={{ padding: isMobile ? '36px 16px 0' : '56px 40px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 700, color: '#0f172a', marginBottom: '6px',
          }}>
            Nos Spécialités
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
            Trouvez le spécialiste qu'il vous faut
          </p>
        </motion.div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
          gap: '12px',
        }}>
          {specialties.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => window.location.href = '/doctors'}
              style={{
                background: '#fff', borderRadius: '16px',
                padding: isMobile ? '16px 8px' : '24px 12px',
                textAlign: 'center',
                border: '1px solid #f1f5f9', cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: '8px' }}>
                {s.icon}
              </div>
              <div style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: 600, color: '#0f172a' }}>
                {s.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FONCTIONNALITÉS */}
      <div style={{ padding: isMobile ? '36px 16px 0' : '56px 40px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 700, color: '#0f172a', marginBottom: '6px',
          }}>
            Pourquoi MaClinica ?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
            Tout ce dont vous avez besoin en un seul endroit
          </p>
        </motion.div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#fff', borderRadius: '20px',
                padding: '24px', border: '1px solid #f1f5f9',
              }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: f.color,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', marginBottom: '14px',
                }}
              >
                {f.icon}
              </motion.div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: isMobile ? '36px 16px 48px' : '56px 40px 60px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, #185fa5, #2D9CDB)',
            borderRadius: '24px',
            padding: isMobile ? '40px 24px' : '60px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 700, color: '#fff', marginBottom: '12px',
          }}>
            Prêt à prendre soin de vous ?
          </h2>
          <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
            Rejoignez plus de 1 284 patients qui nous font confiance
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: '#fff', color: 'var(--blue)',
                border: 'none', padding: isMobile ? '14px 32px' : '16px 44px',
                borderRadius: '30px', fontSize: isMobile ? '14px' : '16px',
                fontWeight: 700,
              }}
            >
              Créer mon compte gratuitement
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;