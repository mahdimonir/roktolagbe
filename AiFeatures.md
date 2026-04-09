# AI Features — RoktoLagbe 🩸🤖

> All AI features in the RoktoLagbe platform. Each feature is grounded in real health-tech industry standards — no gimmicks, only utility.

---

## Overview

| Feature | Status | AI Provider | Caching | Priority |
|---------|--------|-------------|---------|----------|
| Smart Search Suggestions | ✅ Implemented | None (DB-driven) | node-cache (TTL: 5min) | 🥇 High |
| AI Help & FAQ Assistant | ✅ Implemented | Google Gemini 1.5 | node-cache (TTL: 1hr) | 🥇 High |
| Smart Donor-Request Matching | 🟡 Planned | None (scoring algorithm) | — | 🥈 Medium |
| Smart Notification Waves | 🟡 Planned | None (rule-based) | — | 🥈 Medium |
| Auto-Eligibility Prediction | 🟡 Planned | None (cron + rules) | — | 🥉 Low |
| Spam/Fraud Detection | 🟡 Planned | None (pattern matching) | — | 🥉 Low |
| Demand Forecasting | 🟡 Planned | None (statistical) | — | 🥉 Low |

---

## 1. Smart Search Suggestions (Google-style)

### What It Does
Provides real-time, data-driven search suggestions as users type — pulling from actual database content instead of hardcoded city lists.

### Where It Applies
- **Donor Search Page** (`/donors`) — suggests donor names, districts, thanas, blood groups
- **Urgent Requests Page** (`/urgent-requests`) — suggests hospital names, districts, patient conditions, blood groups

### Implementation Status
- **Backend Service**: `src/modules/search/search.service.ts` (Handles PostgreSQL aggregation + ranking)
- **Routes**: `/api/search/suggestions` (Mapped in `search.routes.ts`)

---

## 2. AI Help & FAQ Assistant

### What It Does
An AI-powered assistant on the Help page that answers user questions about blood donation, eligibility, platform usage, and medical guidelines — grounded in platform-specific knowledge.

### Strategy: Multi-Layered Intelligence (NEW)
We moved away from OpenRouter to a more robust, cost-effective architecture:
1.  **Map Filter (Priority 1)**: Instant intent dictionary that matches common queries (join, eligibility, compatibility) zero-cost.
2.  **Gemini 1.5 Flash (Priority 2)**: Primary AI brain for complex medical or platform dialogue.
3.  **Static Fallback (Priority 3)**: Hardcoded FAQ logic if rate limits are reached.

### Technical Details
- **Provider**: Google Gemini 1.5 Flash (Primary)
- **Fallback**: Intelligent "Map Filter" intent matcher.
- **Cooldown**: 1-minute automatic silence after 429 quota errors.
- **Privacy**: No personal data shared with API.

### Files
| Location | File | Purpose |
|----------|------|---------|
| Backend | `src/modules/ai/ai.service.ts` | Intent Map + Gemini integration |
| Backend | `src/lib/gemini.ts` | Gemini client singleton |

---

## 3. Smart Donor-Request Matching (🟡 Planned)
... (Original planned logic remains same)

---

## Architecture (Updated)

```
┌─────────────────┐     ┌──────────────┐     ┌───────────────┐
│   Frontend      │────▶│  Express API │────▶│  PostgreSQL   │
│   (Next.js)     │     │              │     │  (Prisma ORM) │
│                 │     │  node-cache  │     │               │
│  - Search UI    │     │  (TTL cache) │     │  - Donors     │
│  - Help Chat    │     │              │     │  - Requests   │
│  - Suggestions  │     │  Gemini API  │     │  - History    │
└─────────────────┘     │  (fallback:  │     └───────────────┘
                        │   Intent Map)│
                        └──────────────┘
```

---

## Environment Variables
Removed OpenRouter keys as they are no longer required for the updated architecture.

```env
# AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key
```
