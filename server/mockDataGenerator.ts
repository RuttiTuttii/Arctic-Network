// @ts-ignore
import sqlite3 from "sqlite3";

// Types
interface DashboardData {
  temperature: number;
  ice_coverage: number;
  pollution: number;
  wildlife: number;
  wind_speed: number;
  sea_level: number;
}

interface DataPoint {
  data_type: string;
  value: number;
  min_value: number;
  max_value: number;
  change_24h: number;
  trend: "up" | "down" | "stable";
}

class MockDataGenerator {
  private db: sqlite3.Database;
  private dataStore: Map<string, DataPoint> = new Map();
  private initialized: boolean = false;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase(() => {
      this.initializeData();
    });
  }

  private initializeDatabase(callback: () => void): void {
    // Create tables if they don't exist
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS dashboard_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_type TEXT NOT NULL,
        value REAL NOT NULL,
        min_value REAL,
        max_value REAL,
        change_24h REAL DEFAULT 0,
        trend TEXT DEFAULT 'stable',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(data_type)
      );

      CREATE TABLE IF NOT EXISTS dashboard_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_type TEXT NOT NULL,
        value REAL NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (data_type) REFERENCES dashboard_data(data_type)
      );

      CREATE TABLE IF NOT EXISTS chat_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        message_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_id TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_dashboard_data_type ON dashboard_data(data_type);
      CREATE INDEX IF NOT EXISTS idx_dashboard_history_type ON dashboard_history(data_type);
      CREATE INDEX IF NOT EXISTS idx_dashboard_history_timestamp ON dashboard_history(timestamp);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
    `;

    this.db.exec(createTablesSQL, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        callback();
      }
    });
  }

  private initializeData(): void {
    // Initialize data ranges
    const dataConfigs = {
      temperature: { min: -25, max: -5, initial: -15.3 },
      ice_coverage: { min: 80, max: 95, initial: 87.2 },
      pollution: { min: 15, max: 35, initial: 23.1 },
      wildlife: { min: 1200, max: 1300, initial: 1247 },
      wind_speed: { min: 5, max: 25, initial: 12.5 },
      sea_level: { min: 0, max: 5, initial: 2.3 },
    };

    for (const [type, config] of Object.entries(dataConfigs)) {
      this.dataStore.set(type, {
        data_type: type,
        value: config.initial,
        min_value: config.min,
        max_value: config.max,
        change_24h: 0,
        trend: "stable" as const,
      });
    }

    // Insert initial data into DB
    this.syncToDatabase();
    this.initialized = true;
  }

  public generateNewData(): void {
    const dataConfigs = {
      temperature: { min: -25, max: -5, volatility: 0.5 },
      ice_coverage: { min: 80, max: 95, volatility: 1 },
      pollution: { min: 15, max: 35, volatility: 0.8 },
      wildlife: { min: 1200, max: 1300, volatility: 5 },
      wind_speed: { min: 5, max: 25, volatility: 2 },
      sea_level: { min: 0, max: 5, volatility: 0.1 },
    };

    for (const [type, config] of Object.entries(dataConfigs)) {
      const currentData = this.dataStore.get(type)!;
      const randomChange = (Math.random() - 0.5) * config.volatility;
      const newValue = Math.max(
        config.min,
        Math.min(config.max, currentData.value + randomChange)
      );

      const newChange = newValue - currentData.value;

      let trend: "up" | "down" | "stable" = "stable";
      if (newChange > 0.1) trend = "up";
      else if (newChange < -0.1) trend = "down";

      this.dataStore.set(type, {
        data_type: type,
        value: Math.round(newValue * 10) / 10,
        min_value: config.min,
        max_value: config.max,
        change_24h: Math.round(newChange * 100) / 100,
        trend,
      });
    }

    this.syncToDatabase();
  }

  private syncToDatabase(): void {
    const dataArray = Array.from(this.dataStore.values());
    let completed = 0;

    dataArray.forEach((data) => {
      // Insert/update current data
      this.db.run(`
        INSERT INTO dashboard_data (data_type, value, min_value, max_value, change_24h, trend, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(data_type) DO UPDATE SET
          value = excluded.value,
          min_value = excluded.min_value,
          max_value = excluded.max_value,
          change_24h = excluded.change_24h,
          trend = excluded.trend,
          updated_at = CURRENT_TIMESTAMP
      `, [data.data_type, data.value, data.min_value, data.max_value, data.change_24h, data.trend], (err) => {
        if (err) {
          console.error("Error syncing data:", err);
        }

        // Also save to history
        this.db.run(`
          INSERT INTO dashboard_history (data_type, value, timestamp)
          VALUES (?, ?, CURRENT_TIMESTAMP)
        `, [data.data_type, data.value], (err) => {
          if (err) {
            console.error("Error saving history:", err);
          }
          completed++;
        });
      });
    });
  }

  public getCurrentData(): DashboardData {
    return {
      temperature: this.dataStore.get("temperature")?.value || -15.3,
      ice_coverage: this.dataStore.get("ice_coverage")?.value || 87.2,
      pollution: this.dataStore.get("pollution")?.value || 23.1,
      wildlife: this.dataStore.get("wildlife")?.value || 1247,
      wind_speed: this.dataStore.get("wind_speed")?.value || 12.5,
      sea_level: this.dataStore.get("sea_level")?.value || 2.3,
    };
  }

  public getAllData(): DataPoint[] {
    return Array.from(this.dataStore.values());
  }

  public getDataByType(type: string): DataPoint | undefined {
    return this.dataStore.get(type);
  }

  public getDataByTypeFromDB(type: string, callback: (data: DataPoint | null) => void): void {
    this.db.get(
      "SELECT * FROM dashboard_data WHERE data_type = ?",
      [type],
      (err, row: any) => {
        if (err) {
          console.error("Error getting data by type:", err);
          callback(null);
        } else {
          callback(row ? {
            data_type: row.data_type,
            value: row.value,
            min_value: row.min_value,
            max_value: row.max_value,
            change_24h: row.change_24h,
            trend: row.trend
          } : null);
        }
      }
    );
  }

  public getHistoryData(type: string, limit: number, callback: (data: any[]) => void): void {
    this.db.all(
      "SELECT data_type, value, timestamp FROM dashboard_history WHERE data_type = ? ORDER BY timestamp DESC LIMIT ?",
      [type, limit],
      (err, rows: any[]) => {
        if (err) {
          console.error("Error getting history data:", err);
          callback([]);
        } else {
          callback(rows.reverse()); // Return in chronological order
        }
      }
    );
  }

  // Chat session methods
  public createChatSession(title: string, callback: (sessionId: string | null) => void): void {
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.db.run(
      "INSERT INTO chat_sessions (session_id, title, created_at, updated_at, message_count) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)",
      [sessionId, title],
      function(err) {
        if (err) {
          console.error("Error creating chat session:", err);
          callback(null);
        } else {
          callback(sessionId);
        }
      }
    );
  }

  public getChatSessions(callback: (sessions: any[]) => void): void {
    this.db.all(
      "SELECT session_id, title, created_at, updated_at, message_count FROM chat_sessions ORDER BY updated_at DESC",
      [],
      (err, rows: any[]) => {
        if (err) {
          console.error("Error getting chat sessions:", err);
          callback([]);
        } else {
          callback(rows);
        }
      }
    );
  }

  public deleteChatSession(sessionId: string, callback: (success: boolean) => void): void {
    // Messages will be deleted automatically due to CASCADE constraint
    this.db.run(
      "DELETE FROM chat_sessions WHERE session_id = ?",
      [sessionId],
      function(err) {
        if (err) {
          console.error("Error deleting chat session:", err);
          if (callback) callback(false);
        } else {
          if (callback) callback(true);
        }
      }
    );
  }

  public updateSessionMessageCount(sessionId: string): void {
    // Update message count for the session
    this.db.run(
      "UPDATE chat_sessions SET message_count = (SELECT COUNT(*) FROM chat_messages WHERE session_id = ?), updated_at = CURRENT_TIMESTAMP WHERE session_id = ?",
      [sessionId, sessionId],
      (err) => {
        if (err) {
          console.error("Error updating session message count:", err);
        }
      }
    );
  }

  // Chat message methods
  public saveChatMessage(role: string, content: string, sessionId: string = 'default', callback?: (success: boolean) => void): void {
    this.db.run(
      "INSERT INTO chat_messages (role, content, session_id, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      [role, content, sessionId],
      (err) => {
        if (err) {
          console.error("Error saving chat message:", err);
          if (callback) callback(false);
        } else {
          // Update session message count
          this.updateSessionMessageCount(sessionId);
          if (callback) callback(true);
        }
      }
    );
  }

  public getChatHistory(sessionId: string = 'default', limit: number = 50, callback: (messages: any[]) => void): void {
    this.db.all(
      "SELECT id, role, content, timestamp FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC LIMIT ?",
      [sessionId, limit],
      (err, rows: any[]) => {
        if (err) {
          console.error("Error getting chat history:", err);
          callback([]);
        } else {
          callback(rows);
        }
      }
    );
  }

  public clearChatHistory(sessionId: string = 'default', callback?: (success: boolean) => void): void {
    this.db.run(
      "DELETE FROM chat_messages WHERE session_id = ?",
      [sessionId],
      function(err) {
        if (err) {
          console.error("Error clearing chat history:", err);
          if (callback) callback(false);
        } else {
          if (callback) callback(true);
        }
      }
    );
  }

  public close(): void {
    this.db.close();
  }
}

export default MockDataGenerator;
