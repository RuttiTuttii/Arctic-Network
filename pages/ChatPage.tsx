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
  Waves,
  Plus,
  MessageSquare,
  Settings
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useGeminiAI } from "../hooks/useGeminiAI";
import { useDashboardData } from "../hooks/useDashboard";
import { Header } from "../components/Header";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
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
  const { generateResponse, isLoading: aiLoading } = useGeminiAI();
  const { dashboardData, satellites } = useDashboardData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load sessions and chat history on component mount
  useEffect(() => {
    const initializeChat = async () => {
      await loadSessions();
      await loadChatHistory(currentSessionId);
    };

    initializeChat();
  }, [isRussian]);


  const loadSessions = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${BACKEND_URL}/api/chat/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const title = `Чат ${new Date().toLocaleDateString()}`;
      const response = await fetch(`${BACKEND_URL}/api/chat/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSessionId(data.sessionId);
        setMessages([]);
        setIsLoadingHistory(false);
        await loadSessions();
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };


  const switchSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setMessages([]);
    setIsLoadingHistory(true);
    await loadChatHistory(sessionId);
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${BACKEND_URL}/api/chat/history?sessionId=${sessionId}`);

      if (response.ok) {
        const data = await response.json();
        const historyMessages: Message[] = data.messages.map((msg: any) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }));

        setMessages(historyMessages);

        // If no history and it's the default session, add initial greeting
        if (historyMessages.length === 0 && sessionId === 'default') {
          const initialMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: isRussian
              ? "Привет! Я Ольга, всевидящее око Арктики! 🌟 Я ваш спутник-ассистент с душой и харизмой. Расскажите, что вас интересует в нашей прекрасной Арктике?"
              : "Hi! I'm Olga, the all-seeing eye of the Arctic! 🌟 I'm your satellite assistant with soul and charisma. Tell me, what interests you about our beautiful Arctic?",
            timestamp: new Date(),
          };
          setMessages([initialMessage]);
        }
      } else {
        // If API fails, show initial greeting for default session
        if (sessionId === 'default') {
          const initialMessage: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: isRussian
              ? "Привет! Я Ольга, всевидящее око Арктики! 🌟 Я ваш спутник-ассистент с душой и харизмой. Расскажите, что вас интересует в нашей прекрасной Арктике?"
              : "Hi! I'm Olga, the all-seeing eye of the Arctic! 🌟 I'm your satellite assistant with soul and charisma. Tell me, what interests you about our beautiful Arctic?",
            timestamp: new Date(),
          };
          setMessages([initialMessage]);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Show initial greeting on error for default session
      if (sessionId === 'default') {
        const initialMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: isRussian
            ? "Привет! Я Ольга, всевидящее око Арктики! 🌟 Я ваш спутник-ассистент с душой и харизмой. Расскажите, что вас интересует в нашей прекрасной Арктике?"
            : "Hi! I'm Olga, the all-seeing eye of the Arctic! 🌟 I'm your satellite assistant with soul and charisma. Tell me, what interests you about our beautiful Arctic?",
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveMessageToDB = async (role: string, content: string) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      await fetch(`${BACKEND_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          content,
          sessionId: currentSessionId
        }),
      });
    } catch (error) {
      console.error('Error saving message to DB:', error);
      // Don't block the UI on save errors
    }
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
    const currentInput = input;
    setInput("");
    setIsThinking(true);

    // Save user message to DB
    await saveMessageToDB('user', userMessage.content);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Get conversation history (excluding the current messages being added)
      const historyForAI = messages
        .filter(msg => msg.role !== 'assistant' || !msg.isStreaming) // Exclude streaming assistant messages
        .map(msg => ({ role: msg.role, content: msg.content }));

      const aiResponse = await generateResponse(currentInput, undefined, historyForAI);

      // Save assistant message to DB
      await saveMessageToDB('assistant', aiResponse);

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
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = isRussian
        ? "Ой, кажется у меня небольшие технические неполадки! Попробуйте еще раз через минутку. 🔧"
        : "Oops, I seem to have some technical issues! Try again in a minute. 🔧";

      // Save error message to DB
      await saveMessageToDB('assistant', errorMessage);

      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content = errorMessage;
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
    } finally {
      setIsThinking(false);
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
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        className="w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="mb-4">
            <Header />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{isRussian ? "Чаты" : "Chats"}</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={createNewSession}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={isRussian ? "Новый чат" : "New chat"}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
            <motion.div
              key={session.session_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                group relative p-3 rounded-lg cursor-pointer transition-all mb-2
                ${currentSessionId === session.session_id
                  ? "bg-orange-500/20 border border-orange-500/30"
                  : "hover:bg-white/5"
                }
              `}
              onClick={() => switchSession(session.session_id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {session.title}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {session.message_count} {isRussian ? "сообщений" : "messages"} • {new Date(session.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
              <h2 className="text-xl">Ольга - Всевидящее Око Арктики</h2>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>{isRussian ? "В орбите" : "In orbit"}</span>
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

      {/* Loading state */}
      {isLoadingHistory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-4"
        >
          <div className="flex items-center gap-2 text-neutral-400">
            <motion.div
              className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>{isRussian ? "Загружаю историю чата..." : "Loading chat history..."}</span>
          </div>
        </motion.div>
      )}

      {/* Suggested questions */}
      {!isLoadingHistory && messages.length <= 1 && (
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
              placeholder={isRussian ? "Спросите Ольгу об Арктике..." : "Ask Olga about the Arctic..."}
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
          {(dashboardData || satelliteData) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-4 text-xs text-neutral-500"
            >
              {dashboardData ? (
                <>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    <span>{dashboardData.temperature.value.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Waves className="w-3 h-3" />
                    <span>{dashboardData.ice_coverage.value.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{dashboardData.pollution.value.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{dashboardData.wildlife.value}</span>
                  </div>
                  {satellites && (
                    <div className="flex items-center gap-1">
                      <span>🛰️</span>
                      <span>{satellites.active}</span>
                    </div>
                  )}
                </>
              ) : satelliteData ? (
                <>
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
                </>
              ) : null}
              <span className="ml-auto">
                {isRussian ? "Ольга видит всё в реальном времени" : "Olga sees everything in real-time"}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
      </div>

    </div>
  );
}
