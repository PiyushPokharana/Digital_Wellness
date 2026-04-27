# Digital Wellness Course Showcase Platform

Full-stack web app for uploading and showcasing student digital work (images, videos, PDFs, ZIP files, and links).

## Overview

- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + MongoDB
- File storage: Cloudinary
- Deployment targets: Vercel (frontend), Render/Railway (backend)

## Repository Structure

```text
DW-Submission/
  backend/    # Express API, DB models, upload routes
  frontend/   # React app
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas project
- Cloudinary account

## Local Development

### 1) Clone and install

```bash
git clone <your-repo-url>
cd DW-Submission

cd backend
npm install

cd ../frontend
npm install
```

### 2) Configure environment variables

Backend:

```bash
cd backend
cp env.example .env
```

Frontend:

```bash
cd frontend
cp env.example .env
```

Then edit the values in both `.env` files.

### 3) Run the apps

Backend terminal:

```bash
cd backend
npm run dev
```

Frontend terminal:

```bash
cd frontend
npm run dev
```

Default URLs:

- Frontend: your deployed frontend domain
- Backend: your deployed backend domain

## Environment Variables

### Backend (`backend/.env`)

- `MONGODB_URI` MongoDB Atlas connection string
- `CLOUDINARY_CLOUD_NAME` Cloudinary cloud name
- `CLOUDINARY_API_KEY` Cloudinary API key
- `CLOUDINARY_API_SECRET` Cloudinary API secret
- `PORT` API port (default `5000`)
- `CORS_ORIGIN` frontend URL for CORS (for example `https://your-frontend-domain.com`)
- `GOOGLE_CLIENT_ID` Google OAuth web client ID for verifying signed-in users on upload

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` backend API URL, for example `https://your-backend-domain.com/api`
- `VITE_GOOGLE_CLIENT_ID` Google OAuth web client ID

## Scripts

Root (`package.json`):

- `npm run dev:backend`
- `npm run dev:frontend`
- `npm run install:all`
- `npm run build:frontend`

Backend:

- `npm run dev`
- `npm start`

Frontend:

- `npm run dev`
- `npm run build`
- `npm run preview`

## Deployment Notes

- Deploy backend from `backend/` and set backend env vars.
- Deploy frontend from `frontend/` and set `VITE_API_BASE_URL` to your deployed backend URL.
- Update backend `CORS_ORIGIN` to your deployed frontend domain.

## Security Checklist Before Push

- Never commit `.env` files.
- Keep only placeholder values in `*.example` files.
- Rotate any credential that was ever committed.

## License

See `LICENSE`.