-- Arctic Network Database Schema
-- SQLite database for storing satellite monitoring data

-- Users table for authentication and permissions
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'admin', 'user', 'viewer'
    company_name TEXT,
    subscription_type TEXT DEFAULT 'free', -- 'free', 'starter', 'professional', 'enterprise'
    subscription_status TEXT DEFAULT 'inactive', -- 'active', 'inactive', 'cancelled', 'expired'
    subscription_expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Satellites table
CREATE TABLE satellites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'orbital', 'ground', 'buoy'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
    latitude REAL,
    longitude REAL,
    altitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Data points table for sensor readings
CREATE TABLE data_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    satellite_id INTEGER NOT NULL,
    data_type TEXT NOT NULL, -- 'temperature', 'ice_coverage', 'pollution', etc.
    value REAL NOT NULL,
    unit TEXT,
    latitude REAL,
    longitude REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (satellite_id) REFERENCES satellites(id)
);

-- Permissions table for role-based access
CREATE TABLE permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    resource TEXT NOT NULL, -- 'dashboard', 'satellites', 'data', etc.
    action TEXT NOT NULL, -- 'read', 'write', 'delete'
    UNIQUE(role, resource, action)
);

-- Insert default permissions
INSERT INTO permissions (role, resource, action) VALUES
('admin', 'all', 'all'),
('user', 'dashboard', 'read'),
('user', 'data', 'read'),
('viewer', 'dashboard', 'read');

-- Sessions table for authentication
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payments table for storing payment information
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subscription_type TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT NOT NULL, -- 'card', 'paypal', etc.
    card_last_four TEXT, -- Last 4 digits of card
    card_brand TEXT, -- 'visa', 'mastercard', etc.
    transaction_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    billing_period TEXT NOT NULL, -- 'monthly', 'yearly'
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Real-time dashboard data
CREATE TABLE dashboard_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_type TEXT NOT NULL, -- 'temperature', 'ice_coverage', 'pollution', 'wildlife', 'wind_speed', 'sea_level'
    value REAL NOT NULL,
    min_value REAL,
    max_value REAL,
    change_24h REAL,
    trend TEXT, -- 'up', 'down', 'stable'
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(data_type)
);

-- Historical dashboard data for trends
CREATE TABLE dashboard_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_type TEXT NOT NULL,
    value REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (data_type) REFERENCES dashboard_data(data_type)
);

-- Chat sessions table for managing multiple conversations
CREATE TABLE chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    message_count INTEGER DEFAULT 0
);

-- Chat messages table for conversation history
CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_data_points_satellite_id ON data_points(satellite_id);
CREATE INDEX idx_data_points_timestamp ON data_points(timestamp);
CREATE INDEX idx_data_points_type ON data_points(data_type);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_users_subscription_type ON users(subscription_type);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_dashboard_data_type ON dashboard_data(data_type);
CREATE INDEX idx_dashboard_history_type ON dashboard_history(data_type);
CREATE INDEX idx_dashboard_history_timestamp ON dashboard_history(timestamp);
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp);