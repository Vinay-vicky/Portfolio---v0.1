# Dynamic Portfolio (React + Redux + Tailwind + Express + SQLite/Turso)

This project has been upgraded from a static HTML portfolio to a full-stack dynamic portfolio.

## Stack

- **Frontend:** React (Vite), Redux Toolkit, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** SQLite via `@libsql/client` (local file or Turso cloud)

## Project structure

- `frontend/` → React app
- `backend/` → Express API + DB schema/seed
- `assets/`, `index.html`, etc. → legacy static version (kept for reference)

## Environment setup

Create these files from examples:

- `backend/.env` from `backend/.env.example`
- `frontend/.env` from `frontend/.env.example`

For quick local development, you can use:

- Backend DB URL: `file:./data/portfolio.db`
- Frontend API URL: `http://localhost:5000/api`

For contact email delivery to your inbox, configure SMTP in `backend/.env`:

- `CONTACT_RECEIVER_EMAIL` (the mailbox where contact messages should arrive)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true` for SSL ports like `465`, otherwise `false`)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM` (optional display sender)

### Turso setup

When you are ready to use Turso cloud, set in `backend/.env`:

- `TURSO_DATABASE_URL=libsql://<your-db>.turso.io`
- `TURSO_AUTH_TOKEN=<your-turso-token>`

> Note: `npm run db:seed` (executed from `backend/`) reads `backend/.env`. Values in root `.env` are not used by the seed script.

## Install and run

### 1) Backend

1. Install dependencies in `backend/`
2. Run seed once to populate portfolio content
3. Start dev server

Scripts:

- `npm run db:seed`
- `npm run dev`

### 2) Frontend

1. Install dependencies in `frontend/`
2. Start Vite dev server

Script:

- `npm run dev`

## Deployment

- Frontend: Vercel (`frontend/`)
- Backend: Render (`backend/`)
- Database: Turso (libSQL)

### Render backend auto-deploy (versioned)

This repo now includes `render.yaml` at the root so backend deploy settings can live in git instead of only in the Render dashboard.

Configured defaults in `render.yaml`:

- Service type: `web`
- Runtime: `node`
- Branch: `master`
- Root directory: `backend`
- Build command: `npm ci`
- Start command: `npm start`
- Auto deploy: enabled
- Health check: `/api/health`

Required environment variables in Render:

- `FRONTEND_URL` (comma-separated allowed origins, no trailing slash; e.g. `https://your-site.vercel.app` in prod and `http://localhost:5173,http://127.0.0.1:5173` in local)
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `CONTACT_RECEIVER_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM` (optional)

How to apply it:

1. Push the repo changes to GitHub.
2. In Render, create a new Blueprint instance from this repository (or recreate backend service using blueprint).
3. Set all required env vars when prompted.
4. Verify backend health at `/api/health`.

If you keep an existing Render service created manually, make sure its settings still match `render.yaml` (`master` branch + `backend` rootDir + auto deploy ON).

## API endpoints

- `GET /api/health` → health check
- `GET /api/portfolio` → profile + experiences + projects
- `POST /api/contact` → save contact message to DB and send email notification
- `POST /api/admin/smtp-test` → admin-only SMTP verification + optional probe email

## Next improvements you can add

- Admin dashboard to edit profile/projects from UI
- Authentication for admin routes
- Image upload for project thumbnails
- Pagination/filtering for projects
- Deployment with frontend + backend on separate services
