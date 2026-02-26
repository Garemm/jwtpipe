const express = require('express');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// GET / - confirms the API is reachable
app.get('/', (req, res) => {
  res.send('Auth API running successfully.');
});

// GET /health - returns a simple status check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount auth routes — all endpoints will be prefixed with /auth
// e.g. POST /auth/register, POST /auth/login
app.use('/auth', authRoutes);

// Mount profile routes — protected by JWT middleware inside the router
// e.g. GET /profile
app.use('/profile', profileRoutes);

module.exports = app;
