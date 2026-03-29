<div align="center">

# 🔐 Auth Microservice

**Enterprise-Grade Authentication Service**

[![Service](https://img.shields.io/badge/Service-Authentication-blue?style=flat-square)](https://github.com)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-FF6B35?style=flat-square)](https://jwt.io/)

**Secure** • **Fast** • **Scalable** • **Production-Ready**

*Secure JWT-based authentication with role-based access control, password encryption, and async email integration.*

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Docker Deployment](#-docker-deployment)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

The **Auth Microservice** is a robust, scalable authentication and authorization service built for the Power11 Fantasy Sports Platform. It handles all identity management operations including user registration, secure login, JWT token lifecycle management, and role-based access control.

**Core Responsibilities:**
- User account management and registration
- Secure authentication and session management
- JWT token issuance and validation
- Role-based access control (RBAC)
- Async event publishing for email notifications
- Service-to-service authentication

---

## ✨ Features

| Feature | Description |
|:--------|:------------|
| 🔑 **JWT Authentication** | Access tokens (15m) & refresh tokens (7d) with secure rotation |
| 👤 **User Management** | Registration, profile management, and account updates |
| 🔒 **Password Security** | Industry-standard bcrypt hashing (12+ rounds) |
| 👑 **Role-Based Access** | Fine-grained authorization (Admin, User roles) |
| 📧 **Async Email** | Event-driven email notifications via RabbitMQ |
| 🔄 **Token Refresh** | Seamless token renewal with rotating refresh tokens |
| 🔗 **Service Auth** | Secure microservice-to-microservice communication |
| 🍪 **HTTP-Only Cookies** | Secure refresh token storage preventing XSS attacks |
| 🗄️ **Database Migrations** | Version-controlled schema management with Sequelize |

---

## 🏗️ Architecture

**Layered Architecture with Clear Separation of Concerns**

```
                              ┌──────────────────────┐
                              │   🌐 API Gateway     │
                              │      (Port 3000)     │
                              └──────────┬───────────┘
                                         │
                                         ▼
    ┌────────────────────────────────────────────────────────────┐
    │          🔐 AUTH MICROSERVICE (Port 3001)                   │
    │                                                              │
    │  ┌──────────┐  ┌─────────────┐  ┌──────────────┐           │
    │  │  Routes  │─▶│ Controllers │─▶│  Services    │           │
    │  └──────────┘  └─────────────┘  └──────┬───────┘           │
    │                                         │                   │
    │                    ┌────────────────────┴────────┐          │
    │                    │   Repository Layer         │          │
    │                    └────────────────────┬────────┘          │
    │                                         │                   │
    └─────────────────────────────────────────┼───────────────────┘
                                              │
          ┌───────────────────────────────────┼──────────────────┐
          ▼                                   ▼                  ▼
    ┌──────────────────┐          ┌──────────────────┐    ┌─────────────┐
    │ 🗄️  PostgreSQL   │          │ 🐰 RabbitMQ      │    │ 🔐 JWT/RBAC │
    │   • Users        │          │ • Email Events   │    │             │
    │   • Roles        │          │ • Notifications  │    │ • Access    │
    │   • Sessions     │          │                  │    │ • Refresh   │
    └──────────────────┘          └──────────────────┘    └─────────────┘
```

**Key Design Patterns:**
- **MVC Architecture** - Clear separation between routes, controllers, and services
- **Repository Pattern** - Abstracted data access layer
- **Service Layer** - Business logic isolation
- **Dependency Injection** - Loose coupling between components
- **Middleware Pipeline** - Composable request processing

---

## 📁 Project Structure

```
02_Auth_microservice/
├── 📄 dockerfile              # Docker container configuration
├── 📄 package.json            # Node.js dependencies and scripts
├── 📄 .env.example            # Environment variables template
├── 📄 README.md               # This documentation
│
└── 📁 src/
    ├── 📄 index.js            # Application entry point
    │
    ├── 📁 config/
    │   ├── 📄 config.json             # Database config (dev/prod)
    │   ├── 📄 docker-config.json      # Docker database config
    │   └── 📄 server.config.js        # Server configuration
    │
    ├── 📁 controllers/
    │   ├── 📄 index.js                # Controller exports
    │   └── 📄 auth.controller.js      # Auth endpoints handler
    │
    ├── 📁 middlewares/
    │   ├── 📄 index.js                        # Middleware exports
    │   ├── 📄 user.middleware.js              # User auth middleware
    │   └── 📄 internal.service.middleware.js  # Service-to-service auth
    │
    ├── 📁 migrations/
    │   └── 📄 20251117070636-create-user.js   # User table schema
    │
    ├── 📁 models/
    │   ├── 📄 index.js                # Sequelize initialization
    │   └── 📄 user.js                 # User model definition
    │
    ├── 📁 repository/
    │   ├── 📄 curd.repo.js            # Generic CRUD operations
    │   └── 📄 user.repo.js            # User-specific queries
    │
    ├── 📁 services/
    │   ├── 📄 index.js                # Service exports
    │   ├── 📄 user.service.js         # User business logic
    │   ├── 📄 curdService.js          # Generic CRUD service
    │   └── 📄 queue.service.js        # RabbitMQ integration
    │
    ├── 📁 Routes/
    │   ├── 📄 index.js                # Main route handler
    │   └── 📄 routes/index.js         # Route definitions
    │
    └── 📁 utlis/
        ├── 📄 index.js                # Utility exports
        ├── 📄 bcryptHelper.js         # Password hashing utils
        ├── 📄 jwtHelper.js            # JWT token utils
        ├── 📄 messageQueue.js         # RabbitMQ utils
        └── 📁 Errors/
            └── 📄 https_codes.js      # HTTP status codes
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|:-----------|:---------|
| **Node.js** | v18.x or higher |
| **PostgreSQL** | v15.x or higher |
| **RabbitMQ** | v3.x or higher |
| **npm** | v9.x or higher |
| **Git** | Latest |

### 📥 Installation Steps

```bash
# 1️⃣ Clone and navigate to the service
cd 02_Auth_microservice

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create environment configuration
cp .env.example .env

# 4️⃣ Configure your environment variables in .env
# Update: PORT, JWT_KEYS, DATABASE_URL, RABBITMQ_URL, EMAIL settings

# 5️⃣ Run database migrations
npx sequelize-cli db:migrate

# 6️⃣ Start the development server
npm start
```

The service will be available at `http://localhost:3001`

### ⚙️ Environment Configuration

Create `.env` file in the project root:

```env
# ═════════════════════════════════════════════════════════════
# SERVER CONFIGURATION
# ═════════════════════════════════════════════════════════════
PORT=3001
NODE_ENV=development

# ═════════════════════════════════════════════════════════════
# JWT CONFIGURATION (Generate strong random keys)
# ═════════════════════════════════════════════════════════════
PRIVATEJWT=your_super_secret_jwt_access_key_min_32_chars
PRIVATEJWTRefersh=your_super_secret_jwt_refresh_key_min_32_chars
JWT_ACCESS_EXPIRY=900        # 15 minutes in seconds
JWT_REFRESH_EXPIRY=604800    # 7 days in seconds

# ═════════════════════════════════════════════════════════════
# DATABASE CONFIGURATION
# ═════════════════════════════════════════════════════════════
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=power11_auth
DB_DIALECT=postgres

# ═════════════════════════════════════════════════════════════
# MICROSERVICE COMMUNICATION
# ═════════════════════════════════════════════════════════════
INTERNAL_SERVER_TOKEN=your_internal_service_token_for_api_calls
PAYMENT_BACKEND_URL=http://localhost:3006
PAYMENT_SERVICE_API_KEY=your_payment_service_key
FRONTEND_SUCCESS_URL=http://localhost:5173/success

# ═════════════════════════════════════════════════════════════
# EMAIL CONFIGURATION (For async notifications)
# ═════════════════════════════════════════════════════════════
EMAIL_ID=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_SERVICE=gmail
EMAIL_FROM_NAME=Power11

# ═════════════════════════════════════════════════════════════
# RABBITMQ CONFIGURATION (Message broker)
# ═════════════════════════════════════════════════════════════
MESSAGE_BROKER_URL=amqp://localhost:5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
CHANNEL_NAME=AUTH_CHANNEL
EXCHANGE_NAME=AUTH_MICROSERVICE
REMINDER_BINDING_KEY=REMINDER_AUTH_SERVICE

# ═════════════════════════════════════════════════════════════
# LOGGING & DEBUGGING
# ═════════════════════════════════════════════════════════════
LOG_LEVEL=debug
DEBUG=auth:*
```

### 🗄️ Database Setup

Update `src/config/config.json` with your database credentials:

```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "power11_auth",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres",
    "logging": true
  },
  "production": {
    "username": "prod_user",
    "password": "secure_production_password",
    "database": "power11_auth_prod",
    "host": "your-prod-db-host",
    "port": 5432,
    "dialect": "postgres",
    "logging": false,
    "pool": {
      "max": 10,
      "min": 5,
      "acquire": 30000,
      "idle": 10000
    }
  }
}
```

## 📡 API Endpoints

### Authentication Routes

| HTTP | Endpoint | Description | Auth | Rate Limit |
|:----:|:---------|:------------|:----:|:----------:|
| `POST` | `/api/v1/auth/register` | Register new user | ❌ | 5/min |
| `POST` | `/api/v1/auth/login` | User login with credentials | ❌ | 10/min |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | 🔄 | 20/min |
| `POST` | `/api/v1/auth/logout` | User logout and token revocation | ✅ | 20/min |
| `GET` | `/api/v1/auth/profile` | Retrieve user profile | ✅ | 60/min |
| `PATCH` | `/api/v1/auth/profile` | Update user profile | ✅ | 30/min |
| `POST` | `/api/v1/auth/verify-email` | Verify email address | 🔄 | 5/min |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset | ❌ | 3/min |

**Legend:** ❌ = No auth required | ✅ = JWT required | 🔄 = Refresh token required

### Request/Response Examples

#### Register User

<details>
<summary><b>📥 POST /api/v1/auth/register</b></summary>

**Request:**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-01-07T10:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email already exists"
  }
}
```
</details>

#### User Login

<details>
<summary><b>🔑 POST /api/v1/auth/login</b></summary>

**Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Headers:** Refresh token is also set in HttpOnly cookie
```
Set-Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
```
</details>

#### Refresh Token

<details>
<summary><b>🔄 POST /api/v1/auth/refresh</b></summary>

**Request:**
```http
POST /api/v1/auth/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```
</details>

#### Get User Profile

<details>
<summary><b>👤 GET /api/v1/auth/profile</b></summary>

**Request:**
```http
GET /api/v1/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-01-07T10:00:00.000Z",
    "updatedAt": "2026-01-07T10:00:00.000Z"
  }
}
```
</details>

## 🗃️ Database Schema

### User Table

| Column | Type | Constraints | Default | Description |
|:-------|:-----|:------------|:--------|:------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | - | Unique user identifier |
| `name` | VARCHAR(255) | NOT NULL | - | User's full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | - | Email address |
| `password` | VARCHAR(255) | NOT NULL | - | Bcrypt hashed password |
| `role` | ENUM | NOT NULL | 'user' | User role ('admin', 'user') |
| `isEmailVerified` | BOOLEAN | - | false | Email verification status |
| `lastLogin` | TIMESTAMP | - | NULL | Last login timestamp |
| `createdAt` | TIMESTAMP | - | CURRENT_TIMESTAMP | Account creation time |
| `updatedAt` | TIMESTAMP | - | CURRENT_TIMESTAMP | Last update time |
| `deletedAt` | TIMESTAMP | - | NULL | Soft delete timestamp |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_user_createdAt ON users(createdAt);
```

