// Load environment variables from .env file.
// Must be called before anything that reads process.env.
require('dotenv').config();

const app = require('./app');

// Warn early if a critical variable is missing so the mistake is obvious.
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Using an insecure default is not safe in production.');
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
