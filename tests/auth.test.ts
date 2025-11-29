// Authentication tests
import { hashPassword, comparePassword } from '../src/auth/password';
import { generateToken, verifyToken, decodeToken } from '../src/auth/jwt';

// Set up test environment
process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password correctly', async () => {
      const password = 'securePassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should throw error for short passwords', async () => {
      await expect(hashPassword('short')).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });

    it('should throw error for empty passwords', async () => {
      await expect(hashPassword('')).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });

    it('should generate different hashes for same password', async () => {
      const password = 'securePassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'securePassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);
      
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'securePassword123';
      const wrongPassword = 'wrongPassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);
      
      expect(isMatch).toBe(false);
    });

    it('should return false for empty password', async () => {
      const hash = await hashPassword('validPassword123');
      const isMatch = await comparePassword('', hash);
      
      expect(isMatch).toBe(false);
    });
  });
});

describe('JWT Utilities', () => {
  const testPayload = { id: 'user-123', email: 'test@example.com' };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = generateToken({ id: 'user-1', email: 'user1@test.com' });
      const token2 = generateToken({ id: 'user-2', email: 'user2@test.com' });
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);
      
      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow('Invalid token');
    });

    it('should throw error for tampered token', () => {
      const token = generateToken(testPayload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      
      expect(() => verifyToken(tamperedToken)).toThrow('Invalid token');
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const token = generateToken(testPayload);
      const decoded = decodeToken(token);
      
      expect(decoded?.id).toBe(testPayload.id);
      expect(decoded?.email).toBe(testPayload.email);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeToken('invalid-token');
      
      expect(decoded).toBeNull();
    });
  });
});
