<div align="center">

# 🛒 MarketMandu — E-commerce Microservices Platform

**A production-grade, cloud-native e-commerce backend built on a polyglot-persistence microservices architecture with full CI/CD automation and Kubernetes orchestration.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.11+-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com)
[![Redis](https://img.shields.io/badge/Redis-6+-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-326CE5?style=flat-square&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI/CD-D24939?style=flat-square&logo=jenkins&logoColor=white)](https://www.jenkins.io)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

</div>

---

## 🔗 Related Repositories

| Repository | Description | Link |
|------------|-------------|------|
| **Frontend (Web Client)** | React-based e-commerce storefront and admin panel | [Saroj-kr-tharu/Ecommerce-fortend](https://github.com/Saroj-kr-tharu/Ecommerce-fortend) |
| **Backend (This Repo)** | Microservices backend, API Gateway, CI/CD & K8s manifests | *(current repository)* |

---

## 📑 Table of Contents

1. [Tech Stack](#-tech-stack)
2. [High-Level Architecture](#-high-level-architecture)
3. [Frontend Showcase](#-frontend-showcase)
4. [CI/CD Pipeline — Jenkins](#-cicd-pipeline--jenkins)
5. [Live Deployment](#-live-deployment)
6. [Kubernetes Orchestration](#-kubernetes-orchestration)
7. [Horizontal Pod Autoscaling (HPA)](#-horizontal-pod-autoscaling-hpa)
8. [Ingress, Pods & Services](#-ingress-pods--services)
9. [Repository Structure](#-repository-structure)
10. [Services Overview](#-services-overview)
11. [Inter-Service Communication](#-inter-service-communication)
12. [Authentication & Authorization](#-authentication--authorization)
13. [Data Consistency Strategy](#-data-consistency-strategy)
14. [Design Patterns Used](#-design-patterns-used)
15. [Request Lifecycle](#-request-lifecycle-order--payment--notification)
16. [Payment Gateways](#-payment-gateways)
17. [Email & Notifications](#-email--notifications)
18. [Getting Started](#-getting-started)
19. [Environment Variables](#-environment-variables)
20. [API Routes](#-api-routes-via-gateway)
21. [Observability & Troubleshooting](#-observability--troubleshooting)
22. [Roadmap](#-roadmap--improvements)

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 18+, Express.js |
| **Database** | PostgreSQL 14+ (database-per-service), Sequelize ORM |
| **Message Broker** | RabbitMQ (AMQP 0-9-1, direct exchange) |
| **Cache** | Redis 6+ (template cache, 24h TTL) |
| **Authentication** | JWT (access + refresh rotation), bcrypt |
| **Payments** | Stripe, eSewa, Khalti, Cash on Delivery |
| **Email** | Nodemailer (SMTP) + node-cron scheduler |
| **Storage / CDN** | AWS S3 |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (Deployments, StatefulSets, Services, HPA, Ingress) |
| **CI/CD** | Jenkins (multi-stage declarative pipeline) |
| **Ingress Controller** | NGINX Ingress |
| **Observability** | Morgan, `http-proxy-middleware` debug logs |

---

## 🏛 High-Level Architecture

```
                                  ┌────────────────────────┐
                                  │      Frontend (Web)    │
                                  └───────────┬────────────┘
                                              │ HTTPS + JWT (x-access-token)
                                              ▼
                                ┌──────────────────────────────┐
                                │     01 · API Gateway         │
                                │  (Express + http-proxy-mw)   │
                                │  • CORS · Rate-limit · Morgan│
                                │  • JWT verify (role based)   │
                                │  • Injects x-internal-token  │
                                └───┬─────────┬─────────┬──────┘
                                    │  HTTP   │  HTTP   │  HTTP
                ┌───────────────────┘         │         └───────────────────┐
                ▼                             ▼                             ▼
      ┌──────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
      │ 02 · Auth Svc    │      │ 03 · Ecommerce Svc   │      │ 05 · Payment Svc     │
      │  Users / JWT /   │      │ Products / Cart /    │      │ Stripe / eSewa /     │
      │  Refresh Tokens  │      │ Orders / Checkout    │      │ Khalti / COD         │
      │  PostgreSQL      │      │ PostgreSQL + axios   │      │ PostgreSQL + Stripe  │
      └────────┬─────────┘      └──────────┬───────────┘      └──────────┬───────────┘
               │                           │                             │
               │   AMQP publish            │   AMQP publish              │   AMQP publish
               │   (USER_EVENT_EMIT,       │   (CREATE_NOTIFICATION)     │   (CREATE_NOTIFICATION)
               │    CREATE_NOTIFICATION)   │                             │
               └───────────────┬───────────┴─────────────┬───────────────┘
                               ▼                         ▼
                   ┌────────────────────────────────────────────┐
                   │           🐇  RabbitMQ (direct exchange)    │
                   │        binding key: REMINDER_BINDING_KEY    │
                   └───────────────┬────────────────────────────┘
                                   │  consume
                                   ▼
                        ┌─────────────────────────────┐
                        │  04 · Remainder (Notifier)  │
                        │  • node-cron scheduler      │
                        │  • Nodemailer (SMTP)        │
                        │  • Redis template cache     │
                        │  • PostgreSQL               │
                        └─────────────────────────────┘
```

- **North–South traffic** (client → backend) always enters through the **API Gateway**.
- **East–West traffic** (service → service) uses either:
  - **Synchronous**: `axios` HTTP calls over the internal network (hardened with an `x-internal-server-token` shared secret).
  - **Asynchronous**: **RabbitMQ direct exchange** via `amqplib` (fan-out events using a single binding key with a `service` discriminator in the payload).

---

## 🖥 Frontend Showcase

> Frontend repository: **[Saroj-kr-tharu/Ecommerce-fortend](https://github.com/Saroj-kr-tharu/Ecommerce-fortend)**

### 🏠 Home & Landing Pages
<p align="center">
  <img src="Images/home1.jpg" alt="Home page" width="48%" />
  <img src="Images/home2.jpg" alt="Home page" width="48%" />
</p>
<p align="center">
  <img src="Images/home3.jpg" alt="Home page" width="48%" />
  <img src="Images/home4.jpg" alt="Home page" width="48%" />
</p>
<p align="center">
  <img src="Images/home5.jpg" alt="Home page" width="48%" />
  <img src="Images/home6.jpg" alt="Home page" width="48%" />
</p>
<p align="center">
  <img src="Images/home7.jpg" alt="Home page" width="48%" />
  <img src="Images/home8.jpg" alt="Home page" width="48%" />
</p>

### 🔐 Authentication — Login & Register
<p align="center">
  <img src="Images/login1.jpg" alt="Login" width="48%" />
  <img src="Images/login2.jpg" alt="Login" width="48%" />
</p>
<p align="center">
  <img src="Images/register1.jpg" alt="Register" width="48%" />
  <img src="Images/register2.jpg" alt="Register" width="48%" />
</p>

### 🛍 Product Catalog
<p align="center">
  <img src="Images/product1.jpg" alt="Product listing" width="48%" />
  <img src="Images/product2.jpg" alt="Product detail" width="48%" />
</p>
<p align="center">
  <img src="Images/product3.jpg" alt="Product" width="48%" />
  <img src="Images/product4.jpg" alt="Product" width="48%" />
</p>
<p align="center">
  <img src="Images/product5.jpg" alt="Product" width="48%" />
  <img src="Images/product6.jpg" alt="Product" width="48%" />
</p>
<p align="center">
  <img src="Images/product7.jpg" alt="Product" width="60%" />
</p>

### 🛒 Shopping Cart
<p align="center">
  <img src="Images/cart1.jpg" alt="Cart" width="48%" />
  <img src="Images/cart2.jpg" alt="Cart" width="48%" />
</p>
<p align="center">
  <img src="Images/cart3.jpg" alt="Cart" width="48%" />
  <img src="Images/cart4.jpg" alt="Cart" width="48%" />
</p>

### 💳 Checkout Flow
<p align="center">
  <img src="Images/checkout1.jpg" alt="Checkout step 1" width="48%" />
  <img src="Images/checkout2.jpg" alt="Checkout step 2" width="48%" />
</p>
<p align="center">
  <img src="Images/checkout2 (2).jpg" alt="Checkout step 2b" width="48%" />
  <img src="Images/checkout3.jpg" alt="Checkout step 3" width="48%" />
</p>

### 📦 Orders & Order Success
<p align="center">
  <img src="Images/order1.jpg" alt="Orders" width="48%" />
  <img src="Images/order2.jpg" alt="Orders" width="48%" />
</p>
<p align="center">
  <img src="Images/order3.jpg" alt="Orders" width="48%" />
  <img src="Images/order4.jpg" alt="Orders" width="48%" />
</p>
<p align="center">
  <img src="Images/order5.jpg" alt="Orders" width="48%" />
  <img src="Images/order6.jpg" alt="Orders" width="48%" />
</p>
<p align="center">
  <img src="Images/order7.jpg" alt="Orders" width="48%" />
  <img src="Images/order8.jpg" alt="Orders" width="48%" />
</p>
<p align="center">
  <img src="Images/order9.jpg" alt="Orders" width="48%" />
  <img src="Images/ordersucess1.jpg" alt="Order success" width="48%" />
</p>

### 👤 User Profile
<p align="center">
  <img src="Images/user1.jpg" alt="User profile" width="48%" />
  <img src="Images/user2.jpg" alt="User profile" width="48%" />
</p>
<p align="center">
  <img src="Images/user3.jpg" alt="User profile" width="48%" />
  <img src="Images/user4.jpg" alt="User profile" width="48%" />
</p>
<p align="center">
  <img src="Images/user5.jpg" alt="User profile" width="48%" />
  <img src="Images/user6.jpg" alt="User profile" width="48%" />
</p>

### 🛠 Admin Dashboard
<p align="center">
  <img src="Images/admin1.jpg" alt="Admin dashboard" width="48%" />
  <img src="Images/admin2.jpg" alt="Admin dashboard" width="48%" />
</p>
<p align="center">
  <img src="Images/admin3.jpg" alt="Admin dashboard" width="60%" />
</p>

### 🎨 Banner Management
<p align="center">
  <img src="Images/banner1.jpg" alt="Banner" width="48%" />
  <img src="Images/banner2.jpg" alt="Banner" width="48%" />
</p>
<p align="center">
  <img src="Images/banner3.jpg" alt="Banner" width="48%" />
  <img src="Images/banner4.jpg" alt="Banner" width="48%" />
</p>

---

## 🔄 CI/CD Pipeline — Jenkins

A fully automated **Jenkins declarative pipeline** orchestrates the end-to-end delivery workflow: source checkout → dependency install → Docker image build → registry push → Kubernetes rollout.

**Pipeline stages:**

1. 🧾 **Checkout** — pull latest commit from Git
2. 📦 **Install dependencies** — `npm ci` per microservice
3. 🧪 **Lint & test** *(optional stage)*
4. 🐳 **Docker build** — build images for all 5 microservices
5. 🔐 **Docker login** — authenticate to Docker Hub
6. 📤 **Push images** — publish `sarojdockerworkspace/marketmandu-*:latest`
7. ☸️ **Deploy to Kubernetes** — `kubectl apply -f k8s/` & rolling update
8. ✅ **Post-deploy health checks**

<p align="center">
  <img src="Images/jenkins 1.jpg" alt="Jenkins pipeline overview" width="48%" />
  <img src="Images/jenkins 2 .jpg" alt="Jenkins build stage" width="48%" />
</p>
<p align="center">
  <img src="Images/jenkins 3 .jpg" alt="Jenkins stage view" width="48%" />
  <img src="Images/jenkins 4 .jpg" alt="Jenkins console output" width="48%" />
</p>
<p align="center">
  <img src="Images/jenkins 5.jpg" alt="Jenkins build history" width="48%" />
  <img src="Images/jenkins 6 .jpg" alt="Jenkins Docker build" width="48%" />
</p>
<p align="center">
  <img src="Images/jenkins 7.jpg" alt="Jenkins Docker push" width="48%" />
  <img src="Images/jenkins 8.jpg .jpg" alt="Jenkins K8s deploy" width="48%" />
</p>
<p align="center">
  <img src="Images/jenkins 9.jpg" alt="Jenkins pipeline success" width="48%" />
  <img src="Images/jenkins 10.jpg" alt="Jenkins artifact" width="48%" />
</p>
<p align="center">
  <img src="Images/jenkins 11.jpg" alt="Jenkins logs" width="48%" />
  <img src="Images/jenkins 12.jpg" alt="Jenkins dashboard" width="48%" />
</p>

> The full pipeline definition lives in the root [`Jenkinsfile`](./Jenkinsfile).

---

## 🌐 Live Deployment

The platform is deployed on a Kubernetes cluster and exposed through an NGINX Ingress controller on a public IP with `nip.io` DNS.

<p align="center">
  <img src="Images/live 1 .jpg" alt="Live deployment – production frontend" width="90%" />
</p>
<p align="center">
  <img src="Images/live 2 .jpg" alt="Live deployment – browsing live site" width="90%" />
</p>

---

## ☸️ Kubernetes Orchestration

All 5 microservices plus stateful dependencies (PostgreSQL, RabbitMQ, Redis) run on Kubernetes under the `marketmandu-ns` namespace.

**Cluster workload composition:**

| Kind | Resources |
|------|-----------|
| **Deployment** | `apigateway-dep`, `auth-dep`, `ecomerce-dep`, `payment-dep`, `remainder-dep` |
| **StatefulSet** | `postgres-dep`, `rabbitmq-dep`, `redis-dep` |
| **Service** | ClusterIP services for every workload + headless services for StatefulSets |
| **ConfigMap** | Per-service env config (`mm-*-config`) |
| **Secret** | Payment gateway keys (Stripe / eSewa / Khalti) |
| **PVC** | Persistent volumes for Postgres, RabbitMQ, Redis |
| **HPA** | Autoscalers on CPU utilization for every stateless service |
| **Ingress** | Single NGINX ingress routing `/server/*` → API Gateway, `/*` → Frontend |

<p align="center">
  <img src="Images/kind 1 .jpg" alt="Kind cluster up" width="90%" />
</p>
<p align="center">
  <img src="Images/kube1.jpg" alt="kubectl get all – workloads" width="90%" />
</p>
<p align="center">
  <img src="Images/kube 2 .jpg" alt="kubectl describe / pods running" width="90%" />
</p>
<p align="center">
  <img src="Images/kube 3 .jpg" alt="kubectl namespaces & resources" width="90%" />
</p>

> All manifests live under [`k8s/`](./k8s). Apply the stack with:
>
> ```bash
> kubectl apply -f k8s/00_namespace.yml
> kubectl apply -R -f k8s/
> ```

---

## 📈 Horizontal Pod Autoscaling (HPA)

Each stateless service is backed by an **HPA** that scales replicas based on CPU utilization, with tuned stabilization windows and scale-down policies to prevent thrashing.

**Example HPA configuration (shared across services):**

```yaml
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 30
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 30
      policies:
      - type: Percent
        value: 1
        periodSeconds: 15
```

<p align="center">
  <img src="Images/hpa 1 .jpg" alt="kubectl get hpa – autoscaler status" width="90%" />
</p>

> HPA manifests: [`k8s/apiGateway/03_apigateway-hpa.yml`](./k8s/apiGateway/03_apigateway-hpa.yml), [`k8s/auth/03_auth-hpa.yml`](./k8s/auth/03_auth-hpa.yml), [`k8s/ecomerce/03_ecomerce-hpa.yml`](./k8s/ecomerce/03_ecomerce-hpa.yml), [`k8s/payment/03_payment-hpa.yml`](./k8s/payment/03_payment-hpa.yml), [`k8s/remainder/03_remainder-hpa.yml`](./k8s/remainder/03_remainder-hpa.yml).

---

## 🌍 Ingress, Pods & Services

### 🚪 Ingress — Single Entry Point

The NGINX Ingress controller routes external traffic to the correct backend:

| Path | Backend | Purpose |
|------|---------|---------|
| `/server/*` | `apigateway-svc:3000` | All API traffic |
| `/*` | `fortend-svc:80` | Frontend SPA |

<p align="center">
  <img src="Images/ingress 1 .jpg" alt="kubectl get ingress" width="90%" />
</p>

### 📦 Pods Running

All workload pods in a healthy `Running` / `Ready` state.

<p align="center">
  <img src="Images/kube1.jpg" alt="kubectl get pods" width="90%" />
</p>

### 🔌 Services

ClusterIP services fronting each deployment + headless services (`clusterIP: None`) for StatefulSets.

<p align="center">
  <img src="Images/kube 2 .jpg" alt="kubectl get svc – services running" width="90%" />
</p>

### 💾 Persistent Volume Claims

Stateful workloads (Postgres, RabbitMQ, Redis) are backed by bound PVCs.

<p align="center">
  <img src="Images/pvc 1 .jpg" alt="kubectl get pvc" width="90%" />
</p>

---

## 📁 Repository Structure

```
01_Backend/
├── 01_ApiGateway/              # Reverse proxy / edge service
│   └── src/
│       ├── index.js                 # Express bootstrap (CORS, rate-limit, morgan)
│       ├── routes/                  # auth / ecommerce / payment / remainder proxies
│       ├── middlewares/             # JWT verify (verifyAdmin / verifyUser / verifyToken)
│       └── serverConfig/            # .env loader
│
├── 02_Auth_microservice/       # Identity & access
│   └── src/
│       ├── controllers/ services/ repository/ models/ migrations/ seeders/ Routes/
│       ├── middlewares/             # user + internal-service token guards
│       └── utlis/                   # bcrypt, jwt, amqp, errors, responses
│
├── 03_Ecomerce/                # Core domain (products, cart, orders)
│   └── src/
│       ├── controllers/   (admin.ctrl / custumer.ctrl)
│       ├── services/      (orders, cart, products, queue, user-sync, s3, banner)
│       ├── repository/    (CURD base + per-aggregate repos)
│       ├── models/        (User-mirror, Product, Cart, CartItem, Order, OrderItem, Banner, IdempotencyKey)
│       └── utlis/messageQueue.js    # amqp producer + consumer helpers
│
├── 04_Remainder_microservice/  # Async notifications / email scheduler
│   └── src/
│       ├── Controllers/   (template CRUD)
│       ├── Services/      (notification, template, remainder-consumer)
│       ├── utlis/jobsSchedule.js    # node-cron: poll PENDING → send SMTP → mark SENT
│       └── config/redis.config.js   # template cache
│
├── 05_Payment_microservice/    # Payments
│   └── src/
│       ├── Controllers/   (cod / esewa / khalti / stripe)
│       ├── Services/      (gateway-specific + transaction persistence)
│       ├── Middlewares/   (gateway-specific validators + internal-token)
│       └── config/        (esewa / khalti / stripe / stripeConnect)
│
├── k8s/                        # Kubernetes manifests
│   ├── 00_cluster.yml  00_ingress.yml  00_namespace.yml
│   ├── apiGateway/ auth/ ecomerce/ payment/ remainder/
│   └── postgres/ rabbitmq/ redis/
│
├── Images/                     # Screenshots & pipeline captures
├── Jenkinsfile                 # Declarative CI/CD pipeline
└── README.md
```

Each service follows the same layered convention:

```
Route  →  Middleware  →  Controller  →  Service  →  Repository  →  Model (Sequelize)
```

---

## 🧩 Services Overview

| # | Service | Responsibility | DB | Key Deps |
|---|---------|----------------|----|----------|
| 01 | **API Gateway** | Single entry point, routing, rate-limit, CORS, JWT pre-auth, proxy injection | — | `express`, `http-proxy-middleware`, `express-rate-limit`, `morgan`, `jsonwebtoken` |
| 02 | **Auth** | Signup / Login / Logout, access + refresh JWT rotation, user & role CRUD | PostgreSQL | `bcrypt`, `jsonwebtoken`, `sequelize`, `amqplib`, `cookie-parser` |
| 03 | **Ecommerce** | Products, Cart, Orders, Checkout orchestration, Banners, S3 uploads | PostgreSQL | `sequelize`, `axios`, `amqplib`, `uuid`, `@aws-sdk/client-s3` |
| 04 | **Remainder** | Email templating + delivery, scheduled retries, cache-warmed templates | PostgreSQL + Redis | `node-cron`, `nodemailer`, `redis`, `amqplib` |
| 05 | **Payment** | Unified facade for Stripe, eSewa, Khalti, COD; persists `paymentTransactions` | PostgreSQL | `stripe`, `axios`, `amqplib`, `crypto` |

---

## 🔁 Inter-Service Communication

### 1️⃣ Synchronous — HTTP (Axios) through the Gateway

Used when a service needs an **immediate, authoritative response** (e.g. product price during checkout, user email when confirming an order).

```js
// 03_Ecomerce/src/services/orders.service.js  (completeOrderService)
const link = `${APIGATEWAY_BACKEND_URL}/auth/email/${result.dataValues.userId}`;
const user = await axios.get(link);
```

```js
// 05_Payment_microservice/src/Services/stripe.svc.js (intializePaymentService)
const linkRes = `${APIGATEWAY_BACKEND_URL}/ecommerce/product?id=${item.productId}`;
const response = await axios.get(linkRes);
```

All east-west HTTP is **routed back through the API Gateway**, which in turn forwards to the target service and **stamps** the shared internal-service token:

```js
// 01_ApiGateway/src/routes/ecommerce.routes.js
const ecommerceProxy = createProxyMiddleware({
  target: ECOMMERCE_BACKEND_URL,
  changeOrigin: true,
  headers: { "x-internal-server-token": INTERNAL_SERVER_TOKEN },
});
```

Each downstream service validates this header:

```js
// 05_Payment_microservice/src/Middlewares/internal.service.mw.js
if (req.headers["x-internal-server-token"] != INTERNAL_SERVER_TOKEN) {
  return res.status(401).json({ message: "Unauthorized", success: false });
}
```

### 2️⃣ Asynchronous — RabbitMQ (AMQP) Direct Exchange

Used for **fire-and-forget events** and **cross-service state synchronization**.

- **Exchange**: `EXCHANGE_NAME` (type: `direct`, durable)
- **Binding key**: `REMINDER_BINDING_KEY`
- **Queues** (per consumer):
  - `ECOOMERCE_QUEUE` — consumed by the Ecommerce service (for user-sync events)
  - `REMAINDER_QUEUE` — consumed by the Remainder service (for notifications)

A **single binding key** is used; the `service` field inside the payload acts as the **event discriminator** (mini CloudEvents style):

```js
// Producer (any service)
const payload = { data: {...}, service: 'CREATE_NOTIFICATION' };
publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
```

```js
// Consumer (remainder.service.js)
switch (payload.service) {
  case "CREATE_NOTIFICATION":
    await notificationService.createService(payload.data);
    break;
}
```

| Event (`service`) | Publisher | Consumer | Purpose |
|---|---|---|---|
| `USER_EVENT_EMIT` (`USER_REGISTERED` / `UPDATE_USER_SINGLE` / `UPDATE_USER_BULK`) | Auth | Ecommerce | Replicate minimal user projection into the Ecommerce DB (eventual consistency) |
| `CREATE_NOTIFICATION` | Auth / Ecommerce / Payment | Remainder | Persist a pending email record; cron dispatches it |

Consumer connection is **resilient** — on broker failure it auto-reconnects with a 5-second back-off.

---

## 🔐 Authentication & Authorization

Two independent token systems operate side-by-side:

### A. End-user auth — JWT (access + refresh)

- **Access token** in header `x-access-token` (short-lived).
- **Refresh token** in `httpOnly`, `secure`, `sameSite=strict` cookie (7-day TTL) — also persisted on `User.refreshToken` in DB to enable **server-side revocation / rotation**.
- The Gateway exposes three guards:
  - `verifyAdmin` — full JWT verification + role check (`role === 'ADMIN'`)
  - `verifyUser` — full JWT verification + role check (`role === 'CUSTOMER'`)
  - `verifyToken` — **presence-only check** (full verification tracked in the Roadmap).

### B. Service-to-service auth — Shared secret

Every internal endpoint validates `x-internal-server-token` via `InternalServiceMiddleware.verifyToken`. This prevents any downstream service from being reached directly, even from within the cluster.

---

## 🧮 Data Consistency Strategy

Each service owns **its own database** (Database-per-Service). Global ACID transactions are intentionally avoided; consistency is layered:

### 1. Strong (ACID) consistency — *inside a single service*

Sequelize managed transactions for multi-row atomic ops. Example: `completeOrderService`:

```js
const transaction = await sequelize.transaction();
try {
  await Orders_Repo.updateOrdersByOrderNo(changes, orderNO, { transaction });
  for (const item of result.OrderItems) {
    await Product_Repo.deincreaceQunatity(item.productId, item.quantity, { transaction });
    await CartItem.update({ selected: true }, { where: {...}, transaction });
  }
  await transaction.commit();
} catch (err) {
  await transaction.rollback();
  throw err;
}
```

### 2. Eventual consistency — *across services*

User data lives authoritatively in **Auth** but is **projected** into **Ecommerce** (so Orders can `belongsTo(User)` locally without a synchronous call on every read). On every user mutation, Auth publishes a `USER_EVENT_EMIT` event → Ecommerce reconciles via `upsertData` / `userUpdateById` / `bulkUpdateUserId`.

### 3. Choreographed Saga — *Order → Payment → Notification*

| Step | Actor | Action | On Failure |
|---|---|---|---|
| 1 | Ecommerce | Create `Order` + `OrderItems` (tx) with `paymentStatus=pending` | Rollback local tx |
| 2 | Ecommerce | `axios.post` → Payment `/initialize-*` | Order remains `pending`; user can retry |
| 3 | Payment | Create `paymentTransaction` (`PENDING`) + return gateway redirect URL | — |
| 4 | Gateway / Client | User completes payment on gateway | Cancel URL → `FAILED` status path |
| 5 | Payment | On callback: verify signature → update `SUCCESS` → redirect to Ecommerce `/orders/orderFinal` | Mark `FAILED`; publish failure notification |
| 6 | Ecommerce | `completeOrderService` — tx: set `paid` + `confirmed`, decrement stock, flag cart items | Rollback; surfaced for manual reconciliation |
| 7 | Ecommerce | Publish `CREATE_NOTIFICATION` to RabbitMQ | Message is durably queued; retried by broker |
| 8 | Remainder | Persist `Notification (PENDING)` | — |
| 9 | Remainder cron (every 1 min) | Send via SMTP → mark `SENT` | Stays `PENDING` → retried next tick |
| 10 | Remainder cron (every 2 min) | Delete `SENT` rows (GC) | — |

### 4. Idempotency & de-duplication

- `orderNumber` (`"ORD" + Date.now()`) and `transactionId` (UUID v4 / Stripe session id) are **unique**.
- `paymentTransaction.transactionId` has a `unique` constraint.
- Dedicated `IdempotencyKey` table in the Ecommerce service.

### 5. Cache consistency

- The Remainder service caches notification templates in **Redis** with a 24h TTL (`EX: 86400`).

---

## 🧠 Design Patterns Used

| Layer | Pattern | Where |
|---|---|---|
| **Architectural** | API Gateway / BFF | `01_ApiGateway` |
| | Microservices + Database-per-Service | all services |
| | Event-Driven Architecture (pub/sub) | RabbitMQ direct exchange |
| | Choreography Saga | Order → Payment → Notification flow |
| | Materialized View / CQRS-lite | Auth → Ecommerce user projection |
| **Structural** | Layered architecture | every service |
| | Repository pattern + generic base | `CURD_REPO` / `CurdService` |
| | Adapter pattern | Stripe / eSewa / Khalti / COD behind uniform interface |
| | Proxy pattern | `http-proxy-middleware` |
| **Behavioral** | Strategy pattern | `paymentIntialize` switches gateway by `data.gateway` |
| | Chain of Responsibility | Express middleware chain |
| | Publish–Subscribe | AMQP helpers |
| **Reliability** | Retry with back-off | `createChannel` auto-retry every 5s |
| | Circuit-breaker-ready boundary | axios calls localized in services |
| **Security** | Zero-trust internal traffic | `x-internal-server-token` |
| | Refresh-token rotation + server-side revocation | `User.refreshToken` |
| **Ops** | 12-factor config | `dotenv` in each service |
| | Containerization | Dockerfile per service |
| **Error handling** | Typed error hierarchy | `AppError`, `ServiceError`, `ValidationError` |
| | `asyncHandler` wrapper | removes `try/catch` boilerplate |

---

## 🔄 Request Lifecycle (Order → Payment → Notification)

```
Client  ──POST /ecommerce/orders/orderIntial──▶  Gateway  ──▶  Ecommerce
                                                                   │ (tx) create Order+OrderItems
                                                                   │ axios.post → Gateway → Payment
                                                                   ▼
                                                              Payment.initialize
                                                                   │ create paymentTransaction(PENDING)
                                                                   │ returns redirectUrl
                                                                   ▼
Client ◀───── redirect to Stripe/eSewa/Khalti hosted page ────────

Gateway callback ──▶ Payment.complete
                        │ verify signature / session
                        │ paymentTransaction = SUCCESS
                        │ redirect to Ecommerce /orders/orderFinal
                        ▼
                  Ecommerce.completeOrderService
                        │ (tx) Order=paid/confirmed, stock-- , cart flag
                        │ publish CREATE_NOTIFICATION  ──▶  RabbitMQ
                        ▼
                  Remainder.subscribeEvent
                        │ Notification(PENDING) saved
                        ▼
                  cron */1 * * * *  →  SMTP send → Notification=SENT
                  cron */2 * * * *  →  GC sent rows
```

---

## 💰 Payment Gateways

Four payment providers are integrated behind a uniform facade.

### Stripe
<p align="center">
  <img src="Images/stripe1.jpg" alt="Stripe checkout" width="48%" />
  <img src="Images/stripe2.jpg" alt="Stripe payment" width="48%" />
</p>
<p align="center">
  <img src="Images/stripe3.jpg" alt="Stripe success" width="48%" />
  <img src="Images/stripe4.jpg" alt="Stripe dashboard" width="48%" />
</p>
<p align="center">
  <img src="Images/stripe5.jpg" alt="Stripe transaction" width="60%" />
</p>

### Khalti
<p align="center">
  <img src="Images/khalti1.jpg" alt="Khalti" width="48%" />
  <img src="Images/khalti2.jpg" alt="Khalti" width="48%" />
</p>
<p align="center">
  <img src="Images/khalti3.jpg" alt="Khalti" width="48%" />
  <img src="Images/khalti4.jpg" alt="Khalti" width="48%" />
</p>

### eSewa
<p align="center">
  <img src="Images/esewa1.jpg" alt="eSewa checkout" width="70%" />
</p>

---

## ✉️ Email & Notifications

The Remainder service sends transactional emails (order confirmation, shipping updates, etc.) using templated SMTP delivery.

<p align="center">
  <img src="Images/email1.jpg" alt="Email" width="48%" />
  <img src="Images/email2.jpg" alt="Email" width="48%" />
</p>
<p align="center">
  <img src="Images/email3.jpg" alt="Email" width="48%" />
  <img src="Images/email4.jpg" alt="Email" width="48%" />
</p>
<p align="center">
  <img src="Images/email5.jpg" alt="Email" width="48%" />
  <img src="Images/email6.jpg" alt="Email" width="48%" />
</p>

### 🪣 S3 & CDN

Product images, banners, and user assets are stored in **AWS S3** and served via CDN.

<p align="center">
  <img src="Images/s31.jpg" alt="S3 bucket" width="90%" />
</p>
<p align="center">
  <img src="Images/cdn1.jpg" alt="CDN" width="48%" />
  <img src="Images/cdn2.jpg" alt="CDN" width="48%" />
</p>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 18**
- **PostgreSQL ≥ 14** (one database per service, or one instance with 4 schemas)
- **RabbitMQ ≥ 3.11** (`amqp://localhost:5672` by default)
- **Redis ≥ 6** (used by Remainder service)
- *Optional:* Docker + Docker Compose, Kubernetes (Kind / Minikube / EKS / GKE)

### Clone & install

```bash
git clone <backend-repo-url>
cd 01_Backend

for dir in 01_ApiGateway 02_Auth_microservice 03_Ecomerce 04_Remainder_microservice 05_Payment_microservice; do
  (cd "$dir" && npm install)
done
```

Clone the frontend separately:

```bash
git clone https://github.com/Saroj-kr-tharu/Ecommerce-fortend.git
cd Ecommerce-fortend && npm install && npm run dev
```

### Migrate & seed

```bash
cd 02_Auth_microservice && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
cd ../03_Ecomerce       && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
cd ../04_Remainder_microservice && npx sequelize-cli db:migrate
cd ../05_Payment_microservice   && npx sequelize-cli db:migrate
```

### Run locally (5 terminals)

```bash
cd 02_Auth_microservice       && npm start   # Auth
cd 03_Ecomerce                && npm start   # Ecommerce
cd 04_Remainder_microservice  && npm start   # Remainder (cron + consumer)
cd 05_Payment_microservice    && npm start   # Payment
cd 01_ApiGateway              && npm start   # Gateway (last)
```

### Run with Docker

Each service ships a `Dockerfile`. Build and publish with:

```bash
docker build -t sarojdockerworkspace/marketmandu-apigateway:latest ./01_ApiGateway
# repeat for auth / ecomerce / remainder / payment
docker push sarojdockerworkspace/marketmandu-apigateway:latest
```

### Deploy to Kubernetes

```bash
kubectl apply -f k8s/00_namespace.yml
kubectl apply -R -f k8s/
kubectl get pods -n marketmandu-ns
kubectl get svc,ingress,hpa -n marketmandu-ns
```

### Health-checks

```
GET /check            → Gateway itself
GET /auth/check       → Auth
GET /ecommerce/check  → Ecommerce
GET /payment/check    → Payment
GET /remainder/check  → Remainder
```

---

## 🔧 Environment Variables

> Every service reads a local `.env` through `dotenv` in `config/server.config.js` (or `config/serverConfig.js`). Kubernetes equivalents live in `k8s/<service>/00_*_configMaps.yml` and as Secrets for payment keys.

**Shared across services**
```dotenv
INTERNAL_SERVER_TOKEN=change-me-shared-secret
EXCHANGE_NAME=ECOMM_EXCHANGE
REMINDER_BINDING_KEY=ECOMM_NOTIFICATION
MESSAGE_BROKER_URL=amqp://guest:guest@rabbitmq-svc:5672
PRIVATEJWT=super-secret-access-jwt
PRIVATEJWTRefersh=super-secret-refresh-jwt
```

**01 · API Gateway**
```dotenv
PORT=3000
FORTEND_URL=http://localhost:5173
AUTH_BACKEND_URL=http://auth-svc:3001/api/v1
ECOMMERCE_BACKEND_URL=http://ecomerce-svc:3002/api
PAYMENT_BACKEND_URL=http://payment-svc:3009/api
REMINDER_BACKEND_URL=http://remainder-svc:3003/api
```

- **02 · Auth** — `PORT`, `DB_*`, `EMAIL_ID`, `EMAIL_PASS`, `salt`
- **03 · Ecommerce** — `PORT`, `DB_*`, `APIGATEWAY_BACKEND_URL`, `PAYMENT_BACKEND_URL`, `ECOOMERCE_QUEUE`, AWS S3 creds
- **04 · Remainder** — `PORT`, `DB_*`, `REDIS_URL`, `EMAIL_SENDER`, `EMAIL_ID`, `EMAIL_PASS`, `REMAINDER_QUEUE`
- **05 · Payment** — `PORT`, `DB_*`, `STRIPE_SECRET_KEY`, `STRIPE_SUCCESS_URL`, `STRIPE_FAILED_URL`, `ESEWA_*`, `KHALTI_*`, `ECOMMERCE_BACKEND_URL`, `APIGATEWAY_BACKEND_URL`

---

## 🌐 API Routes (via Gateway)

### Auth (`/auth/*`)
| Method | Path | Guard |
|---|---|---|
| POST | `/auth/signup` | — |
| POST | `/auth/login` | — |
| POST | `/auth/refresh-token` | cookie |
| POST | `/auth/logout` | cookie |
| GET  | `/auth/email/:userId` | internal-token (stamped by gateway) |
| GET/PATCH | `/auth/users…` | `verifyAdmin` |

### Ecommerce (`/ecommerce/*`)
| Method | Path | Guard |
|---|---|---|
| GET  | `/ecommerce/products` · `/product` | public |
| POST/PATCH/DELETE | `/ecommerce/products/**` | `verifyAdmin` |
| POST | `/ecommerce/orders/addOrder` · `/orderIntial` | `verifyUser` |
| GET  | `/ecommerce/orders/getByUser` | `verifyToken` |
| GET  | `/ecommerce/orders/orderByNO/:OrderNo` | `verifyAdmin` |
| *    | `/ecommerce/cart/**` | `verifyUser` |
| *    | `/ecommerce/banners/**` | `verifyAdmin` (mutations) / public (reads) |

### Payment (`/payment/*`)
`initialize-esewa`, `epayment/initiate`, `stripe-initiate`, `cod-initiate` (user) + gateway callback GETs.

### Remainder (`/remainder/*`)
`/template` CRUD — `verifyAdmin`.

---

## 🔎 Observability & Troubleshooting

- **HTTP logs**: `morgan("combined")` on the Gateway.
- **Proxy debugging**: `http-proxy-middleware` runs with `logLevel: "debug"`.
- **AMQP issues**: check RabbitMQ management UI (`:15672`). Consumer prints `Failed to connect with rabbitmq` and retries every 5s.
- **Stuck emails**: rows in `Notifications` with `status='PENDING'` older than 2 cron ticks indicate SMTP failure.
- **Stuck orders** (`paymentStatus='pending'` but `paymentTransactions.status='SUCCESS'`): replay `completeOrderService` manually using `orderNO` + `trans_id`.
- **401 from internal endpoints**: `x-internal-server-token` mismatch — confirm every service shares the same `INTERNAL_SERVER_TOKEN`.
- **Kubernetes pod diagnostics**:
  ```bash
  kubectl logs -f <pod> -n marketmandu-ns
  kubectl describe pod <pod> -n marketmandu-ns
  kubectl top pods -n marketmandu-ns
  ```

---

## 🗺 Roadmap / Improvements

- [ ] **Root `docker-compose.yml`** including Postgres / RabbitMQ / Redis + wait-for-it healthchecks
- [ ] **Central `.env.example`** per service
- [ ] **DLX + DLQ** for poison messages in RabbitMQ
- [ ] **Outbox pattern** in Ecommerce & Payment to guarantee "DB commit ⇒ event publish"
- [ ] **Circuit breaker** (`opossum`) around every `axios` call
- [ ] **Correlation-id** (`x-request-id`) propagation for distributed tracing (OpenTelemetry)
- [ ] **Jest** + **Supertest** suites per service + `npm test` scripts
- [ ] **Helm chart** packaging of current K8s manifests
- [ ] **At-least-once AMQP consumer** — `await service(payload)` before `channel.ack`, with `channel.nack` + DLX on failure
- [ ] **Full JWT verification in gateway `verifyToken`** (currently presence-only)
- [ ] **Prometheus + Grafana** dashboards wired to HPA CPU metrics

---

## 🧾 Note on Identifier Spelling

The codebase contains several intentional typos that are part of the public API / filenames and must **not** be "fixed" blindly: `utlis` (utils), `Remainder` (reminder), `FORTEND_URL` (frontend), `custumer` (customer), `intialize` (initialize), `ECOOMERCE_QUEUE`, `deincreaceQunatity`. Renaming them requires a coordinated change across services, env files, and queue names.

---

## 📄 License

ISC © MarketMandu

## 👤 Maintainer

**Saroj Kumar Tharu**
- Frontend repo: [Saroj-kr-tharu/Ecommerce-fortend](https://github.com/Saroj-kr-tharu/Ecommerce-fortend)
- Docker Hub: [`sarojdockerworkspace`](https://hub.docker.com/u/sarojdockerworkspace)

> Open an issue or PR — contributions welcome.
