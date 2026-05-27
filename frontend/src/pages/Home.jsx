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

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #185fa5 100%)',
        padding: isMobile ? '50px 20px 40px' : '90px 40px 80px',
        textAlign: 'center',
        width: '100%',
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
            padding: '6px 16px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', marginBottom: '20px',
          }}>
            ✦ Plateforme médicale de confiance
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '34px' : '52px',
            fontWeight: 700, color: '#fff',
            lineHeight: 1.2, marginBottom: '16px',
          }}>
            Votre santé,<br />
            notre <span style={{ color: '#7dd3fc' }}>priorité</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '14px' : '17px',
            color: '#94a3b8', marginBottom: '32px',
            lineHeight: 1.7,
          }}>
            Prenez rendez-vous avec les meilleurs spécialistes
            en quelques clics, 24h/24 7j/7
          </p>

          <div style={{
            display: 'flex', gap: '12px',
            justifyContent: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            padding: isMobile ? '0 16px' : '0',
          }}>
            <Link to="/doctors" style={{ width: isMobile ? '100%' : 'auto' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--blue)', color: '#fff',
                  border: 'none', padding: '14px 32px',
                  borderRadius: '30px', fontSize: '15px',
                  fontWeight: 700, width: '100%',
                }}
              >
                Prendre un RDV
              </motion.button>
            </Link>
            <Link to="/doctors" style={{ width: isMobile ? '100%' : 'auto' }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent', color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  padding: '14px 32px', borderRadius: '30px',
                  fontSize: '15px', fontWeight: 600, width: '100%',
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
        gridTemplateColumns: 'repeat(2, 1fr)',
        borderBottom: '1px solid #e2e8f0',
        width: '100%',
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: '20px 12px',
              textAlign: 'center',
              borderRight: i % 2 === 0 ? '1px solid #e2e8f0' : 'none',
              borderBottom: i < 2 ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--blue)' }}>
              {s.num}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* SPÉCIALITÉS */}
      <div style={{ padding: isMobile ? '32px 16px 0' : '56px 40px 0', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '20px' }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 700, color: '#0f172a', marginBottom: '6px',
          }}>
            Nos Spécialités
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>
            Trouvez le spécialiste qu'il vous faut
          </p>
        </motion.div>

        {/* 2 lignes de 3 sur mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          width: '100%',
        }}>
          {specialties.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => window.location.href = '/doctors'}
              style={{
                background: '#fff', borderRadius: '14px',
                padding: '16px 8px',
                textAlign: 'center',
                border: '1px solid #f1f5f9', cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>
                {s.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FONCTIONNALITÉS */}
      <div style={{ padding: isMobile ? '32px 16px 0' : '56px 40px 0', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '20px' }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 700, color: '#0f172a', marginBottom: '6px',
          }}>
            Pourquoi MaClinica ?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>
            Tout ce dont vous avez besoin en un seul endroit
          </p>
        </motion.div>

        {/* 1 colonne sur mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '12px',
          width: '100%',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: '#fff', borderRadius: '16px',
                padding: '20px', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'flex-start', gap: '14px',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: f.color, flexShrink: 0,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '20px',
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: isMobile ? '32px 16px 48px' : '56px 40px 60px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, #185fa5, #2D9CDB)',
            borderRadius: '20px',
            padding: isMobile ? '36px 20px' : '60px 40px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? '22px' : '32px',
            fontWeight: 700, color: '#fff', marginBottom: '10px',
          }}>
            Prêt à prendre soin de vous ?
          </h2>
          <p style={{
            fontSize: isMobile ? '13px' : '15px',
            color: 'rgba(255,255,255,0.8)', marginBottom: '24px',
          }}>
            Rejoignez plus de 1 284 patients qui nous font confiance
          </p>
          <Link to="/register">
            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{
                background: '#fff', color: 'var(--blue)',
                border: 'none',
                padding: isMobile ? '13px 28px' : '16px 44px',
                borderRadius: '30px',
                fontSize: isMobile ? '14px' : '16px',
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