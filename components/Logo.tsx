import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function Logo() {
  const navigate = useNavigate();

  return (
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
  );
}