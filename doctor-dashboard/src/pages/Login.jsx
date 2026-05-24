import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { loginDoctor } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginDoctor: setDoctor } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginDoctor(form);
      if (data.role !== 'doctor') {
        toast.error('Accès réservé aux médecins');
        return;
      }
      setDoctor(data);
      toast.success(`Bienvenue Dr. ${data.name} ! 👋`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects');
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
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #027a48 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: '#fff', borderRadius: '24px',
          padding: '48px 44px', width: '100%', maxWidth: '420px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            style={{ fontSize: '52px', marginBottom: '14px' }}
          >
            👨‍⚕️
          </motion.div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px', fontWeight: 700,
            color: '#0f172a', marginBottom: '6px',
          }}>
            Espace Médecin
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Connectez-vous à votre espace professionnel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'email',    label: 'Email',        type: 'email',    ph: 'dr.meziane@maclinica.com' },
            { name: 'password', label: 'Mot de passe', type: 'password', ph: '••••••••' },
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
                name={field.name}
                placeholder={field.ph}
                value={form[field.name]}
                onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                required
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
              background: loading ? '#94a3b8' : '#064e3b',
              color: '#fff', border: 'none',
              borderRadius: '12px', fontSize: '15px',
              fontWeight: 700, marginTop: '8px',
            }}
          >
            {loading ? 'Connexion...' : 'Accéder à mon espace'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;