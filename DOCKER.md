# Docker Deployment Guide

## Overview

This project includes Docker configuration for easy deployment. The Docker setup includes:
- **PostgreSQL** database service
- **FastAPI** backend service  
- **React + Nginx** frontend service

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Ethara_AI_project
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if you want to change default values:

```env
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=inventory_db
DEBUG=false
```

### 3. Build and Start Services

```bash
# Build images and start all services
docker-compose up -d

# Or with verbose output
docker-compose up
```

### 4. Access the Application

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Swagger UI**: http://localhost:8000/redoc

### 5. Verify Services

Check service status:

```bash
docker-compose ps
```

View logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Common Commands

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove All Data

```bash
docker-compose down -v
```

### Rebuild Images

```bash
docker-compose build --no-cache
```

### Run Backend Migrations

```bash
docker-compose exec backend python -m alembic upgrade head
```

### Access Database

```bash
docker-compose exec db psql -U postgres -d inventory_db
```

### View Backend Logs

```bash
docker-compose logs -f backend
```

### SSH into a Container

```bash
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec db bash
```

## Database

### Initial Data

The PostgreSQL service automatically creates the `inventory_db` database on first run.

### Reset Database

```bash
# Remove the database volume and start fresh
docker-compose down -v
docker-compose up -d
```

## Health Checks

Each service includes health checks:

- **Backend**: GET `/health` endpoint
- **Frontend**: HTTP status check
- **Database**: PostgreSQL `pg_isready` check

View health status:

```bash
docker-compose ps
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL username | postgres |
| `DB_PASSWORD` | PostgreSQL password | postgres |
| `DB_NAME` | Database name | inventory_db |
| `DATABASE_URL` | Full database connection string | postgresql://... |
| `DEBUG` | Debug mode | false |
| `ENVIRONMENT` | Environment type | production |
| `VITE_API_URL` | Frontend API base URL | http://localhost:8000 |

## Production Deployment

### Change Credentials

For production, update `.env` with strong passwords:

```env
DB_PASSWORD=your_very_secure_password_here
DEBUG=false
ENVIRONMENT=production
```

### Use Production Database

For production, consider using a managed PostgreSQL service (AWS RDS, Azure Database, etc.) and update `DATABASE_URL`:

```env
DATABASE_URL=postgresql://user:password@your-db-host:5432/inventory_db
```

### Build Production Images

```bash
docker-compose -f docker-compose.yml build --no-cache
```

### Use Docker Swarm or Kubernetes

For advanced orchestration, refer to respective documentation:
- Docker Swarm: `docker swarm init`
- Kubernetes: Use `kubectl` with converted manifests

## Troubleshooting

### Port Already in Use

If ports 80, 8000, or 5432 are already in use:

```bash
# Change ports in docker-compose.yml
# For example, change "80:80" to "8080:80" for frontend
```

### Database Connection Failed

Ensure the database is healthy:

```bash
docker-compose logs db
docker-compose ps db
```

### Frontend Shows "Cannot GET /"

Wait for backend to be fully running or check:

```bash
docker-compose logs frontend
docker-compose logs backend
```

### Out of Disk Space

Clean up Docker resources:

```bash
docker system prune -a
docker volume prune
```

## Performance Tips

1. **Use .dockerignore**: Reduces image size and build time
2. **Multi-stage builds**: Backend and frontend use multi-stage builds
3. **Health checks**: Services monitor each other's health
4. **Volume mounts (dev)**: Enable live reload during development

## Security

- Change default database credentials
- Use environment variables for secrets
- Enable HTTPS in production (use reverse proxy)
- Regularly update base images
- Implement network policies

## Support

For issues or questions, refer to:
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- Project repository issues

## Next Steps

### Production Deployment

1. **Render Backend Deployment**: See [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md)
2. **Vercel Frontend Deployment**: See [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)
3. **GitHub Actions CI/CD**: See [.github/workflows](./.github/workflows/)
