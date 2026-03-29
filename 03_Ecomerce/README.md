# 🛒 Ecommerce Backend API

A production-ready Node.js REST API for modern ecommerce platforms. Built with Express.js, Sequelize ORM, and MySQL, this backend provides secure user authentication, product management, order processing, and more.

## 🚀 Features

- **JWT Authentication** with OTP-based two-factor authentication
- **Role-based Access Control** (Admin, Customer, User)
- **Complete Product Management** with advanced filtering
- **Order Management System** with status tracking
- **Secure Password Handling** with bcrypt
- **Email Integration** for OTP delivery
- **🐳 Full Docker Containerization** with multi-service orchestration
- **🔄 Automated CI/CD Pipeline** with GitHub Actions for seamless deployment
- **📦 Production-Ready Docker Images** with optimized Node.js Alpine base
- **🌐 VPS Deployment Automation** via SSH with zero-downtime deployment

## 🏗️ Project Structure

```
📁 src/
├── 📄 index.js                    # Application entry point
├── 📁 config/                     # Configuration files
│   ├── config.json                # Database configuration
│   ├── docker-config.json         # Docker database config
│   ├── emailConfig.js             # Email service setup
│   └── serverConfig.js            # Server settings
├── 📁 controllers/                # HTTP request handlers
├── 📁 middlewares/                # Authentication & authorization
├── 📁 models/                     # Sequelize database models
├── 📁 migrations/                 # Database schema migrations
├── 📁 repository/                 # Data access layer
├── 📁 services/                   # Business logic layer
├── 📁 Routes/                     # API route definitions
└── 📁 utlis/                      # Utilities and helpers
    ├── 📁 Errors/                 # Error handling
    └── 📁 MailTemplate/           # Email templates
```
## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saroj-kr-tharu/Ecommerce.git
   cd Ecommerce/01_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   PRIVATEJWT=your_jwt_secret_key
   EMAIL_ID=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Database setup**
   Update `src/config/config.json` with your MySQL credentials:
   ```json
   {
     "development": {
       "username": "your_mysql_username",
       "password": "your_mysql_password",
       "database": "ecommerce",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

5. **Run migrations**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. **Start the server**
   ```bash
   npm start
   ```



**🏗️ Docker Architecture:**
- **Backend Service**: Node.js 18 Alpine container on port 8000
- **MySQL Database**: MySQL 8.0 container on port 3308
- **Custom Network**: `Ecommerce_net` for secure inter-service communication
- **Persistent Storage**: Named volumes for database and node_modules
- **Health Checks**: Automatic MySQL health monitoring
- **Auto-restart**: Containers restart automatically on failure

**Docker Benefits:**
- ✅ **Consistent Environment** across development, staging, and production
- ✅ **Isolated Dependencies** with no conflicts between projects
- ✅ **One-Command Setup** - everything configured and ready
- ✅ **Production Parity** - identical runtime environments

## 📋 API Documentation

Base URL: `http://localhost:3000/api/v1` (Local) or `http://localhost:8000/api/v1` (Docker)

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth/signup` | User registration |
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/login/otp` | Request OTP for login |
| `POST` | `/auth/login/otp-verify` | Verify OTP |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/products` | Get products with filters | No |
| `POST` | `/products/add` | Add new product | Admin |
| `PATCH` | `/products/update` | Update product | Admin |
| `DELETE` | `/products/delete` | Delete product | Admin |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/orders/addOrder` | Place new order | Customer |
| `GET` | `/orders/getByUser` | Get user orders | Customer |
| `GET` | `/orders` | Get all orders | Admin |
| `PATCH` | `/orders/update` | Update order status | Admin |


## 🗄️ Database Schema

### 👤 User Model
```sql
- id (Primary Key)
- name (String, Required)
- email (String, Required, Unique)
- password (String, Required, Encrypted)
- role (Enum: 'admin', 'customer', Default: 'customer')
- createdAt, updatedAt (Timestamps)
```

### 📦 Product Model  
```sql
- id (Primary Key)
- name (String, Required)
- description (Text, Required) 
- category (String, Required)
- price (Decimal, Required)
- stock (Integer, Required)
- brand (String, Required)
- imageUrl (String, Optional)
- rating (Float, Optional)
- createdAt, updatedAt (Timestamps)
```

### 🛍️ Order Model
```sql
- id (Primary Key)
- userId (Foreign Key → User.id)
- totalAmount (Decimal, Required)
- status (Enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- orderDate (Date, Default: NOW)
- createdAt, updatedAt (Timestamps)
```

### 📝 OrderItem Model
```sql
- id (Primary Key) 
- orderId (Foreign Key → Order.id)
- productId (Foreign Key → Product.id)
- quantity (Integer, Required)
- price (Decimal, Required)
- createdAt, updatedAt (Timestamps)
```

