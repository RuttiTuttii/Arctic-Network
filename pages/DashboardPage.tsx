import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Satellite,
  Activity,
  Waves,
  Thermometer,
  Download,
  Share2,
  Settings,
  Bell,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  Video
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { SatelliteRecordings } from "../components/SatelliteRecordings";

export function DashboardPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRussian = language === "ru";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"metrics" | "recordings">("metrics");

  const [realTimeData, setRealTimeData] = useState({
    temperature: -15.3,
    icecover: 87.2,
    pollution: 23.1,
    wildlife: 1247,
    windSpeed: 12.5,
    seaLevel: 2.3,
    activeSatellites: 47,
    dataPoints: 2456789,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        icecover: Math.max(80, Math.min(95, prev.icecover + (Math.random() - 0.5) * 1)),
        pollution: Math.max(15, Math.min(35, prev.pollution + (Math.random() - 0.5) * 0.8)),
        wildlife: prev.wildlife + Math.floor((Math.random() - 0.5) * 5),
        windSpeed: Math.max(5, Math.min(25, prev.windSpeed + (Math.random() - 0.5) * 2)),
        seaLevel: prev.seaLevel + (Math.random() - 0.5) * 0.1,
        activeSatellites: 47,
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 100),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-3 h-1 bg-orange-500" />
                ))}
              </div>
              <div>
                <div className="tracking-wider">ARCTIC NETWORK</div>
                <div className="text-xs text-neutral-500">
                  {isRussian ? "ПАНЕЛЬ УПРАВЛЕНИЯ" : "CONTROL PANEL"}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRussian ? "Поиск..." : "Search..."}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0 }}
              />
              <span className="text-sm text-neutral-400">
                {isRussian ? "АКТИВНО" : "LIVE"}
              </span>

              <div className="flex items-center gap-2 ml-4">
                {/* AI Chat Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/chat")}
                  className="relative p-2 hover:bg-white/5 rounded-lg transition-colors group"
                  title={isRussian ? "AI Ассистент" : "AI Assistant"}
                >
                  <MessageSquare className="w-5 h-5" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-orange-500" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-orange-500/20 rounded-lg blur-lg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
                  title={isRussian ? "Уведомления" : "Notifications"}
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title={isRussian ? "Фильтры" : "Filters"}
                >
                  <Filter className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title={isRussian ? "Настройки" : "Settings"}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 pb-32">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <motion.button
            onClick={() => setActiveTab("metrics")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "metrics"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Activity className="w-5 h-5" />
            <span className="font-semibold">
              {isRussian ? "Метрики" : "Metrics"}
            </span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("recordings")}
            className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "recordings"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video className="w-5 h-5" />
            <span className="font-semibold">
              {isRussian ? "Записи со спутников" : "Satellite Recordings"}
            </span>
          </motion.button>
        </div>

        {activeTab === "metrics" ? (
          <>
        {/* AI Assistant CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 backdrop-blur-xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 p-6 rounded-3xl cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate("/chat")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(249, 115, 22, 0.3)",
                    "0 0 30px rgba(249, 115, 22, 0.5)",
                    "0 0 20px rgba(249, 115, 22, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl mb-1">
                  {isRussian ? "Спросите AI Ассистента" : "Ask the AI Assistant"}
                </h3>
                <p className="text-sm text-neutral-400">
                  {isRussian
                    ? "Получите мгновенный анализ данных со спутников и датчиков"
                    : "Get instant analysis of satellite and sensor data"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/chat")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{isRussian ? "Открыть чат" : "Open Chat"}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              icon: Thermometer, 
              label: isRussian ? "Температура" : "Temperature", 
              value: `${realTimeData.temperature.toFixed(1)}°C`,
              change: "-0.3°C",
              trend: "down",
              color: "#3b82f6"
            },
            { 
              icon: Waves, 
              label: isRussian ? "Ледовый покров" : "Ice Coverage", 
              value: `${realTimeData.icecover.toFixed(1)}%`,
              change: "+1.2%",
              trend: "up",
              color: "#06b6d4"
            },
            { 
              icon: AlertTriangle, 
              label: isRussian ? "Загрязнение" : "Pollution", 
              value: realTimeData.pollution.toFixed(1),
              change: "-2.1",
              trend: "down",
              color: "#f97316"
            },
            { 
              icon: Activity, 
              label: isRussian ? "Дикая природа" : "Wildlife", 
              value: realTimeData.wildlife,
              change: "+12",
              trend: "up",
              color: "#10b981"
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:border-orange-500/50 transition-colors cursor-pointer group"
                style={{ borderRadius: "20px" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  <div className="flex items-center gap-1 text-xs">
                    <TrendIcon className="w-3 h-3" style={{ color: stat.trend === "up" ? "#10b981" : "#3b82f6" }} />
                    <span className="text-neutral-400">{stat.change}</span>
                  </div>
                </div>
                <motion.div 
                  className="text-2xl md:text-3xl mb-1"
                  key={stat.value.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-neutral-500 tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Real-time data visualization */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 p-6" style={{ borderRadius: "20px" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl mb-1">
                  {isRussian ? "Потоки данных в реальном времени" : "Real-Time Data Streams"}
                </h3>
                <p className="text-sm text-neutral-500">
                  {isRussian ? "Последние 24 часа" : "Last 24 hours"}
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title={isRussian ? "Скачать" : "Download"}
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  title={isRussian ? "Поделиться" : "Share"}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 flex items-end justify-between gap-2">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 relative rounded-t-sm cursor-pointer group"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${30 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%` 
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.05,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 2,
                  }}
                  whileHover={{ scale: 1.1 }}
                  title={`${i}:00 - ${(30 + Math.sin(i * 0.5) * 30).toFixed(0)}%`}
                >
                  <div className="absolute inset-0 bg-orange-500/50 blur-sm" />
                </motion.div>
              ))}
            </div>

            {/* Time labels */}
            <div className="flex justify-between mt-4 text-xs text-neutral-500">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Satellite status */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6" style={{ borderRadius: "20px" }}>
            <h3 className="text-xl mb-6">
              {isRussian ? "Статус спутников" : "Satellite Status"}
            </h3>

            <div className="space-y-4">
              {[
                { id: "ARCTIC-1", status: "active", signal: 98 },
                { id: "POLAR-2", status: "active", signal: 95 },
                { id: "CLIMATE-3", status: "active", signal: 92 },
                { id: "MONITOR-4", status: "maintenance", signal: 0 },
              ].map((sat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <Satellite className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="tracking-wider">{sat.id}</div>
                      <div className="text-xs text-neutral-500">
                        {sat.status === "active" 
                          ? (isRussian ? "Активен" : "Active")
                          : (isRussian ? "Обслуживание" : "Maintenance")
                        }
                      </div>
                    </div>
                  </div>
                  {sat.status === "active" && (
                    <div className="text-right">
                      <div className="text-green-500">{sat.signal}%</div>
                      <div className="text-xs text-neutral-500">
                        {isRussian ? "Сигнал" : "Signal"}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* System health */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-400">
                  {isRussian ? "Здоровье системы" : "System Health"}
                </span>
                <span className="text-green-500">94%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-300"
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity log */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6" style={{ borderRadius: "20px" }}>
          <h3 className="text-xl mb-6">
            {isRussian ? "Последняя активность" : "Recent Activity"}
          </h3>

          <div className="space-y-3">
            {[
              { time: "14:32:18", event: isRussian ? "Синхронизация данных спутника ARCTIC-1 завершена" : "Satellite ARCTIC-1 data sync complete", type: "success" },
              { time: "14:31:45", event: isRussian ? "Буй GAMMA сообщает об аномалии" : "Ocean buoy GAMMA reporting anomaly", type: "warning" },
              { time: "14:30:22", event: isRussian ? "Обновление отслеживания животных: 12 новых сигналов" : "Wildlife tracking update: 12 new signals", type: "info" },
              { time: "14:28:55", event: isRussian ? "Наземная станция BETA в сети" : "Ground station BETA came online", type: "success" },
              { time: "14:27:10", event: isRussian ? "Обновление прошивки CLIMATE-3 завершено" : "CLIMATE-3 firmware update complete", type: "info" },
            ].map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
                whileHover={{ x: 5 }}
              >
                <span className="text-neutral-600 font-mono text-sm">{log.time}</span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      log.type === "success" ? "#10b981" : log.type === "warning" ? "#f97316" : "#3b82f6",
                  }}
                />
                <span className="flex-1 group-hover:text-orange-500 transition-colors">
                  {log.event}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        </>
        ) : (
          <SatelliteRecordings />
        )}
      </div>
    </div>
  );
}