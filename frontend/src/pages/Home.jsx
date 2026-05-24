import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const stats = [
  { num: '1 284+', label: 'Patients satisfaits' },
  { num: '47',     label: 'Médecins experts' },
  { num: '12',     label: 'Spécialités' },
  { num: '4.9 ★',  label: 'Note moyenne' },
];

const features = [
  {
    icon: '📅',
    title: 'Réservation facile',
    desc: 'Choisissez votre médecin, votre créneau et confirmez en 3 clics.',
    color: '#E8F5FD',
  },
  {
    icon: '🔔',
    title: 'Rappels automatiques',
    desc: 'Recevez des notifications avant chaque rendez-vous. Ne ratez plus rien.',
    color: '#e8f5e9',
  },
  {
    icon: '🔒',
    title: '100% sécurisé',
    desc: 'Vos données médicales sont chiffrées. Confidentialité garantie.',
    color: '#f3e5f5',
  },
  {
    icon: '⚡',
    title: 'Disponible 24h/24',
    desc: 'Prenez rendez-vous à toute heure, même le week-end.',
    color: '#fff3e0',
  },
  {
    icon: '👨‍⚕️',
    title: 'Médecins vérifiés',
    desc: 'Tous nos praticiens sont diplômés et vérifiés par notre équipe.',
    color: '#fce4ec',
  },
  {
    icon: '📋',
    title: 'Suivi médical',
    desc: 'Accédez à tout votre historique de rendez-vous en un endroit.',
    color: '#e8f5e9',
  },
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
  return (
    <div>
      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #185fa5 100%)',
        padding: '90px 40px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cercles décoratifs */}
        {[
          { top: '-80px', right: '-80px', size: '300px', opacity: 0.12 },
          { bottom: '-60px', left: '-60px', size: '220px', opacity: 0.08 },
          { top: '40px', left: '10%', size: '120px', opacity: 0.06 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', ...c,
            width: c.size, height: c.size,
            borderRadius: '50%',
            background: 'rgba(45,156,219,' + c.opacity + ')',
          }} />
        ))}

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
            padding: '6px 18px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            marginBottom: '24px',
          }}>
            ✦ Plateforme médicale de confiance
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '52px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            Votre santé,<br />
            notre <span style={{ color: '#7dd3fc' }}>priorité</span>
          </h1>

          <p style={{
            fontSize: '17px',
            color: '#94a3b8',
            marginBottom: '36px',
            lineHeight: 1.7,
          }}>
            Prenez rendez-vous avec les meilleurs spécialistes<br />
            en quelques clics, 24h/24 7j/7
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/doctors">
              <motion.button
                whileHover={{ scale: 1.05, background: '#1a7ab5' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'var(--blue)', color: '#fff',
                  border: 'none', padding: '15px 36px',
                  borderRadius: '30px', fontSize: '15px', fontWeight: 700,
                  transition: 'background 0.2s',
                }}
              >
                Prendre un RDV
              </motion.button>
            </Link>
            <Link to="/doctors">
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent', color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  padding: '15px 36px', borderRadius: '30px',
                  fontSize: '15px', fontWeight: 600,
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
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            style={{
              padding: '28px',
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--blue)' }}>
              {s.num}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* SPÉCIALITÉS */}
      <div style={{ padding: '56px 40px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px', fontWeight: 700,
            color: '#0f172a', marginBottom: '8px',
          }}>
            Nos Spécialités
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
            Trouvez le spécialiste qu'il vous faut
          </p>
        </motion.div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '14px',
        }}>
          {specialties.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6, boxShadow: '0 12px 28px rgba(45,156,219,0.15)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => window.location.href = '/doctors'}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px 12px',
                textAlign: 'center',
                border: '1px solid #f1f5f9',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                {s.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FONCTIONNALITÉS */}
      <div style={{ padding: '56px 40px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px', fontWeight: 700,
            color: '#0f172a', marginBottom: '8px',
          }}>
            Pourquoi MaClinica ?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
            Tout ce dont vous avez besoin en un seul endroit
          </p>
        </motion.div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, borderColor: 'var(--blue)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s',
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                style={{
                  width: '54px', height: '54px',
                  borderRadius: '16px',
                  background: f.color,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px', marginBottom: '16px',
                }}
              >
                {f.icon}
              </motion.div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '56px 40px 60px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, #185fa5, #2D9CDB)',
            borderRadius: '24px',
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '32px', fontWeight: 700,
            color: '#fff', marginBottom: '12px',
          }}>
            Prêt à prendre soin de vous ?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '28px' }}>
            Rejoignez plus de 1 284 patients qui nous font confiance
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, background: '#fff', color: 'var(--blue)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: '#fff', color: 'var(--blue)',
                border: 'none', padding: '16px 44px',
                borderRadius: '30px', fontSize: '16px',
                fontWeight: 700, transition: 'all 0.2s',
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