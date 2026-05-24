import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { loginAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginAdmin: setAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAdmin(form);
      if (data.role !== 'admin') {
        toast.error('Accès réservé aux administrateurs');
        return;
      }
      setAdmin(data);
      toast.success('Bienvenue Admin ! 👋');
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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
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
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ fontSize: '52px', marginBottom: '14px' }}
          >
            🏥
          </motion.div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px', fontWeight: 700,
            color: '#0f172a', marginBottom: '6px',
          }}>
            Admin MaClinica
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Connectez-vous au panneau d'administration
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'email', label: 'Email', type: 'email', placeholder: 'admin@maclinica.com' },
            { name: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
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
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                required
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
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
              background: loading ? '#94a3b8' : '#0f172a',
              color: '#fff', border: 'none',
              borderRadius: '12px', fontSize: '15px',
              fontWeight: 700, marginTop: '8px',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Connexion...' : 'Accéder au Dashboard'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;