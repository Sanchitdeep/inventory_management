# Production Deployment Guide - Step 6

## Overview
This guide walks you through deploying the Inventory & Order Management System to production using:
- **Backend**: Render.com (FastAPI + PostgreSQL)
- **Frontend**: Vercel (React + Vite)

**Time Estimate**: 30-45 minutes total  
**Status**: All code committed to Git ✅

---

## Phase 1: Push Code to GitHub

### Step 1.1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `inventory-management-system` (or your choice)
   - **Description**: `Production-ready Inventory & Order Management System with Docker support`
   - **Visibility**: Public (recommended for Render/Vercel free tier)
4. Click **"Create repository"**

### Step 1.2: Connect Local Repository to GitHub

After creating the GitHub repo, you'll see push instructions. Run these commands in your terminal:

```bash
cd c:\Users\Admin\Desktop\Ethara_AI_project

# Add GitHub as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main
git branch -m master main

# Push code to GitHub
git push -u origin main
```

**Replace**:
- `YOUR_USERNAME` with your GitHub username
- `REPO_NAME` with the repository name you created

### Step 1.3: Verify GitHub Push

- Check [GitHub.com](https://github.com) and navigate to your repository
- Confirm all 76 files appear in the repository
- You should see the README.md file displayed on the repository page

**✅ Phase 1 Complete**: Code is now on GitHub!

---

## Phase 2: Deploy Backend to Render

### Step 2.1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with GitHub (recommended - allows automatic deployment)
4. Authorize Render to access your GitHub account

### Step 2.2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name**: `inventory-db`
   - **Database**: `inventory_db`
   - **User**: `postgres`
   - **Region**: Choose the region closest to your users
   - **PostgreSQL Version**: 15
   - **Datadog API Key**: Leave blank (optional monitoring)
3. Click **"Create Database"**
4. ⏳ **Wait 3-5 minutes** for database to initialize

### Step 2.3: Copy Database Connection URL

1. After database is created, go to the database details page
2. Find **"Internal Database URL"** section
3. Copy the connection string (looks like: `postgresql://user:password@host/database`)
4. **Save this somewhere safe** - you'll need it in the next step

### Step 2.4: Create Web Service for Backend

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing Git repository"**
3. Click **"Connect account"** if needed (to link GitHub)
4. Find and select your `inventory-management-system` repository
5. Click **"Connect"**

### Step 2.5: Configure Backend Service

On the deployment page, fill in:

**Basic Settings:**
- **Name**: `inventory-backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`

**Root Directory**: Leave blank (or enter `.` for project root)

**Pricing Plan**: Select **"Free"** (if available in your region)

### Step 2.6: Add Environment Variables

Click **"Advanced"** and then click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste your PostgreSQL URL from Step 2.3 |
| `DEBUG` | `false` |
| `ENVIRONMENT` | `production` |
| `PYTHONUNBUFFERED` | `1` |
| `LOG_LEVEL` | `info` |

**Important**: Make sure `DATABASE_URL` includes the full connection string with password!

### Step 2.7: Deploy Backend

1. Click **"Create Web Service"**
2. ⏳ **Wait 10-15 minutes** for the build and deployment to complete
3. Watch the **"Logs"** tab for any build errors
4. Once deployed, you'll see a URL like: `https://inventory-backend-xxxxx.onrender.com`

### Step 2.8: Verify Backend Deployment

1. Copy your backend URL from Render
2. In browser, visit: `https://your-backend-url/health`
3. You should see: `{"status":"healthy","environment":"production"}`
4. Also test: `https://your-backend-url/docs` (API documentation)

**✅ Phase 2 Complete**: Backend deployed on Render!

---

## Phase 3: Deploy Frontend to Vercel

### Step 3.1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your GitHub account

### Step 3.2: Add Project to Vercel

1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select your `inventory-management-system` repository
4. Click **"Import"**

### Step 3.3: Configure Frontend Project

On the import page, fill in:

**Project Configuration:**
- **Project Name**: `inventory-frontend`
- **Framework Preset**: **"Vite"** (very important!)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (should auto-fill)
- **Output Directory**: `dist` (should auto-fill)

### Step 3.4: Add Environment Variables

Before deploying, add the backend URL:

1. Click **"Environment Variables"**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url` (from Render deployment)
   - Click **"Add"**

**Example**: If your Render backend URL is `https://inventory-backend-abc123.onrender.com`, enter that as the `VITE_API_URL`.

### Step 3.5: Deploy Frontend

1. Click **"Deploy"**
2. ⏳ **Wait 5-10 minutes** for build and deployment
3. Watch for build completion message
4. You'll receive a URL like: `https://inventory-frontend-xxxxx.vercel.app`

### Step 3.6: Verify Frontend Deployment

1. Visit your Vercel frontend URL
2. You should see the Inventory dashboard loading
3. Try navigating between pages (Products, Customers, Orders)
4. Open browser DevTools → Network tab
5. Confirm API requests go to your Render backend URL

**✅ Phase 3 Complete**: Frontend deployed on Vercel!

---

## Phase 4: Final Verification

### Complete Production URL

Your system is now live at:
- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend API**: `https://your-backend-url.onrender.com`
- **API Docs**: `https://your-backend-url.onrender.com/docs`

### Test Production Deployment

1. Visit your Vercel frontend URL
2. Navigate to **"Products"** page
3. **Search** for a product by ID
4. **Add a new product** with custom ID
5. **Add another product** without ID (auto-increment)
6. Verify data appears correctly
7. Check **"Dashboard"** for updated metrics

### Monitor Deployments

**Render Backend:**
- Dashboard → Your Service → Logs (view real-time logs)
- Watch for any errors or warnings

**Vercel Frontend:**
- Dashboard → Your Project → Analytics (view usage)
- Check Build section for deployment history

---

## Phase 5: Automatic Deployments

### GitHub Push → Auto-Deploy

Once connected, any push to your GitHub repository will automatically:
1. Trigger a new build on Render (backend)
2. Trigger a new build on Vercel (frontend)
3. Deploy the changes automatically

**Workflow:**
```bash
# Make code changes locally
git add .
git commit -m "Your changes"
git push origin main

# Both Render and Vercel automatically build and deploy!
```

### Manual Redeployment

If needed:
- **Render**: Dashboard → Your Service → Click "Manual Deploy"
- **Vercel**: Dashboard → Your Project → Click "Deploy"

---

## Troubleshooting

### Backend Deployment Issues

**Build Fails:**
- Check logs in Render for specific error
- Verify all dependencies in `backend/requirements.txt`
- Ensure `DATABASE_URL` environment variable is set

**Database Connection Errors:**
- Verify `DATABASE_URL` is correct and complete
- Check database initialization (should be automatic)
- Ensure database region matches backend region

**Service Crashes:**
- Check logs: Render Dashboard → Logs tab
- Look for error messages and stack traces
- Verify all environment variables are set

### Frontend Deployment Issues

**Build Fails:**
- Check Vercel build logs
- Verify Node.js version compatibility
- Ensure `VITE_API_URL` environment variable is set

**API Requests Fail (CORS Error):**
- Verify backend has CORS enabled (it does by default)
- Check `VITE_API_URL` matches your backend URL exactly
- Ensure backend is running and healthy

**Blank Page:**
- Check browser console for JavaScript errors
- Verify React Router is loading
- Check DevTools Network tab for failed requests

---

## Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| Render (Backend) | Free | $0/month (with limits) |
| Render (PostgreSQL) | Free | $0/month (limited) |
| Vercel (Frontend) | Hobby | $0/month (free tier) |
| **Total** | | **$0/month** |

*Free tiers have resource limitations. Upgrade if needed as your application grows.*

---

## Next Steps

After successful deployment:

1. **Monitor Performance**
   - Check logs regularly for errors
   - Monitor API response times
   - Track frontend usage via Vercel Analytics

2. **Add Features**
   - User authentication
   - Advanced filtering/search
   - Export/Import functionality
   - Email notifications

3. **Scale Up**
   - Upgrade Render plan for more resources
   - Add Render Cron Jobs for scheduled tasks
   - Configure CDN for faster frontend delivery
   - Add monitoring/alerting

---

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created on Render
- [ ] Backend deployed and responding at `/health`
- [ ] Frontend deployed and loading
- [ ] `VITE_API_URL` environment variable set
- [ ] API requests working from frontend
- [ ] Product creation working end-to-end
- [ ] Search functionality working
- [ ] Dashboard metrics displaying correctly
- [ ] No console errors in browser
- [ ] No error logs in Render/Vercel

---

**Congratulations! Your production system is deployed! 🎉**
