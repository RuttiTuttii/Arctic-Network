import { motion, useMotionValue, PanInfo, animate } from "motion/react";
import { Home, Inbox, Telescope, User, Globe } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

interface MenuItem {
  icon: typeof Home;
  label: string;
  labelRu: string;
  id: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "Home", labelRu: "Главная", id: "home", path: "/" },
  { icon: Inbox, label: "Pricing", labelRu: "Цены", id: "inbox", path: "/pricing" },
  { icon: Telescope, label: "Explore", labelRu: "Обзор", id: "explore", path: "/dashboard" },
  { icon: User, label: "Profile", labelRu: "Профиль", id: "profile", path: "/register" },
];

export function GlassMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeItem = menuItems.find(item => item.path === location.pathname)?.id || "home";
  const activeIndex = menuItems.findIndex(item => item.id === activeItem);
  const itemWidth = 80; // Width of each menu item
  
  const x = useMotionValue(activeIndex * itemWidth);

  // Handle show/hide with cursor
  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const newIndex = menuItems.findIndex(item => item.id === activeItem);
    animate(x, newIndex * itemWidth, {
      type: "spring",
      stiffness: 400,
      damping: 30
    });
  }, [activeItem, x]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.x;

    let newIndex = Math.round(x.get() / itemWidth);

    // Add velocity-based adjustment
    if (Math.abs(velocity) > 500) {
      newIndex += velocity > 0 ? 1 : -1;
    }

    // Clamp to valid range
    newIndex = Math.max(0, Math.min(menuItems.length - 1, newIndex));

    const newItem = menuItems[newIndex];
    navigate(newItem.path);
  };

  const handleItemClick = (itemId: string) => {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ 
          opacity: isVisible ? 1 : 0.02, 
          y: isVisible ? 0 : 80,
        }}
        transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 25 }}
        style={{ pointerEvents: "auto" } as any}
      >
        <motion.div
          className="relative backdrop-blur-3xl bg-white/10 border border-white/20 pl-6 pr-4 py-4"
          style={{
            borderRadius: "32px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
            style={{ borderRadius: "32px" }}
          />

          <div className="relative flex items-center gap-2">
            <div 
              ref={constraintsRef}
              className="relative flex items-center"
            >
              {/* Draggable active indicator */}
              <motion.div
                drag="x"
                dragConstraints={{
                  left: 0,
                  right: (menuItems.length - 1) * itemWidth
                }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{ 
                  x,
                  width: itemWidth,
                }}
                className="absolute top-0 bottom-0 cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  className="h-full bg-white/20 backdrop-blur-xl"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 4px 16px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  }}
                  whileTap={{ scale: 1.05 }}
                />
              </motion.div>

              {/* Menu items */}
              <div className="relative flex items-center">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  const label = language === "ru" ? item.labelRu : item.label;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className="relative flex flex-col items-center justify-center gap-2 cursor-pointer z-10"
                      style={{ width: itemWidth, height: "64px" }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Icon
                        className="w-6 h-6 relative z-10 transition-colors duration-200"
                        style={{
                          color: isActive ? "#f97316" : "white",
                          filter: isActive ? "drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))" : "none",
                        }}
                      />

                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="text-xs tracking-wider relative z-10 whitespace-nowrap"
                          style={{ color: "#f97316" }}
                        >
                          {label}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Language toggle */}
            <div className="border-l border-white/10 pl-2 ml-2">
              <motion.button
                onClick={() => setLanguage(language === "en" ? "ru" : "en")}
                className="relative flex flex-col items-center justify-center gap-1 cursor-pointer"
                style={{ width: "60px", height: "64px" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Globe className="w-6 h-6 relative z-10" />
                <motion.span
                  className="text-xs tracking-wider relative z-10"
                  key={language}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {language.toUpperCase()}
                </motion.span>

                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 bg-blue-500/20 blur-xl"
                  style={{ borderRadius: "20px" }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}