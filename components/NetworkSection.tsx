import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export function NetworkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const { t } = useLanguage();

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-orange-500 tracking-[0.3em] mb-6"
            >
              {t("ecosystemArchitecture")}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl mb-8"
            >
              {t("interconnectedIntelligence")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-neutral-400 mb-8 leading-relaxed"
            >
              {t("networkDescription")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                { label: t("orbitalSatellites"), value: t("orbitalDescription") },
                { label: t("groundStations"), value: t("groundDescription") },
                { label: t("oceanBuoys"), value: t("oceanDescription") },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <div className="w-2 h-2 bg-orange-500 mt-2 group-hover:scale-150 transition-transform" />
                  <div className="flex-1">
                    <div className="tracking-wider mb-1 group-hover:text-orange-500 transition-colors">
                      {item.label}
                    </div>
                    <div className="text-neutral-500">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Hexagon grid */}
              <svg viewBox="0 0 400 400" className="w-full h-auto">
                <defs>
                  <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                    <path
                      d="M30 0 L45 13 L45 39 L30 52 L15 39 L15 13 Z"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  </pattern>

                  <filter id="hexGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Background hexagons */}
                <rect width="400" height="400" fill="url(#hexPattern)" />

                {/* Central data flow visualization */}
                <g transform="translate(200, 200)">
                  {/* Center circle */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="40"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    filter="url(#hexGlow)"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0.8, 1, 0.8] }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatDelay: 0,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Orbiting nodes */}
                  {[0, 120, 240].map((angle, i) => (
                    <motion.g
                      key={i}
                      initial={{ rotate: angle }}
                      animate={{ rotate: angle + 360 }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatDelay: 0
                      }}
                      style={{ transformOrigin: "0px 0px" }}
                    >
                      <circle cx="0" cy="-100" r="15" fill="#f97316" opacity="0.8" />
                      <motion.circle
                        cx="0"
                        cy="-100"
                        r="20"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2"
                        animate={{ 
                          scale: [1, 1.5, 1], 
                          opacity: [0.6, 0, 0.6] 
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatDelay: 0,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.g>
                  ))}

                  {/* Data streams */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.line
                      key={i}
                      x1="0"
                      y1="0"
                      x2={Math.sin((angle * Math.PI) / 180) * 80}
                      y2={-Math.cos((angle * Math.PI) / 180) * 80}
                      stroke="#06b6d4"
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: [0, 1, 0], 
                        opacity: [0, 1, 0] 
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        repeatDelay: 0,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </g>
              </svg>

              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-orange-500" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-orange-500" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}