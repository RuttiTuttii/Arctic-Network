import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { SatelliteNetwork } from "./SatelliteNetwork";
import { GlassButton } from "./GlassButton";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

export function Hero() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const isRussian = language === "ru";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Textured background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grain" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="200" height="200" filter="url(#noise)" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grain)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-1 bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              />
            ))}
          </div>
          <span className="ml-2 tracking-wider">ARCTIC NETWORK</span>
        </motion.div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-8 pt-20 md:pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-orange-500 tracking-[0.3em] mb-6"
          >
            {t("satelliteEcosystem")}
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t("arcticClimate")}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="text-neutral-400"
            >
              {t("monitoring")}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {t("network")}
            </motion.div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-xl md:text-2xl text-neutral-400 max-w-3xl mb-12 leading-relaxed"
          >
            {t("heroDescription")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-wrap gap-4"
          >
            <GlassButton variant="primary" onClick={() => navigate("/dashboard")}>
              {t("exploreDashboard")}
            </GlassButton>
            <GlassButton variant="secondary" onClick={() => navigate("/register")}>
              {isAuthenticated ? (isRussian ? "АККАУНТ" : "ACCOUNT") : (isRussian ? "ЗАРЕГИСТРИРОВАТЬСЯ" : "SIGN UP")}
            </GlassButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Satellite Network Visualization */}
      <SatelliteNetwork />

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="relative z-10 container mx-auto px-6 md:px-8 pb-16"
      >
        <div className="grid grid-cols-3 gap-8 max-w-4xl">
          {[
            { label: t("activeSatellites"), value: "47" },
            { label: t("dataPoints"), value: "2.4M" },
            { label: t("coverageArea"), value: "100%" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 + i * 0.1 }}
              className="relative"
            >
              <div className="text-4xl md:text-5xl mb-2 text-orange-500">{stat.value}</div>
              <div className="text-sm tracking-wider text-neutral-500">{stat.label}</div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.8 + i * 0.1 }}
                className="h-px bg-neutral-800 mt-4 origin-left"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}