require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { setupSecurity } = require('./middleware/security');
const OptimizedQueries = require('./services/optimizedQueries');
const ExternalAPIController = require('./controllers/externalAPIController');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize services
const optimizedQueries = new OptimizedQueries(pool);
const externalAPIController = new ExternalAPIController();

// Middleware setup
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for audio content
app.use(express.urlencoded({ extended: true }));

// Setup security middleware
setupSecurity(app);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`📨 ${req.method} ${req.path} - ${req.ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📤 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        server: 'running'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await optimizedQueries.getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 per page

    const leaderboard = await optimizedQueries.getLeaderboard(page, limit);
    res.json({
      leaderboard,
      page,
      limit,
      hasMore: leaderboard.length === limit
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user/streak', authenticateToken, async (req, res) => {
  try {
    const streak = await optimizedQueries.getUserStreak(req.user.id);
    res.json({ currentStreak: streak });
  } catch (error) {
    console.error('Get user streak error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/lessons/search', async (req, res) => {
  try {
    const { q: searchTerm, page = 1, limit = 20 } = req.query;

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({ error: 'Search term must be at least 2 characters' });
    }

    const results = await optimizedQueries.searchLessons(searchTerm, parseInt(page), parseInt(limit));
    res.json({
      results,
      page: parseInt(page),
      limit: parseInt(limit),
      searchTerm
    });
  } catch (error) {
    console.error('Search lessons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user/achievements', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const achievements = await optimizedQueries.getUserAchievements(req.user.id, page, limit);
    res.json({
      achievements,
      page,
      limit,
      hasMore: achievements.length === limit
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// External API routes
app.post('/api/external/tts', externalAPIController.textToSpeech.bind(externalAPIController));
app.post('/api/external/translate', externalAPIController.translate.bind(externalAPIController));
app.post('/api/external/moderate', externalAPIController.moderateContent.bind(externalAPIController));
app.post('/api/external/push', authenticateToken, externalAPIController.sendPushNotification.bind(externalAPIController));
app.post('/api/external/push/batch', authenticateToken, externalAPIController.sendBatchPushNotifications.bind(externalAPIController));
app.get('/api/external/health', externalAPIController.healthCheck.bind(externalAPIController));
app.post('/api/external/audio-lesson', externalAPIController.createAudioLesson.bind(externalAPIController));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║       🚀 CUENTA CONMIGO API INICIADO 🚀       ║
╚═══════════════════════════════════════════════╝
    `);
    console.log(`📍 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security: ${process.env.JWT_SECRET ? 'Configured' : 'NOT CONFIGURED'}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Configured' : 'NOT CONFIGURED'}`);
    console.log(`🔊 TTS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.VOICERSS_API_KEY ? 'Available' : 'Not configured'}`);
    console.log(`\n📊 Cache Stats:`, optimizedQueries.getCacheStats());
  });
}

module.exports = app;
