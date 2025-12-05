# TerraVue

A modern travel concierge platform that pairs a React experience with an Express + MongoDB API. This root README gives you the stitching story across the backend, frontend, and shared workflows.

## ✨ Highlights
- **Dynamic itineraries & bookings** powered by secure REST APIs.
- **JWT auth with refresh tokens** plus optional **Google Sign-In** for one-click access.
- **Profile, planner, and commerce experiences** that share a unified design language.
- **Environment-driven configuration** so you can run the stack locally or ship to cloud targets.

## 🧱 Architecture At A Glance
| Layer | Tech | Notes |
| --- | --- | --- |
| Frontend | React 19, React Router, Framer Motion, React Toastify | Resides in [`frontend/`](./frontend), bootstrapped with CRA. |
| Backend | Node.js, Express, Mongoose, bcrypt, google-auth-library | Lives in [`backend/`](./backend), exposes `/api/*` endpoints. |
| Database | MongoDB | Connection string provided via `MONGODB_URI`. |
| Auth | JWT + Refresh tokens, Google OAuth | Credentials stored in localStorage; backend manages refresh token lists. |

## 🚀 Quick Start
```bash
# 1. Install dependencies
(cd backend && npm install)
(cd frontend && npm install)

# 2. Environment variables (see below) and start both apps
(cd backend && npm run dev)
(cd frontend && npm start)
```
By default the API runs on `http://localhost:5000` and the React dev server on `http://localhost:3000`.

## 🔑 Environment Variables
Create `.env` files inside both `backend/` and `frontend/` (CRA uses `REACT_APP_*` keys). Suggested keys:

| Scope | Variable | Purpose |
| --- | --- | --- |
| Backend | `PORT` | API port (defaults to 5000). |
| Backend | `MONGODB_URI` | MongoDB connection string. |
| Backend | `JWT_SECRET`, `REFRESH_TOKEN_SECRET` | Token signing secrets. |
| Backend | `GOOGLE_CLIENT_ID` | OAuth Client ID for verifying Google ID tokens. |
| Frontend | `REACT_APP_API_BASE_URL` | Axios base URL (e.g., `http://localhost:5000`). |
| Frontend | `REACT_APP_GOOGLE_CLIENT_ID` | Same OAuth Client ID as backend to render the Google button. |

## 🔐 Auth Flow Overview
1. **Email + Password**
   - `/api/auth/login` returns access + refresh tokens.
   - Refresh tokens are persisted per-user and rotated on logout.
2. **Google Sign-In**
   - Frontend obtains a credential via Google Identity Services.
   - Backend verifies the ID token, upserts the user (matching schema to local accounts), and returns the same JWT bundle.
3. **Profile & deletion**
   - Profile endpoints live under `/api/auth/profile` (see `backend/routes/profileRoutes.js`).
   - Deleting an account clears related carts/bookings and the frontend wipes `localStorage`.

## 📂 Key Directories
- `backend/controllers/`, `routes/`, `models/` — Express MVC-style structure.
- `backend/services/`, `utils/` — Shared helpers (API integrations, common logic).
- `frontend/src/pages/` — Top-level routes such as `LogIn`, `Dashboard`, `Profile`.
- `frontend/src/components/` — Shared UI (navbar, loaders, etc.).
- `frontend/src/context/` — React context for planners / other stateful modules.

## 🧪 Useful Scripts
| Location | Script | Description |
| --- | --- | --- |
| `backend` | `npm run dev` | Starts Express via nodemon. |
| `backend` | `npm start` | Runs the API with Node. |
| `frontend` | `npm start` | CRA dev server with hot reload. |
| `frontend` | `npm run build` | Production build of the React app. |

## 🛠️ Development Tips
- Keep `backend/.env` and `frontend/.env` aligned for Google OAuth.
- When changing shared models (e.g., `User`), update both backend responses and frontend consumers.
- Use `npm audit fix` inside both folders if you want to address the advisories reported during install.
- For rapid iteration, keep `npm run dev` (backend) and `npm start` (frontend) running in separate terminals.

Happy building! 🧭