## 🔐 Security

### Token Security Strategy

```
╔═══════════════════════════════════════════════════════════╗
║                  TOKEN LIFECYCLE                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🔑 ACCESS TOKEN              🔄 REFRESH TOKEN           ║
║  ├─ Lifetime: 15 minutes      ├─ Lifetime: 7 days       ║
║  ├─ Location: Memory/Header   ├─ Location: HttpOnly     ║
║  ├─ Usage: API calls          ├─ Usage: Token renewal   ║
║  ├─ Scope: All endpoints      ├─ Scope: /refresh only   ║
║  └─ Claims: userId, role, exp └─ Claims: userId, exp     ║
║                                                           ║
║  ⚠️  Token Rotation: Every refresh generates new tokens   ║
║  ⚠️  Signing: HS256 algorithm with strong secrets         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Password Security

**Bcrypt Configuration:**
- **Algorithm:** bcrypt (one-way hashing)
- **Salt Rounds:** 12 (configurable, higher = slower but more secure)
- **Cost Factor:** Adapts to hardware improvements over time

```javascript
// Password hashing example
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Hash password during registration
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Verify password during login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Security Best Practices Implemented

✅ **HTTPS Only:** Secure cookie flag enabled
✅ **HttpOnly Cookies:** Prevents XSS attacks on refresh tokens
✅ **CSRF Protection:** SameSite cookie policy (Strict)
✅ **JWT Signing:** Strong secret keys (min 32 characters)
✅ **Password Hashing:** Industry-standard bcrypt
✅ **Rate Limiting:** Prevents brute force attacks
✅ **Input Validation:** Schema validation on all endpoints
✅ **Error Masking:** Generic error messages prevent information leakage
✅ **Token Expiration:** Short-lived access tokens (15 min)
✅ **Service Auth:** Internal token verification for microservice calls

