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