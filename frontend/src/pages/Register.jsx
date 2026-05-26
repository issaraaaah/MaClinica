import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await register({ ...form, role: 'patient' });
      loginUser(data);
      toast.success('Bienvenue sur MaClinica ! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    borderRadius: '12px', border: '1.5px solid #e2e8f0',
    fontSize: '15px', background: '#f8fafc',
    outline: 'none', fontFamily: 'inherit',
    transition: 'border 0.2s',
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f5fd 100%)',
      padding: '24px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '32px 24px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 8px 32px rgba(45,156,219,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            style={{ fontSize: '44px', marginBottom: '12px' }}
          >
            👋
          </motion.div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px', fontWeight: 700,
            color: '#0f172a', marginBottom: '6px',
          }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Rejoignez MaClinica gratuitement
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'name',     label: 'Nom complet',  type: 'text',     placeholder: 'Karima Ait Yahia' },
            { name: 'email',    label: 'Email',         type: 'email',    placeholder: 'votre@email.com'  },
            { name: 'password', label: 'Mot de passe',  type: 'password', placeholder: '••••••••'         },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '13px', fontWeight: 600,
                color: '#374151', display: 'block', marginBottom: '6px',
              }}>
                {field.label}
              </label>
              <input
                style={inputStyle}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          ))}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: loading ? '#94a3b8' : 'var(--blue)',
              color: '#fff', border: 'none',
              borderRadius: '12px', fontSize: '15px',
              fontWeight: 700, marginTop: '8px',
            }}
          >
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;