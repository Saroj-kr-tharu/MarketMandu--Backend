<div align="center">

# 📧 Reminder Microservice

<img src="https://img.shields.io/badge/Service-Email%20Notifications-orange?style=for-the-badge" alt="Service"/>
<img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status"/>
<img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version"/>

### Power11 Fantasy Sports Platform

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3+-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-6+-0B7285?style=for-the-badge)](https://nodemailer.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)](LICENSE)

<br/>

**📬 Email Notifications** • **⏰ Cron Scheduling** • **🔄 Async Processing** • **🧹 Auto-Cleanup** • **🚀 Microservice**

<br/>

*Enterprise-grade email notification and reminder service with asynchronous message queue processing, automated scheduling, and production-ready error handling.*

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Configuration](#-environment-configuration)
- [Cron Scheduling](#-cron-job-schedule)
- [Email Types](#-email-types)
- [API Endpoints](#-api-endpoints)
- [Dependencies](#-dependencies)
- [Docker Deployment](#-docker)
- [Development](#-development)
- [License](#-license)

---

## 📖 Overview

The **Reminder Microservice** is a robust, production-ready email notification service designed for the Power11 fantasy sports platform. It provides comprehensive email delivery capabilities with asynchronous message processing, intelligent scheduling, and extensive status tracking.

### 🎯 Core Responsibilities

| Feature | Description |
|:--------|:------------|
| 📬 **Email Delivery** | Transactional email sending via SMTP with template support |
| 🐰 **Queue Processing** | Asynchronous message consumption from RabbitMQ |
| ⏰ **Task Scheduling** | Automated cron-based job execution and orchestration |
| 📊 **Status Tracking** | Real-time email delivery status management and logging |
| 🧹 **Auto Cleanup** | Intelligent removal of successfully processed notifications |
| 🔐 **Security** | Environment-based configuration and secure credential handling |
| 📈 **Scalability** | Designed for horizontal scaling in containerized environments |

---

## ✨ Key Features

| Feature | Capability | Benefit |
|:--------|:-----------|:--------|
| 📬 **Email Notifications** | Multi-type transactional emails | Login alerts, payments, contests, reminders |
| 🐰 **RabbitMQ Integration** | Message-driven architecture | Decoupled, scalable, reliable processing |
| ⏰ **Cron Scheduling** | Configurable job execution | Automated reminders and cleanup tasks |
| 📊 **Status Tracking** | Real-time delivery monitoring | Complete audit trail and visibility |
| 🧹 **Auto Cleanup** | Intelligent data management | Optimized database performance |
| ✉️ **Nodemailer SMTP** | Industry-standard email library | Reliable, battle-tested delivery |
| 📝 **Template Engine** | HTML template support | Beautiful, professional email designs |
| 🐳 **Docker Ready** | Container configuration included | Easy deployment and scaling |

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          📤 MESSAGE PRODUCERS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐              │
│  │  🔐 Auth         │  │  💳 Payment      │  │  🏆 Contest      │              │
│  │   Microservice   │  │   Microservice   │  │   Microservice   │              │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘              │
│           │                     │                     │                         │
│           └─────────────────────┼─────────────────────┘                         │
│                                 ▼                                               │
│                        ┌──────────────────┐                                    │
│                        │  🐰 RabbitMQ    │                                    │
│                        │  Message Broker  │                                    │
│                        │                  │                                    │
│                        │ amqp://localhost │                                    │
│                        └────────┬─────────┘                                    │
│                                 │                                              │
└─────────────────────────────────┼──────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    📧 REMINDER MICROSERVICE (PORT: 3007)                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  🔄 Message Processing Pipeline                                         │  │
│  ├─────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                         │  │
│  │  ┌───────────────┐      ┌──────────────────┐      ┌──────────────────┐ │  │
│  │  │ 🐰 Queue      │─────▶│ 📧 Email Service │─────▶│ 📤 SMTP Server   │ │  │
│  │  │ Consumer      │      │ (Nodemailer)     │      │ (Gmail/Custom)   │ │  │
│  │  └───────────────┘      └────────┬─────────┘      └──────────────────┘ │  │
│  │                                  │                                       │  │
│  │                        ┌─────────▼──────────┐                            │  │
│  │                        │ 📊 Status Manager  │                            │  │
│  │                        │ (Log & Track)      │                            │  │
│  │                        └─────────┬──────────┘                            │  │
│  │                                  │                                       │  │
│  └──────────────────────────────────┼───────────────────────────────────────┘  │
│                                     │                                          │
│  ┌─────────────────────────────────┼───────────────────────────────────────┐  │
│  │  ⏰ Scheduled Tasks Pipeline                                           │  │
│  ├──────────────────────────────────┼───────────────────────────────────────┤  │
│  │                                  │                                       │  │
│  │  ┌──────────────────┐           │                                      │  │
│  │  │ ⏰ Cron Scheduler │───────────┼──▶ Cleanup & Status Tasks           │  │
│  │  └──────────────────┘           │                                      │  │
│  │                                  │                                       │  │
│  └──────────────────────────────────┼───────────────────────────────────────┘  │
│                                     │                                          │
└─────────────────────────────────────┼──────────────────────────────────────────┘
                                      │
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
        ┌─────────────────────┐              ┌─────────────────────┐
        │  🗄️ PostgreSQL      │              │  📤 Email Provider  │
        │     Database        │              │   (SMTP/Gmail)      │
        ├─────────────────────┤              │                     │
        │ • Notifications     │              │ • Email Sending     │
        │ • Tickets           │              │ • Delivery Status   │
        │ • Email Logs        │              │ • Error Handling    │
        │ • Confirmations     │              │ • Retry Logic       │
        └─────────────────────┘              └─────────────────────┘
```

### 🔄 Data Flow

1. **Message Production**: Other microservices publish events to RabbitMQ
2. **Queue Consumption**: Reminder service consumes messages asynchronously
3. **Processing**: Validates and processes notification requests
4. **Email Rendering**: Renders HTML templates with dynamic data
5. **Email Sending**: Delivers via Nodemailer SMTP integration
6. **Status Logging**: Records delivery status in PostgreSQL database
7. **Cleanup**: Automated cron jobs clean up processed records

### 📡 Technology Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js 4+ | REST API framework |
| **Database** | PostgreSQL 15+ | Persistent data storage |
| **ORM** | Sequelize | Database abstraction |
| **Message Queue** | RabbitMQ 3+ | Async message processing |
| **Email Service** | Nodemailer 6+ | SMTP email delivery |
| **Scheduling** | Node-Cron | Task scheduling |
| **Environment** | Docker | Containerization |

---

## 📁 Project Structure

```
03_Remainder_microservice/
│
├── 📄 Dockerfile                           # Docker image configuration
├── 📄 package.json                         # Dependencies and scripts
├── 📄 readme.md                            # Documentation (you are here)
│
└── 📁 src/
    ├── 📄 index.js                         # 🚀 Application entry point
    │
    ├── 📁 config/                          # Configuration files
    │   ├── 📄 config.json                  # Database connection config
    │   ├── 📄 email.config.js              # Email service settings
    │   └── 📄 server.config.js             # Server configuration
    │
    ├── 📁 Controllers/                     # Request handlers & business logic
    │   └── 📄 remainder.ctrl.js            # Reminder controller
    │
    ├── 📁 Middlewares/                     # Custom middleware
    │   └── 📄 ticket.middleware.js         # Ticket validation middleware
    │
    ├── 📁 models/                          # Sequelize database models
    │   ├── 📄 index.js                     # Model initialization
    │   ├── 📄 notificationtickets.js       # Notification tickets model
    │   ├── 📄 paymentnotification.js       # Payment notifications model
    │   └── 📄 ticketconfirm.js             # Ticket confirmations model
    │
    ├── 📁 migrations/                      # Database migrations
    │   ├── 📄 20241225034220-create-notification-tickets.js
    │   ├── 📄 20250508154347-create-payment-notification.js
    │   └── 📄 20250515095149-create-ticket-confirm.js
    │
    ├── 📁 Repository/                      # Data access layer (DAL)
    │   ├── 📄 payment.notification.repo.js # Payment notification queries
    │   ├── 📄 ticket.confirm.repo.js       # Ticket confirmation queries
    │   └── 📄 ticket.repo.js               # Ticket queries
    │
    ├── 📁 Routes/                          # API route definitions
    │   ├── 📄 index.js                     # Main router
    │   └── 📁 v1/                          # API v1 routes
    │       └── 📄 index.js                 # v1 route handlers
    │
    ├── 📁 seeders/                         # Database seed data
    │
    ├── 📁 Services/                        # Business logic & orchestration
    │   ├── 📄 payment.notification.Service.js
    │   └── 📄 remainder.service.js
    │
    └── 📁 utlis/                           # Utility functions
        ├── 📄 jobsSchedule.js              # Cron job scheduling
        ├── 📄 messageQueue.js              # RabbitMQ integration
        └── 📁 Template/                    # Email templates
            ├── 📄 index.js                 # Template registry
            ├── 📁 assets/                  # Static assets
            ├── 📁 emailTemplate/           # Email HTML templates
            │   ├── 📄 verifyEmailTemplate.js
            │   └── 📄 welcomeEmailTemplate.js
            └── 📁 paymentTemplate/         # Payment email templates
                └── 📄 genPaymentTemplate.js
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

| Requirement | Version | Link |
|-------------|---------|------|
| Node.js | v18.x or higher | [nodejs.org](https://nodejs.org/) |
| npm | v9.x or higher | Included with Node.js |
| PostgreSQL | v15.x or higher | [postgresql.org](https://www.postgresql.org/) |
| RabbitMQ | v3.x or higher | [rabbitmq.com](https://www.rabbitmq.com/) |
| Docker (optional) | Latest | [docker.com](https://www.docker.com/) |

### 📥 Installation Steps

```bash
# 1️⃣ Navigate to the service directory
cd 03_Remainder_microservice

# 2️⃣ Install dependencies
npm install

# 3️⃣ Copy and configure environment variables
cp .env.example .env
# Edit .env with your configuration

# 4️⃣ Run database migrations
npx sequelize-cli db:migrate

# 5️⃣ (Optional) Seed database
npx sequelize-cli db:seed:all

# 6️⃣ Start the development server
npm start

# 7️⃣ Verify the service is running
curl http://localhost:3007/health
```

### 🔍 Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Test PostgreSQL connection
psql -U postgres -d reminder_db -c "SELECT 1"

# Test RabbitMQ connection
curl -u guest:guest http://localhost:15672/api/overview
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# ═══════════════════════════════════════════════════════════════════
# 🚀 SERVER CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
PORT=3007
NODE_ENV=development
SERVICE_NAME=reminder-microservice

# ═══════════════════════════════════════════════════════════════════
# 🗄️ DATABASE CONFIGURATION (PostgreSQL)
# ═══════════════════════════════════════════════════════════════════
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=reminder_db
DB_DIALECT=postgres
DB_POOL_MIN=2
DB_POOL_MAX=10

# ═══════════════════════════════════════════════════════════════════
# 📧 EMAIL CONFIGURATION (SMTP)
# ═══════════════════════════════════════════════════════════════════
EMAIL_SERVICE=gmail                           # or custom SMTP
EMAIL_ID=your-email@gmail.com                 # Sender email address
EMAIL_PASS=your-app-password                  # Gmail app password
EMAIL_SENDER=Power11 <noreply@power11.com>   # Display name
EMAIL_HOST=smtp.gmail.com                     # SMTP server
EMAIL_PORT=587                                 # SMTP port
EMAIL_SECURE=false                            # Use TLS

# ═══════════════════════════════════════════════════════════════════
# 🐰 RABBITMQ CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
AMQP_URL=amqp://guest:guest@localhost:5672   # RabbitMQ connection URL
AMQP_EXCHANGE=AUTH_MICROSERVICE               # Exchange name
AMQP_QUEUE=reminder_queue                     # Queue name
AMQP_BINDING_KEY=REMINDER_AUTH_SERVICE        # Binding key
AMQP_PREFETCH=10                              # Prefetch count

# ═══════════════════════════════════════════════════════════════════
# ⏰ CRON JOB SCHEDULES (Cron Expression Format)
# ═══════════════════════════════════════════════════════════════════
CRON_SEND_REMINDERS=*/5 * * * *               # Every 5 minutes
CRON_UPDATE_STATUS=*/10 * * * *               # Every 10 minutes
CRON_DELETE_SUCCESS=0 */6 * * *               # Every 6 hours
CRON_CLEANUP_OLD=0 0 * * 0                    # Every Sunday at midnight

# ═══════════════════════════════════════════════════════════════════
# 📊 LOGGING CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
LOG_LEVEL=info                                # debug, info, warn, error
LOG_FORMAT=json                               # json or text

# ═══════════════════════════════════════════════════════════════════
# 🔐 SECURITY CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
JWT_SECRET=your_jwt_secret_key
API_KEY=your_api_key
CORS_ORIGIN=http://localhost:3000

# ═══════════════════════════════════════════════════════════════════
# 🎯 APPLICATION CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
MAX_RETRIES=3                                 # Email retry attempts
RETRY_DELAY=5000                              # Retry delay in milliseconds
EMAIL_TIMEOUT=30000                           # Email send timeout (ms)
CLEANUP_DAYS=30                               # Keep logs for N days
```

---

## ⏰ Cron Job Schedule

Automated tasks that run at configured intervals:

| Job | Schedule | Description | Frequency |
|:----|:---------|:------------|:----------|
| 📬 **Send Reminders** | `*/5 * * * *` | Process pending email queue | Every 5 minutes |
| 📊 **Update Status** | `*/10 * * * *` | Update delivery status | Every 10 minutes |
| 🧹 **Delete Success** | `0 */6 * * *` | Clean up delivered emails | Every 6 hours |
| 🔄 **Cleanup Old** | `0 0 * * 0` | Remove old log entries | Weekly (Sunday) |

### Cron Expression Guide

```
┌──────────────────────────────────────────────────────────────────────
│ Cron expression format (left to right):
├──────────────────────────────────────────────────────────────────────
│
│  Field          │ Allowed Values │ Example │ Description
│  ─────────────────────────────────────────────────────────────────────
│  Minute (*)     │ 0 - 59         │ */5     │ Every 5 minutes
│  Hour (*)       │ 0 - 23         │ 0       │ At midnight
│  Day (**)       │ 1 - 31         │ 1       │ First day of month
│  Month (***)    │ 1 - 12         │ *       │ Every month
│  Day of Week    │ 0 - 6          │ 0       │ Every Sunday
│
│  Example: "0 0 * * 0" = Every Sunday at midnight
│  Example: "*/5 * * * *" = Every 5 minutes
│  Example: "0 9 * * 1-5" = 9 AM on weekdays
│
└──────────────────────────────────────────────────────────────────────
```

---

## 📬 Email Types

Supported email notification types:

| Type | Trigger | Template | Priority | Description |
|:-----|:--------|:---------|:--------:|:------------|
| 🔐 **Login Alert** | User login detected | login-alert.html | High | Notify user of new login attempt |
| 💳 **Payment Success** | Payment processed | payment-success.html | High | Payment receipt & confirmation |
| 🏆 **Contest Entry** | Join contest | contest-entry.html | Medium | Contest participation confirmation |
| ⏰ **Match Reminder** | Before match starts | match-reminder.html | High | Upcoming match notification |
| 🎉 **Welcome Email** | New user registration | welcome.html | Medium | Welcome new users to platform |
| 🏅 **Winner Notification** | Contest end | winner.html | High | Prize winning notification |
| 📋 **Ticket Confirmed** | Ticket verified | ticket-confirm.html | Medium | Ticket confirmation detail |

---

## 📡 API Endpoints

### Reminder Endpoints

| Method | Endpoint | Description | Auth | Status |
|:------:|:---------|:------------|:----:|:------:|
| `GET` | `/api/v1/reminders` | Get all reminders | ✅ | Active |
| `POST` | `/api/v1/reminders` | Create new reminder | ✅ | Active |
| `GET` | `/api/v1/reminders/:id` | Get reminder by ID | ✅ | Active |
| `PUT` | `/api/v1/reminders/:id` | Update reminder | ✅ | Active |
| `DELETE` | `/api/v1/reminders/:id` | Delete reminder | ✅ | Active |
| `GET` | `/api/v1/reminders/status` | Get email status | ✅ | Active |

### Health Check

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/health` | Service health status |

---

## 📦 Dependencies

Complete list of npm dependencies:

| Package | Version | Purpose | Type |
|:--------|:--------|:--------|:----:|
| **express** | ^4.21.2 | REST API web framework | Production |
| **sequelize** | ^6.37.5 | PostgreSQL ORM | Production |
| **pg** | ^8.16.3 | PostgreSQL database driver | Production |
| **amqplib** | ^0.10.8 | RabbitMQ client library | Production |
| **nodemailer** | ^6.9.16 | Email sending via SMTP | Production |
| **node-cron** | ^3.0.3 | Job scheduling & automation | Production |
| **dotenv** | ^16.4.7 | Environment variable management | Production |
| **axios** | ^1.9.0 | HTTP client for API calls | Production |
| **body-parser** | ^1.20.3 | Request body parsing | Production |
| **pg-hstore** | ^2.3.4 | PostgreSQL hstore support | Production |
| **sequelize-cli** | ^6.6.2 | Database migration CLI | Dev |
| **nodemon** | ^3.1.9 | Development auto-restart | Dev |

### Installation of Specific Packages

```bash
# Install production dependencies
npm install

# Install new package
npm install <package-name>

# Install dev dependency
npm install --save-dev <package-name>

# List all installed packages
npm list

# Update all packages
npm update
```

---

## 🐳 Docker

### 🔨 Build Docker Image

```bash
# Build the image with tag
docker build -t power11-reminder-service:1.0.0 .

# Build with multiple tags
docker build -t power11-reminder-service:latest -t power11-reminder-service:1.0.0 .
```

### 🚀 Run Container

```bash
# Run container with environment file
docker run -d \
  --name reminder-service \
  -p 3007:3007 \
  --env-file .env \
  --network power11-network \
  power11-reminder-service:latest

# Run with explicit environment variables
docker run -d \
  --name reminder-service \
  -p 3007:3007 \
  -e NODE_ENV=production \
  -e DB_HOST=postgres.internal \
  -e AMQP_URL=amqp://rabbitmq.internal \
  --network power11-network \
  power11-reminder-service:latest
```

### 📋 Container Management

```bash
# View container logs
docker logs -f reminder-service

# List running containers
docker ps

# Stop container
docker stop reminder-service

# Remove container
docker rm reminder-service

# View container stats
docker stats reminder-service
```


---

## 💻 Development

### Development Setup

```bash
# Install dev dependencies
npm install --save-dev

# Start with nodemon (auto-reload)
npm start

# Start in debug mode
node --inspect src/index.js
```

### Database Operations

```bash
# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Create new seeder
npx sequelize-cli seed:generate --name seed-name

# Run seeders
npx sequelize-cli db:seed:all

# Undo seeders
npx sequelize-cli db:seed:undo:all
```

### Code Quality

```bash
# Format code
npm run format

# Run linter
npm run lint

# Run tests
npm test

# Test coverage
npm run test:coverage
```

### Debug Commands

```bash
# View database logs
npm run db:logs

# Check queue status
npm run queue:status

# View cron jobs
npm run cron:status

# Test email sending
npm run test:email
```

---

## 🔗 Integration with Other Services

### Publishing to Queue

Other microservices can publish events:

```javascript
const amqp = require('amqplib');

async function publishReminder() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  const message = {
    userId: 123,
    type: 'payment_confirmation',
    data: { amount: 100, currency: 'USD' }
  };
  
  channel.publish(
    'AUTH_MICROSERVICE',
    'REMINDER_AUTH_SERVICE',
    Buffer.from(JSON.stringify(message))
  );
}
```

---

## 📊 Monitoring & Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|:------|:------|:---------|
| Email not sending | SMTP config error | Check `.env` email settings |
| Queue not consuming | RabbitMQ disconnected | Verify RabbitMQ is running |
| Database errors | Connection pool exhausted | Check DB_POOL_MAX setting |
| Cron jobs not running | Incorrect timezone | Verify system timezone |

### Monitoring

```bash
# Check service health
curl http://localhost:3007/health

# View recent logs
tail -f logs/reminder-service.log

# Monitor resource usage
docker stats reminder-service
```

---

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` file to version control
2. **API Keys**: Use strong, unique API keys
3. **Database**: Use encrypted connections (SSL/TLS)
4. **Email Credentials**: Use app-specific passwords, not main account password
5. **Rate Limiting**: Implement rate limiting on endpoints
6. **Input Validation**: Validate all incoming email addresses
7. **Error Handling**: Don't expose sensitive info in error messages

---

## 📝 Best Practices

- ✅ Always use environment variables for configuration
- ✅ Implement error handling and retry logic
- ✅ Log important events and errors
- ✅ Keep email templates updated and tested
- ✅ Monitor cron job execution
- ✅ Regular database backups
- ✅ Use version control for all code
- ✅ Document configuration changes

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contribution

For issues, questions, or contributions:

1. Check existing documentation
2. Review error logs
3. Contact the development team
4. Submit issues via project management system

---

<div align="center">

**[⬆ Back to Top](#-reminder-microservice)**

<br/>

<sub>Power11 Reminder Microservice v1.0.0</sub>
<br/>
<sub>Last Updated: January 7, 2026</sub>

</div>
