# Full-Stack TypeScript Starter

[![CI](https://github.com/bajrang0789/fullstack-typescript-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/bajrang0789/fullstack-typescript-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.19-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A production-ready full-stack application built with TypeScript, featuring robust authentication, RESTful API, PostgreSQL database, React frontend, and comprehensive monitoring.

## 🚀 Features

- **Authentication System**: JWT-based auth with refresh token rotation and bcrypt password hashing
- **RESTful API**: Express.js with request validation, pagination, and versioning
- **Database**: PostgreSQL with Prisma ORM, migrations, and repository pattern
- **Frontend**: React 18 with TypeScript, Tailwind CSS, and React Query
- **Caching**: Redis integration for improved performance
- **Monitoring**: Winston structured logging and Prometheus metrics
- **Testing**: Jest with 85% code coverage
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Containerization**: Docker multi-stage builds and Kubernetes manifests
- **Security**: Rate limiting, input validation, SQL injection prevention

## 📋 Prerequisites

- Node.js 18.19 or higher
- PostgreSQL 14+
- Redis 7+ (optional, for caching)
- Docker & Docker Compose (for containerized setup)

## 🛠️ Installation

```bash
# Clone the repository
git clone git@github.com:bajrang0789/fullstack-typescript-starter.git
cd fullstack-typescript-starter

# Install dependencies
npm ci

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

## 🏃 Running the Application

### Development Mode

```bash
# Start the backend API
npm run dev

# Start the frontend (in another terminal)
cd frontend
npm run dev
```

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Using Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Architecture Guide](docs/ARCHITECTURE.md) - System design and patterns
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute
- [Changelog](CHANGELOG.md) - Version history and changes

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Project Structure

```
.
├── src/
│   ├── auth/              # Authentication logic
│   ├── db/                # Database client and repositories
│   ├── routes/            # API endpoints
│   ├── middleware/        # Express middleware
│   ├── monitoring/        # Logging and metrics
│   └── index.ts           # Application entry point
├── frontend/              # React frontend application
├── prisma/                # Database schema and migrations
├── tests/                 # Test files
├── k8s/                   # Kubernetes manifests
├── docs/                  # Documentation
└── .github/               # GitHub Actions workflows
```

## 🔐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Server
PORT=3000
NODE_ENV=production
```

See `.env.example` for a complete list.

## 🚢 Deployment

### Docker Deployment

```bash
# Build the image
docker build -t professional-project:latest .

# Run the container
docker run -p 3000:3000 --env-file .env professional-project:latest
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl logs -f deployment/professional-project
```

For detailed deployment instructions, see [Deployment Guide](docs/DEPLOYMENT.md).

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Thanks to all contributors who helped improve this project

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This is a production-ready starter template for building full-stack TypeScript applications with best practices and clean architecture.
