import { motion } from 'framer-motion';

const TopBar = ({ title, subtitle }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric',
    month: 'long', year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '32px',
      }}
    >
      <div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '26px', fontWeight: 700,
          color: '#0f172a', marginBottom: '4px',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>{subtitle}</p>
        )}
      </div>
      <div style={{
        background: '#fff', padding: '10px 18px',
        borderRadius: '12px', border: '1px solid #e2e8f0',
        fontSize: '13px', color: '#64748b', fontWeight: 500,
      }}>
        📅 {dateStr}
      </div>
    </motion.div>
  );
};

export default TopBar;