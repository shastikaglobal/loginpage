const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', // Default Vite port
  'http://localhost:5174', // Secondary Vite port
  'https://loginpage-xtsc.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    },
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
  });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
let startupError = null;

try {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing');
  }
} catch (err) {
  console.error('Startup Error:', err.message);
  startupError = {
    message: err.message,
    stack: err.stack,
    envKeys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('URI'))
  };
}

app.get('/api/auth/debug', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Debug endpoint reached',
    startupError,
    nodeEnv: process.env.NODE_ENV
  });
});

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('MongoDB connection failure:', err.message);
    if (require.main === module) {
      process.exit(1);
    }
  });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