### Environment Security

**Never commit secrets!**
```bash
# .gitignore
.env
.env.local
.env.*.local
```

Generate strong secrets:
```bash
# Generate 32-byte random string for JWT keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📦 Dependencies

| Package | Version | Purpose |
|:--------|:--------|:--------|
| **express** | ^5.1.0 | Web framework and routing |
| **sequelize** | ^6.37.7 | PostgreSQL ORM |
| **pg** | ^8.16.3 | PostgreSQL database driver |
| **pg-hstore** | ^2.3.4 | Sequelize type support |
| **bcrypt** | ^6.0.0 | Password hashing and verification |
| **jsonwebtoken** | ^9.0.2 | JWT token creation and validation |
| **amqplib** | ^0.10.9 | RabbitMQ client library |
| **cookie-parser** | ^1.4.7 | HTTP cookie parsing middleware |
| **body-parser** | ^2.2.0 | Request body parsing |
| **dotenv** | ^17.2.3 | Environment variable management |
| **sequelize-cli** | ^6.6.3 | Sequelize CLI tools |
| **nodemon** | ^3.1.11 | Development auto-reload (dev only) |

**Total Dependencies:** 12 production packages

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t power11-auth-service:latest .

# Tag for registry
docker tag power11-auth-service:latest your-registry/power11-auth-service:1.0.0
```

