const request = require('supertest');
const app = require('../src/app');
const { users } = require('../src/controllers/auth.controller');

// Reuse these values across related tests
const TEST_EMAIL = 'test3@example.com';
const TEST_PASSWORD = 'password123';

// Clear the in-memory users array before every test so each test
// starts with a clean slate and tests don't affect one another.
beforeEach(() => {
  users.splice(0, users.length);
});

// Helper: register + login and return the JWT token
const getToken = async () => {
  await request(app)
    .post('/auth/register')
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

  const res = await request(app)
    .post('/auth/login')
    .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

  return res.body.token;
};

// ─── Register ────────────────────────────────────────────────────────────────
describe('POST /auth/register', () => {
  it('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
    expect(res.body.message).toBe('User registered successfully.');
  });

  it('fails when email is missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ password: TEST_PASSWORD }); // no email

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email and password are required.');
  });

  it('fails when the same email is registered twice', async () => {
    // First registration — should succeed
    await request(app)
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    // Second registration with the same email — should fail
    const res = await request(app)
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Email is already registered.');
  });
});

// ─── Login ───────────────────────────────────────────────────────────────────
describe('POST /auth/login', () => {
  it('logs in and returns a JWT token', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toBe('Login successful.');
  });

  it('fails with wrong password', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: TEST_EMAIL, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password.');
  });
});

// ─── Profile ─────────────────────────────────────────────────────────────────
describe('GET /profile', () => {
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/profile');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Access denied. No token provided.');
  });

  it('returns the user email with a valid token', async () => {
    const token = await getToken();

    const res = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(TEST_EMAIL);
  });
});
