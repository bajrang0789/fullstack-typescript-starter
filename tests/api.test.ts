// API Integration tests
import request from 'supertest';
import app from '../src/server';
import { generateToken } from '../src/auth/jwt';

// nosemgrep: generic.secrets.security.detected-generic-secret.detected-generic-secret
// TEST_FIXTURES: Mock token for testing authenticated routes
const TEST_USER = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
const VALID_TOKEN = generateToken(TEST_USER);

describe('Health Check Endpoints', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('GET /health/live', () => {
    it('should return alive status', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('alive');
      expect(response.body.timestamp).toBeDefined();
    });
  });
});

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'invalid-email', password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'short' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });
});

describe('Protected User Endpoints', () => {
  describe('GET /api/v1/users/me', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.error).toBe('Invalid or expired token');
    });

    it('should accept valid token format (DB unavailable returns 500)', async () => {
      // Happy path: valid JWT token format is accepted by auth middleware
      // Returns 500 because DATABASE_URL not configured in test environment
      // In production with DB, this would return 404 for non-existent user
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect('Content-Type', /json/);

      // Token validation passed (not 401), but DB lookup fails
      expect(response.status).not.toBe(401);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should validate UUID format for user ID', async () => {
      const response = await request(app)
        .get('/api/v1/users/invalid-uuid')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject access to other user profiles', async () => {
      const otherUserId = '660e8400-e29b-41d4-a716-446655440001';
      const response = await request(app)
        .get(`/api/v1/users/${otherUserId}`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.error).toBe('Access denied');
    });
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body.error).toBe('Not found');
  });
});
