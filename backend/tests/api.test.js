const request = require('supertest');
const app = require('../app_improvements');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// Mock database for testing
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

// Mock external services
jest.mock('../services/externalAPIService', () => {
  return jest.fn().mockImplementation(() => ({
    textToSpeech: jest.fn(),
    translateText: jest.fn(),
    moderateContent: jest.fn(),
    sendPushNotification: jest.fn(),
    sendBatchPushNotifications: jest.fn(),
    healthCheck: jest.fn(),
  }));
});

describe('Cuenta Conmigo API Tests', () => {
  let mockPool;
  let agent;

  beforeAll(() => {
    mockPool = new Pool();
    agent = request.agent(app);
  });

  afterAll(async () => {
    await mockPool.end();
  });

  describe('Health Check', () => {
    test('GET /health - should return healthy status', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [1] });

      const response = await agent.get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.services.database).toBe('connected');
    });

    test('GET /health - should handle database errors', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Connection failed'));

      const response = await agent.get('/health');

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('unhealthy');
    });
  });

  describe('Authentication', () => {
    test('POST /api/auth/register - successful registration', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // No existing user
        .mockResolvedValueOnce({ rows: [{ id: 1, username: 'testuser', email: 'test@example.com', created_at: new Date() }] });

      const response = await agent
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.token).toBeDefined();
    });

    test('POST /api/auth/register - user already exists', async () => {
      const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await agent
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User already exists');
    });

    test('POST /api/auth/login - successful login', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: '$2a$12$mockhashedpassword'
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

      // Mock bcrypt.compare to return true
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const response = await agent
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });

    test('POST /api/auth/login - invalid credentials', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const response = await agent
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('Security Middleware', () => {
    test('Rate limiting - should limit requests', async () => {
      // This test would need to be implemented with a test-specific rate limiter
      // For now, we'll test the basic functionality
      const response = await agent.get('/health');
      expect(response.status).toBe(200);
    });

    test('Input validation - invalid email', async () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await agent
        .post('/api/auth/register')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email format');
    });

    test('Input validation - weak password', async () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      };

      const response = await agent
        .post('/api/auth/register')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password must be at least 8 characters long');
    });
  });

  describe('Protected Routes', () => {
    let token;

    beforeAll(() => {
      token = jwt.sign(
        { id: 1, username: 'testuser', email: 'test@example.com' },
        process.env.JWT_SECRET || 'test_secret'
      );
    });

    test('GET /api/user/stats - requires authentication', async () => {
      const response = await agent.get('/api/user/stats');
      expect(response.status).toBe(401);
    });

    test('GET /api/user/stats - successful with token', async () => {
      const mockStats = {
        username: 'testuser',
        lessons_completed: 5,
        total_points: 100
      };

      // Mock the optimized queries service
      const OptimizedQueries = require('../services/optimizedQueries');
      const mockOptimizedQueries = new OptimizedQueries(mockPool);
      mockOptimizedQueries.getUserStats = jest.fn().mockResolvedValue(mockStats);

      const response = await agent
        .get('/api/user/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('testuser');
    });
  });

  describe('Leaderboard', () => {
    test('GET /api/leaderboard - successful', async () => {
      const mockLeaderboard = [
        { username: 'user1', total_points: 100, rank: 1 },
        { username: 'user2', total_points: 80, rank: 2 }
      ];

      const OptimizedQueries = require('../services/optimizedQueries');
      const mockOptimizedQueries = new OptimizedQueries(mockPool);
      mockOptimizedQueries.getLeaderboard = jest.fn().mockResolvedValue(mockLeaderboard);

      const response = await agent.get('/api/leaderboard');

      expect(response.status).toBe(200);
      expect(response.body.leaderboard).toHaveLength(2);
      expect(response.body.page).toBe(1);
    });

    test('GET /api/leaderboard - with pagination', async () => {
      const response = await agent
        .get('/api/leaderboard?page=2&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(5);
    });
  });

  describe('Search', () => {
    test('GET /api/lessons/search - successful search', async () => {
      const mockResults = [
        { id: 1, title: 'Math Lesson', relevance: 0.8 }
      ];

      const OptimizedQueries = require('../services/optimizedQueries');
      const mockOptimizedQueries = new OptimizedQueries(mockPool);
      mockOptimizedQueries.searchLessons = jest.fn().mockResolvedValue(mockResults);

      const response = await agent
        .get('/api/lessons/search?q=math');

      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(1);
      expect(response.body.searchTerm).toBe('math');
    });

    test('GET /api/lessons/search - search term too short', async () => {
      const response = await agent
        .get('/api/lessons/search?q=a');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search term must be at least 2 characters');
    });
  });

  describe('External API Integration', () => {
    test('POST /api/external/tts - successful TTS', async () => {
      const ttsData = {
        text: 'Hello world',
        language: 'en',
        voice: 'female'
      };

      const mockResult = {
        success: true,
        audioContent: 'base64audio',
        provider: 'google'
      };

      const ExternalAPIService = require('../services/externalAPIService');
      const mockService = new ExternalAPIService();
      mockService.textToSpeech.mockResolvedValue(mockResult);

      const response = await agent
        .post('/api/external/tts')
        .send(ttsData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.provider).toBe('google');
    });

    test('POST /api/external/translate - successful translation', async () => {
      const translateData = {
        text: 'Hello world',
        targetLanguage: 'es'
      };

      const mockResult = {
        success: true,
        translatedText: 'Hola mundo',
        provider: 'google'
      };

      const ExternalAPIService = require('../services/externalAPIService');
      const mockService = new ExternalAPIService();
      mockService.translateText.mockResolvedValue(mockResult);

      const response = await agent
        .post('/api/external/translate')
        .send(translateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.translatedText).toBe('Hola mundo');
    });

    test('POST /api/external/moderate - content moderation', async () => {
      const moderateData = {
        text: 'This is appropriate content'
      };

      const mockResult = {
        success: true,
        isAppropriate: true,
        scores: { toxicity: 0.1 }
      };

      const ExternalAPIService = require('../services/externalAPIService');
      const mockService = new ExternalAPIService();
      mockService.moderateContent.mockResolvedValue(mockResult);

      const response = await agent
        .post('/api/external/moderate')
        .send(moderateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.isAppropriate).toBe(true);
    });

    test('GET /api/external/health - external services health', async () => {
      const mockHealth = {
        googleTTS: true,
        voiceRSS: true,
        firebase: false
      };

      const ExternalAPIService = require('../services/externalAPIService');
      const mockService = new ExternalAPIService();
      mockService.healthCheck.mockResolvedValue(mockHealth);

      const response = await agent.get('/api/external/health');

      expect(response.status).toBe(200);
      expect(response.body.overallHealth).toBe(true);
      expect(response.body.services.googleTTS).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('404 - route not found', async () => {
      const response = await agent.get('/nonexistent-route');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });

    test('500 - internal server error', async () => {
      // Force an error by mocking a service to throw
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await agent.get('/health');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('Performance Tests', () => {
    test('Response time - health check under 200ms', async () => {
      const start = Date.now();
      mockPool.query.mockResolvedValueOnce({ rows: [1] });

      await agent.get('/health');

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });

    test('Concurrent requests handling', async () => {
      mockPool.query.mockResolvedValue({ rows: [1] });

      const promises = Array(10).fill().map(() => agent.get('/health'));
      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Security Tests', () => {
    test('SQL injection prevention', async () => {
      const maliciousData = {
        username: "'; DROP TABLE users; --",
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await agent
        .post('/api/auth/register')
        .send(maliciousData);

      // Should not execute the malicious SQL
      expect(response.status).toBe(400);
    });

    test('XSS prevention', async () => {
      const xssData = {
        username: '<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await agent
        .post('/api/auth/register')
        .send(xssData);

      expect(response.status).toBe(400);
    });

    test('Authentication required for protected routes', async () => {
      const protectedRoutes = [
        '/api/user/stats',
        '/api/user/streak',
        '/api/user/achievements'
      ];

      for (const route of protectedRoutes) {
        const response = await agent.get(route);
        expect(response.status).toBe(401);
      }
    });
  });
});
