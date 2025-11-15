import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function GlassButton({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }: GlassButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        relative px-8 py-4 tracking-wider overflow-hidden
        backdrop-blur-xl border border-white/20
        ${isPrimary ? "bg-white/10" : "bg-white/5"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        borderRadius: "16px",
        boxShadow: isPrimary
          ? "0 8px 32px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          : "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-300/20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ borderRadius: "16px" }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
        style={{ borderRadius: "16px" }}
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}