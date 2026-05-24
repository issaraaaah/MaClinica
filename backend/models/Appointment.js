const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: { type: String, required: true }, // ex: "2024-06-15"
  time: { type: String, required: true }, // ex: "10:00"
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);