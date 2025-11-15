import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  Check, 
  Zap, 
  Shield, 
  Crown, 
  CreditCard, 
  Lock,
  Calendar,
  ArrowRight,
  Info
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const { language } = useLanguage();
  const isRussian = language === "ru";
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const plans = [
    {
      id: "starter",
      name: isRussian ? "Старт" : "Starter",
      icon: Zap,
      price: { monthly: 49, yearly: 470 },
      description: isRussian 
        ? "Для небольших команд и стартапов"
        : "For small teams and startups",
      features: [
        isRussian ? "До 5 активных спутников" : "Up to 5 active satellites",
        isRussian ? "Базовая аналитика" : "Basic analytics",
        isRussian ? "Email поддержка" : "Email support",
        isRussian ? "API доступ" : "API access",
        isRussian ? "1 ГБ хранилища" : "1 GB storage",
      ],
      color: "#3b82f6",
      popular: false,
    },
    {
      id: "professional",
      name: isRussian ? "Профессионал" : "Professional",
      icon: Shield,
      price: { monthly: 149, yearly: 1430 },
      description: isRussian
        ? "Для растущих организаций"
        : "For growing organizations",
      features: [
        isRussian ? "До 20 активных спутников" : "Up to 20 active satellites",
        isRussian ? "Расширенная аналитика" : "Advanced analytics",
        isRussian ? "Приоритетная поддержка 24/7" : "Priority 24/7 support",
        isRussian ? "Полный API доступ" : "Full API access",
        isRussian ? "50 ГБ хранилища" : "50 GB storage",
        isRussian ? "Пользовательские отчеты" : "Custom reports",
        isRussian ? "Интеграции" : "Integrations",
      ],
      color: "#f97316",
      popular: true,
    },
    {
      id: "enterprise",
      name: isRussian ? "Корпоративный" : "Enterprise",
      icon: Crown,
      price: { monthly: 499, yearly: 4790 },
      description: isRussian
        ? "Для крупных предприятий"
        : "For large enterprises",
      features: [
        isRussian ? "Неограниченные спутники" : "Unlimited satellites",
        isRussian ? "AI-аналитика" : "AI-powered analytics",
        isRussian ? "Выделенный менеджер" : "Dedicated account manager",
        isRussian ? "Белая метка" : "White-label solutions",
        isRussian ? "Неограниченное хранилище" : "Unlimited storage",
        isRussian ? "SLA гарантия" : "SLA guarantee",
        isRussian ? "Обучение команды" : "Team training",
        isRussian ? "Пользовательские разработки" : "Custom development",
      ],
      color: "#8b5cf6",
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="pricingGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricingGrid)" />
        </svg>
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? "rgba(249, 115, 22, 0.1)" : "rgba(59, 130, 246, 0.1)"
              } 0%, transparent 70%)`,
              left: `${i * 25}%`,
              top: `${i * 20}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 backdrop-blur-xl bg-orange-500/10 border border-orange-500/20 rounded-full"
          >
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span className="text-sm tracking-wider text-orange-500">
              {isRussian ? "ТАРИФНЫЕ ПЛАНЫ" : "PRICING PLANS"}
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl mb-6">
            {isRussian ? "Выберите свой" : "Choose Your"}
            <br />
            <span className="text-orange-500">{isRussian ? "план" : "Plan"}</span>
          </h1>

          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
            {isRussian
              ? "Гибкие тарифы для команд любого размера. Начните бесплатно с 14-дневным пробным периодом."
              : "Flexible pricing for teams of all sizes. Start free with 14-day trial."}
          </p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-4 backdrop-blur-xl bg-white/5 border border-white/10 p-2 rounded-full"
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`
                px-6 py-2 rounded-full transition-all relative
                ${billingPeriod === "monthly" ? "text-white" : "text-neutral-400"}
              `}
            >
              {billingPeriod === "monthly" && (
                <motion.div
                  layoutId="billingToggle"
                  className="absolute inset-0 bg-orange-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 tracking-wider">
                {isRussian ? "Ежемесячно" : "Monthly"}
              </span>
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`
                px-6 py-2 rounded-full transition-all relative flex items-center gap-2
                ${billingPeriod === "yearly" ? "text-white" : "text-neutral-400"}
              `}
            >
              {billingPeriod === "yearly" && (
                <motion.div
                  layoutId="billingToggle"
                  className="absolute inset-0 bg-orange-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 tracking-wider">
                {isRussian ? "Ежегодно" : "Yearly"}
              </span>
              <span className="relative z-10 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                {isRussian ? "−20%" : "Save 20%"}
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.price[billingPeriod];
            const isProfessional = plan.id === "professional";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`
                  relative backdrop-blur-xl border p-8
                  ${isProfessional 
                    ? "bg-white/10 border-orange-500 md:-mt-4 md:scale-105" 
                    : "bg-white/5 border-white/10"
                  }
                `}
                style={{ borderRadius: "24px" }}
                whileHover={{ scale: isProfessional ? 1.05 : 1.02 }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 rounded-full text-sm tracking-wider"
                  >
                    {isRussian ? "ПОПУЛЯРНЫЙ" : "POPULAR"}
                  </motion.div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${plan.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: plan.color }} />
                      </div>
                      <h3 className="text-2xl">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-neutral-400">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl">${price}</span>
                    <span className="text-neutral-400">
                      / {billingPeriod === "monthly" 
                        ? (isRussian ? "мес" : "mo") 
                        : (isRussian ? "год" : "yr")}
                    </span>
                  </div>
                  {billingPeriod === "yearly" && (
                    <p className="text-sm text-green-500">
                      {isRussian 
                        ? `Экономия $${(plan.price.monthly * 12 - price).toFixed(0)} в год`
                        : `Save $${(plan.price.monthly * 12 - price).toFixed(0)} per year`}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${plan.color}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: plan.color }} />
                      </div>
                      <span className="text-neutral-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`
                    w-full py-4 rounded-xl tracking-wider flex items-center justify-center gap-2 group
                    ${isProfessional
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRussian ? "ВЫБРАТЬ ПЛАН" : "SELECT PLAN"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Features comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl"
        >
          <h3 className="text-2xl mb-6 flex items-center gap-2">
            <Info className="w-6 h-6 text-orange-500" />
            {isRussian ? "Все планы включают" : "All Plans Include"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              isRussian ? "99.9% время работы SLA" : "99.9% uptime SLA",
              isRussian ? "Шифрование данных" : "Data encryption",
              isRussian ? "Регулярные обновления" : "Regular updates",
              isRussian ? "Документация API" : "API documentation",
              isRussian ? "Мобильные приложения" : "Mobile apps",
              isRussian ? "Соответствие GDPR" : "GDPR compliance",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
              >
                <Check className="w-5 h-5 text-green-500" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentForm && selectedPlanData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            onClick={() => setShowPaymentForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl mb-2">
                    {isRussian ? "Оформление заказа" : "Checkout"}
                  </h2>
                  <p className="text-neutral-400">
                    {selectedPlanData.name} - ${selectedPlanData.price[billingPeriod]} / 
                    {billingPeriod === "monthly" ? (isRussian ? " мес" : " mo") : (isRussian ? " год" : " yr")}
                  </p>
                </div>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Payment form */}
              <form className="space-y-6">
                {/* Card number */}
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                    {isRussian ? "НОМЕР КАРТЫ" : "CARD NUMBER"}
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                      maxLength={19}
                    />
                  </div>
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                      {isRussian ? "СРОК ДЕЙСТВИЯ" : "EXPIRY DATE"}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                      CVC
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Cardholder name */}
                <div>
                  <label className="block text-sm tracking-wider mb-2 text-neutral-400">
                    {isRussian ? "ИМЯ ВЛАДЕЛЬЦА" : "CARDHOLDER NAME"}
                  </label>
                  <input
                    type="text"
                    placeholder={isRussian ? "Иван Иванов" : "John Doe"}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Security info */}
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-300">
                    {isRussian
                      ? "Ваши платежные данные надежно зашифрованы и защищены. Мы не храним информацию о картах."
                      : "Your payment information is securely encrypted and protected. We don't store card details."}
                  </p>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-xl tracking-wider flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPaymentForm(false);
                    onNavigate("dashboard");
                  }}
                >
                  {isRussian ? "ОПЛАТИТЬ" : "PAY"} ${selectedPlanData.price[billingPeriod]}
                  <Lock className="w-4 h-4" />
                </motion.button>

                <p className="text-center text-sm text-neutral-500">
                  {isRussian
                    ? "14-дневная гарантия возврата средств"
                    : "14-day money back guarantee"}
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
