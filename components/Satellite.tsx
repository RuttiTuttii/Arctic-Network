import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { Satellite as SatelliteIcon, Radio, Droplet } from "lucide-react";
import { useState } from "react";

interface SatelliteProps {
  id: string;
  x: number;
  y: number;
  type: "orbit" | "land" | "water";
  label: string;
  delay: number;
  onHover: (id: string | null) => void;
  isConnected: boolean;
}

export function Satellite({ id, x, y, type, label, delay, onHover, isConnected }: SatelliteProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  const scale = useTransform(
    [dragX, dragY],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return 1 + Math.min(distance / 100, 0.5);
    }
  );

  const getIcon = () => {
    switch (type) {
      case "orbit":
        return SatelliteIcon;
      case "land":
        return Radio;
      case "water":
        return Droplet;
    }
  };

  const Icon = getIcon();

  const colors = {
    orbit: "#f97316",
    land: "#06b6d4",
    water: "#3b82f6",
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    dragX.set(0);
    dragY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        x: dragX,
        y: dragY,
        scale,
      }}
      drag
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => !isDragging && onHover(id)}
      onMouseLeave={() => !isDragging && onHover(null)}
      whileHover={{ scale: 1.1 }}
    >
      {/* Pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ 
          border: `2px solid ${colors[type]}`,
          width: "80px",
          height: "80px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 2, 2],
          opacity: [0.6, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          repeatDelay: 0,
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ 
          border: `2px solid ${colors[type]}`,
          width: "80px",
          height: "80px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 2, 2],
          opacity: [0.6, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
          repeatDelay: 0,
        }}
      />

      {/* Satellite body with texture */}
      <motion.div
        className="relative"
        animate={
          isDragging 
            ? { rotate: [0, 5, -5, 0] }
            : isConnected 
            ? { scale: 1.3 } 
            : { scale: 1 }
        }
        transition={{ 
          duration: isDragging ? 0.2 : 0.3,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="relative z-10">
          <defs>
            <pattern id={`texture-${id}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill={colors[type]} opacity="0.3" />
            </pattern>
            
            <filter id={`glow-${id}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <radialGradient id={`gradient-${id}`}>
              <stop offset="0%" stopColor={colors[type]} stopOpacity="1" />
              <stop offset="100%" stopColor={colors[type]} stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Main circle */}
          <circle
            cx="30"
            cy="30"
            r="20"
            fill={`url(#gradient-${id})`}
            stroke={colors[type]}
            strokeWidth="2"
            filter={`url(#glow-${id})`}
          />
          
          {/* Texture overlay */}
          <circle
            cx="30"
            cy="30"
            r="20"
            fill={`url(#texture-${id})`}
          />

          {/* Icon */}
          <g transform="translate(30, 30)">
            <Icon
              className="w-6 h-6"
              style={{ 
                transform: "translate(-12px, -12px)",
                color: "white",
                filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))"
              }}
            />
          </g>

          {/* Orbital dots for orbit type */}
          {type === "orbit" && (
            <>
              <motion.circle
                cx="30"
                cy="10"
                r="2"
                fill="white"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 0 }}
                style={{ transformOrigin: "30px 30px" }}
              />
              <motion.circle
                cx="50"
                cy="30"
                r="2"
                fill="white"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1, repeatDelay: 0 }}
                style={{ transformOrigin: "30px 30px" }}
              />
            </>
          )}
        </svg>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap text-xs tracking-wider"
          style={{ color: colors[type] }}
        >
          {label}
        </motion.div>

        {/* Status indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [1, 0.7, 1] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 0,
            ease: "easeInOut"
          }}
        />

        {/* Drag indicator glow */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ backgroundColor: colors[type] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}