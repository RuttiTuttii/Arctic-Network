# Arctic Network Server

Real-time data generation server for the Arctic Network dashboard application.

## Features

- **Real-time Mock Data Generation**: Updates satellite metrics every second
- **SQLite Database**: Persists current values and historical data
- **REST API**: Provides endpoints for current data, metrics, and historical trends
- **CORS Support**: Enables frontend integration
- **Health Checks**: Built-in monitoring endpoint

## Setup

### Installation

```bash
cd server
npm install
```

### Environment

Create a `.env` file in the server directory (optional):

```
PORT=3000
NODE_ENV=development
```

### Database

The server expects a SQLite database at `db/arctic.db`. The schema should include:

```sql
CREATE TABLE dashboard_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_type TEXT UNIQUE NOT NULL,
  value REAL NOT NULL,
  min_value REAL NOT NULL,
  max_value REAL NOT NULL,
  change_24h REAL DEFAULT 0,
  trend TEXT DEFAULT 'stable',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dashboard_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_type TEXT NOT NULL,
  value REAL NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (data_type) REFERENCES dashboard_data(data_type)
);
```

## Development

Run the server in development mode with hot-reload:

```bash
npm run dev
```

## Build & Production

Build TypeScript:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## API Endpoints

### Get Dashboard Data

```
GET /api/dashboard
```

Returns all current metrics with satellite status.

**Response:**

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
    "ice_coverage": {
      "value": 87.2,
      "min": 80,
      "max": 95,
      "change_24h": -1.2,
      "trend": "down"
    },
    "pollution": {...},
    "wildlife": {...},
    "wind_speed": {...},
    "sea_level": {...}
  },
  "satellites": {
    "active": 47,
    "status": "operational",
    "coverage": 98.5
  }
}
```

### Get Specific Metric

```
GET /api/dashboard/metric/:type
```

Get current value and metadata for a specific metric.

**Parameters:**
- `type` - Metric type: `temperature`, `ice_coverage`, `pollution`, `wildlife`, `wind_speed`, `sea_level`

**Response:**

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "metric": "temperature",
  "data_type": "temperature",
  "value": -15.3,
  "min_value": -25,
  "max_value": -5,
  "change_24h": 0.5,
  "trend": "up"
}
```

### Get Historical Data

```
GET /api/dashboard/history?type=temperature&limit=60
```

Get historical data for trend visualization.

**Query Parameters:**
- `type` - Metric type (default: `temperature`)
- `limit` - Number of records (default: 60)

**Response:**

```json
{
  "metric": "temperature",
  "data": [
    {
      "data_type": "temperature",
      "value": -15.1,
      "timestamp": "2024-01-15T10:29:45.123Z"
    },
    {
      "data_type": "temperature",
      "value": -15.2,
      "timestamp": "2024-01-15T10:30:00.123Z"
    },
    ...
  ]
}
```

### Health Check

```
GET /api/health
```

Check server status and uptime.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime": 1234.56
}
```

## Data Metrics

The server generates and tracks the following Arctic metrics:

| Metric | Min | Max | Volatility | Unit |
|--------|-----|-----|-----------|------|
| Temperature | -25 | -5 | ±0.5 | °C |
| Ice Coverage | 80 | 95 | ±1% | % |
| Pollution | 15 | 35 | ±0.8 | µg/m³ |
| Wildlife | 1200 | 1300 | ±5 | count |
| Wind Speed | 5 | 25 | ±2 | m/s |
| Sea Level | 0 | 5 | ±0.1 | cm |

## Data Update Frequency

- **Real-time Updates**: Every 1 second
- **Database Persistence**: Synchronous with updates
- **Historical Archive**: Automatic with each update

## Frontend Integration

To connect the frontend to this server, update your dashboard API calls:

```typescript
// Example: Fetch current dashboard data
const response = await fetch('http://localhost:3000/api/dashboard');
const data = await response.json();

// Example: Fetch temperature history for charts
const history = await fetch('http://localhost:3000/api/dashboard/history?type=temperature&limit=60');
const chartData = await history.json();
```

## Troubleshooting

### Module Not Found Errors

Install missing dependencies:

```bash
npm install
```

### Database Connection Failed

Ensure the database file exists at `db/arctic.db` and has proper permissions.

### Port Already in Use

Change the port:

```bash
PORT=3001 npm run dev
```

## License

MIT
