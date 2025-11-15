import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles,
  X,
  Mic,
  Paperclip,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  Thermometer,
  Waves
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatPageProps {
  onClose?: () => void;
  satelliteData?: {
    temperature: number;
    icecover: number;
    pollution: number;
    wildlife: number;
  };
}

export function ChatPage({ onClose, satelliteData }: ChatPageProps) {
  const { language } = useLanguage();
  const isRussian = language === "ru";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: isRussian 
        ? "Здравствуйте! Я AI-ассистент Arctic Network. Я помогу вам проанализировать данные со спутников и датчиков. Задайте мне любой вопрос о состоянии арктической экосистемы."
        : "Hello! I'm the Arctic Network AI assistant. I'll help you analyze satellite and sensor data. Ask me anything about the Arctic ecosystem's current state.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("temperature") || lowerMessage.includes("температур")) {
      return isRussian
        ? `Анализирую данные о температуре... Текущая температура в Арктике составляет ${satelliteData?.temperature.toFixed(1)}°C. Это на 0.3°C ниже, чем вчера. Спутники ARCTIC-1 и POLAR-2 отслеживают тепловые аномалии. В последние 24 часа наблюдается стабильное снижение температуры в северном секторе.`
        : `Analyzing temperature data... Current Arctic temperature is ${satelliteData?.temperature.toFixed(1)}°C. This is 0.3°C lower than yesterday. Satellites ARCTIC-1 and POLAR-2 are tracking thermal anomalies. Over the past 24 hours, we've observed a steady temperature decrease in the northern sector.`;
    }
    
    if (lowerMessage.includes("ice") || lowerMessage.includes("лед")) {
      return isRussian
        ? `Ледовый покров сейчас составляет ${satelliteData?.icecover.toFixed(1)}%. Это положительная тенденция - увеличение на 1.2% за последнюю неделю. Спутниковые снимки показывают уплотнение льда в восточном секторе. CLIMATE-3 фиксирует стабильную динамику.`
        : `Ice coverage is currently at ${satelliteData?.icecover.toFixed(1)}%. This is a positive trend - an increase of 1.2% over the past week. Satellite imagery shows ice consolidation in the eastern sector. CLIMATE-3 is recording stable dynamics.`;
    }
    
    if (lowerMessage.includes("pollution") || lowerMessage.includes("загрязнен")) {
      return isRussian
        ? `Индекс загрязнения: ${satelliteData?.pollution.toFixed(1)}. Буи GAMMA и DELTA сообщают о незначительном снижении уровня загрязнения. Основные источники: судоходные маршруты и промышленные зоны. Рекомендую обратить внимание на северо-западный сектор.`
        : `Pollution index: ${satelliteData?.pollution.toFixed(1)}. Buoys GAMMA and DELTA report a slight decrease in pollution levels. Main sources: shipping routes and industrial zones. I recommend focusing on the northwest sector.`;
    }
    
    if (lowerMessage.includes("wildlife") || lowerMessage.includes("животн") || lowerMessage.includes("фауна")) {
      return isRussian
        ? `Отслеживаем ${satelliteData?.wildlife} особей. Система обнаружила 12 новых сигналов за последний час. Миграционные паттерны показывают движение на юг. Популяция белых медведей стабильна. MONITOR-4 фиксирует повышенную активность морских млекопитающих.`
        : `Tracking ${satelliteData?.wildlife} specimens. The system detected 12 new signals in the past hour. Migration patterns show southward movement. Polar bear population is stable. MONITOR-4 is recording increased marine mammal activity.`;
    }
    
    if (lowerMessage.includes("satellite") || lowerMessage.includes("спутник")) {
      return isRussian
        ? `Все 47 спутников активны. ARCTIC-1, POLAR-2 и CLIMATE-3 работают в штатном режиме. MONITOR-4 находится на техническом обслуживании. Средний уровень сигнала: 95%. Следующая синхронизация данных через 2 часа.`
        : `All 47 satellites are active. ARCTIC-1, POLAR-2, and CLIMATE-3 are operating normally. MONITOR-4 is under maintenance. Average signal level: 95%. Next data sync in 2 hours.`;
    }

    if (lowerMessage.includes("predict") || lowerMessage.includes("прогноз")) {
      return isRussian
        ? `На основе анализа данных за последние 30 дней, прогнозирую: температура будет снижаться на 0.1-0.2°C в день, ледовый покров увеличится до 89-91% к концу недели. Погодные модели показывают стабильные условия. Рекомендую продолжить мониторинг.`
        : `Based on 30-day data analysis, I predict: temperature will decrease by 0.1-0.2°C daily, ice coverage will increase to 89-91% by week's end. Weather models show stable conditions. I recommend continued monitoring.`;
    }

    return isRussian
      ? "Интересный вопрос! Я анализирую все доступные данные со спутников. На основе текущих показателей: температура стабильна, ледовый покров в норме, система мониторинга работает оптимально. Если нужен детальный анализ конкретного параметра, уточните, пожалуйста."
      : "Interesting question! I'm analyzing all available satellite data. Based on current readings: temperature is stable, ice coverage is normal, monitoring system is operating optimally. If you need detailed analysis of a specific parameter, please specify.";
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = generateAIResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsThinking(false);

    // Stream the response
    for (let i = 0; i <= aiResponse.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content = aiResponse.slice(0, i);
          if (i === aiResponse.length) {
            lastMessage.isStreaming = false;
          }
        }
        return newMessages;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = isRussian ? [
    "Какая текущая температура?",
    "Анализ ледового покрова",
    "Статус спутников",
    "Прогноз на неделю",
  ] : [
    "What's the current temperature?",
    "Analyze ice coverage",
    "Satellite status",
    "Week forecast",
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="backdrop-blur-xl bg-black/80 border-b border-white/10 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center relative"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(249, 115, 22, 0.3)",
                  "0 0 30px rgba(249, 115, 22, 0.5)",
                  "0 0 20px rgba(249, 115, 22, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot className="w-6 h-6 text-white" />
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-500"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-xl">Arctic AI Assistant</h2>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>{isRussian ? "Онлайн" : "Online"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.role === "assistant"
                    ? "bg-gradient-to-br from-orange-500 to-orange-600"
                    : "bg-gradient-to-br from-blue-500 to-blue-600"
                  }
                `}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <UserIcon className="w-5 h-5 text-white" />
                )}
              </motion.div>

              {/* Message content */}
              <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`
                    inline-block max-w-3xl px-6 py-4 rounded-2xl
                    ${message.role === "assistant"
                      ? "bg-white/5 border border-white/10"
                      : "bg-gradient-to-br from-orange-500 to-orange-600"
                    }
                  `}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-1 h-4 bg-orange-500 ml-1"
                      />
                    )}
                  </p>
                  <div className="mt-2 text-xs text-neutral-400">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                  <span className="text-neutral-400">
                    {isRussian ? "Анализирую данные..." : "Analyzing data..."}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-4"
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-neutral-400">
            <Sparkles className="w-4 h-4" />
            <span>{isRussian ? "Попробуйте спросить:" : "Try asking:"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInput(question)}
                className="px-4 py-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
              >
                {question}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="backdrop-blur-xl bg-black/80 border-t border-white/10 px-6 py-4"
      >
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-end gap-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5 text-neutral-400" />
            </motion.button>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRussian ? "Задайте вопрос об Арктике..." : "Ask about the Arctic..."}
              className="flex-1 bg-transparent outline-none resize-none max-h-32 py-2 px-2"
              rows={1}
              disabled={isThinking}
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Mic className="w-5 h-5 text-neutral-400" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className={`
                p-3 rounded-xl transition-all
                ${input.trim() && !isThinking
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-white/5 opacity-50 cursor-not-allowed"
                }
              `}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Data context indicator */}
          {satelliteData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-4 text-xs text-neutral-500"
            >
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                <span>{satelliteData.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Waves className="w-3 h-3" />
                <span>{satelliteData.icecover.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>{satelliteData.pollution.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{satelliteData.wildlife}</span>
              </div>
              <span className="ml-auto">
                {isRussian ? "AI использует актуальные данные" : "AI using live data"}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
