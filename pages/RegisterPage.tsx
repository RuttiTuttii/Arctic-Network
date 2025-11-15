import { motion } from "motion/react";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { GlassButton } from "../components/GlassButton";
import { useLanguage } from "../contexts/LanguageContext";

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
  });
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    onNavigate("dashboard");
  };

  const isRussian = language === "ru";

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="registerGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#registerGrid)" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-4 h-1.5 bg-orange-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  />
                ))}
              </div>
              <span className="text-xl tracking-wider">ARCTIC NETWORK</span>
            </div>

            <h1 className="text-5xl lg:text-6xl mb-6 leading-tight">
              {isRussian ? "Присоединяйтесь к" : "Join the"}
              <br />
              <span className="text-orange-500">
                {isRussian ? "будущему" : "Future"}
              </span>
              <br />
              {isRussian ? "мониторинга" : "of Monitoring"}
            </h1>

            <p className="text-xl text-neutral-400 mb-12 leading-relaxed max-w-lg">
              {isRussian
                ? "Получите доступ к передовой спутниковой сети для мониторинга арктической экосистемы в режиме реального времени."
                : "Access cutting-edge satellite networks for real-time Arctic ecosystem monitoring."}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "47+", label: isRussian ? "Спутников" : "Satellites" },
                { value: "99.9%", label: isRussian ? "Время работы" : "Uptime" },
                { value: "24/7", label: isRussian ? "Поддержка" : "Support" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-3xl text-orange-500 mb-1">{stat.value}</div>
                  <div className="text-sm text-neutral-500 tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-3xl" />

            <div
              className="relative backdrop-blur-3xl bg-white/5 border border-white/10 p-8 md:p-12"
              style={{
                borderRadius: "32px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <h2 className="text-3xl mb-2">
                {isRussian ? "Создать аккаунт" : "Create Account"}
              </h2>
              <p className="text-neutral-400 mb-8">
                {isRussian
                  ? "Начните мониторинг сегодня"
                  : "Start monitoring today"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name input */}
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                    {isRussian ? "ПОЛНОЕ ИМЯ" : "FULL NAME"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ borderRadius: "16px" }}
                      placeholder={isRussian ? "Введите имя" : "Enter your name"}
                      required
                    />
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                    {isRussian ? "ЭЛЕКТРОННАЯ ПОЧТА" : "EMAIL"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ borderRadius: "16px" }}
                      placeholder={isRussian ? "ваш@email.com" : "your@email.com"}
                      required
                    />
                  </div>
                </div>

                {/* Organization input */}
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                    {isRussian ? "ОРГАНИЗАЦИЯ" : "ORGANIZATION"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ borderRadius: "16px" }}
                      placeholder={isRussian ? "Название компании" : "Company name"}
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                    {isRussian ? "ПАРОЛЬ" : "PASSWORD"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ borderRadius: "16px" }}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-neutral-400">
                    {isRussian
                      ? "Я согласен с условиями использования и политикой конфиденциальности"
                      : "I agree to the terms of service and privacy policy"}
                  </label>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 tracking-wider backdrop-blur-xl border border-white/20 bg-orange-500/80 hover:bg-orange-500 transition-all flex items-center justify-center gap-3 group"
                  style={{
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRussian ? "СОЗДАТЬ АККАУНТ" : "CREATE ACCOUNT"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>

              <div className="mt-8 text-center text-sm text-neutral-400">
                {isRussian ? "Уже есть аккаунт?" : "Already have an account?"}{" "}
                <button
                  onClick={() => onNavigate("home")}
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  {isRussian ? "Войти" : "Sign in"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
