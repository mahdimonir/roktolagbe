# RoktoLagbe Backend ⚙️ (Neural Core)

This is the high-performance Express server and Prisma ORM layer that powers the **RoktoLagbe** blood donation network. It handles real-time signaling, authentication, and the global institutional registry.

## 🏗️ Technical Stack
*   **Runtime**: Node.js (v18+)
*   **Engine**: Express.js with TypeScript
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Security**: JWT (Access/Refresh strategy) + RBAC (Role-Based Access Control)

## 🚀 Rapid Deployment

### 1. Setup Environment
```bash
npm install
cp .env.example .env
# Fill in your DATABASE_URL, JWT_SECRETS, and SMTP credentials
```

### 2. Database Synchronization
```bash
# Push schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed official credentials (Admin, Manager, Donor)
npm run prisma:seed
```

### 3. Launch Core
```bash
# Development (with hot-reload)
npm run dev

# Production Build
npm run build
npm start
```

## 🔐 Core Modules
*   **`/auth`**: Secure identity management and verification.
*   **`/admin`**: Global command center logic and analytics.
*   **`/blood-requests`**: High-priority supply chain and fulfillment tracking.
*   **`/managers`**: Institutional registry for hospitals and NGOs.
*   **`/messages`**: Cross-sector communication bridge.

## 🛡️ Security Protocols
The backend utilizes customized middleware for:
- **Authorization**: Role-based access for `ADMIN`, `MANAGER`, and `DONOR`.
- **Latency Monitoring**: Real-time tracking of API response vitals.
- **Audit Logging**: Chronological timeline of sensitive administrative actions.
