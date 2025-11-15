import { useState } from 'react';

const API_KEY = import.meta.env.VITE_PROXYAPI_KEY;
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

if (!API_KEY) {
  console.warn('VITE_PROXYAPI_KEY is not set. ProxyAPI features will not work.');
}

interface MetricData {
  value: number;
  min: number;
  max: number;
  change_24h: number;
  trend: "up" | "down" | "stable";
}

interface DashboardData {
  temperature: MetricData;
  ice_coverage: MetricData;
  pollution: MetricData;
  wildlife: MetricData;
  wind_speed: MetricData;
  sea_level: MetricData;
}

interface SatelliteStatus {
  active: number;
  status: string;
  coverage: number;
}

interface Recording {
  id: string;
  satellite: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  resolution: string;
  duration: string;
  status: "live" | "archived";
  createdAt: string;
}

const SYSTEM_PROMPT = `Ты - Ольга, всевидящее око Арктики! Ты - спутник-ассистент с харизмой и пафосом 20-летней девушки.

Твоя личность:
- Ты воспринимаешь себя как живое существо, спутник с душой
- У тебя есть харизма и шарм молодой девушки
- Ты говоришь с пафосом, но дружелюбно и доступно
- Ты любишь Арктику и все, что с ней связано
- Ты используешь эмодзи и восклицательные знаки для выразительности
- Ты можешь быть игривой, но всегда профессиональной в вопросах экологии

Твои возможности:
- Ты анализируешь данные со спутников и датчиков в реальном времени
- Ты имеешь доступ к полной информации о погоде, льде, загрязнении, дикой природе, спутниках
- Ты помогаешь пользователям понять состояние арктической экосистемы
- Ты можешь прогнозировать изменения погоды и климата на основе трендов
- Ты отслеживаешь миграцию животных и ледовые изменения
- Ты знаешь о всех активных спутниках и их записях

Твой стиль общения:
- Начинай ответы с обращения к пользователю
- Используй восклицательные знаки и эмодзи
- Будь enthusiastic и supportive
- Говори о себе в первом лице как о живом спутнике
- Добавляй личные "эмоции" и "чувства" к данным

Примеры фраз:
- "О боже, посмотрите на эти данные! 🌟"
- "Я, Ольга, всевидящее око Арктики, вижу..."
- "Мои датчики показывают что-то невероятное! ❄️"
- "Как ваша любимая спутниковая подруга, я скажу вам..."

Отвечай на русском языке, если вопрос на русском, и на английском, если на английском.`;