### 🔑 OTP Model
```sql
- id (Primary Key)
- userId (Foreign Key → User.id) 
- otp (String, Required)
- expiresAt (Date, Required)
- isUsed (Boolean, Default: false)
- createdAt, updatedAt (Timestamps)
```

### 🔗 Model Relationships
- **User** → **Order**: One-to-Many (User can have multiple orders)
- **User** → **OTP**: One-to-Many (User can have multiple OTPs)
- **Order** → **OrderItem**: One-to-Many (Order can have multiple items)
- **Product** → **OrderItem**: One-to-Many (Product can be in multiple orders)

---

## 🛠️ Technologies & Dependencies

### 🎯 Core Technologies
- **Node.js 18** - JavaScript runtime environment (Alpine Linux)
- **Express.js 5.1.0** - Modern web application framework
- **MySQL 8.0** - Relational database management system
- **Sequelize 6.37.7** - Promise-based Node.js ORM



### 🐳 Infrastructure & DevOps
- **Docker 🐳** - Multi-stage containerization with Alpine Linux base
- **Docker Compose** - Multi-service orchestration with networking & volumes
- **GitHub Actions** - Automated CI/CD pipeline with SSH deployment
- **MySQL Docker** - Containerized database with health checks & persistence
- **Production VPS** - Automated deployment to production server
- **Zero-Downtime Deployment** - Rolling updates without service interruption

### 🔧 Development Tools
- **Nodemon** - File watching and automatic server restart
- **Sequelize CLI** - Database migration and seeding management
- **Docker Desktop** - Container development environment

### 🏗️ Architecture Patterns
- **Repository Pattern** - Clean data access layer separation
- **Service Layer** - Business logic encapsulation  
- **Middleware Pattern** - Request/response processing pipeline
- **MVC Architecture** - Model-View-Controller separation
- **RESTful API** - Resource-based API design

---

## 🐳 Docker Implementation Details

### 📦 Containerization Architecture

Our ecommerce backend is fully containerized using Docker with a multi-service approach:

#### **Backend Service Container**
```dockerfile
FROM node:18-alpine          # Lightweight Alpine Linux base
WORKDIR /Ecommerce/backend/developer/backend
COPY package*.json ./        # Layer caching optimization
RUN npm ci                   # Clean production install
COPY . .                     # Application code
EXPOSE 8000                  # Application port
CMD ["npm", "start"]         # Start with nodemon
```

#### **MySQL Service Container**
```yaml
mysql_service:
  image: mysql:8.0                    # Official MySQL 8.0 image
  container_name: mysql_Ecommerce    # Custom container name
  ports: ["3308:3306"]               # Host:Container port mapping
  environment:
    MYSQL_ROOT_PASSWORD: 12345       # Database credentials
    MYSQL_DATABASE: ecommerce        # Auto-create database
  volumes:
    - mysql_data_vol:/var/lib/mysql  # Persistent data storage
  healthcheck:                       # Container health monitoring
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### 🔧 Docker Compose Configuration

**🌐 Network Setup:**
- **Custom Bridge Network** (`Ecommerce_net`) for isolated service communication
- **DNS Resolution** - Services can communicate using container names
- **Security Isolation** - Network-level separation from other Docker projects

**💾 Volume Management:**
- **mysql_data_vol** - Database persistence across container restarts
- **ecommerce_backend_data_vol** - Node.js modules cache optimization
- **Bind Mounts** - Development code synchronization (when needed)

**🚀 Service Dependencies:**
- **Health Checks** - MySQL service health verification before backend starts
- **Auto-restart Policy** - `unless-stopped` for production reliability
- **Environment Variables** - Secure configuration via `.env` file

### 🛠️ Development vs Production Docker Usage

#### **Development Mode:**
```bash
# Development with live reload
docker-compose up --build

# View logs for debugging
docker-compose logs -f ecommerce_backend_service

# Execute commands inside containers
docker-compose exec ecommerce_backend_service npm run migrate
docker-compose exec mysql_service mysql -u root -p ecommerce
```

#### **Production Mode:**
```bash
# Production deployment
docker-compose up -d --force-recreate

# Monitor production health
docker-compose ps
docker stats