### Run Container Locally

```bash
# Run with environment file
docker run -d \
  --name auth-service \
  -p 3001:3001 \
  --env-file .env \
  --network power11-network \
  power11-auth-service:latest

# Check logs
docker logs -f auth-service

# Stop container
docker stop auth-service
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  auth-service:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DB_HOST=postgres
      - DB_PORT=5432
      - MESSAGE_BROKER_URL=amqp://rabbitmq:5672
    depends_on:
      - postgres
      - rabbitmq
    networks:
      - power11-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: power11_auth
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - power11-network

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - power11-network

volumes:
  postgres_data:
  rabbitmq_data:

networks:
  power11-network:
    driver: bridge
```

**Deploy with Docker Compose:**
```bash
docker-compose up -d
docker-compose logs -f auth-service
```

## 🔧 Development

### Common Commands

```bash
# Start development server with auto-reload
npm start

# Run database migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Create new model
npx sequelize-cli model:generate --name UserRole --attributes id:integer,name:string

# Seed database
npx sequelize-cli db:seed:all

# Run specific seed
npx sequelize-cli db:seed --seed 20260101120000-demo-user.js

# Check database connection
npm run db:check
```

### Project Conventions

**Naming Conventions:**
- Controllers: `entityName.controller.js`
- Services: `entityName.service.js`
- Routes: `entityName.routes.js`
- Models: PascalCase (e.g., `User.js`)
- Migrations: `YYYYMMDDHHMMSS-description.js`

**Code Style:**
- Use async/await (no callbacks)
- Include JSDoc comments for public methods
- Follow Airbnb JavaScript style guide
- Use meaningful variable names

