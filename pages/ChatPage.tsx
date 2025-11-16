import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  X,
  Mic,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  Thermometer,
  Waves,
  Plus,
  MessageSquare
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useGeminiAI } from "../hooks/useGeminiAI";
import { useDashboardData } from "../hooks/useDashboard";
import { Header } from "../components/Header";
import { Logo } from "../components/Logo";
import { MessageContent } from "../components/MessageContent";

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
  const { generateResponse } = useGeminiAI();
  const { dashboardData, satellites } = useDashboardData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close header menu and delete confirmation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((headerMenuOpen || deleteConfirmOpen) && !(event.target as Element).closest('.header-menu-container')) {
        setHeaderMenuOpen(false);
        setDeleteConfirmOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [headerMenuOpen, deleteConfirmOpen]);

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
    setMenuOpen(null);
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      if (sessionId === 'default') {
        // For default session, just clear local messages and show initial greeting
        setMessages([]);
        // The loadChatHistory will show initial greeting when there are no messages
      } else {
        // For other sessions, delete normally
        await fetch(`${BACKEND_URL}/api/chat/sessions/${sessionId}`, {
          method: 'DELETE',
        });
        await loadSessions();
        if (currentSessionId === sessionId) {
          setCurrentSessionId('default');
          setMessages([]);
          await loadChatHistory('default');
        }
      }
      setMenuOpen(null);
    } catch (error) {
      console.error('Error deleting/clearing session:', error);
    }
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

  const handleVoiceInput = () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isRussian ? 'Распознавание речи не поддерживается в этом браузере' : 'Speech recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = isRussian ? 'ru-RU' : 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
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
    <div className="fixed inset-0 bg-black z-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        className="w-full md:w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 md:flex flex-col hidden md:flex"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-col gap-4">
            <div className="hidden md:block">
              <Logo />
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
                <div className="relative header-menu-container">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === session.session_id ? null : session.session_id);
                    }}
                    className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </motion.button>
                  {menuOpen === session.session_id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-6 bg-black border border-white/20 rounded-lg p-2 z-10"
                    >
                      <button
                        onClick={() => deleteSession(session.session_id)}
                        className="text-red-400 hover:text-red-300 text-sm whitespace-nowrap"
                      >
                        {isRussian ? "Удалить" : "Delete"}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="backdrop-blur-xl bg-black/80 border-b border-white/10 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center relative flex-shrink-0"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(249, 115, 22, 0.3)",
                  "0 0 30px rgba(249, 115, 22, 0.5)",
                  "0 0 20px rgba(249, 115, 22, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <motion.div
                className="absolute inset-0 rounded-full bg-orange-500"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl truncate">{isRussian ? "Ольга - Всевидящее Око Арктики" : "Olga - All-Seeing Eye of the Arctic"}</h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
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
              onClick={createNewSession}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              title={isRussian ? "Новый чат" : "New chat"}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </motion.button>

              {/* Header Dropdown Menu */}
              <AnimatePresence>
                {headerMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-12 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg p-2 z-50 min-w-64 max-h-80 overflow-y-auto"
                  >
                    <div className="text-sm font-medium text-neutral-300 mb-2 px-2">
                      {isRussian ? "Все чаты" : "All Chats"}
                    </div>
                    {sessions.length === 0 ? (
                      <div className="text-neutral-500 text-sm px-2 py-4 text-center">
                        {isRussian ? "Нет чатов" : "No chats"}
                      </div>
                    ) : (
                      sessions.map((session) => (
                        <motion.div
                          key={session.session_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="relative group mb-1"
                        >
                          <motion.button
                            onClick={() => {
                              switchSession(session.session_id);
                              setHeaderMenuOpen(false);
                            }}
                            className={`
                              w-full text-left p-3 rounded-lg transition-all
                              ${currentSessionId === session.session_id
                                ? "bg-orange-500/20 border border-orange-500/30"
                                : "hover:bg-white/5"
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {session.title}
                                </div>
                                <div className="text-xs text-neutral-400 mt-1">
                                  {session.message_count} {isRussian ? "сообщений" : "messages"} • {new Date(session.updated_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </motion.button>

                          {/* Delete button */}
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmOpen(session.session_id);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </motion.button>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delete Confirmation Dialog */}
              <AnimatePresence>
                {deleteConfirmOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-12 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg p-4 z-50 min-w-64"
                  >
                    <div className="text-sm font-medium text-neutral-300 mb-2">
                      {deleteConfirmOpen === 'default'
                        ? (isRussian ? "Очистить чат?" : "Clear chat?")
                        : (isRussian ? "Удалить чат?" : "Delete chat?")
                      }
                    </div>
                    <div className="text-xs text-neutral-400 mb-4">
                      {deleteConfirmOpen === 'default'
                        ? (isRussian ? "Все сообщения будут удалены, но чат останется." : "All messages will be cleared, but the chat will remain.")
                        : (isRussian ? "Это действие нельзя отменить." : "This action cannot be undone.")
                      }
                    </div>
                    <div className="flex gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteConfirmOpen(null)}
                        className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 rounded transition-colors"
                      >
                        {isRussian ? "Отмена" : "Cancel"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (deleteConfirmOpen) {
                            deleteSession(deleteConfirmOpen);
                            setDeleteConfirmOpen(null);
                            setHeaderMenuOpen(false);
                          }
                        }}
                        className={`px-3 py-1 text-xs text-white rounded transition-colors ${
                          deleteConfirmOpen === 'default'
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {deleteConfirmOpen === 'default'
                          ? (isRussian ? "Очистить" : "Clear")
                          : (isRussian ? "Удалить" : "Delete")
                        }
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
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
              <div className={`flex-1 min-w-0 ${message.role === "user" ? "flex justify-end" : ""}`}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`
                    inline-block w-full max-w-3xl px-4 py-3 rounded-2xl sm:px-6 sm:py-4
                    ${message.role === "assistant"
                      ? "bg-white/5 border border-white/10"
                      : "bg-gradient-to-br from-orange-500 to-orange-600"
                    }
                  `}
                >
                  <MessageContent content={message.content} />
                  {message.isStreaming && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-4 bg-orange-500 ml-1"
                    />
                  )}
                  <div className="mt-2 text-xs text-neutral-400">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Thinking indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex gap-4"
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(249, 115, 22, 0.3)",
                  "0 0 20px rgba(249, 115, 22, 0.6)",
                  "0 0 10px rgba(249, 115, 22, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-700 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Bot className="w-6 h-6 text-white relative z-10" />

              {/* Thinking particles */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
              />
            </motion.div>

            <div className="flex-1">
              <motion.div
                className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/20 backdrop-blur-sm"
                animate={{
                  boxShadow: [
                    "0 0 5px rgba(255, 255, 255, 0.1)",
                    "0 0 15px rgba(249, 115, 22, 0.2)",
                    "0 0 5px rgba(255, 255, 255, 0.1)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  {/* Enhanced thinking animation */}
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gradient-to-t from-orange-400 to-orange-600 rounded-full"
                        animate={{
                          y: [0, -8, 0],
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Thinking text with animation */}
                  <motion.span
                    className="text-neutral-300 font-medium"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isRussian ? "Ольга думает..." : "Olga is thinking..."}
                  </motion.span>

                  {/* Progress indicator */}
                  <motion.div
                    className="flex gap-1 ml-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 bg-orange-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </motion.div>
                </div>

                {/* Subtle data processing visualization */}
                <motion.div
                  className="mt-3 flex items-center gap-2 text-xs text-neutral-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <div className="w-1 h-1 bg-green-400 rounded-full" />
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                  </motion.div>
                  <span>{isRussian ? "Анализ спутниковых данных..." : "Analyzing satellite data..."}</span>
                </motion.div>
              </motion.div>
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
        className="backdrop-blur-xl bg-black/80 border-t border-white/10 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
      >
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2 sm:p-3">
            <div className="flex items-end gap-2 flex-1 min-w-0">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRussian ? "Спросите Ольгу об Арктике..." : "Ask Olga about the Arctic..."}
                className="flex-1 bg-transparent outline-none resize-none max-h-32 py-2 px-2 text-sm sm:text-base min-w-0"
                rows={1}
                disabled={isThinking}
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  isRecording ? 'bg-red-500/20 hover:bg-red-500/30' : 'hover:bg-white/5'
                }`}
                disabled={isThinking}
              >
                <motion.div
                  animate={isRecording ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
                >
                  <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'text-red-400' : 'text-neutral-400'}`} />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className={`
                  p-2 sm:p-3 rounded-xl transition-all flex-shrink-0
                  ${input.trim() && !isThinking
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-white/5 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>

          {/* Data context indicator */}
          {(dashboardData || satelliteData) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-neutral-500"
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
              <span className="hidden sm:flex flex-1 min-w-0 text-right ml-auto">
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