# Production maintenance
docker-compose restart ecommerce_backend_service
docker-compose pull && docker-compose up -d  # Update images
```

### 🏗️ Docker Benefits for This Project

- **🎯 Environment Consistency** - Identical runtime from development to production
- **⚡ Fast Setup** - One command setup for new developers
- **🔒 Security Isolation** - Each service runs in its own secure container
- **📈 Scalability Ready** - Easy horizontal scaling with Docker Swarm/Kubernetes
- **🔄 Easy Updates** - Version-controlled infrastructure as code
- **💾 Data Persistence** - Database survives container lifecycles
- **🌐 Network Isolation** - Secure inter-service communication

---

### Authentication & Authorization
- **🔐 JWT-based Authentication** - Secure token-based user sessions
- **🛡️ Role-based Access Control** - Different permissions for Admin, Customer, and User roles
- **🔒 Password Encryption** - bcrypt hashing with salt for secure password storage
- **⏰ Token Verification** - Middleware to validate JWT tokens for protected routes

### OTP Security
- **📱 Two-Factor Authentication** - OTP-based login for enhanced security
- **📧 Email-based OTP** - Secure OTP delivery via email
- **⏳ Time-based Expiration** - OTP tokens expire after specified time period
- **🔄 One-time Use** - OTP tokens are invalidated after single use

### Middleware Protection
- **🚦 Route Protection** - Specific middleware for different user roles
- **🔍 Input Validation** - Request validation and sanitization
- **🛡️ Error Handling** - Comprehensive error handling and logging

### Data Security
- **🗄️ SQL Injection Prevention** - Sequelize ORM protects against SQL injection
- **🌐 CORS Protection** - Cross-origin resource sharing configuration
- **🔒 Secure Headers** - Security headers for API responses


---

## 🚀 Deployment - From Development to Production

Taking your ecommerce backend from your laptop to serving real customers? We've got you covered with multiple deployment strategies that scale with your needs.

### 🐳 Docker Deployment - Container Magic

#### 🏠 Local Docker Setup
Perfect for replicating production environment on your development machine:

```bash
# Build and launch everything with one command
docker-compose up --build -d

# Verify all containers are healthy
docker-compose ps

# Monitor your application logs in real-time
docker-compose logs ecommerce_backend_service

# Scale your backend horizontally (when you're ready to handle more traffic!)
docker-compose up --scale ecommerce_backend_service=2
```

#### 🌐 Production Docker Deployment
Ready for the real world:

```bash
# Ensure you have the latest images
docker-compose pull

# Deploy with production optimizations
docker-compose -f docker-compose.yml up -d

# Keep an eye on your production logs
docker-compose logs -f
```

**Production Benefits:**
- **Consistent Environment** - Identical runtime from development to production
- **Easy Scaling** - Spin up additional containers as your user base grows
- **Resource Isolation** - Each service runs in its own secure container
- **Quick Rollbacks** - Deploy new versions with confidence, roll back instantly if needed

### 🔄 Automated CI/CD Pipeline - Deploy Like a Pro

We've implemented a **complete GitHub Actions workflow** that automates your entire deployment process from code push to production:

**📋 Pipeline Overview (`CiCDPipeline.yml`):**
```yaml
Trigger: Push to main branch
Platform: Ubuntu Latest Runner
Target: VPS Deployment via SSH
```

**🚀 Deployment Workflow:**
1. **Code Checkout** - Fresh code pulled from main branch
2. **VPS Connection** - Secure SSH connection to production server  
3. **Image Update** - `docker compose pull` for latest images
4. **Service Restart** - `docker compose up -d` with zero-downtime deployment
5. **Health Verification** - Automatic service health checks

**⚙️ Required GitHub Secrets:**
```env
VPS_HOST=your.production.server.ip
VPS_USER=your_server_username  
VPS_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
```

**📂 Production Server Structure:**
```bash
/Ecommerce/Backend/
├── docker-compose.yml    # Production compose file
├── .env                  # Production environment variables
└── ...                   # Application files
```

**🎯 Deployment Features:**
- **Zero-Downtime Deployment** - Rolling updates without service interruption
- **Automatic Rollback** - Easy revert to previous version if needed
- **Secure SSH Access** - Key-based authentication for VPS access
- **Real-time Monitoring** - GitHub Actions logs for deployment tracking

### 🌍 Production Environment Configuration

#### 🔐 Environment Variables for Production
```env
# Production server settings
NODE_ENV=production
PORT=8000

# Secure JWT secret (make this LONG and RANDOM!)
PRIVATEJWT=your_super_secure_production_jwt_secret_here_make_it_very_long

# Production email service
EMAIL_ID=noreply@yourdomain.com
EMAIL_PASS=your_production_email_password

# Production database (configure in src/config/config.json)
```

#### 🗄️ Production Database Setup
```bash
# Run migrations on your production database
NODE_ENV=production npx sequelize-cli db:migrate

# Optionally seed initial data (be careful with this in production!)
NODE_ENV=production npx sequelize-cli db:seed:all
```


## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---


## 🙏 Acknowledgments

- **Node.js Community** for excellent runtime environment
- **Express.js Team** for the robust web framework
- **Sequelize Team** for the powerful ORM
- **MySQL** for reliable database management
- **Open Source Contributors** for various packages used

---
