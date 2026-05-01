# 🛒 MarketMandu — E-commerce Microservices Backend

A production-style, **polyglot-persistence e-commerce backend** built on a **microservices architecture** with an **API Gateway**, **event-driven messaging (RabbitMQ)**, **synchronous HTTP (Axios)**, and **database-per-service (PostgreSQL + Sequelize)**.

> Stack: **Node.js · Express · Sequelize · PostgreSQL · RabbitMQ (AMQP) · Redis · JWT · Stripe / eSewa / Khalti · Docker**

---

## 📑 Table of Contents

1. [High-Level Architecture](#-high-level-architecture)
2. [Repository Structure](#-repository-structure)
3. [Services Overview](#-services-overview)
4. [Inter-Service Communication](#-inter-service-communication)
5. [Authentication & Authorization](#-authentication--authorization)
6. [Data Consistency Strategy](#-data-consistency-strategy)
7. [Design Patterns Used](#-design-patterns-used)
8. [Request Lifecycle (Order → Payment → Notification)](#-request-lifecycle-order--payment--notification)
9. [Getting Started](#-getting-started)
10. [Environment Variables](#-environment-variables)
11. [API Routes (via Gateway)](#-api-routes-via-gateway)
12. [Observability & Troubleshooting](#-observability--troubleshooting)
13. [Roadmap / Improvements](#-roadmap--improvements)

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
                        │  • PostgreSQL (Notifications│
                        │    + NotificationTemplates) │
                        └─────────────────────────────┘
```

- **North–South traffic** (client → backend) always enters through the **API Gateway**.
- **East–West traffic** (service → service) uses either:
  - **Synchronous**: `axios` HTTP calls over the internal network (hardened with an `x-internal-server-token` shared secret).
  - **Asynchronous**: **RabbitMQ direct exchange** via `amqplib` (fan-out events using a single binding key with a `service` discriminator in the payload).

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
│       ├── services/      (orders, cart, products, queue, user-sync)
│       ├── repository/    (CURD base + per-aggregate repos)
│       ├── models/        (User-mirror, Product, Cart, CartItem, Order, OrderItem)
│       └── utlis/messageQueue.js    # amqp producer + consumer helpers
│
├── 04_Remainder_microservice/  # Async notifications / email scheduler
│   └── src/
│       ├── Controllers/   (template CRUD)
│       ├── Services/      (notification, template, remainder-consumer)
│       ├── utlis/jobsSchedule.js    # node-cron: poll PENDING → send SMTP → mark SENT
│       └── config/redis.config.js   # template cache
│
└── 05_Payment_microservice/    # Payments
    └── src/
        ├── Controllers/   (cod / esewa / khalti / stripe)
        ├── Services/      (gateway-specific + transaction persistence)
        ├── Middlewares/   (gateway-specific validators + internal-token)
        └── config/        (esewa / khalti / stripe / stripeConnect)
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
| 03 | **Ecommerce** | Products, Cart, Orders, Checkout orchestration | PostgreSQL | `sequelize`, `axios`, `amqplib`, `uuid` |
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

Consumer connection is **resilient** — on broker failure it auto-reconnects with a 5-second back-off:

```js
// utlis/messageQueue.js
setTimeout(async () => resolve(await createChannel()), 5000);
```

---

## 🔐 Authentication & Authorization

Two independent token systems operate side-by-side:

### A. End-user auth — JWT (access + refresh)

- **Access token** in header `x-access-token` (short-lived).
- **Refresh token** in `httpOnly`, `secure`, `sameSite=strict` cookie (7-day TTL) — also persisted on `User.refreshToken` in DB to enable **server-side revocation / rotation**.
- The Gateway exposes three guards:
  - `verifyAdmin` — full JWT verification + role check (`role === 'ADMIN'`)
  - `verifyUser` — full JWT verification + role check (`role === 'CUSTOMER'`)
  - `verifyToken` — **presence-only check** (header exists) — current implementation does *not* verify the JWT signature; full verification is tracked in the Roadmap.
- Role-aware guards are applied *before* proxying:

```js
router.post("/orders/addOrder",  userMw.verifyUser,  ecommerceProxy);
router.delete("/products/delete", userMw.verifyAdmin, ecommerceProxy);
```

### B. Service-to-service auth — Shared secret

Every internal endpoint validates `x-internal-server-token` via `InternalServiceMiddleware.verifyToken`. This prevents any downstream service from being reached directly (bypassing the Gateway), even from within the cluster.

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

User data lives authoritatively in **Auth** but is **projected** into **Ecommerce** (so Orders can `belongsTo(User)` locally without a synchronous call on every read).
On every user mutation, Auth publishes a `USER_EVENT_EMIT` event → Ecommerce reconciles via `upsertData` / `userUpdateById` / `bulkUpdateUserId`.

### 3. Choreographed Saga — *Order → Payment → Notification*

The checkout flow is a **choreography-based saga**:

| Step | Actor | Action | On Failure |
|---|---|---|---|
| 1 | Ecommerce | Create `Order` + `OrderItems` (tx) with `paymentStatus=pending` | Rollback local tx |
| 2 | Ecommerce | `axios.post` → Payment `/initialize-*` | Order remains `pending`; user can retry |
| 3 | Payment | Create `paymentTransaction` (`PENDING`) + return gateway redirect URL | — |
| 4 | Gateway / Client | User completes payment on gateway | Cancel URL → `FAILED` status path |
| 5 | Payment | On callback: verify signature → update `SUCCESS` → redirect to Ecommerce `/orders/orderFinal` | Mark `FAILED`; publish failure notification |
| 6 | Ecommerce | `completeOrderService` — tx: set `paid` + `confirmed`, decrement stock, flag cart items | Rollback; transaction remains `SUCCESS` but order `pending` → surfaced for manual reconciliation |
| 7 | Ecommerce | Publish `CREATE_NOTIFICATION` to RabbitMQ | Message is durably queued; retried by broker |
| 8 | Remainder | Persist `Notification (PENDING)` | — |
| 9 | Remainder cron (every 1 min) | Send via SMTP → mark `SENT` | Stays `PENDING` → retried next tick |
| 10 | Remainder cron (every 2 min) | Delete `SENT` rows (GC) | — |

### 4. Idempotency & de-duplication

- `orderNumber` (`"ORD" + Date.now()`) and `transactionId` (UUID v4 / Stripe session id) are **unique** — replayed events cannot create duplicate records.
- `paymentTransaction.transactionId` has a `unique` constraint.
- Consumer calls `channel.ack(msg)` immediately after dispatching the handler (fire-and-forget). **Note:** the ack is not awaited on the handler promise — a failing async handler still acks, so the current implementation is *at-most-once*. Tightening this to *at-least-once* (await handler → ack on success, nack + DLX on failure) is tracked in the Roadmap.

### 5. Cache consistency

- The Remainder service caches notification templates in **Redis** with a 24h TTL (`EX: 86400`). Template mutations invalidate by re-reading at next miss (TTL-based).

---

## 🧠 Design Patterns Used

| Layer | Pattern | Where |
|---|---|---|
| **Architectural** | API Gateway / BFF | `01_ApiGateway` |
| | Microservices + Database-per-Service | all services |
| | Event-Driven Architecture (pub/sub) | RabbitMQ direct exchange |
| | Choreography Saga | Order → Payment → Notification flow |
| | Materialized View / CQRS-lite | Auth → Ecommerce user projection |
| **Structural** | Layered architecture (Route → MW → Ctrl → Svc → Repo → Model) | every service |
| | Repository pattern + generic base class (`CURD_REPO` / `CurdService`) | `03_Ecomerce/src/repository`, `02_Auth_microservice/src/services/curdService.js` |
| | Adapter pattern | `Payment` service wraps Stripe/eSewa/Khalti/COD behind a uniform `intialize / complete / failed` interface |
| | Proxy pattern | `http-proxy-middleware` in the Gateway |
| **Behavioral** | Strategy pattern | `orders.service.js#paymentIntialize` switches gateway by `data.gateway` |
| | Chain of Responsibility | Express middleware chain (`verifyToken → verifyUser → ctrl`) |
| | Publish–Subscribe | AMQP producer/consumer helpers |
| **Reliability** | Retry with back-off | `createChannel` auto-retry every 5s on broker outage |
| | Circuit-breaker-ready boundary | All axios calls are localized in services (easy to wrap with `opossum`) |
| | Dead-letter-ready queue | Manual `ack` + durable exchange (DLX can be added as a single binding) |
| **Security** | Zero-trust internal traffic | `x-internal-server-token` on every internal endpoint |
| | Refresh-token rotation + server-side revocation | `User.refreshToken` column |
| **Ops** | 12-factor config | `dotenv` in each `config/server.config.js` |
| | Containerization | Dockerfile per service (bind-mounted `src/` via nodemon `-L`) |
| **Error handling** | Typed error hierarchy | `AppError`, `ServiceError`, `ValidationError` + central `errorMw` |
| | `asyncHandler` wrapper | removes `try/catch` boilerplate around every controller |

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
                  cron */1 * * * *
                        │ Redis-cached template lookup
                        │ SMTP send → Notification=SENT
                        ▼
                  cron */2 * * * *
                        │ GC sent rows
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 18**
- **PostgreSQL ≥ 14** (one database per service, or one instance with 4 schemas)
- **RabbitMQ ≥ 3.11** (`amqp://localhost:5672` by default)
- **Redis ≥ 6** (used by Remainder service)
- *Optional:* Docker + Docker Compose

### Clone & install

```bash
git clone <repo-url>
cd 01_Backend

for dir in 01_ApiGateway 02_Auth_microservice 03_Ecomerce 04_Remainder_microservice 05_Payment_microservice; do
  (cd "$dir" && npm install)
done
```

### Migrate & seed (per service that has migrations)

```bash
cd 02_Auth_microservice && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
cd ../03_Ecomerce       && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
cd ../04_Remainder_microservice && npx sequelize-cli db:migrate
cd ../05_Payment_microservice   && npx sequelize-cli db:migrate
```

### Run (5 terminals, or with a process manager)

```bash
# Terminal 1
cd 02_Auth_microservice       && npm start        # Auth
# Terminal 2
cd 03_Ecomerce                && npm start        # Ecommerce
# Terminal 3
cd 04_Remainder_microservice  && npm start        # Remainder (cron + consumer)
# Terminal 4
cd 05_Payment_microservice    && npm start        # Payment
# Terminal 5
cd 01_ApiGateway              && npm start        # Gateway (last — needs others up)
```

### Run with Docker

Each service ships a `dockerfile`/`Dockerfile`. Compose the stack with a `docker-compose.yml` at the repo root that provisions **Postgres, RabbitMQ, Redis** plus the five services. Example:

```bash
docker compose up --build
```

### Health-checks

```
GET /auth/check       → Auth
GET /ecommerce/check  → Ecommerce
GET /payment/check    → Payment
GET /remainder/check  → Remainder
GET /check            → Gateway itself
```

---

## 🔧 Environment Variables

> Every service reads a local `.env` through `dotenv` in `config/server.config.js` (or `config/serverConfig.js`).

**Shared across services**
```dotenv
INTERNAL_SERVER_TOKEN=change-me-shared-secret
EXCHANGE_NAME=ECOMM_EXCHANGE
REMINDER_BINDING_KEY=ECOMM_NOTIFICATION
MESSAGE_BROKER_URL=amqp://guest:guest@rabbitmq:5672
PRIVATEJWT=super-secret-access-jwt
PRIVATEJWTRefersh=super-secret-refresh-jwt
```

> The port values below are **illustrative**. Use whatever you configure in each service's `.env`.

**01 · API Gateway**
```dotenv
PORT=<gateway-port>
FORTEND_URL=http://localhost:5173
AUTH_BACKEND_URL=http://<host>:<port>/api/v1
ECOMMERCE_BACKEND_URL=http://<host>:<port>/api
PAYMENT_BACKEND_URL=http://<host>:<port>/api
REMINDER_BACKEND_URL=http://<host>:<port>/api
```

**02 · Auth** `PORT`, `DB_*`, `EMAIL_ID`, `EMAIL_PASS`
**03 · Ecommerce** `PORT`, `DB_*`, `APIGATEWAY_BACKEND_URL`, `PAYMENT_BACKEND_URL`, `ECOOMERCE_QUEUE`
**04 · Remainder** `PORT`, `DB_*`, `REDIS_URL`, `EMAIL_SENDER`, `EMAIL_ID`, `EMAIL_PASS`, `REMAINDER_QUEUE`
**05 · Payment** `PORT`, `DB_*`, `STRIPE_SECRET_KEY`, `STRIPE_SUCCESS_URL`, `STRIPE_FAILED_URL`, `ESEWA_*`, `KHALTI_*`, `ECOMMERCE_BACKEND_URL`, `APIGATEWAY_BACKEND_URL`

---

## 🌐 API Routes (via Gateway)

### Auth (`/auth/*`)
| Method | Path | Guard |
|---|---|---|
| POST | `/auth/signup` | — |
| POST | `/auth/login` | — |
| POST | `/auth/refresh-token` | cookie |
| POST | `/auth/logout` | cookie |
| GET  | `/auth/email/:userId` | public (internal-token stamped by gateway) |
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

### Payment (`/payment/*`)
`initialize-esewa`, `epayment/initiate`, `stripe-initiate`, `cod-initiate` (user) + gateway callback GETs.

### Remainder (`/remainder/*`)
`/template` CRUD — `verifyAdmin`.

---

## 🔎 Observability & Troubleshooting

- **HTTP logs**: `morgan("combined")` on the Gateway.
- **Proxy debugging**: `http-proxy-middleware` runs with `logLevel: "debug"`.
- **AMQP issues**: check RabbitMQ management UI (`:15672`). The producer auto-reconnects; consumer prints `Failed to connect with rabbitmq` and retries every 5s.
- **Stuck emails**: rows in `Notifications` with `status='PENDING'` older than 2 cron ticks indicate SMTP failure — check `EMAIL_ID / EMAIL_PASS` and SMTP provider quotas.
- **Stuck orders** (`paymentStatus='pending'` but `paymentTransactions.status='SUCCESS'`): reconciliation gap — replay `completeOrderService` manually using `orderNO` + `trans_id`.
- **401 from internal endpoints**: `x-internal-server-token` mismatch — confirm every service shares the same `INTERNAL_SERVER_TOKEN`.

---

## 🗺 Roadmap / Improvements

- [ ] **Root `docker-compose.yml`** including Postgres / RabbitMQ / Redis + wait-for-it healthchecks
- [ ] **Central `.env.example`** per service
- [ ] **DLX + DLQ** for poison messages in RabbitMQ
- [ ] **Outbox pattern** in Ecommerce & Payment to guarantee "DB commit ⇒ event publish"
- [ ] **Circuit breaker** (`opossum`) around every `axios` call
- [ ] **Correlation-id** (`x-request-id`) propagation for distributed tracing (OpenTelemetry)
- [ ] **Jest** + **Supertest** suites per service + `npm test` scripts
- [ ] **CI** (GitHub Actions) — lint, test, build, push images
- [ ] **Kubernetes manifests / Helm chart** with HPA per service
- [ ] **At-least-once AMQP consumer** — `await service(payload)` before `channel.ack`, with `channel.nack` + DLX on failure
- [ ] **Full JWT verification in gateway `verifyToken`** (currently presence-only)

---

## 🧾 Note on Identifier Spelling

The codebase contains several intentional typos that are part of the public API / filenames and must **not** be "fixed" blindly: `utlis` (utils), `Remainder` (reminder), `FORTEND_URL` (frontend), `custumer` (customer), `intialize` (initialize), `ECOOMERCE_QUEUE`, `deincreaceQunatity`. Renaming them requires a coordinated change across services, env files, and queue names.

---

## 📄 License

ISC © MarketMandu

## 👤 Maintainers

Open an issue or PR — contributions welcome.