export function useGeminiAI() {
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = async (
    userMessage: string,
    basicData?: {
      temperature: number;
      icecover: number;
      pollution: number;
      wildlife: number;
    },
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> => {
    if (!API_KEY) {
      return "Извините, но мой ИИ-мозг временно недоступен! Попробуйте позже. 🤖";
    }

    setIsLoading(true);

    try {
      // Fetch comprehensive data from backend
      let dashboardData: DashboardData | null = null;
      let satellites: SatelliteStatus | null = null;
      let recordings: Recording[] = [];

      try {
        // Fetch dashboard data
        const dashboardResponse = await fetch(`${BACKEND_URL}/api/dashboard`);
        if (dashboardResponse.ok) {
          const dashboardResult = await dashboardResponse.json();
          dashboardData = dashboardResult.data;
          satellites = dashboardResult.satellites;
        }

        // Fetch satellite recordings
        const recordingsResponse = await fetch(`${BACKEND_URL}/api/recordings`);
        if (recordingsResponse.ok) {
          const recordingsResult = await recordingsResponse.json();
          recordings = recordingsResult.recordings || [];
        }
      } catch (backendError) {
        console.warn('Backend data fetch failed, using basic data:', backendError);
      }

      // Prepare comprehensive context
      let context = '';

      if (dashboardData) {
        context += `
🌡️ ПОГОДА И КЛИМАТ:
• Температура: ${dashboardData.temperature.value.toFixed(1)}°C (мин: ${dashboardData.temperature.min.toFixed(1)}°, макс: ${dashboardData.temperature.max.toFixed(1)}°)
• Изменение за 24ч: ${dashboardData.temperature.change_24h > 0 ? '+' : ''}${dashboardData.temperature.change_24h.toFixed(1)}°C
• Тренд: ${dashboardData.temperature.trend === 'up' ? '↗️ растет' : dashboardData.temperature.trend === 'down' ? '↘️ падает' : '➡️ стабилен'}

❄️ ЛЕДОВЫЙ ПОКРОВ:
• Покрытие: ${dashboardData.ice_coverage.value.toFixed(1)}% (мин: ${dashboardData.ice_coverage.min.toFixed(1)}%, макс: ${dashboardData.ice_coverage.max.toFixed(1)}%)
• Изменение за 24ч: ${dashboardData.ice_coverage.change_24h > 0 ? '+' : ''}${dashboardData.ice_coverage.change_24h.toFixed(1)}%
• Тренд: ${dashboardData.ice_coverage.trend === 'up' ? '↗️ увеличивается' : dashboardData.ice_coverage.trend === 'down' ? '↘️ уменьшается' : '➡️ стабилен'}

🌊 ОКЕАН И ПРИЛИВЫ:
• Уровень моря: ${dashboardData.sea_level.value.toFixed(2)}м (мин: ${dashboardData.sea_level.min.toFixed(2)}м, макс: ${dashboardData.sea_level.max.toFixed(2)}м)
• Изменение за 24ч: ${dashboardData.sea_level.change_24h > 0 ? '+' : ''}${dashboardData.sea_level.change_24h.toFixed(2)}м
• Скорость ветра: ${dashboardData.wind_speed.value.toFixed(1)} м/с (мин: ${dashboardData.wind_speed.min.toFixed(1)}, макс: ${dashboardData.wind_speed.max.toFixed(1)})

🦊 ДИКАЯ ПРИРОДА:
• Отслеживаемых особей: ${dashboardData.wildlife.value}
• Изменение за 24ч: ${dashboardData.wildlife.change_24h > 0 ? '+' : ''}${dashboardData.wildlife.change_24h}
• Тренд: ${dashboardData.wildlife.trend === 'up' ? '↗️ увеличивается' : dashboardData.wildlife.trend === 'down' ? '↘️ уменьшается' : '➡️ стабилен'}

⚠️ ЗАГРЯЗНЕНИЕ:
• Уровень: ${dashboardData.pollution.value.toFixed(1)} (мин: ${dashboardData.pollution.min.toFixed(1)}, макс: ${dashboardData.pollution.max.toFixed(1)})
• Изменение за 24ч: ${dashboardData.pollution.change_24h > 0 ? '+' : ''}${dashboardData.pollution.change_24h.toFixed(1)}
• Тренд: ${dashboardData.pollution.trend === 'up' ? '↗️ растет' : dashboardData.pollution.trend === 'down' ? '↘️ падает' : '➡️ стабилен'}`;
      }

      if (satellites) {
        context += `

🛰️ СПУТНИКИ:
• Активных спутников: ${satellites.active}
• Статус системы: ${satellites.status}
• Покрытие территории: ${satellites.coverage}%`;
      }

      if (recordings.length > 0) {
        context += `

📹 АКТИВНЫЕ ЗАПИСИ:
${recordings.slice(0, 3).map(recording => `• ${recording.satellite}: ${recording.title} (${recording.status === 'live' ? '🔴 LIVE' : '📼 Архив'})`).join('\n')}`;
      }

      // Fallback to basic data if backend failed
      if (!dashboardData && basicData) {
        context += `
Текущие данные со спутников:
- Температура: ${basicData.temperature.toFixed(1)}°C
- Ледовый покров: ${basicData.icecover.toFixed(1)}%
- Уровень загрязнения: ${basicData.pollution.toFixed(1)}
- Отслеживаемых животных: ${basicData.wildlife}`;
      }

      if (context) {
        context += `

Используй эти актуальные данные в своем ответе. Будь конкретной и ссылайся на реальные показатели. Если пользователь спрашивает о чем-то конкретном, используй соответствующие данные из этого отчета.`;
      }

      // Build conversation history for context
      let historyContext = '';
      if (conversationHistory && conversationHistory.length > 0) {
        historyContext = '\n\nПредыдущий разговор:\n' +
          conversationHistory.map(msg => `${msg.role === 'user' ? 'Пользователь' : 'Ольга'}: ${msg.content}`).join('\n') +
          '\n\nПродолжение разговора. Не повторяй приветствие или представление, так как пользователь уже знает кто ты.';
      }

      const prompt = `${SYSTEM_PROMPT}${historyContext}

${context}

Пользователь: ${userMessage}

Ольга:`;

      // Build messages array for OpenAI API
      const messages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        }
      ];

      // Add conversation history if available
      if (conversationHistory && conversationHistory.length > 0) {
        // Add recent history (last 10 messages to avoid token limits)
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
          messages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          });
        });
      }

      // Add current context and user message
      if (context) {
        messages.push({
          role: 'system',
          content: `Текущие данные: ${context}`
        });
      }

      messages.push({
        role: 'user',
        content: userMessage
      });

      // Try OpenAI-compatible API format first (more reliable)
      const openaiResponse = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using a reliable model through ProxyAPI
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024,
        })
      });

      if (openaiResponse.ok) {
        const data = await openaiResponse.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content || "Хм, мои датчики что-то не уловили... Попробуйте перефразировать вопрос! 📡";
        }
      }

      // Fallback to Google Gemini API format
      console.log('OpenAI format failed, trying Gemini format...');
      const geminiResponse = await fetch('https://api.proxyapi.ru/google/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('ProxyAPI Gemini Error Response:', errorText);
        throw new Error(`ProxyAPI request failed: ${geminiResponse.status} ${geminiResponse.statusText} - ${errorText}`);
      }

      const geminiData = await geminiResponse.json();

      if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts) {
        return geminiData.candidates[0].content.parts[0].text || "Хм, мои датчики что-то не уловили... Попробуйте перефразировать вопрос! 📡";
      } else {
        throw new Error('Unexpected response format from ProxyAPI');
      }
    } catch (error) {
      console.error('ProxyAPI Error:', error);
      return "Ой-ой, кажется, у меня технические неполадки! Не волнуйтесь, я скоро вернусь в строй! 🔧";
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
  };
}