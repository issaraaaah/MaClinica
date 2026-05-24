import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TopBar from '../components/TopBar';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../services/api';

const emptyForm = {
  name: '', email: '', password: '',
  specialty: '', experience: '', availability: '',
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchDoctors = async () => {
    try {
      const { data } = await getDoctors();
      setDoctors(data);
    } catch (err) {
      toast.error('Erreur chargement médecins');
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const openAdd = () => {
    setEditDoctor(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (doc) => {
    setEditDoctor(doc);
    setForm({
      name: doc.name,
      email: '',
      password: '',
      specialty: doc.specialty,
      experience: doc.experience,
      availability: doc.availability?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        experience: Number(form.experience),
        availability: form.availability.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editDoctor) {
        await updateDoctor(editDoctor._id, payload);
        toast.success('Médecin mis à jour ✅');
      } else {
        await createDoctor(payload);
        toast.success('Médecin ajouté ✅');
      }
      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce médecin ?')) return;
    try {
      await deleteDoctor(id);
      toast.success('Médecin supprimé');
      fetchDoctors();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    borderRadius: '10px', border: '1.5px solid #e2e8f0',
    fontSize: '14px', background: '#f8fafc',
    outline: 'none', fontFamily: 'inherit',
    marginBottom: '14px', transition: 'border 0.2s',
  };

  return (
    <div>
      <TopBar title="👨‍⚕️ Médecins" subtitle={`${doctors.length} médecins enregistrés`} />

      {/* Barre actions */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un médecin..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '12px 16px',
            borderRadius: '12px', border: '1.5px solid #e2e8f0',
            fontSize: '14px', background: '#fff',
            outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          style={{
            background: 'var(--blue)', color: '#fff',
            border: 'none', padding: '12px 24px',
            borderRadius: '12px', fontSize: '14px',
            fontWeight: 700, whiteSpace: 'nowrap',
          }}
        >
          + Ajouter médecin
        </motion.button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#fff', borderRadius: '20px',
          border: '1px solid #f1f5f9', overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              {['Médecin', 'Spécialité', 'Expérience', 'Disponibilités', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '14px 18px', textAlign: 'left',
                  fontSize: '12px', fontWeight: 600,
                  color: '#94a3b8', textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((doc, i) => (
                <motion.tr
                  key={doc._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'var(--blue-light)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                      }}>
                        👨‍⚕️
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      background: 'var(--blue-light)', color: 'var(--blue)',
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: 600,
                    }}>
                      {doc.specialty}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '14px', color: '#374151' }}>
                    {doc.experience} ans
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '13px', color: '#64748b' }}>
                    {doc.availability?.slice(0, 2).join(', ')}
                    {doc.availability?.length > 2 && ' ...'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openEdit(doc)}
                        style={{
                          background: '#e8f5fd', color: 'var(--blue)',
                          border: 'none', padding: '6px 14px',
                          borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        }}
                      >
                        ✏️ Modifier
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleDelete(doc._id)}
                        style={{
                          background: '#fce4ec', color: '#880e4f',
                          border: 'none', padding: '6px 14px',
                          borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        }}
                      >
                        🗑️ Supprimer
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15,23,42,0.6)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 200,
              padding: '20px',
            }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: '#fff', borderRadius: '24px',
                padding: '36px', width: '100%', maxWidth: '480px',
                maxHeight: '90vh', overflowY: 'auto',
              }}
            >
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px', fontWeight: 700,
                color: '#0f172a', marginBottom: '24px',
              }}>
                {editDoctor ? '✏️ Modifier médecin' : '➕ Ajouter médecin'}
              </h2>

              <form onSubmit={handleSubmit}>
                {[
                  { name: 'name',       label: 'Nom complet',  type: 'text',   ph: 'Dr. Meziane Kamel' },
                  { name: 'email',      label: 'Email',        type: 'email',  ph: 'dr.meziane@maclinica.com', skip: !!editDoctor },
                  { name: 'password',   label: 'Mot de passe', type: 'password', ph: '••••••••', skip: !!editDoctor },
                  { name: 'specialty',  label: 'Spécialité',   type: 'text',   ph: 'Cardiologie' },
                  { name: 'experience', label: 'Expérience (années)', type: 'number', ph: '10' },
                  { name: 'availability', label: 'Disponibilités (séparées par virgule)', type: 'text', ph: 'Lundi 09:00, Mercredi 14:00' },
                ].filter(f => !f.skip).map((field) => (
                  <div key={field.name}>
                    <label style={{
                      fontSize: '13px', fontWeight: 600,
                      color: '#374151', display: 'block', marginBottom: '6px',
                    }}>
                      {field.label}
                    </label>
                    <input
                      style={inputStyle}
                      type={field.type}
                      placeholder={field.ph}
                      value={form[field.name]}
                      onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                      required={!editDoctor || (field.name !== 'email' && field.name !== 'password')}
                      onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1, padding: '12px',
                      background: '#f1f5f9', color: '#64748b',
                      border: 'none', borderRadius: '12px',
                      fontSize: '14px', fontWeight: 600,
                    }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1, padding: '12px',
                      background: loading ? '#94a3b8' : 'var(--blue)',
                      color: '#fff', border: 'none',
                      borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                    }}
                  >
                    {loading ? 'Sauvegarde...' : editDoctor ? 'Mettre à jour' : 'Ajouter'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;