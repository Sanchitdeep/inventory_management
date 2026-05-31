# Deployment Guide - Vercel Frontend

This guide covers deploying the React frontend to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub account with repository pushed
- Backend service deployed (see DEPLOYMENT_RENDER.md)

## Step 1: Connect GitHub Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository
5. Click **"Import"**

## Step 2: Configure Project Settings

1. **Project Name**: `inventory-frontend` (or your choice)
2. **Framework Preset**: Select **"Vite"**
3. **Root Directory**: `frontend`
4. Leave other settings at default

## Step 3: Add Environment Variables

Before deploying, add environment variables:

1. In Vercel Project Settings, go to **"Environment Variables"**
2. Add the following:

```
VITE_API_URL=https://your-backend-service.onrender.com
```

Replace `your-backend-service` with your actual Render service name.

### Alternative (for local development):
```
VITE_API_URL=http://localhost:8000
```

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. You'll receive a deployment URL: `https://xxx.vercel.app`

## Step 5: Update Frontend for Production

### Update Backend API URL

If you used different API URL in environment variables, the frontend will automatically use it.

To verify:
1. Visit your Vercel deployment URL
2. Open browser DevTools → Network tab
3. Check that API requests go to your Render backend

## Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Backend service URL | `https://inventory-backend.onrender.com` |

## Build Settings

- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)
- **Install Command**: `npm install` (default)

## Common Issues

### API Requests Fail (CORS Error)

1. Check backend has CORS enabled (should be in FastAPI)
2. Verify `VITE_API_URL` environment variable is correct
3. Ensure backend service is running on Render

### Build Fails

- Check Node.js version compatibility
- Verify `package.json` dependencies are correct
- Check build logs in Vercel for specific errors

### Blank Page or 404

1. Ensure React Router is working
2. Check browser console for JavaScript errors
3. Verify `.env` file is NOT committed to GitHub

## Updating Deployment

### Push Code Updates

```bash
cd frontend
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically redeploy when you push to main branch.

### Manual Redeploy

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Redeploy"** → **"Redeploy latest commit"**

## Custom Domain

1. Go to project in Vercel Dashboard
2. Settings → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration steps

## Performance Optimization

1. **Enable Caching**: Set long cache headers for static assets
2. **Image Optimization**: Use Vercel's Image Optimization
3. **Database Connection**: Keep backend geographically close
4. **CDN**: Vercel automatically uses edge network

## Monitoring

1. Vercel Dashboard shows deployment history
2. Analytics available for Pro tier
3. Monitor backend logs separately

## API Base URL Configuration

### Development
```bash
# .env.local
VITE_API_URL=http://localhost:8000
```

### Production (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

### Docker
```
VITE_API_URL=/api
```
(Proxied through nginx)

## Troubleshooting

### API calls returning 404

- Check that backend service is running
- Verify `VITE_API_URL` environment variable
- Check backend CORS settings

### Frontend displays correctly but API fails

- Open DevTools → Network tab
- Check API request URL
- Verify backend can handle CORS requests

### Build takes too long

- Check for large dependencies in `package.json`
- Consider using lighter alternatives
- Optimize images in `public/` folder

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Next.js Deployment](https://vercel.com/solutions/nextjs) (if migrating from Vite)
- GitHub Issues for bug reports

## Next Steps

1. Test API connectivity from deployed frontend
2. Set up custom domain (optional)
3. Enable analytics (Pro tier)
4. Configure CI/CD for automated deployments
5. Set up monitoring and alerts