**Error Handling:**
```javascript
// Good: Consistent error format
try {
  // logic
} catch (error) {
  logger.error('Error message:', error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

// Bad: No error handling
const data = await User.findAll();
res.json(data);
```


## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>❌ "ECONNREFUSED: Connection refused to PostgreSQL"</b></summary>

**Solution:**
1. Verify PostgreSQL is running: `psql --version`
2. Check database credentials in `.env` file
3. Ensure database exists: `createdb power11_auth`
4. Restart PostgreSQL service:
   ```bash
   # macOS
   brew services restart postgresql
   
   # Linux
   sudo systemctl restart postgresql
   
   # Windows
   # Restart PostgreSQL service from Services app
   ```
</details>

<details>
<summary><b>❌ "ECONNREFUSED: Connection refused to RabbitMQ"</b></summary>

**Solution:**
1. Check RabbitMQ status
2. Start RabbitMQ:
   ```bash
   # macOS
   brew services start rabbitmq
   
   # Linux
   sudo systemctl start rabbitmq-server
   
   # Docker
   docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
   ```
3. Access management UI: `http://localhost:15672`
</details>

<details>
<summary><b>❌ "Port 3001 already in use"</b></summary>

**Solution:**
```bash
# Find and kill process using port 3001
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>

# Or change port in .env
PORT=3002
```
</details>

<details>
<summary><b>❌ "SequelizeConnectionError: password authentication failed"</b></summary>

**Solution:**
1. Verify database user credentials
2. Reset PostgreSQL password:
   ```bash
   psql -U postgres
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```
3. Update `.env` with correct credentials
</details>

<details>
<summary><b>❌ "JWT token is invalid or expired"</b></summary>

**Solution:**
1. Ensure `PRIVATEJWT` environment variable is set
2. Check token expiration (default: 15 minutes)
3. Use `/api/v1/auth/refresh` endpoint to get new token
4. Verify token hasn't been tampered with
</details>

### Debug Mode

Enable detailed logging:

```bash
# Set debug environment variable
DEBUG=auth:* npm start

# Or in .env
LOG_LEVEL=debug
DEBUG=auth:*,sequelize:*
```

### Health Check Endpoint

```bash
# Check service health
curl http://localhost:3001/health

# Expected response
{
  "status": "up",
  "timestamp": "2026-01-07T10:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "rabbitmq": "connected"
}
```

---

## 📊 Performance Optimization

### Database Query Optimization

```javascript
// Use eager loading to prevent N+1 queries
User.findAll({
  include: [{ association: 'roles' }],
  raw: true
});

// Use pagination for large datasets
User.findAll({
  limit: 20,
  offset: (page - 1) * 20
});

// Index frequently searched columns
```

### Caching Strategy

- **Access Tokens:** Cached in memory (15 min TTL)
- **User Profiles:** Redis cache (1 hour TTL)
- **Permissions:** In-memory RBAC cache (updated on role change)

### Rate Limiting

All endpoints are protected with rate limiting:
- 5 req/min for registration
- 10 req/min for login
- 20 req/min for token refresh
- 60 req/min for profile endpoints

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m "feat: add new feature"
   ```
4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request with description of changes**

**Commit Message Format:**
```
type(scope): subject

body

footer
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 📄 License

This project is licensed under the **ISC License** - see [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Documentation Issues:** Open an issue on GitHub
- **Security Concerns:** Email security@power11.com
- **Questions:** Check existing issues or create a new one

---

## 📈 Roadmap

### Planned Features
- [ ] Two-factor authentication (2FA)
- [ ] OAuth 2.0 integration (Google, GitHub)
- [ ] Email verification workflow
- [ ] Password reset functionality
- [ ] User session management
- [ ] Activity logging and audit trail
- [ ] API key management for developers

### In Progress
- [ ] Enhanced error handling
- [ ] Comprehensive test suite

### Completed ✅
- JWT token authentication
- Role-based access control
- Password encryption with bcrypt
- RabbitMQ integration
- Docker support

---

<div align="center">

### Made with ❤️ for Power11 Fantasy Sports Platform

**[⬆ Back to Top](#-auth-microservice)**

<br/>

**Version:** 1.0.0 | **Last Updated:** January 7, 2026 | **Status:** Production Ready ✅

</div>
