
## Admission Bondhu

**Admission Bondhu** is a modern university admission support platform for Bangladesh. Students can explore public/private universities, compare tuition costs, check GPA eligibility, get admission help, and track application status. Admins can manage universities, notices, and applications.

Built by **Rizqara Science & Innovation Club**.

## Key features

- **University Finder**
  - Browse universities and filter by type, subject, city/division, scholarship, GPA, and budget
  - University details page with key info (fees, GPA, departments, deadlines)

- **Admission Support (Application Requests)**
  - Students submit admission support requests with package selection and payment reference
  - Track application status and steps in the dashboard

- **Notice Board**
  - Latest admission notices, circulars, results, and deadlines

- **Admin Panel**
  - CRUD for universities and notices
  - Manage student applications and update status/progress
  - Accommodation data management

- **Real database + media storage**
  - **MongoDB** for structured app data
  - **Cloudinary** for media uploads (logos, PDFs) using an unsigned preset

- **Authentication**
  - Email/password login & signup backed by MongoDB
  - “Continue with Google” (Google Identity Services) -> backend verifies Google ID token -> issues app JWT

- **SEO**
  - Dynamic meta tags for homepage, notices, and university detail pages

## Tech stack

- **Frontend**: Vite + React + React Router + Tailwind
- **Backend**: Node.js + Express + Mongoose + JWT
- **Database**: MongoDB Atlas
- **Media**: Cloudinary

## Local development

### 1) Install dependencies

```bash
npm i
cd server && npm i
```

### 2) Seed MongoDB (optional but recommended)

```bash
cd server
MONGODB_URI="your_mongodb_uri" JWT_SECRET="your_jwt_secret" CORS_ORIGIN="http://localhost:5173" npm run seed
```

### 3) Run backend

```bash
cd server
MONGODB_URI="your_mongodb_uri" JWT_SECRET="your_jwt_secret" CORS_ORIGIN="http://localhost:5173" GOOGLE_CLIENT_ID="your_google_client_id" npm run dev
```

### 4) Run frontend

```bash
VITE_API_URL="http://localhost:4000" \
VITE_CLOUDINARY_CLOUD_NAME="diodvgjrx" \
VITE_CLOUDINARY_UPLOAD_PRESET="admissionbondu" \
VITE_GOOGLE_CLIENT_ID="your_google_client_id" \
npm run dev
```

## Environment variables

### Backend (`server`)

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (comma-separated list or `*`)
- `GOOGLE_CLIENT_ID` (required for Google login)

### Frontend (Vercel / local)

- `VITE_API_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_SITE_URL` (recommended for canonical URLs)

## Deployment (recommended)

- **Vercel**: frontend (this repo root)
- **Render**: backend (this repo `server/` directory)

  