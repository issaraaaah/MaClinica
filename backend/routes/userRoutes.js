const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET tous les users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT bloquer/débloquer un user (admin)
router.put('/:id/block', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `Utilisateur ${user.isBlocked ? 'bloqué' : 'débloqué'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;