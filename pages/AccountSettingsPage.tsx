import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, EyeOff, User, Mail, Building, Lock } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRussian = language === "ru";

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: user?.email || "",
    company_name: user?.company_name || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage(isRussian ? "Пароли не совпадают" : "Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(isRussian ? "Пароль успешно изменен" : "Password changed successfully");
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (error) {
      setMessage(isRussian ? "Ошибка при изменении пароля" : "Error changing password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(isRussian ? "Профиль обновлен" : "Profile updated");
    } catch (error) {
      setMessage(isRussian ? "Ошибка при обновлении профиля" : "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Header />

      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="settingsGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#settingsGrid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {isRussian ? "Назад к дашборду" : "Back to Dashboard"}
          </button>
          <h1 className="text-4xl md:text-5xl mb-4">
            {isRussian ? "Настройки аккаунта" : "Account Settings"}
          </h1>
          <p className="text-xl text-neutral-400">
            {isRussian ? "Управляйте вашими учетными данными и предпочтениями" : "Manage your account details and preferences"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl"
          >
            <h2 className="text-2xl mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-orange-500" />
              {isRussian ? "Профиль" : "Profile"}
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Username (read-only) */}
              <div>
                <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                  {isRussian ? "ИМЯ ПОЛЬЗОВАТЕЛЯ" : "USERNAME"}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    value={user?.username || ""}
                    disabled
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors opacity-50 cursor-not-allowed"
                    style={{ borderRadius: "16px" }}
                  />
                </div>
              </div>

              {/* Email */}
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
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                  {isRussian ? "КОМПАНИЯ" : "COMPANY"}
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                    style={{ borderRadius: "16px" }}
                    placeholder={isRussian ? "Название компании" : "Company name"}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 tracking-wider backdrop-blur-xl border border-white/20 bg-orange-500/80 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                {isLoading ? (isRussian ? "СОХРАНЕНИЕ..." : "SAVING...") : (isRussian ? "СОХРАНИТЬ" : "SAVE")}
              </motion.button>
            </form>
          </motion.div>

          {/* Password Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl"
          >
            <h2 className="text-2xl mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6 text-orange-500" />
              {isRussian ? "Изменить пароль" : "Change Password"}
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                  {isRussian ? "ТЕКУЩИЙ ПАРОЛЬ" : "CURRENT PASSWORD"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                    style={{ borderRadius: "16px" }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                  {isRussian ? "НОВЫЙ ПАРОЛЬ" : "NEW PASSWORD"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                    style={{ borderRadius: "16px" }}
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                  {isRussian ? "ПОДТВЕРДИТЬ ПАРОЛЬ" : "CONFIRM PASSWORD"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 backdrop-blur-xl focus:border-orange-500 focus:outline-none transition-colors"
                    style={{ borderRadius: "16px" }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 tracking-wider backdrop-blur-xl border border-white/20 bg-orange-500/80 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                {isLoading ? (isRussian ? "СОХРАНЕНИЕ..." : "SAVING...") : (isRussian ? "ИЗМЕНИТЬ ПАРОЛЬ" : "CHANGE PASSWORD")}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-8 p-4 rounded-xl backdrop-blur-xl border ${
              message.includes(isRussian ? "успешно" : "successfully") || message.includes(isRussian ? "обновлен" : "updated")
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>
    </div>
  );
}