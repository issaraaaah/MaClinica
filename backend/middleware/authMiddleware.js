const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Vérifie si le token JWT est valide
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, token manquant' });
  }
};

// Vérifie le rôle (admin uniquement)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès réservé aux admins' });
  }
};

// Vérifie le rôle (doctor ou admin)
const doctorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'doctor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Accès réservé aux médecins' });
  }
};

module.exports = { protect, adminOnly, doctorOrAdmin };