const express = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

// POST /auth/register — create a new user account
router.post('/register', register);

// POST /auth/login — authenticate and receive a JWT
router.post('/login', login);

module.exports = router;
