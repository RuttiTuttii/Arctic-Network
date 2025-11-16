import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Home, BarChart3, MessageSquare, Settings, LogOut, Languages } from "lucide-react";
import { Logo } from "./Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isRussian = language === "ru";

  const menuItems = [
    { icon: Home, label: isRussian ? "Главная" : "Home", path: "/" },
    { icon: BarChart3, label: isRussian ? "Дашборд" : "Dashboard", path: "/dashboard" },
    { icon: MessageSquare, label: isRussian ? "Чат" : "Chat", path: "/chat" },
    { icon: Settings, label: isRussian ? "Настройки" : "Settings", path: "/account-settings" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "ru" ? "en" : "ru");
  };

  return (
    <>
      <header className="relative z-[100] p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <Logo />


          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden fixed right-4 top-4 p-2 hover:bg-white/5 rounded-lg transition-colors z-[100] ${isMobileMenuOpen ? 'hidden' : ''}`}
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // place overlay above header and page content so everything is dimmed
              className="fixed inset-0 bg-black/80 z-[105] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              // drawer should appear above the overlay
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black border-l border-white/20 z-[110] md:hidden"
            >
              <div className="p-6">
                {/* Close button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                  }}
                  className="absolute top-4 right-4 p-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors cursor-pointer z-10"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                {/* User info */}
                {user && (
                  <div className="mb-8 pt-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <span className="text-orange-500 font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.username}</div>
                        <div className="text-neutral-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu items */}
                <nav className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleNavigation(item.path)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <Icon className="w-5 h-5 text-orange-500" />
                        <span className="text-white font-medium">{item.label}</span>
                      </motion.button>
                    );
                  })}

                  {/* Language Toggle */}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.1 }}
                    onClick={toggleLanguage}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-left"
                  >
                    <Languages className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">
                      {isRussian ? "Switch to English" : "Переключить на русский"}
                    </span>
                  </motion.button>

                  {/* Logout */}
                  {user && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (menuItems.length + 1) * 0.1 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 p-4 hover:bg-red-500/10 rounded-xl transition-colors text-left text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">{isRussian ? "Выйти" : "Logout"}</span>
                    </motion.button>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}