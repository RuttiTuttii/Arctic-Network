// @ts-ignore
import express from "express";
// @ts-ignore
import cors from "cors";
// @ts-ignore
import MockDataGenerator from "./mockDataGenerator.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data generator with SQLite database
const dataGenerator = new MockDataGenerator("../db/arctic.db");

// Update metrics every second with realistic data generation
setInterval(() => {
  dataGenerator.generateNewData();
}, 1000);

// Routes

/**
 * GET /api/dashboard
 * Returns current dashboard data with all metrics
 */
app.get("/api/dashboard", (_req, res) => {
  try {
    const allData = dataGenerator.getAllData();
    const dataMap = new Map(allData.map(item => [item.data_type, item]));

    const response = {
      timestamp: new Date().toISOString(),
      data: {
        temperature: {
          value: dataMap.get("temperature")?.value || -15.3,
          min: dataMap.get("temperature")?.min_value || -25,
          max: dataMap.get("temperature")?.max_value || -5,
          change_24h: dataMap.get("temperature")?.change_24h || 0,
          trend: dataMap.get("temperature")?.trend || "stable",
        },
        ice_coverage: {
          value: dataMap.get("ice_coverage")?.value || 87.2,
          min: dataMap.get("ice_coverage")?.min_value || 80,
          max: dataMap.get("ice_coverage")?.max_value || 95,
          change_24h: dataMap.get("ice_coverage")?.change_24h || 0,
          trend: dataMap.get("ice_coverage")?.trend || "stable",
        },
        pollution: {
          value: dataMap.get("pollution")?.value || 23.1,
          min: dataMap.get("pollution")?.min_value || 15,
          max: dataMap.get("pollution")?.max_value || 35,
          change_24h: dataMap.get("pollution")?.change_24h || 0,
          trend: dataMap.get("pollution")?.trend || "stable",
        },
        wildlife: {
          value: dataMap.get("wildlife")?.value || 1247,
          min: dataMap.get("wildlife")?.min_value || 1200,
          max: dataMap.get("wildlife")?.max_value || 1300,
          change_24h: dataMap.get("wildlife")?.change_24h || 0,
          trend: dataMap.get("wildlife")?.trend || "stable",
        },
        wind_speed: {
          value: dataMap.get("wind_speed")?.value || 12.5,
          min: dataMap.get("wind_speed")?.min_value || 5,
          max: dataMap.get("wind_speed")?.max_value || 25,
          change_24h: dataMap.get("wind_speed")?.change_24h || 0,
          trend: dataMap.get("wind_speed")?.trend || "stable",
        },
        sea_level: {
          value: dataMap.get("sea_level")?.value || 2.3,
          min: dataMap.get("sea_level")?.min_value || 0,
          max: dataMap.get("sea_level")?.max_value || 5,
          change_24h: dataMap.get("sea_level")?.change_24h || 0,
          trend: dataMap.get("sea_level")?.trend || "stable",
        },
      },
      satellites: {
        active: 47,
        status: "operational",
        coverage: 98.5,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

/**
 * GET /api/dashboard/metric/:type
 * Returns current value and metadata for specific metric
 */
app.get("/api/dashboard/metric/:type", (req: any, res: any) => {
  try {
    const { type } = req.params;
    const metricData = dataGenerator.getDataByType(type);

    if (!metricData) {
      return res.status(404).json({ error: `Metric type '${type}' not found` });
    }

    res.json({
      timestamp: new Date().toISOString(),
      metric: type,
      value: metricData.value,
      min_value: metricData.min_value,
      max_value: metricData.max_value,
      change_24h: metricData.change_24h,
      trend: metricData.trend,
    });
  } catch (error) {
    console.error("Error fetching metric:", error);
    res.status(500).json({ error: "Failed to fetch metric" });
  }
});

/**
 * GET /api/dashboard/history
 * Returns historical data for trend visualization
 */
app.get("/api/dashboard/history", (req: any, res: any) => {
  try {
    const { type = "temperature", limit = 60 } = req.query;

    // Fetch real historical data from database using the dataGenerator
    dataGenerator.getHistoryData(type, parseInt(limit), (data) => {
      res.json({
        metric: type,
        data: data,
      });
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get("/api/health", (_req: any, res: any) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * GET /api/recordings
 * Returns list of satellite recordings with mock data
 */
app.get("/api/recordings", (_req: any, res: any) => {
  try {
    const mockRecordings = [
      {
        id: "1",
        satellite: "ARCTIC-1",
        title: "Спутниковое наблюдение - Оптический канал 1",
        videoUrl: "/videos/optic1.mp4",
        thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop",
        resolution: "4K",
        duration: "23:45",
        status: "archived",
        createdAt: new Date(Date.now() - 0 * 60000).toISOString(),
      },
      {
        id: "2",
        satellite: "POLAR-2",
        title: "Спутниковое наблюдение - Оптический канал 2",
        videoUrl: "/videos/optic2.mp4",
        thumbnail: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop",
        resolution: "4K",
        duration: "18:30",
        status: "archived",
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
      {
        id: "3",
        satellite: "CLIMATE-3",
        title: "Наблюдение с земли - Наземная станция",
        videoUrl: "/videos/earthrobot.mp4",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop",
        resolution: "4K",
        duration: "15:22",
        status: "archived",
        createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
      },
      {
        id: "4",
        satellite: "MONITOR-4",
        title: "Мониторинг океана - Плавучий буй",
        videoUrl: "/videos/waterdron.mp4",
        thumbnail: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop",
        resolution: "4K",
        duration: "21:15",
        status: "archived",
        createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
      },
    ];

    res.json({
      timestamp: new Date().toISOString(),
      recordings: mockRecordings,
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    res.status(500).json({ error: "Failed to fetch recordings" });
  }
});

/**
 * GET /api/chat/history
 * Returns chat message history
 */
app.get("/api/chat/history", (req: any, res: any) => {
  try {
    const { sessionId = 'default', limit = 50 } = req.query;

    dataGenerator.getChatHistory(sessionId, parseInt(limit), (messages) => {
      res.json({
        timestamp: new Date().toISOString(),
        sessionId,
        messages: messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      });
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

/**
 * POST /api/chat/message
 * Saves a new chat message
 */
app.post("/api/chat/message", (req: any, res: any) => {
  try {
    const { role, content, sessionId = 'default' } = req.body;

    if (!role || !content) {
      return res.status(400).json({ error: "Role and content are required" });
    }

    if (!['user', 'assistant'].includes(role)) {
      return res.status(400).json({ error: "Role must be 'user' or 'assistant'" });
    }

    dataGenerator.saveChatMessage(role, content, sessionId, (success) => {
      if (success) {
        res.json({
          timestamp: new Date().toISOString(),
          success: true,
          message: "Message saved successfully"
        });
      } else {
        res.status(500).json({ error: "Failed to save message" });
      }
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).json({ error: "Failed to save chat message" });
  }
});

/**
 * DELETE /api/chat/history
 * Clears chat history for a session
 */
app.delete("/api/chat/history", (req: any, res: any) => {
  try {
    const { sessionId = 'default' } = req.query;

    dataGenerator.clearChatHistory(sessionId, (success) => {
      if (success) {
        res.json({
          timestamp: new Date().toISOString(),
          success: true,
          message: "Chat history cleared successfully"
        });
      } else {
        res.status(500).json({ error: "Failed to clear chat history" });
      }
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

/**
 * GET /api/chat/sessions
 * Returns list of all chat sessions
 */
app.get("/api/chat/sessions", (_req: any, res: any) => {
  try {
    dataGenerator.getChatSessions((sessions) => {
      res.json({
        timestamp: new Date().toISOString(),
        sessions: sessions,
      });
    });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    res.status(500).json({ error: "Failed to fetch chat sessions" });
  }
});

/**
 * POST /api/chat/sessions
 * Creates a new chat session
 */
app.post("/api/chat/sessions", (req: any, res: any) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    dataGenerator.createChatSession(title.trim(), (sessionId) => {
      if (sessionId) {
        res.json({
          timestamp: new Date().toISOString(),
          success: true,
          sessionId: sessionId,
          title: title.trim(),
          message: "Chat session created successfully"
        });
      } else {
        res.status(500).json({ error: "Failed to create chat session" });
      }
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ error: "Failed to create chat session" });
  }
});

/**
 * DELETE /api/chat/sessions/:sessionId
 * Deletes a chat session and all its messages
 */
app.delete("/api/chat/sessions/:sessionId", (req: any, res: any) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || sessionId === 'default') {
      return res.status(400).json({ error: "Cannot delete default session" });
    }

    dataGenerator.deleteChatSession(sessionId, (success) => {
      if (success) {
        res.json({
          timestamp: new Date().toISOString(),
          success: true,
          message: "Chat session deleted successfully"
        });
      } else {
        res.status(500).json({ error: "Failed to delete chat session" });
      }
    });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    res.status(500).json({ error: "Failed to delete chat session" });
  }
});

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  dataGenerator.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  dataGenerator.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🌍 Arctic Network Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Frontend should use: VITE_API_URL=http://localhost:${PORT}`);
  console.log(`🗄️  Database: SQLite with real-time data generation`);
});

export default app;
