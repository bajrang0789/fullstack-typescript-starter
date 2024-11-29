# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### Reporting Process

1. **DO NOT** open a public issue
2. Email security details to: bajrang.panigrahi89@gmail.com
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Assessment**: We'll assess the vulnerability within 5 business days
- **Updates**: We'll keep you informed about the fix progress
- **Resolution**: We aim to resolve critical issues within 30 days
- **Credit**: You'll be credited in the security advisory (if desired)

## Security Best Practices

When using this project:

- Always use the latest stable version
- Keep dependencies up to date
- Use environment variables for sensitive data
- Enable rate limiting in production
- Use HTTPS for all API endpoints
- Implement proper authentication and authorization
- Regular security audits recommended

## Security Features

This project includes:

- JWT authentication with token rotation
- Bcrypt password hashing
- Rate limiting to prevent brute force
- SQL injection prevention with parameterized queries
- XSS protection with proper input sanitization
- CORS configuration
- Request validation with Zod schemas

## Known Security Considerations

- Ensure `JWT_SECRET` is a strong, random string in production
- Configure proper CORS origins
- Set appropriate rate limits for your use case
- Regularly update dependencies for security patches

## Contact

For security concerns: bajrang.panigrahi89@gmail.com
