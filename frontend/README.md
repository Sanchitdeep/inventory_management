# React + Vite Frontend for Inventory Management System

This is a modern React application built with Vite, providing a responsive user interface for the Inventory & Order Management System.

## Features

- 📊 **Dashboard**: Real-time metrics and inventory overview
- 📦 **Products Management**: Full CRUD operations for products
- 👥 **Customers Management**: Manage customer information
- 🛒 **Orders Management**: Create and manage customer orders
- 🎨 **Responsive UI**: Mobile-friendly interface with Tailwind CSS
- ⚡ **Fast Development**: Vite hot module replacement (HMR)

## Tech Stack

- **React 18.2**: Modern UI library
- **Vite 5.0**: Lightning-fast build tool
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful SVG icons

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components (Dashboard, Products, etc.)
│   ├── services/       # API service layer
│   ├── styles/         # Global styles
│   ├── utils/          # Helper functions
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── index.html          # HTML template
└── tailwind.config.js  # Tailwind configuration
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Inventory & Order Management System
```

## Components

### Pages
- **Dashboard**: Displays key metrics and low-stock products
- **Products**: Manage product inventory with CRUD operations
- **Customers**: Manage customer information
- **Orders**: Create and track orders

### Reusable Components
- `Card`: Container component
- `StatCard`: Statistics display card
- `Button`: Styled button component
- `Input`: Form input field
- `Select`: Dropdown selector
- `Modal`: Dialog component
- `LoadingSpinner`: Loading indicator
- `Alerts`: Error, success, and warning messages
- `Pagination`: Pagination controls

## API Integration

All API calls are made through the `src/services/api.js` service layer, which provides:
- `productAPI`: Product endpoints
- `customerAPI`: Customer endpoints
- `orderAPI`: Order endpoints
- `dashboardAPI`: Dashboard metrics endpoint

## Styling

The project uses Tailwind CSS for styling with custom components and utilities defined in `src/styles/index.css`.

## Features in Detail

### Dashboard
- View total products, customers, orders, and revenue
- See low-stock products that need replenishment
- Real-time metrics from backend

### Products
- Create, read, update, and delete products
- Manage SKU, price, and inventory levels
- Search and filter products

### Customers
- Manage customer database
- Store email and phone information
- CRUD operations

### Orders
- Create orders with multiple items
- View order details and history
- Manage order inventory deductions

## Future Enhancements

- [ ] Search and filter functionality
- [ ] Advanced pagination
- [ ] Data export (CSV/PDF)
- [ ] User authentication
- [ ] Order status tracking
- [ ] Inventory analytics
