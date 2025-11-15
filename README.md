# 🌍 Arctic Network - Real-time Arctic Data Dashboard

A comprehensive, production-ready web application for monitoring Arctic satellite data in real-time with AI-powered analysis and interactive visualizations.

## 🎯 Features

### Dashboard & Monitoring
- ✅ **Real-time Metrics** - Temperature, ice coverage, pollution, wildlife, wind speed, sea level
- ✅ **Live Updates** - Data refreshes every 2 seconds from backend
- ✅ **Satellite Network** - Track 47 active Arctic satellites
- ✅ **Trend Analysis** - Track metric changes with up/down/stable indicators
- ✅ **Historical Data** - View metrics over time with charts

### Backend System
- ✅ **Express.js REST API** - 4 endpoints with real-time data
- ✅ **Mock Data Generator** - Arctic metrics updated every second
- ✅ **SQLite Database** - Time-series data storage with indexes
- ✅ **Docker Support** - Full containerization ready

### Frontend Experience
- ✅ **Glass Morphism UI** - Modern sleek design
- ✅ **Smooth Animations** - Optimized Framer Motion
- ✅ **AI Chat Assistant** - Real-time data analysis
- ✅ **Multi-language** - English and Russian support

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Initialize database
chmod +x init-db.sh && ./init-db.sh

# 2. Start frontend (Terminal 1)
npm install && npm run dev

# 3. Start backend (Terminal 2)
cd server && npm install && npm run dev
```

Visit `http://localhost:5173` and `http://localhost:3000/api/dashboard` ✅

## 📖 Documentation

- **Quick Start**: `QUICKSTART.md`
- **Implementation**: `IMPLEMENTATION.md`
- **Backend**: `server/README.md`
- **Summary**: `BACKEND_SUMMARY.md`

## 🛠️ Tech Stack

**Frontend:** React 18 • TypeScript • Vite • Tailwind CSS • Framer Motion
**Backend:** Express.js • Node.js 20 • SQLite • better-sqlite3 • Docker

---

**🌍 Arctic Network - Monitor the Arctic, Protect the Future 🚀**
