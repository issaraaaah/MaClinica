const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, adminOnly, doctorOrAdmin } = require('../middleware/authMiddleware');

router.post('/',        protect, createAppointment);
router.get('/mine',     protect, getMyAppointments);
router.get('/doctor',   protect, doctorOrAdmin, getDoctorAppointments); // ← nouveau
router.get('/',         protect, adminOnly, getAllAppointments);
router.put('/:id',      protect, updateAppointment);
router.delete('/:id',   protect, adminOnly, deleteAppointment);

module.exports = router;