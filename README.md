# RoktoLagbe 🩸

> **"Blood when seconds matter"** — A real-time blood donation & emergency network for Bangladesh.

RoktoLagbe connects patients in critical need of blood with verified donors across Bangladesh. The platform provides real-time emergency broadcasting, intelligent donor-request matching, a gamification-based rewards system, and AI-powered assistance — all designed to reduce the time between a blood request and a life-saving donation.

---

## Stack

| Layer | Tech |
|-------|------|
| Backend | Express.js + TypeScript (feature-module architecture) |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Auth | JWT access tokens + httpOnly refresh cookies |
| Frontend | Next.js 16 (App Router) + Tailwind CSS 4 |
| State | Zustand + TanStack React Query |
| Styling | Tailwind CSS with dark mode support |
| Forms | React Hook Form + Zod validation |
| Maps | Leaflet / React-Leaflet |
| Charts | Recharts |
| Notifications | Sonner (toast) + Email (Nodemailer) |
| AI | Google Gemini (primary) + OpenRouter (fallback) |
| Caching | node-cache (in-memory TTL cache) |

---

## Features

### 🩸 Core Platform

| Feature | Description |
|---------|-------------|
| **Donor Registration** | Donors register with blood group, location (division/district/thana), and contact info. Email verification required. |
| **Blood Request Posting** | Verified hospital managers create blood requests with patient details, urgency level, and deadline. |
| **Emergency SOS Broadcast** | Public (no-auth) emergency request form that instantly notifies matching donors via in-app + email notifications. |
| **Donor Search & Discovery** | Public search portal with unified search across name, phone, district, thana, and blood group. Supports sort by recency, donations, and availability. |
| **Urgent Requests Feed** | Live feed of open blood requests with filters for blood group, district, urgency, and deadline. |
| **Donor-Request Commitment** | Donors commit to open requests; managers verify fulfilled donations. |
| **Donation Verification** | Managers verify donor commitments, triggering points, badges, and auto-availability updates. |
| **Donation History** | Full timeline of all donations per donor with status tracking (Committed → Verified / Declined). |
| **Donation Card Generator** | Auto-generates a shareable donation card image after each logged donation. |

### 🏥 Organizations & Hospitals

| Feature | Description |
|---------|-------------|
| **Hospital/Organization Registry** | Public directory of verified partner hospitals and organizations with contact info and mission count. |
| **Manager Verification** | Admin-verified hospital managers can create requests and manage donor pools. |
| **Organization Members** | Managers can invite and manage donor members within their organization. |
| **Blood Inventory Tracking** | Per-organization blood stock tracking by blood group with unit counts. |

### 👤 User Roles & Dashboards

| Role | Dashboard Features |
|------|-------------------|
| **DONOR** | Profile management, donation history, points & badges, rewards redemption, affiliated organizations, nearby request alerts, donation logging with image upload |
| **MANAGER** | Blood request management, donor shortlisting, donation verification, blood inventory, organization profile, member management |
| **ADMIN** | Platform analytics, user management (verify/ban), audit logs, badge management, reward management, system configuration (global alerts, maintenance mode) |

### 🏆 Gamification & Rewards

| Feature | Description |
|---------|-------------|
| **Points System** | Donors earn points per donation (100 for logging, +50 for verification, +10 for commitment). |
| **Tier Ranks** | Bronze → Silver (500pts) → Gold (1000pts) → Platinum (2500pts) → Titanium (5000pts). |
| **Badges** | Auto-awarded based on milestones (e.g., "First Blood", "Legendary Donor 10+"). Categories: Milestone, Community, Special. |
| **Rewards Marketplace** | Donors redeem points for rewards (Food, Health, E-commerce vouchers) posted by managers. Voucher code generation with usage tracking. |

### 💬 Communication

| Feature | Description |
|---------|-------------|
| **In-App Messaging** | Real-time messaging between donors and seekers/managers. Conversation list + chat interface via floating overlay. |
| **Email Notifications** | Automated emails for blood request matches, verification confirmations, and platform updates. |
| **In-App Notifications** | Bell notification system with read/unread status, mark all as read, and paginated history. |
| **Global Alerts** | Admin-configurable platform-wide alert banners (INFO/WARNING/EMERGENCY) with maintenance mode support. |

### 🔒 Security & Administration

| Feature | Description |
|---------|-------------|
| **JWT Auth** | Access token (15min) + httpOnly refresh cookie (7 days) with rotation. |
| **Role-Based Access** | Middleware-enforced authorization (DONOR / MANAGER / ADMIN). |
| **Rate Limiting** | API-level rate limiting (Express Rate Limit) on public endpoints. |
| **Audit Logging** | Full audit trail for critical actions (create, update, delete, ban, verify, config changes) with actor tracking. |
| **Email Verification** | Token-based email verification on registration. |
| **Forgot Password** | Password reset flow via email. |

