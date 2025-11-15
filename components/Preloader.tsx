import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full">
              <defs>
                <pattern id="preloaderGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <motion.rect
                width="100%"
                height="100%"
                fill="url(#preloaderGrid)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1 }}
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-12"
            >
              {/* Orbital rings */}
              <motion.svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="absolute inset-0"
              >
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Outer ring */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, rotate: 0 }}
                  animate={{ pathLength: 1, rotate: 360 }}
                  transition={{
                    pathLength: { duration: 2, ease: "easeInOut" },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  }}
                  style={{ transformOrigin: "100px 100px" }}
                />

                {/* Middle ring */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, rotate: 0 }}
                  animate={{ pathLength: 1, rotate: -360 }}
                  transition={{
                    pathLength: { duration: 2, delay: 0.2, ease: "easeInOut" },
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                  }}
                  style={{ transformOrigin: "100px 100px" }}
                />

                {/* Inner ring */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="40"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, rotate: 0 }}
                  animate={{ pathLength: 1, rotate: 360 }}
                  transition={{
                    pathLength: { duration: 2, delay: 0.4, ease: "easeInOut" },
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  }}
                  style={{ transformOrigin: "100px 100px" }}
                />

                {/* Orbiting particles */}
                {[0, 120, 240].map((angle, i) => (
                  <motion.circle
                    key={i}
                    cx="100"
                    cy="20"
                    r="4"
                    fill="#f97316"
                    initial={{ rotate: angle }}
                    animate={{ rotate: angle + 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.3,
                    }}
                    style={{ transformOrigin: "100px 100px" }}
                  />
                ))}
              </motion.svg>

              {/* Center logo grid */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="relative z-10 w-[200px] h-[200px] flex items-center justify-center"
              >
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-6 h-2 bg-orange-500"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.8 + i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-3xl tracking-[0.3em] mb-8"
            >
              ARCTIC NETWORK
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="w-64"
            >
              <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-300"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm text-neutral-500">
                <span>LOADING</span>
                <span>{progress}%</span>
              </div>
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 bg-orange-500 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
