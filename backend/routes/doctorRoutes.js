const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');
const { protect, adminOnly, doctorOrAdmin } = require('../middleware/authMiddleware');

router.get('/',     getDoctors);
router.get('/me',   protect, doctorOrAdmin, async (req, res) => {  // ← nouveau
  try {
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Profil non trouvé' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/me',   protect, doctorOrAdmin, async (req, res) => {  // ← nouveau
  try {
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: 'Profil non trouvé' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id',  getDoctorById);
router.post('/',    protect, adminOnly, createDoctor);
router.put('/:id',  protect, adminOnly, updateDoctor);
router.delete('/:id', protect, adminOnly, deleteDoctor);

module.exports = router;