### 📊 Analytics & Insights

| Feature | Description |
|---------|-------------|
| **Admin Analytics** | Total donors, active requests, lives saved, partner hospitals, recent activity. |
| **Donor Analytics** | Personal stats (total donations, points, rank, badges count, nearby requests). |
| **Public Stats** | Homepage stats pulled from live database (donors count, active requests, lives saved, partner hospitals). |

### 📄 Static Pages

| Page | Description |
|------|-------------|
| **Homepage** | Hero section, urgent requests, platform stats, how it works, thalassemia awareness, awareness campaigns, why donate, impact wall, testimonials, FAQ section, community trust |
| **About** | Platform mission, team, and vision |
| **How It Works** | Step-by-step guide for donors and seekers |
| **Eligibility** | Medical guidelines, blood compatibility chart, temporary & permanent deferral rules |
| **FAQ** | Accordion FAQ with categories (Safety, Eligibility, Platform) |
| **Help Center** | Support hub with categories (Donors, Hospitals, Security, Resources) + AI assistant |
| **Contact** | Emergency hotlines, email, contact form |
| **Saved Lives** | Success stories and impact showcase |
| **Rewards** | Rewards marketplace overview + elite donor perks |
| **Privacy Policy** | Data protection and privacy terms |
| **Terms of Service** | Platform usage terms |

### 🤖 AI Features (Planned)

> See [AiFeatures.md](./AiFeatures.md) for detailed technical documentation.

