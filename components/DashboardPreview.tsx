import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { GlassButton } from "./GlassButton";
import { useLanguage } from "../contexts/LanguageContext";

interface DashboardPreviewProps {
  onNavigate: (page: string) => void;
}

export function DashboardPreview({ onNavigate }: DashboardPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const { t } = useLanguage();

  const [data, setData] = useState({
    temperature: -15.3,
    icecover: 87.2,
    pollution: 23.1,
    wildlife: 1247,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temperature: -15.3 + (Math.random() - 0.5) * 2,
        icecover: 87.2 + (Math.random() - 0.5) * 5,
        pollution: 23.1 + (Math.random() - 0.5) * 3,
        wildlife: 1247 + Math.floor((Math.random() - 0.5) * 20),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-neutral-950">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          style={{ scale, opacity }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-orange-500 tracking-[0.3em] mb-6">{t("interface")}</div>
            <h2 className="text-4xl md:text-6xl mb-6">{t("realTimeDashboard")}</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              {t("dashboardDescription")}
            </p>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative cursor-pointer"
            onClick={() => onNavigate("dashboard")}
            whileHover={{ scale: 1.02 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl" />

            {/* Main dashboard container */}
            <div className="relative bg-black border-2 border-neutral-800 overflow-hidden hover:border-orange-500 transition-colors">
              {/* Header */}
              <div className="border-b border-neutral-800 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="tracking-wider">ARCTIC MONITOR / LIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 0 }}
                  />
                  <span className="text-sm text-neutral-500">{t("connected")}</span>
                </div>
              </div>

              {/* Content grid */}
              <div className="p-6">
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: t("temperature"), value: `${data.temperature.toFixed(1)}°C`, icon: TrendingDown, color: "#3b82f6" },
                    { label: t("iceCoverage"), value: `${data.icecover.toFixed(1)}%`, icon: TrendingUp, color: "#06b6d4" },
                    { label: t("pollutionIndex"), value: data.pollution.toFixed(1), icon: AlertTriangle, color: "#f97316" },
                    { label: t("wildlifeTracked"), value: data.wildlife, icon: TrendingUp, color: "#10b981" },
                  ].map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-neutral-900 border border-neutral-800 p-4 hover:border-orange-500 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs tracking-wider text-neutral-500 group-hover:text-orange-500 transition-colors">
                            {metric.label}
                          </span>
                          <Icon className="w-4 h-4" style={{ color: metric.color }} />
                        </div>
                        <motion.div
                          key={metric.value.toString()}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl"
                        >
                          {metric.value}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts area */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Chart 1 - Animated bars */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 col-span-2">
                    <div className="text-sm tracking-wider text-neutral-500 mb-6">{t("dataStreams")}</div>
                    <div className="flex items-end justify-between h-40 gap-2">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 relative rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${20 + Math.random() * 80}%` }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 1,
                          }}
                        >
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-orange-500 blur-sm opacity-50" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Chart 2 - Circular progress */}
                  <div className="bg-neutral-900 border border-neutral-800 p-6 flex flex-col items-center justify-center">
                    <div className="text-sm tracking-wider text-neutral-500 mb-6">{t("systemStatus")}</div>
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#262626"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="8"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 0.94 }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          style={{
                            pathLength: 0,
                            strokeDasharray: "0 1",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl">94%</span>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500 mt-4">{t("operational")}</div>
                  </div>
                </div>

                {/* Activity log */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="mt-4 bg-neutral-900 border border-neutral-800 p-6"
                >
                  <div className="text-sm tracking-wider text-neutral-500 mb-4">{t("recentActivity")}</div>
                  <div className="space-y-3">
                    {[
                      { time: "14:32:18", event: "Satellite ARCTIC-1 data sync complete", type: "success" },
                      { time: "14:31:45", event: "Ocean buoy GAMMA reporting anomaly", type: "warning" },
                      { time: "14:30:22", event: "Wildlife tracking update: 12 new signals", type: "info" },
                    ].map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="flex items-center gap-4 text-sm group hover:text-orange-500 transition-colors cursor-pointer"
                      >
                        <span className="text-neutral-600 font-mono">{log.time}</span>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              log.type === "success" ? "#10b981" : log.type === "warning" ? "#f97316" : "#3b82f6",
                          }}
                        />
                        <span className="flex-1">{log.event}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-orange-500 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-orange-500 pointer-events-none" />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <GlassButton variant="primary" onClick={() => onNavigate("profile")}>
              {t("requestDemo")}
            </GlassButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}