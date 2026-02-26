const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /profile — protected route, requires a valid JWT
// verifyToken runs first; if it passes, req.user is available
router.get('/', verifyToken, (req, res) => {
  // req.user was attached by verifyToken and contains { userId, email }
  res.status(200).json({ email: req.user.email });
});

module.exports = router;
