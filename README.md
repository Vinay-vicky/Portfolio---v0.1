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

### Turso setup

When you are ready to use Turso cloud, set in `backend/.env`:

- `TURSO_DATABASE_URL=libsql://<your-db>.turso.io`
- `TURSO_AUTH_TOKEN=<your-turso-token>`

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

## API endpoints

- `GET /api/health` → health check
- `GET /api/portfolio` → profile + experiences + projects
- `POST /api/contact` → save contact message

## Next improvements you can add

- Admin dashboard to edit profile/projects from UI
- Authentication for admin routes
- Image upload for project thumbnails
- Pagination/filtering for projects
- Deployment with frontend + backend on separate services
