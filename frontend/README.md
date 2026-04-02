# RoktoLagbe Frontend 🩸 (Interface Layer)

This is the high-fidelity, Next.js-powered interface for the **RoktoLagbe** blood donation network. It provides custom, role-aware dashboards for Donors, Managers, and System Administrators.

## 🏗️ Technical Stack
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS with Glassmorphism
*   **State**: TanStack Query (React Query)
*   **Persistence**: Axios with JWT Interceptors
*   **Icons**: Lucide React

## 🚀 Rapid Deployment

### 1. Setup Environment
```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to point to the backend (e.g., http://localhost:5000/api)
```

### 2. Launch Interface
```bash
# Development (with hot-reload)
npm run dev

# Port 3000 by default
```

### 3. Production Build
```bash
# Verify static and dynamic routes
npm run build

# Start the optimized shell
npm start
```

## 🔐 Role-Based Dashboards
The frontend dynamically adapts based on the active user role:
- **`DONOR/`**: Life-saving history, mission tracking, and honor rewards.
- **`MANAGER/`**: Institutional request ledger and donor recruitment radar.
- **`ADMIN/`**: Global command suite for citizen and organization management.

## 💎 Visual Excellence
- **Glassmorphic UI**: High-contrast light theme with multi-layered translucency.
- **Neural Motion**: Smooth transitions and micro-animations for high engagement.
- **Dynamic Routing**: Unified dashboard engine powered by Next.js search parameters.
