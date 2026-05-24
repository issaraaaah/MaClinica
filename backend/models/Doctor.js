const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, default: 0 },
  availability: [{ type: String }], // ex: ["Lundi 09:00", "Mardi 14:00"]
  rating: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);