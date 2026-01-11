# Deployment Guide - SafetyReport Application

This guide covers deploying the SafetyReport application to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Post-Deployment](#post-deployment)

---

## Prerequisites

- GitHub account with repository access
- Production database (PostgreSQL recommended)
- Hosting platform account (Railway, Render, Vercel, etc.)
- Domain name (optional but recommended)

---

## Database Setup

### Option 1: Railway (Recommended - Easiest)

1. **Sign up**: Visit [railway.app](https://railway.app)
2. **Create PostgreSQL Database**:
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Railway will auto-generate connection string
3. **Get DATABASE_URL**:
   - Click on PostgreSQL service
   - Copy "DATABASE_URL" from Variables tab
   - Format: `postgresql://user:pass@host:port/dbname`

### Option 2: Render

1. **Sign up**: Visit [render.com](https://render.com)
2. **Create PostgreSQL Database**:
   - New → PostgreSQL
   - Select free tier or paid plan
   - Copy "Internal Database URL"

### Option 3: Supabase (PostgreSQL)

1. **Sign up**: Visit [supabase.com](https://supabase.com)
2. **Create Project**: New project
3. **Get Connection String**:
   - Settings → Database
   - Copy "Connection string" (URI format)

---

## Backend Deployment

### Railway Deployment (Recommended)

1. **Create New Project**:
   ```bash
   # No commands needed - Railway connects to GitHub
   ```

2. **Deploy Backend**:
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Select `backend` as root directory
   - Railway auto-detects Node.js

3. **Configure Environment Variables**:
   - Click on your service
   - Go to "Variables" tab
   - Add all variables from `.env.production.example`:
   
   ```env
   DATABASE_URL=<your-postgresql-url-from-step-1>
   JWT_SECRET=<generate-with-openssl-rand-base64-32>
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

4. **Generate Strong JWT Secret**:
   ```bash
   # Run this locally to generate a strong secret
   openssl rand -base64 32
   # Copy output to JWT_SECRET variable
   ```

5. **Run Database Migrations**:
   - In Railway service settings → "Settings" tab
   - Add to "Build Command":
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```
   - Or run manually after first deploy:
   ```bash
   # In Railway service terminal
   npx prisma migrate deploy
   npx prisma db seed
   ```

6. **Get Backend URL**:
   - Railway generates a public URL like: `https://your-app.railway.app`
   - Copy this for frontend configuration

### Alternative: Render Deployment

1. **Create Web Service**:
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

2. **Add Environment Variables**:
   - Same as Railway setup above
   - Use Render's PostgreSQL Internal URL for DATABASE_URL

---

## Frontend Deployment

### Vercel Deployment (Recommended for React)

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub** (easier):
   - Visit [vercel.com](https://vercel.com)
   - "New Project" → Import from GitHub
   - Select your repository
   - Framework Preset: Vite
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Environment Variables**:
   - Project Settings → Environment Variables
   - Add:
   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_ENV=production
   ```

4. **Deploy**:
   - Vercel auto-deploys on every push to main branch
   - Get your URL: `https://your-app.vercel.app`

### Alternative: Netlify Deployment

1. **Deploy**:
   - Visit [netlify.com](https://netlify.com)
   - "Add new site" → "Import from Git"
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Environment Variables**:
   - Same as Vercel setup

---

## Post-Deployment

### 1. Update CORS on Backend

After getting frontend URL, update backend CORS:
- Railway: Variables → CORS_ORIGIN → `https://your-app.vercel.app`
- Redeploy backend

### 2. Seed Database

```bash
# If using Railway, in service terminal:
npx prisma db seed

# Or create your own seed script
npm run seed
```

### 3. Test the Application

1. Visit frontend URL
2. Try login with demo account
3. Create a test report
4. Check database for data

### 4. Setup Custom Domain (Optional)

**Frontend (Vercel)**:
- Settings → Domains → Add Domain
- Follow DNS configuration instructions

**Backend (Railway)**:
- Service Settings → Networking → Custom Domain
- Add domain and configure DNS

### 5. SSL/HTTPS

- Railway/Render/Vercel handle SSL automatically
- No configuration needed!

---

## Environment Variables Summary

### Backend Required Variables
```env
DATABASE_URL          # PostgreSQL connection string
JWT_SECRET           # Strong secret (32+ characters)
NODE_ENV=production
PORT=3000
CORS_ORIGIN          # Frontend URL(s), comma-separated
```

### Frontend Required Variables
```env
VITE_API_URL         # Backend API URL
VITE_ENV=production
```

---

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format is correct
- Check if database accepts connections from Railway/Render IPs
- Ensure Prisma migrations ran successfully

### CORS Errors
- Ensure CORS_ORIGIN includes your frontend URL
- No trailing slashes in URLs
- Redeploy backend after updating CORS

### Build Failures
- Check build logs in platform dashboard
- Verify all dependencies in package.json
- Ensure Node.js version compatibility (check .nvmrc or package.json engines)

### 401 Unauthorized Errors
- Check JWT_SECRET is set on backend
- Verify VITE_API_URL points to correct backend
- Check browser console for token issues

---

## Local Testing with PostgreSQL

Before deploying, test locally with PostgreSQL:

1. **Install PostgreSQL**:
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Create Local Database**:
   ```bash
   createdb safetyreport_dev
   ```

3. **Update .env**:
   ```env
   DATABASE_URL="postgresql://localhost:5432/safetyreport_dev"
   ```

4. **Run Migrations**:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

5. **Test Application**:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:5173

---

## Monitoring & Maintenance

### Health Check Endpoint
- Backend has `/health` endpoint
- Use for uptime monitoring (Uptime Robot, Pingdom, etc.)

### Database Backups
- Railway: Automatic daily backups on paid plans
- Render: Automatic backups included
- Manual: `pg_dump` via Prisma or direct PostgreSQL

### Logging
- Railway/Render provide built-in logs
- Consider adding Sentry for error tracking

---

## Cost Estimates

### Free Tier (Good for MVP/Testing)
- **Database**: Railway PostgreSQL (500MB free)
- **Backend**: Railway/Render (free tier with limitations)
- **Frontend**: Vercel/Netlify (unlimited free for personal projects)
- **Total**: $0/month

### Production (Small Scale)
- **Database**: Railway PostgreSQL ($5/month for 1GB)
- **Backend**: Railway ($5/month)
- **Frontend**: Vercel/Netlify (free or $20/month Pro)
- **Total**: $10-30/month

### Recommended Production Setup
- **Railway**: $20/month (backend + database with higher limits)
- **Vercel**: Free or $20/month (frontend)
- **Domain**: $10-15/year
- **Total**: ~$25-45/month

---

## Quick Deploy Commands

```bash
# Generate strong JWT secret
openssl rand -base64 32

# Test build locally
cd backend && npm run build
cd web && npm run build

# Run Prisma migrations
npx prisma migrate deploy

# Seed production database (one-time)
npx prisma db seed
```

---

## Next Steps

1. ✅ Update Prisma schema for PostgreSQL
2. ✅ Create environment configuration files
3. ✅ Update CORS and security settings
4. ✅ Read this deployment guide
5. ⬜ Test locally with PostgreSQL
6. ⬜ Deploy to Railway/Render
7. ⬜ Deploy frontend to Vercel
8. ⬜ Configure custom domain
9. ⬜ Setup monitoring

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Deploy**: https://www.prisma.io/docs/guides/deployment

---

**Last Updated**: January 11, 2026
