const Appointment = require('../models/Appointment');

// POST /api/appointments — Créer un rendez-vous (patient)
const createAppointment = async (req, res) => {
  const { doctorId, date, time, notes } = req.body;
  try {
    // Vérifier si le créneau est déjà pris
    const existing = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      return res.status(400).json({ message: 'Ce créneau est déjà réservé' });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      notes: notes || ''
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments — Tous les rendez-vous (admin)
const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments/mine — Mes rendez-vous (patient connecté)
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialty')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/appointments/:id — Modifier le statut
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Un patient ne peut qu'annuler ses propres rendez-vous
    if (req.user.role === 'patient') {
      if (appointment.patientId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
      appointment.status = 'cancelled';
    } else {
      // Admin ou doctor peut changer le statut librement
      appointment.status = req.body.status || appointment.status;
    }

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/appointments/:id — Supprimer (admin)
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json({ message: 'Rendez-vous supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/appointments/doctor — RDV du médecin connecté
const getDoctorAppointments = async (req, res) => {
  try {
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Profil médecin non trouvé' });
    }
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,  
  updateAppointment,
  deleteAppointment
};