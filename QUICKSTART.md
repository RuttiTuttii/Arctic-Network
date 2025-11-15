# 🌍 Arctic Network - Quick Start Guide

Complete real-time dashboard system for Arctic satellite data monitoring with AI assistant.

## 📋 Project Structure

```
Arctic-Network/
├── components/          # React components (UI, features, pages)
├── contexts/           # React context (Auth, Language)
├── pages/              # Page components
├── hooks/              # Custom hooks (useDashboard)
├── styles/             # Global styles
├── server/             # Node.js/Express backend
│   ├── server.ts       # Express API server
│   ├── mockDataGenerator.ts  # Real-time data generation
│   └── package.json
├── db/                 # SQLite database
├── init-db.sh          # Database initialization script
└── docker-compose.yml  # Local development setup
```

## 🚀 Quick Start (5 minutes)

### Option 1: Local Development (Recommended for first-time setup)

#### 1. Initialize Database

```bash
chmod +x init-db.sh
./init-db.sh
```

#### 2. Install Frontend Dependencies

```bash
npm install
```

#### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

#### 4. Start Frontend (Terminal 1)

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

#### 5. Start Backend (Terminal 2)

```bash
cd server
npm run dev
```

Backend will be available at: `http://localhost:3000`

#### 6. Test API

```bash
# Get dashboard data
curl http://localhost:3000/api/dashboard

# Get specific metric
curl http://localhost:3000/api/dashboard/metric/temperature

# Get historical data
curl 'http://localhost:3000/api/dashboard/history?type=temperature&limit=60'

# Health check
curl http://localhost:3000/api/health
```

### Option 2: Docker Compose (Full stack in one command)

```bash
# Initialize database first
chmod +x init-db.sh
./init-db.sh

# Start all services
docker-compose up
```

Accessing the application:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📊 API Endpoints

### Dashboard Data
- **GET** `/api/dashboard` - Get all current metrics
- **GET** `/api/dashboard/metric/:type` - Get specific metric
- **GET** `/api/dashboard/history?type=temperature&limit=60` - Get historical data
- **GET** `/api/health` - Health check

### Example Response

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "data": {
    "temperature": {
      "value": -15.3,
      "min": -25,
      "max": -5,
      "change_24h": 0.5,
      "trend": "up"
    },
    ...
  },
  "satellites": {
    "active": 47,
    "status": "operational",
    "coverage": 98.5
  }
}
```

## 🎨 Frontend Features

### Pages
- **Home** (`/`) - Landing page with features showcase
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - Account creation
- **Dashboard** (`/dashboard`) - Real-time Arctic data monitoring (Protected)
- **Chat** (`/chat`) - AI assistant for satellite data analysis
- **Pricing** (`/pricing`) - Subscription plans

### Components
- **GlassMenu** - Navigation with smooth animations (auto-hide after 3s)
- **DashboardPreview** - Real-time metric visualization
- **SatelliteNetwork** - Interactive satellite visualization
- **Hero** - Landing page hero section
- **Features** - Feature showcase with icons

### Features
- Real-time data updates (every 2 seconds)
- Smooth animations with Framer Motion
- Glass morphism UI design
- Russian/English language support
- Authentication with protected routes
- AI chat assistant integration
- Responsive mobile design

## 🔌 Frontend Integration Example

```typescript
import { useDashboardData } from "@/hooks/useDashboard";

function Dashboard() {
  const { dashboardData, satellites, loading, error } = useDashboardData(2000);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Temperature: {dashboardData?.temperature.value}°C</h1>
      <p>Satellites: {satellites?.active} active</p>
    </div>
  );
}
```

## 🗄️ Database

### Tables
- `users` - User accounts
- `satellites` - Satellite metadata
- `data_points` - Historical satellite data
- `dashboard_data` - Current real-time metrics
- `dashboard_history` - Time-series metric history
- `sessions` - Active sessions
- `payments` - Payment records
- `permissions` - User permissions

### Real-time Data Generation

The backend generates mock Arctic data every second:
- **Temperature**: -25°C to -5°C (±0.5°C volatility)
- **Ice Coverage**: 80% to 95% (±1% volatility)
- **Pollution**: 15 to 35 µg/m³ (±0.8 volatility)
- **Wildlife**: 1200-1300 count (±5 volatility)
- **Wind Speed**: 5-25 m/s (±2 volatility)
- **Sea Level**: 0-5 cm (±0.1 volatility)

Data is automatically persisted to database and served via REST API.

## 🛠️ Build & Production

### Frontend Build

```bash
npm run build
npm run preview  # Preview production build locally
```

Built files go to: `dist/`

### Backend Build

```bash
cd server
npm run build
npm start
```

Built files go to: `server/dist/`

## 🌐 Environment Variables

### Frontend (`.env.development`)
```
VITE_API_URL=http://localhost:3000
```

### Backend (`.env`)
```
PORT=3000
NODE_ENV=development
```

## 📝 Key Technologies

**Frontend:**
- React 18 with TypeScript
- Vite (ultra-fast build tool)
- Tailwind CSS (utility-first CSS)
- Framer Motion (animation library)
- React Router (routing)
- shadcn/ui (component library)

**Backend:**
- Node.js 20
- Express.js (API framework)
- SQLite (lightweight database)
- better-sqlite3 (synchronous driver)
- CORS (cross-origin support)

## 🧪 Development Tips

### Debugging Frontend
1. Open DevTools: `F12` or `Cmd+Option+I`
2. Check Console for errors
3. Use React DevTools extension

### Debugging Backend
```bash
# Run with debug output
DEBUG=* npm run dev

# Verbose logging
NODE_DEBUG=* npm run dev
```

### Database Inspection
```bash
# Open SQLite CLI
sqlite3 db/arctic.db

# View table structure
.schema dashboard_data

# Query data
SELECT * FROM dashboard_data;
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Connection Error
```bash
# Reinitialize database
rm db/arctic.db
./init-db.sh
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For server
cd server && npm install
```

### CORS Issues
Ensure `VITE_API_URL` in `.env.development` matches backend URL:
```
VITE_API_URL=http://localhost:3000
```

## 📚 Documentation

- Frontend setup: See root `README.md`
- Backend setup: See `server/README.md`
- Database schema: See `db/schema.sql`
- API documentation: See `server/README.md` API Endpoints section

## 🎯 Next Steps

1. ✅ Database initialized with real-time metric tables
2. ✅ Backend server running with mock data generation
3. ✅ Frontend hooks for API integration created
4. 🔄 Update DashboardPage to use `useDashboardData` hook
5. 🔄 Add chart visualizations for metrics
6. 🔄 Implement user authentication flow
7. 🔄 Deploy to production

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs: `npm run dev` output
3. Check frontend console: DevTools
4. Inspect database: `sqlite3 db/arctic.db`

---

**Happy coding! 🚀 The Arctic is waiting for real-time monitoring.**
