# Deployment Guide - Render Backend

This guide covers deploying the FastAPI backend to Render.com with PostgreSQL.

## Prerequisites

- Render.com account (free tier available)
- GitHub account with repository pushed
- PostgreSQL database

## Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"PostgreSQL"**
3. Fill in details:
   - **Name**: `inventory-db` (or your choice)
   - **Database**: `inventory_db`
   - **User**: `postgres`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15
4. Click **"Create Database"**
5. Note the **Internal Database URL** (starts with `postgresql://`)

## Step 2: Deploy Backend Service

1. In Render Dashboard, click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Fill in details:
   - **Name**: `inventory-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Click **"Advanced"** and add environment variables:

```
DATABASE_URL=<your-postgres-internal-url>
DEBUG=false
ENVIRONMENT=production
PYTHONUNBUFFERED=1
```

5. **Pricing Plan**: Free tier is available
6. Click **"Create Web Service"**

## Step 3: Verify Deployment

1. Wait for build to complete (5-10 minutes)
2. Check deployment logs for errors
3. Visit your service URL to see health check
4. Verify API docs at `https://your-service.onrender.com/docs`

## Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `DEBUG` | false | `false` |
| `ENVIRONMENT` | production | `production` |
| `PYTHONUNBUFFERED` | 1 | `1` |

## Common Issues

### Database Connection Timeout

- Ensure `DATABASE_URL` includes full connection string
- Check database is in same region or has correct IP allowlist
- Verify credentials are correct

### Build Fails

- Check Python version compatibility
- Ensure `requirements.txt` is present
- Check build logs for dependency issues

### Service Crashes After Deploy

- Check logs: Render Dashboard → Your Service → Logs
- Verify environment variables are set
- Test locally with same Python version

## Updating Deployment

### Push Code Updates

```bash
git add .
git commit -m "Your changes"
git push
```

Render will automatically redeploy if connected to GitHub.

### Manual Redeploy

1. Go to your service in Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Database Migrations

If you add new models:

1. Update SQLAlchemy models in `app/models/`
2. Push to GitHub (Render will rebuild)
3. SQLAlchemy will auto-create tables on first run

## API Endpoints

After deployment, access your API:

```
Base URL: https://your-service.onrender.com

Products: https://your-service.onrender.com/products
Customers: https://your-service.onrender.com/customers
Orders: https://your-service.onrender.com/orders
Dashboard: https://your-service.onrender.com/dashboard
Documentation: https://your-service.onrender.com/docs
```

## Performance Tips

1. Use Render's PostgreSQL in same region
2. Consider Pro tier for better performance
3. Set up monitoring in Render Dashboard
4. Monitor API response times

## Support

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- GitHub Issues for bug reports
