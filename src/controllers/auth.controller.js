const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ─── In-Memory Store ──────────────────────────────────────────────────────────
// In a real app, replace this with a database (e.g. MongoDB, PostgreSQL).
const users = [];

// How many times bcrypt runs its hashing algorithm — higher = more secure but slower.
// 10 is a safe default for most applications.
const SALT_ROUNDS = 10;

// Secret key used to sign JWTs.
// Reads from the JWT_SECRET environment variable.
// Set this in your .env file locally or in your hosting platform's config.
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Token expiry time — tokens become invalid after this duration.
const JWT_EXPIRES_IN = '1h';

// ─── Register ─────────────────────────────────────────────────────────────────
/**
 * POST /register
 * Validates input, hashes the password, and stores the new user.
 */
const register = async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  // 2. Check if the email is already taken
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered.' });
  }

  // 3. Hash the password — never store plain-text passwords
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 4. Build and store the new user
  const newUser = {
    id: users.length + 1,   // simple auto-increment id
    email,
    passwordHash,
  };
  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully.', userId: newUser.id });
};

// ─── Login ────────────────────────────────────────────────────────────────────
/**
 * POST /login
 * Validates credentials, compares password hash, and returns a JWT.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // 2. Look up the user by email
  const user = users.find((u) => u.email === email);
  if (!user) {
    // Use a generic message — don't reveal whether the email exists
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // 3. Compare the provided password against the stored hash
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // 4. Sign a JWT containing the user's id and email
  const token = jwt.sign(
    { userId: user.id, email: user.email }, // payload (public data — no sensitive info)
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.status(200).json({ message: 'Login successful.', token });
};

module.exports = { register, login, users };
