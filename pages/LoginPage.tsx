import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Header } from "../components/Header";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";
  const isRussian = language === "ru";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(isRussian ? "Неверные учетные данные" : "Invalid credentials");
      }
    } catch (err) {
      setError(isRussian ? "Ошибка входа" : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Header />
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <defs>
            <pattern id="loginGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginGrid)" />
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
              {isRussian ? "Добро пожаловать" : "Welcome"}
              <br />
              <span className="text-orange-500">
                {isRussian ? "обратно" : "Back"}
              </span>
              <br />
              {isRussian ? "в систему" : "to the System"}
            </h1>

            <p className="text-xl text-neutral-400 mb-12 leading-relaxed max-w-lg">
              {isRussian
                ? "Войдите в свою учетную запись для доступа к спутниковому мониторингу Арктики."
                : "Sign in to your account to access Arctic satellite monitoring."}
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
                {isRussian ? "Вход в систему" : "Sign In"}
              </h2>
              <p className="text-neutral-400 mb-8">
                {isRussian
                  ? "Введите свои учетные данные"
                  : "Enter your credentials"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username input */}
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                    {isRussian ? "ИМЯ ПОЛЬЗОВАТЕЛЯ" : "USERNAME"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ borderRadius: "16px" }}
                      placeholder={isRussian ? "Введите имя пользователя" : "Enter username"}
                      required
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
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                      style={{ borderRadius: "16px" }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 tracking-wider backdrop-blur-xl border border-white/20 bg-orange-500/80 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
                  style={{
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    isRussian ? "Вход..." : "Signing in..."
                  ) : (
                    <>
                      {isRussian ? "ВОЙТИ" : "SIGN IN"}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center text-sm text-neutral-400">
                {isRussian ? "Нет аккаунта?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-orange-500 hover:text-orange-400 transition-colors"
                >
                  {isRussian ? "Зарегистрироваться" : "Sign up"}
                </button>
              </div>

              {/* Demo accounts */}
              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-xs text-neutral-500 mb-2">
                  {isRussian ? "Демо аккаунты:" : "Demo accounts:"}
                </div>
                <div className="text-xs text-neutral-400 space-y-1">
                  <div>admin/admin123</div>
                  <div>user/user123</div>
                  <div>viewer/viewer123</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}