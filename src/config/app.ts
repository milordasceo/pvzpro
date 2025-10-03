/**
 * Конфигурация приложения
 * Централизованное место для всех настроек
 */

export const APP_CONFIG = {
  // Версия приложения
  VERSION: '1.0.0',

  // Окружения
  ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

  // API
  API: {
    BASE_URL: 'https://api.wb-pvz.ru',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },

  // Геолокация
  LOCATION: {
    GEOLOCATION_RADIUS: 100, // метров
    REQUEST_TIMEOUT: 10000,
    MAX_RETRIES: 3,
  },

  // QR коды
  QR: {
    SECRET: process.env.QR_SECRET || 'wb-demo-secret-change-me',
    TTL_DEFAULT: 180, // секунд
    MAX_TTL: 3600, // 1 час
    VALIDATE_URL: 'https://pvzqr.ru/api/validate.php',
    BIND_URL: 'https://pvzqr.ru/api/bind.php',
  },

  // Смена
  SHIFT: {
    WORK_HOURS_START: 10,
    WORK_HOURS_END: 22,
    BREAK_DURATION: 10, // минут
    BREAKS_ALLOWED: 3,
  },

  // UI
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 2500,
    MODAL_FADE_DURATION: 200,
  },

  // Кэширование
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 минут
    MAX_SIZE: 50, // максимум 50 элементов
  },

  // Логирование
  LOGGING: {
    LEVEL: 'debug',
    ENABLE_REMOTE_LOGGING: false,
    MAX_LOG_ENTRIES: 1000,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
