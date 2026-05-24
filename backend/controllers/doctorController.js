const Doctor = require('../models/Doctor');
const User = require('../models/User');

// GET /api/doctors — Liste tous les médecins approuvés
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/doctors/:id — Détail d'un médecin
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/doctors — Ajouter un médecin (admin)
const createDoctor = async (req, res) => {
  const { name, email, password, specialty, experience, availability } = req.body;
  try {
    // 1. Créer le User avec le rôle doctor
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'doctor'
    });

    // 2. Créer le profil Doctor lié au User
    const doctor = await Doctor.create({
      userId: user._id,
      name,
      specialty,
      experience: experience || 0,
      availability: availability || [],
      isApproved: true
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/doctors/:id — Modifier un médecin (admin)
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/doctors/:id — Supprimer un médecin (admin)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }
    // Supprimer aussi le User associé
    await User.findByIdAndDelete(doctor.userId);
    res.json({ message: 'Médecin supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};