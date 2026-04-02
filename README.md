# RoktoLagbe 🩸

> "Blood when seconds matter" — A real-time blood donation & emergency network for Bangladesh.

## Stack

| Layer | Tech |
|-------|------|
| Backend | Express + TypeScript (feature-module) |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + httpOnly refresh cookie |
| Frontend | Next.js 14 App Router + Tailwind CSS |

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Supabase](https://supabase.com) / [Railway](https://railway.app) for free)
- A Mailtrap account (free) for email testing

### 2. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in your DATABASE_URL and other values in .env

# Frontend
cd frontend
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL
```

### 3. Database Setup

```bash
cd backend

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed admin account (uses ADMIN_EMAIL + ADMIN_PASSWORD from .env)
npm run prisma:seed
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend
npm run dev
```

---

## Project Structure

```
RoktoLagbe/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # All models & enums
│   │   └── seed.ts            # Seeds admin account
│   ├── src/
│   │   ├── app.ts             # Express app setup
│   │   ├── server.ts          # Entry point
│   │   ├── config/env.ts      # Typed + validated env vars
│   │   ├── lib/prisma.ts      # Singleton Prisma client
│   │   ├── middlewares/       # authenticate, authorize, rateLimiter, errorHandler
│   │   ├── utils/             # AppError, email, helpers
│   │   └── modules/
│   │       ├── auth/          # Register, login, verify, refresh
│   │       ├── donors/        # Profile, availability, donation history
│   │       ├── managers/      # Hospital & org management, members, invites
│   │       ├── blood-requests/# Post, track, resolve requests
│   │       ├── search/        # Anonymized public search
│   │       ├── notifications/ # In-app + email notifications
│   │       └── admin/         # Verify, ban, analytics
└── frontend/
    └── src/app/
        ├── (public)/          # Homepage, Find Blood, Urgent Requests, Orgs
        ├── (auth)/            # Login, Register, Verify Email
        └── dashboard/         # Donor, Manager, Admin dashboards
```

---

## API Reference (Base URL: `/api`)

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register (DONOR or MANAGER) |
| POST | `/auth/login` | Public | Login, sets refresh cookie |
| GET | `/auth/verify-email?token=&id=` | Public | Email verification |
| POST | `/auth/refresh` | Public | Rotate JWT |
| POST | `/auth/logout` | Auth | Clear refresh cookie |
| GET | `/auth/me` | Auth | Current user |

### Donors
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/donors` | Public | Anonymized list |
| GET | `/donors/:id` | MANAGER/ADMIN | Full profile |
| GET | `/donors/me` | DONOR | Own profile |
| PATCH | `/donors/me` | DONOR | Update availability |
| POST | `/donors/me/donation` | DONOR | Log donation (+ image) |

### Blood Requests
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/blood-requests` | Public | Open requests feed |
| POST | `/blood-requests` | MANAGER | Create request |
| PATCH | `/blood-requests/:id` | MANAGER/ADMIN | Update status |

### Search
| Method | Endpoint | Auth | Rate Limit |
|--------|----------|------|------------|
| GET | `/search/donors?bloodGroup=A_POS&district=Dhaka` | Public | 20/min |
| GET | `/search/requests?bloodGroup=A_POS` | Public | 20/min |

### Admin
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/admin/analytics` | ADMIN |
| PATCH | `/admin/managers/:id/verify` | ADMIN |
| PATCH | `/admin/users/:id/ban` | ADMIN |

---

## Roles

| Role | Description |
|------|-------------|
| `DONOR` | Can log donations, update availability |
| `MANAGER` | Hospital or Organization — post requests, manage members |
| `ADMIN` | Seeded — verify managers, view analytics |

---

## 🔐 Seed Credentials

Use these credentials after running the database seed (`npm run prisma:seed` in the backend).

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@roktolagbe.com` | `Admin@123456` |
| **Hospital Manager** | `contactrbm15@gmail.com` | `RoktoLagbe123` |
| **Hero Donor** | `mahdimoniruzzaman@gmail.com` | `RoktoLagbe123` |

---

## Environment Variables

See `.env.example` in the `backend/` folder for all required variables.

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` + `JWT_REFRESH_SECRET` — Use long random strings
- `SMTP_*` — Service for email notifications
- `ADMIN_EMAIL` + `ADMIN_PASSWORD` — Admin credentials used during seed

