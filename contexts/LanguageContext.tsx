import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ru";

interface Translations {
  [key: string]: {
    en: string;
    ru: string;
  };
}

const translations: Translations = {
  // Navigation
  menu: { en: "MENU", ru: "МЕНЮ" },
  
  // Hero
  satelliteEcosystem: { en: "SATELLITE ECOSYSTEM", ru: "СПУТНИКОВАЯ ЭКОСИСТЕМА" },
  arcticClimate: { en: "Arctic Climate", ru: "Арктический климат" },
  monitoring: { en: "Monitoring", ru: "Мониторинг" },
  network: { en: "Network", ru: "Сеть" },
  heroDescription: {
    en: "Interconnected satellites on orbit, land, and water—communicating and guiding each other in a unified ecosystem for Arctic environmental monitoring.",
    ru: "Взаимосвязанные спутники на орбите, земле и в воде — обменивающиеся данными и направляющие друг друга в единой экосистеме для мониторинга арктической среды.",
  },
  exploreDashboard: { en: "EXPLORE DASHBOARD", ru: "ОТКРЫТЬ ДАШБОРД" },
  learnMore: { en: "LEARN MORE", ru: "УЗНАТЬ БОЛЬШЕ" },
  
  // Stats
  activeSatellites: { en: "Active Satellites", ru: "Активные спутники" },
  dataPoints: { en: "Data Points", ru: "Точки данных" },
  coverageArea: { en: "Coverage Area", ru: "Зона покрытия" },
  
  // Network Section
  ecosystemArchitecture: { en: "ECOSYSTEM ARCHITECTURE", ru: "АРХИТЕКТУРА ЭКОСИСТЕМЫ" },
  interconnectedIntelligence: { en: "Interconnected Intelligence", ru: "Взаимосвязанный интеллект" },
  networkDescription: {
    en: "Our network of satellites, ground stations, and ocean buoys work in harmony, continuously communicating and adjusting their parameters to provide comprehensive Arctic monitoring coverage.",
    ru: "Наша сеть спутников, наземных станций и океанских буев работает в гармонии, постоянно обмениваясь данными и корректируя параметры для обеспечения полного мониторинга Арктики.",
  },
  orbitalSatellites: { en: "Orbital Satellites", ru: "Орбитальные спутники" },
  orbitalDescription: { en: "Real-time climate data from space", ru: "Климатические данные в реальном времени из космоса" },
  groundStations: { en: "Ground Stations", ru: "Наземные станции" },
  groundDescription: { en: "Land-based monitoring and relay", ru: "Наземный мониторинг и ретрансляция" },
  oceanBuoys: { en: "Ocean Buoys", ru: "Океанские буи" },
  oceanDescription: { en: "Marine ecosystem tracking", ru: "Отслеживание морской экосистемы" },
  
  // Features
  capabilities: { en: "CAPABILITIES", ru: "ВОЗМОЖНОСТИ" },
  comprehensiveMonitoring: { en: "Comprehensive Monitoring", ru: "Комплексный мониторинг" },
  featuresDescription: {
    en: "Advanced satellite technology combined with AI-driven analytics for complete Arctic ecosystem oversight",
    ru: "Передовые спутниковые технологии в сочетании с аналитикой на основе ИИ для полного контроля арктической экосистемы",
  },
  climateTracking: { en: "Climate Tracking", ru: "Отслеживание климата" },
  climateDescription: {
    en: "Real-time temperature, ice coverage, and atmospheric data across the Arctic region",
    ru: "Данные о температуре, ледовом покрове и атмосфере в режиме реального времени по всему арктическому региону",
  },
  oceanMonitoring: { en: "Ocean Monitoring", ru: "Мониторинг океана" },
  oceanMonitoringDescription: {
    en: "Track ocean currents, salinity levels, and pollution patterns in Arctic waters",
    ru: "Отслеживание океанских течений, уровня солености и паттернов загрязнения в арктических водах",
  },
  wildlifeMigration: { en: "Wildlife Migration", ru: "Миграция животных" },
  wildlifeDescription: {
    en: "Monitor migration patterns and populations of Arctic marine and terrestrial species",
    ru: "Мониторинг миграционных паттернов и популяций арктических морских и наземных видов",
  },
  seismicActivity: { en: "Seismic Activity", ru: "Сейсмическая активность" },
  seismicDescription: {
    en: "Detect and analyze seismic events and tectonic movements in the region",
    ru: "Обнаружение и анализ сейсмических событий и тектонических движений в регионе",
  },
  weatherPatterns: { en: "Weather Patterns", ru: "Погодные паттерны" },
  weatherDescription: {
    en: "Advanced meteorological forecasting with machine learning predictions",
    ru: "Передовое метеорологическое прогнозирование с прогнозами машинного обучения",
  },
  navigationSupport: { en: "Navigation Support", ru: "Навигационная поддержка" },
  navigationDescription: {
    en: "Provide safe passage data for vessels navigating Arctic waters",
    ru: "Обеспечение данных безопасного прохода для судов в арктических водах",
  },
  
  // Dashboard
  interface: { en: "INTERFACE", ru: "ИНТЕРФЕЙС" },
  realTimeDashboard: { en: "Real-Time Dashboard", ru: "Дашборд в реальном времени" },
  dashboardDescription: {
    en: "Access live data streams, historical analytics, and predictive insights all in one unified platform",
    ru: "Доступ к потокам данных в реальном времени, исторической аналитике и прогнозам на единой платформе",
  },
  temperature: { en: "Temperature", ru: "Температура" },
  iceCoverage: { en: "Ice Coverage", ru: "Ледовый покров" },
  pollutionIndex: { en: "Pollution Index", ru: "Индекс загрязнения" },
  wildlifeTracked: { en: "Wildlife Tracked", ru: "Отслеживаемые виды" },
  dataStreams: { en: "DATA STREAMS", ru: "ПОТОКИ ДАННЫХ" },
  systemStatus: { en: "SYSTEM STATUS", ru: "СТАТУС СИСТЕМЫ" },
  operational: { en: "OPERATIONAL", ru: "РАБОТАЕТ" },
  recentActivity: { en: "RECENT ACTIVITY", ru: "ПОСЛЕДНЯЯ АКТИВНОСТЬ" },
  requestDemo: { en: "REQUEST DEMO ACCESS", ru: "ЗАПРОСИТЬ ДЕМО-ДОСТУП" },
  connected: { en: "CONNECTED", ru: "ПОДКЛЮЧЕНО" },
  
  // Footer
  platform: { en: "PLATFORM", ru: "ПЛАТФОРМА" },
  features: { en: "Features", ru: "Возможности" },
  dashboard: { en: "Dashboard", ru: "Дашборд" },
  apiAccess: { en: "API Access", ru: "API доступ" },
  documentation: { en: "Documentation", ru: "Документация" },
  pricing: { en: "Pricing", ru: "Цены" },
  contact: { en: "CONTACT", ru: "КОНТАКТЫ" },
  footerDescription: {
    en: "Advanced satellite ecosystem for comprehensive Arctic environmental monitoring. Protecting our planet through interconnected intelligence.",
    ru: "Передовая спутниковая экосистема для комплексного мониторинга арктической среды. Защищаем нашу планету через взаимосвязанный интеллект.",
  },
  privacyPolicy: { en: "Privacy Policy", ru: "Политика конфиденциальности" },
  termsOfService: { en: "Terms of Service", ru: "Условия использования" },
  cookiePolicy: { en: "Cookie Policy", ru: "Политика Cookie" },
  allRightsReserved: { en: "All rights reserved.", ru: "Все права защищены." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