| Feature | Provider | Description |
|---------|----------|-------------|
| **Smart Search Suggestions** | Database-driven | Real-time, Google-style autocomplete from actual donor/request data |
| **AI Help Assistant** | Google Gemini | Conversational FAQ assistant grounded in platform knowledge |
| **Smart Donor Matching** | Scoring algorithm | Weighted ranking (proximity, reliability, recovery time) |
| **Smart Notification Waves** | Rule-based | Tiered donor notification (top 5 first, then expand) |
| **Auto-Eligibility** | Cron + rules | Auto-manage donor availability based on donation history |
| **Spam Detection** | Pattern matching | Anomaly scoring for public emergency requests |
| **Demand Forecasting** | Statistical | Weekly blood demand prediction per blood group per district |

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Supabase](https://supabase.com) / [Railway](https://railway.app) for free)
- A Mailtrap account (free) for email testing
- Google Gemini API Key (free tier) for AI features

### 2. Clone & Install

```bash
# Clone repository
git clone https://github.com/mahdimonir/roktolagbe.git
cd roktolagbe

# Backend
cd backend
npm install
cp .env.example .env
# Fill in your DATABASE_URL and other values in .env

# Frontend
cd ../frontend
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

# Optional: Seed sample donors
npm run prisma:seed:donors
npm run prisma:seed:donors2
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
├── AiFeatures.md              # AI features documentation
├── README.md                  # This file
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # All models & enums
│   │   ├── seed.ts            # Seeds admin account
│   │   ├── seed-donors.ts     # Sample donor data
│   │   └── seed-donors-2.ts   # Additional donor data
│   ├── src/
│   │   ├── app.ts             # Express app setup
│   │   ├── server.ts          # Entry point
│   │   ├── config/env.ts      # Typed + validated env vars
│   │   ├── lib/
│   │   │   ├── prisma.ts      # Singleton Prisma client
│   │   │   ├── cache.ts       # node-cache singleton (planned)
│   │   │   └── gemini.ts      # Gemini client (planned)
│   │   ├── middlewares/
│   │   │   ├── authenticate.ts  # JWT verification
│   │   │   ├── authorize.ts     # Role-based access control
│   │   │   ├── rateLimiter.ts   # API rate limiting
│   │   │   └── errorHandler.ts  # Global error handler
│   │   ├── utils/
│   │   │   ├── AppError.ts      # Custom error class
│   │   │   ├── email.ts         # Email sender (Nodemailer)
│   │   │   ├── helpers.ts       # Pagination, response formatters
│   │   │   ├── cardGenerator.ts # Donation card image generator
│   │   │   └── ExportService.ts # Data export utility
│   │   └── modules/
│   │       ├── auth/            # Register, login, verify email, refresh, logout
│   │       ├── donors/          # Profile CRUD, donation logging, search, analytics
│   │       ├── managers/        # Hospital/org management, members, invites, inventory
│   │       ├── blood-requests/  # Create, track, resolve requests, donor commitment, verification
│   │       ├── notifications/   # In-app + email notification system
│   │       ├── messages/        # Real-time messaging between users
│   │       ├── badges/          # Auto-awarded achievement badges
│   │       ├── rewards/         # Rewards marketplace + redemption
│   │       ├── admin/           # Analytics, user management, system config, audit logs
│   │       ├── audit/           # Audit trail service
│   │       ├── media/           # File upload handling
│   │       ├── search/          # Search suggestions API (planned)
│   │       └── ai/             # AI help assistant (planned)
│   └── uploads/               # Uploaded files (images, donation proofs)
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx           # Homepage
        │   ├── layout.tsx         # Root layout
        │   ├── globals.css        # Global styles
        │   ├── about/             # About page
        │   ├── contact/           # Contact page
        │   ├── donors/            # Donor search portal
        │   ├── eligibility/       # Eligibility guidelines
        │   ├── emergency-request/ # Public emergency SOS form
        │   ├── faq/               # FAQ page
        │   ├── forgot-password/   # Password reset
        │   ├── help/              # Help center + AI assistant
        │   ├── how-it-works/      # Platform guide
        │   ├── login/             # Login page
        │   ├── organizations/     # Hospital/org directory
        │   ├── privacy/           # Privacy policy
        │   ├── register/          # Registration page
        │   ├── rewards/           # Rewards marketplace
        │   ├── saved-lives/       # Success stories
        │   ├── terms/             # Terms of service
        │   ├── urgent-requests/   # Active blood request feed
        │   ├── verify-email/      # Email verification
        │   └── dashboard/
        │       ├── (donor)/       # Donor dashboard (profile, history, rewards, settings, log donation)
        │       ├── (manager)/     # Manager dashboard (requests, donors, inventory, profile, verification)
        │       ├── (admin)/       # Admin dashboard (analytics, users, badges, donations, audit, settings, organizations, requests)
        │       └── messages/      # Messaging interface
        ├── components/
        │   ├── Navbar.tsx         # Main navigation (responsive, dark mode toggle)
        │   ├── Footer.tsx         # Site footer
        │   ├── Logo.tsx           # Brand logo
        │   ├── ThemeSwitcher.tsx   # Dark/light mode toggle
        │   ├── MessagingOverlay.tsx # Floating chat overlay
        │   ├── Providers.tsx       # React Query + Theme providers
        │   ├── common/
        │   │   ├── CTASection.tsx       # Reusable call-to-action component
        │   │   ├── GlobalAlert.tsx      # Platform-wide alert banner
        │   │   ├── LocationSelector.tsx # Division > District > Thana cascading selector
        │   │   ├── Skeleton.tsx         # Loading skeleton
        │   │   └── SkeletonCard.tsx     # Card loading skeleton
        │   ├── home/              # Homepage sections (Hero, Stats, UrgentRequests, HowItWorks, etc.)
        │   ├── dashboard/         # Dashboard layout components
        │   └── layout/            # Layout wrappers
        ├── constants/             # Location data (divisions, districts, thanas)
        ├── lib/api/axios.ts       # Axios instance with auth interceptors
        ├── store/                 # Zustand auth store
        └── providers/             # App-level providers
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
| GET | `/donors` | Public | Anonymized donor list |
| GET | `/donors/search` | Public | Unified search (name, phone, location, blood group) |
| GET | `/donors/:id` | Public/Auth | Public profile (contact info visible if authenticated) |
| GET | `/donors/me` | DONOR | Own profile with donation history + badges |
| GET | `/donors/me/analytics` | DONOR | Personal stats (rank, points, nearby requests) |
| PATCH | `/donors/me` | DONOR | Update profile (name, location, availability, social links) |
| POST | `/donors/me/donation` | DONOR | Log donation (+ image upload) |
| GET | `/donors/me/history` | DONOR | Paginated donation history |

### Blood Requests
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/blood-requests` | Public | Open requests feed (filterable, sortable) |
| GET | `/blood-requests/:id` | Public | Request details |
| POST | `/blood-requests` | MANAGER | Create request |
| POST | `/blood-requests/emergency` | Public | Emergency SOS (no auth required) |
| PATCH | `/blood-requests/:id` | MANAGER/ADMIN | Update status |
| DELETE | `/blood-requests/:id` | MANAGER/ADMIN | Cancel request |
| GET | `/blood-requests/:id/shortlist` | MANAGER/ADMIN | Matching donors list |
| POST | `/blood-requests/:id/commit` | DONOR | Commit to a request |
| POST | `/blood-requests/:id/verify/:donationId` | MANAGER | Verify a donation |

### Organizations/Managers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/public/organizations` | Public | All verified organizations |
| GET | `/managers/me` | MANAGER | Own org profile |
| PATCH | `/managers/me` | MANAGER | Update org profile |
| GET | `/managers/me/inventory` | MANAGER | Blood stock levels |
| PATCH | `/managers/me/inventory` | MANAGER | Update stock |
| GET | `/managers/me/members` | MANAGER | Organization members |

### Messaging
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/messages/conversations` | Auth | List conversations |
| GET | `/messages/:userId` | Auth | Messages with a user |
| POST | `/messages` | Auth | Send message |

### Notifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Auth | Paginated notifications |
| PATCH | `/notifications/:id/read` | Auth | Mark as read |
| PATCH | `/notifications/read-all` | Auth | Mark all as read |

### Rewards
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/rewards/marketplace` | Public | Available rewards |
| POST | `/rewards/:id/redeem` | DONOR | Redeem with points |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/analytics` | ADMIN | Platform analytics |
| GET | `/admin/users` | ADMIN | User management |
| PATCH | `/admin/managers/:id/verify` | ADMIN | Verify a manager |
| PATCH | `/admin/users/:id/ban` | ADMIN | Ban/unban user |
| GET | `/admin/audit-logs` | ADMIN | Audit trail |
| PATCH | `/admin/config` | ADMIN | System configuration |

### Public Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/public/stats` | Public | Platform-wide statistics |

---

## Roles

| Role | Description |
|------|-------------|
| `DONOR` | Register, update profile, log donations, earn points/badges, redeem rewards, commit to requests, message seekers |
| `MANAGER` | Hospital or Organization — post requests, manage members, verify donations, manage inventory |
| `ADMIN` | Seeded — verify managers, ban users, manage badges/rewards, system config, view analytics & audit logs |

---

## Data Models

| Model | Purpose |
|-------|---------|
| `User` | Core user (email, phone, passwordHash, role, verification status) |
| `DonorProfile` | Donor details (blood group, location, availability, stats, social links) |
| `ManagerProfile` | Hospital/org details (type, district, verification, invite token) |
| `BloodRequest` | Blood request (blood group, urgency, deadline, patient info, status) |
| `BloodInventory` | Per-org blood stock by blood group |
| `DonationHistory` | Donation records (status: Committed/Verified/Declined, points, proof image) |
| `OrgMember` | Donor-organization membership |
| `Message` | User-to-user messaging |
| `Notification` | In-app notifications (type, read status) |
| `Reward` | Redeemable rewards (title, points cost, category, stock) |
| `RedeemedReward` | Redemption records with voucher codes |
| `Badge` | Achievement badges (name, icon, category) |
| `DonorBadge` | Badge-donor assignments |
| `SystemConfig` | Platform settings (global alerts, maintenance mode, API version) |
| `AuditLog` | Admin action trail (actor, action, entity, details) |

---

## 🔐 Seed Credentials

Use these credentials after running the database seed (`npm run prisma:seed` in the backend).

| Role | Email | Password |
|:-----|:------|:---------|
| **System Admin** | `admin@roktolagbe.com` | `Admin@123456` |
| **Hospital Manager** | `contactrbm15@gmail.com` | `RoktoLagbe123` |
| **Hero Donor** | `mahdimoniruzzaman@gmail.com` | `RoktoLagbe123` |

---

## Environment Variables

### Backend (`.env`)

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/roktolagbe

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Mailtrap for dev)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
EMAIL_FROM=noreply@roktolagbe.com

