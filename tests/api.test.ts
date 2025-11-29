// API Integration tests
import request from 'supertest';
import app from '../src/server';

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
