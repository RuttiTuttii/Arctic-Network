import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Satellite } from "./Satellite";

interface SatelliteNode {
  id: string;
  x: number;
  y: number;
  type: "orbit" | "land" | "water";
  label: string;
}

export function SatelliteNetwork() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Array<[string, string]>>([]);

  const satellites: SatelliteNode[] = [
    { id: "sat1", x: 15, y: 20, type: "orbit", label: "ARCTIC-1" },
    { id: "sat2", x: 45, y: 15, type: "orbit", label: "POLAR-2" },
    { id: "sat3", x: 75, y: 25, type: "orbit", label: "CLIMATE-3" },
    { id: "sat4", x: 85, y: 50, type: "orbit", label: "MONITOR-4" },
    { id: "land1", x: 25, y: 60, type: "land", label: "BASE ALPHA" },
    { id: "land2", x: 65, y: 70, type: "land", label: "BASE BETA" },
    { id: "water1", x: 35, y: 85, type: "water", label: "BUOY GAMMA" },
    { id: "water2", x: 55, y: 80, type: "water", label: "BUOY DELTA" },
  ];

  useEffect(() => {
    // Create dynamic connections
    const allConnections: Array<[string, string]> = [
      ["sat1", "sat2"],
      ["sat2", "sat3"],
      ["sat3", "sat4"],
      ["sat1", "land1"],
      ["sat2", "land2"],
      ["sat4", "land2"],
      ["land1", "water1"],
      ["land2", "water2"],
      ["water1", "water2"],
    ];
    setConnections(allConnections);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        <defs>
          {/* Gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>

          {/* Animated gradient */}
          <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0">
              <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#f97316" stopOpacity="1">
              <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0">
              <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Connections */}
        {connections.map(([from, to], index) => {
          const fromSat = satellites.find((s) => s.id === from);
          const toSat = satellites.find((s) => s.id === to);
          if (!fromSat || !toSat) return null;

          const isActive = hoveredId === from || hoveredId === to;

          return (
            <motion.line
              key={`${from}-${to}`}
              x1={`${fromSat.x}%`}
              y1={`${fromSat.y}%`}
              x2={`${toSat.x}%`}
              y2={`${toSat.y}%`}
              stroke={isActive ? "url(#animatedGradient)" : "url(#connectionGradient)"}
              strokeWidth={isActive ? "2" : "1"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 2, delay: index * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Satellites */}
      {satellites.map((sat, index) => (
        <Satellite
          key={sat.id}
          id={sat.id}
          x={sat.x}
          y={sat.y}
          type={sat.type}
          label={sat.label}
          delay={index * 0.15}
          onHover={setHoveredId}
          isConnected={hoveredId ? connections.some(
            ([from, to]) =>
              (from === hoveredId && to === sat.id) ||
              (to === hoveredId && from === sat.id)
          ) : false}
        />
      ))}
    </div>
  );
}