# Frontend
CLIENT_URL=http://localhost:3000

# Admin Seed
ADMIN_EMAIL=admin@roktolagbe.com
ADMIN_PASSWORD=Admin@123456

# AI Configuration (for AI features)
GEMINI_API_KEY=your_google_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Scripts

### Backend
| Script | Command | Description |
|--------|---------|-------------|
| Dev Server | `npm run dev` | Start with hot reload (ts-node-dev) |
| Build | `npm run build` | Compile TypeScript |
| Start | `npm start` | Run compiled JS |
| Prisma Generate | `npm run prisma:generate` | Regenerate Prisma client |
| Prisma Migrate | `npm run prisma:migrate` | Run pending migrations |
| Prisma Seed | `npm run prisma:seed` | Seed admin user |
| Prisma Seed Donors | `npm run prisma:seed:donors` | Seed sample donors |
| Prisma Seed All | `npm run prisma:seed:all` | Run all seed scripts |
| Prisma Studio | `npm run prisma:studio` | Open Prisma data browser |
| Prisma Reset | `npm run prisma:migrate:reset` | Reset database |
| Test | `npm test` | Run Jest tests |

### Frontend
| Script | Command | Description |
|--------|---------|-------------|
| Dev Server | `npm run dev` | Start Next.js dev server |
| Build | `npm run build` | Production build |
| Start | `npm start` | Serve production build |
| Lint | `npm run lint` | Run ESLint |

---

## Deployment

The backend is configured for **Vercel** deployment (`vercel.json` present). The frontend is a standard Next.js app deployable to Vercel, Netlify, or any Node.js host.

---

## License

MIT
