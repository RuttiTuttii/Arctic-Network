#!/bin/bash

# Initialize Arctic Network Database
# This script creates the SQLite database and tables if they don't exist

set -e

DB_PATH="${1:-.}/db/arctic.db"
DB_DIR="$(dirname "$DB_PATH")"

echo "🔧 Initializing Arctic Network Database..."
echo "📁 Database path: $DB_PATH"

# Create directory if it doesn't exist
mkdir -p "$DB_DIR"

# Create SQLite database and tables
sqlite3 "$DB_PATH" << 'EOF'
-- Drop existing tables if they exist (optional, for development)
-- DROP TABLE IF EXISTS dashboard_history;
-- DROP TABLE IF EXISTS dashboard_data;
-- DROP TABLE IF EXISTS payments;
-- DROP TABLE IF EXISTS sessions;
-- DROP TABLE IF EXISTS permissions;
-- DROP TABLE IF EXISTS data_points;
-- DROP TABLE IF EXISTS satellites;
-- DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  company TEXT,
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Satellites table
CREATE TABLE IF NOT EXISTS satellites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  latitude REAL,
  longitude REAL,
  altitude REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data points table
CREATE TABLE IF NOT EXISTS data_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  satellite_id INTEGER NOT NULL,
  temperature REAL,
  ice_coverage REAL,
  pollution REAL,
  wildlife INTEGER,
  wind_speed REAL,
  sea_level REAL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (satellite_id) REFERENCES satellites(id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  permission TEXT NOT NULL,
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dashboard data table (real-time metrics)
CREATE TABLE IF NOT EXISTS dashboard_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_type TEXT UNIQUE NOT NULL,
  value REAL NOT NULL,
  min_value REAL NOT NULL,
  max_value REAL NOT NULL,
  change_24h REAL DEFAULT 0,
  trend TEXT DEFAULT 'stable',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard history table (time-series data)
CREATE TABLE IF NOT EXISTS dashboard_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_type TEXT NOT NULL,
  value REAL NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (data_type) REFERENCES dashboard_data(data_type)
);

-- Chat sessions table for managing multiple conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  message_count INTEGER DEFAULT 0
);

-- Chat messages table for conversation history
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  session_id TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_data_points_satellite_id ON data_points(satellite_id);
CREATE INDEX IF NOT EXISTS idx_data_points_timestamp ON data_points(timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_type ON dashboard_data(data_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_history_type ON dashboard_history(data_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_history_timestamp ON dashboard_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Insert sample satellites
INSERT OR IGNORE INTO satellites (name, status, latitude, longitude, altitude) VALUES
('ARCTIC-1', 'active', 78.5, 15.0, 420),
('ARCTIC-2', 'active', 79.2, 20.5, 425),
('ARCTIC-3', 'active', 77.8, 10.2, 418),
('POLAR-1', 'active', 80.1, 25.0, 430),
('POLAR-2', 'active', 76.5, 5.0, 415);

-- Insert initial dashboard data
INSERT OR IGNORE INTO dashboard_data (data_type, value, min_value, max_value, change_24h, trend)
VALUES
('temperature', -15.3, -25, -5, 0.0, 'stable'),
('ice_coverage', 87.2, 80, 95, 0.0, 'stable'),
('pollution', 23.1, 15, 35, 0.0, 'stable'),
('wildlife', 1247, 1200, 1300, 0.0, 'stable'),
('wind_speed', 12.5, 5, 25, 0.0, 'stable'),
('sea_level', 2.3, 0, 5, 0.0, 'stable');

-- Create default chat session
INSERT OR IGNORE INTO chat_sessions (session_id, title, created_at, updated_at, message_count)
VALUES ('default', 'Основной чат', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

EOF

echo "✅ Database initialized successfully!"
echo "📊 Tables created: users, satellites, data_points, sessions, payments, permissions, dashboard_data, dashboard_history, chat_sessions, chat_messages"
echo "🚀 Ready to start the Arctic Network server!"
