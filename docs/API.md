# API Documentation

## Base URL

```
Production: https://api.example.com/v1
Staging: https://staging-api.example.com/v1
Development: http://localhost:3000/v1
```

## Authentication

All API requests require authentication using JWT tokens.

### Getting a Token

```bash
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### Using the Token

Include the access token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Endpoints

### Health Check

```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-29T12:00:00Z",
  "uptime": 123456,
  "database": "connected"
}
```

### Users

#### Get All Users

```bash
GET /v1/users?page=1&limit=10&sort=createdAt:desc
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sort` (optional): Sort field and order (e.g., `name:asc`)
- `search` (optional): Search term for filtering

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### Get User by ID

```bash
GET /v1/users/:id
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

#### Create User

```bash
POST /v1/users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "name": "Jane Smith",
  "role": "user"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "role": "user",
  "createdAt": "2024-11-29T12:00:00Z"
}
```

#### Update User

```bash
PATCH /v1/users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "role": "admin"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "role": "admin",
  "updatedAt": "2024-11-29T12:05:00Z"
}
```

#### Delete User

```bash
DELETE /v1/users/:id
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### Authentication

#### Register

```bash
POST /v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

#### Refresh Token

```bash
POST /v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```bash
POST /v1/auth/logout
Authorization: Bearer <token>
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

- **Authenticated requests**: 100 requests per minute
- **Unauthenticated requests**: 20 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638360000
```

## Pagination

All list endpoints support pagination:

```
GET /v1/users?page=2&limit=20
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Versioning

API version is included in the URL path: `/v1/`

Breaking changes will result in a new version: `/v2/`
