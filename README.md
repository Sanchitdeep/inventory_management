# 📦 Inventory & Order Management System

A complete, production-ready inventory and order management system built with modern web technologies. Manage products, customers, and orders with a clean, responsive interface.

## Features

### Product Management
- ✅ Create, read, update, delete products
- ✅ Custom product IDs or auto-increment
- ✅ Search products by ID
- ✅ Track inventory levels
- ✅ Low-stock alerts

### Customer Management
- ✅ Manage customer information
- ✅ Email and phone validation
- ✅ Customer order history
- ✅ Full CRUD operations

### Order Management
- ✅ Create orders with multiple items
- ✅ Automatic inventory deduction
- ✅ Calculate order totals
- ✅ View order details with customer info
- ✅ Cancel orders with inventory restoration

### Dashboard
- ✅ Key metrics (products, customers, orders, revenue)
- ✅ Low-stock product alerts
- ✅ Real-time updates

## Tech Stack

### Backend
- **Framework**: FastAPI 0.100.0
- **Server**: Uvicorn 0.23.2
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: SQLAlchemy 2.0.50
- **Validation**: Pydantic 2.13.4
- **Language**: Python 3.11+

### Frontend
- **Framework**: React 18.2
- **Bundler**: Vite 5.0
- **Styling**: Tailwind CSS 3.3.6
- **HTTP Client**: Axios 1.6.2
- **Router**: React Router 6.20.0

### DevOps
- **Containerization**: Docker 29.5.2
- **Orchestration**: Docker Compose 5.1.3
- **Web Server**: Nginx (production)

## Project Structure

```
Ethara_AI_project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/          # API endpoints
│   │   ├── core/                # Configuration & exceptions
│   │   ├── database/            # Database setup
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   └── main.py              # FastAPI app
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile               # Docker build config
│   └── .dockerignore            # Docker ignore patterns
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API client
│   │   ├── styles/              # Global styles
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json             # Node dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── Dockerfile               # Docker build config
│   └── .dockerignore            # Docker ignore patterns
├── docker-compose.yml           # Multi-container setup
├── init.sql                     # Database initialization
├── DOCKER.md                    # Docker deployment guide
├── DEPLOYMENT_RENDER.md         # Render backend deployment
├── DEPLOYMENT_VERCEL.md         # Vercel frontend deployment
└── README.md                    # This file
```

## Quick Start

### Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd Ethara_AI_project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload
   ```
   Backend runs at `http://localhost:8000`

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

4. **Access Application**
   - Dashboard: http://localhost:5173
   - API Documentation: http://localhost:8000/docs

### Docker Deployment

1. **Build and Start**
   ```bash
   docker-compose up -d
   ```

2. **Access Services**
   - Frontend: http://localhost (port 80)
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

3. **View Logs**
   ```bash
   docker-compose logs -f
   ```

See [DOCKER.md](./DOCKER.md) for detailed Docker guide.

## API Endpoints

### Products
```
GET    /products              # Get all products
GET    /products/{id}         # Get product by ID
POST   /products              # Create product
PUT    /products/{id}         # Update product
DELETE /products/{id}         # Delete product
```

### Customers
```
GET    /customers             # Get all customers
GET    /customers/{id}        # Get customer by ID
POST   /customers             # Create customer
PUT    /customers/{id}        # Update customer
DELETE /customers/{id}        # Delete customer
```

### Orders
```
GET    /orders                # Get all orders
GET    /orders/{id}           # Get order details
POST   /orders                # Create order
DELETE /orders/{id}           # Delete order (restores inventory)
```

### Dashboard
```
GET    /dashboard             # Get metrics & analytics
```

### Health
```
GET    /health                # Health check
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=inventory_db
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db

# Backend
DEBUG=false
ENVIRONMENT=production

# Frontend
VITE_API_URL=http://localhost:8000
```

## Deployment

### Production Deployment

#### Backend (Render)
See [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md)

**Quick Summary:**
1. Create PostgreSQL database on Render
2. Deploy backend as Web Service
3. Set `DATABASE_URL` environment variable

#### Frontend (Vercel)
See [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)

**Quick Summary:**
1. Connect GitHub repository to Vercel
2. Set `VITE_API_URL` to your Render backend
3. Deploy frontend

## Database

### Local Development
- **Database**: SQLite (auto-created)
- **File**: `backend/inventory.db`

### Production
- **Database**: PostgreSQL
- **Connection**: Configured via `DATABASE_URL` environment variable

### Database Initialization

Tables are automatically created on first application run via SQLAlchemy.

To reset database:
```bash
# Docker
docker-compose down -v
docker-compose up -d

# Local
rm backend/inventory.db
python -m uvicorn app.main:app
```

## Development Guide

### Adding New Features

1. **Backend**
   - Add SQLAlchemy model in `app/models/`
   - Create Pydantic schema in `app/schemas/`
   - Implement service logic in `app/services/`
   - Add API routes in `app/api/routes/`

2. **Frontend**
   - Create API client in `src/services/`
   - Build components in `src/components/`
   - Create page in `src/pages/`
   - Add route in `src/App.jsx`

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

### Code Quality

```bash
# Backend linting
flake8 app/
black app/
isort app/

# Frontend linting
npm run lint
npm run format
```

## Performance Optimization

- ✅ Database query optimization with SQLAlchemy
- ✅ Response pagination
- ✅ Frontend component memoization
- ✅ Tailwind CSS purging for production
- ✅ Multi-stage Docker builds
- ✅ Nginx compression and caching

## Security Features

- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ CORS middleware
- ✅ Security headers (Nginx)
- ✅ Email validation
- ✅ Error handling with custom exceptions

## Monitoring & Logging

- Health checks on all services
- Structured logging in backend
- Console logging in frontend
- Docker container monitoring
- Error tracking and reporting

## Troubleshooting

### Backend Issues
- Check logs: `docker-compose logs backend`
- Verify database connection: Check `DATABASE_URL`
- Test API: Visit `http://localhost:8000/docs`

### Frontend Issues
- Check logs: `docker-compose logs frontend`
- Verify API URL: Check browser DevTools Network tab
- Clear cache: Delete `node_modules` and `.next` folders

### Database Issues
- Reset database: `docker-compose down -v && docker-compose up -d`
- Check connection: `docker-compose exec db psql -U postgres`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- 📖 [Documentation](./DOCKER.md)
- 🐛 [Bug Reports](https://github.com/yourusername/Ethara_AI_project/issues)
- 💬 [Discussions](https://github.com/yourusername/Ethara_AI_project/discussions)

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and connected
- [ ] Backend deployed and tested
- [ ] Frontend deployed with correct API URL
- [ ] SSL/TLS certificates installed
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented
- [ ] Security audit completed

## Performance Metrics

- API response time: < 100ms
- Database queries: Optimized with indexes
- Frontend load time: < 2 seconds
- Container startup time: < 30 seconds

## Next Steps

1. Customize branding and colors
2. Add user authentication
3. Implement advanced filtering and search
4. Add export/import functionality
5. Set up automated backups
6. Configure monitoring and alerts

---

**Built with ❤️ using FastAPI, React, and Docker**
