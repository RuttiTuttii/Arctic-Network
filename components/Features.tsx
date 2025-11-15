import { motion } from "motion/react";
import { Thermometer, Waves, Compass, Activity, Cloud, Fish } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const features = [
    {
      icon: Thermometer,
      title: t("climateTracking"),
      description: t("climateDescription"),
      color: "#f97316",
    },
    {
      icon: Waves,
      title: t("oceanMonitoring"),
      description: t("oceanMonitoringDescription"),
      color: "#06b6d4",
    },
    {
      icon: Fish,
      title: t("wildlifeMigration"),
      description: t("wildlifeDescription"),
      color: "#3b82f6",
    },
    {
      icon: Activity,
      title: t("seismicActivity"),
      description: t("seismicDescription"),
      color: "#10b981",
    },
    {
      icon: Cloud,
      title: t("weatherPatterns"),
      description: t("weatherDescription"),
      color: "#8b5cf6",
    },
    {
      icon: Compass,
      title: t("navigationSupport"),
      description: t("navigationDescription"),
      color: "#ec4899",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Textured background section */}
      <div className="absolute inset-0 bg-neutral-950">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="dotsPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#f97316" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotsPattern)" />
          </svg>
        </div>
      </div>

      <div className="relative container mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="text-orange-500 tracking-[0.3em] mb-6">{t("capabilities")}</div>
          <h2 className="text-4xl md:text-6xl mb-6">{t("comprehensiveMonitoring")}</h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            {t("featuresDescription")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group cursor-pointer"
              >
                {/* Card background with texture */}
                <div className="relative h-full bg-black border border-neutral-800 p-8 overflow-hidden transition-colors hover:border-orange-500">
                  {/* Texture overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                    <svg className="w-full h-full">
                      <defs>
                        <pattern id={`cardTexture-${index}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                          <rect width="100" height="100" fill="none" />
                          <circle cx="10" cy="10" r="1" fill={feature.color} />
                          <circle cx="40" cy="30" r="1" fill={feature.color} />
                          <circle cx="70" cy="20" r="1" fill={feature.color} />
                          <circle cx="20" cy="60" r="1" fill={feature.color} />
                          <circle cx="80" cy="70" r="1" fill={feature.color} />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#cardTexture-${index})`} />
                    </svg>
                  </div>

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute top-0 left-0"
                    initial={{ scaleX: 0 }}
                    animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: "40px",
                      height: "2px",
                      backgroundColor: feature.color,
                      transformOrigin: "left",
                    }}
                  />
                  <motion.div
                    className="absolute top-0 left-0"
                    initial={{ scaleY: 0 }}
                    animate={isHovered ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: "2px",
                      height: "40px",
                      backgroundColor: feature.color,
                      transformOrigin: "top",
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="relative mb-6"
                    animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative inline-block">
                      <Icon
                        className="w-12 h-12 relative z-10"
                        style={{ color: feature.color }}
                      />
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 blur-xl"
                        style={{ backgroundColor: feature.color }}
                        animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl mb-4 group-hover:text-orange-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Animated bottom line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1"
                    style={{ backgroundColor: feature.color, transformOrigin: "left" }}
                    initial={{ scaleX: 0 }}
                    animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Particle effect on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          backgroundColor: feature.color,
                          left: "50%",
                          top: "50%",
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI) / 4) * 100,
                          y: Math.sin((i * Math.PI) / 4) * 100,
                        }}
                        transition={{ duration: 0.8 }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}