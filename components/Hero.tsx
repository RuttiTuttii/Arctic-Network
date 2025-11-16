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


      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 pt-8 md:pt-16 lg:pt-24 pb-20 md:pb-32">
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
            className="text-orange-500 tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6 text-sm md:text-base"
          >
            {t("satelliteEcosystem")}
          </motion.div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl mb-6 md:mb-8 leading-tight">
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
            className="text-lg md:text-xl lg:text-2xl text-neutral-400 max-w-3xl mb-8 md:mb-12 leading-relaxed"
          >
            {t("heroDescription")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
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
        className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl">
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
              className="relative text-center sm:text-left"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl mb-2 text-orange-500">{stat.value}</div>
              <div className="text-sm tracking-wider text-neutral-500">{stat.label}</div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.8 + i * 0.1 }}
                className="h-px bg-neutral-800 mt-4 origin-center sm:origin-left"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}