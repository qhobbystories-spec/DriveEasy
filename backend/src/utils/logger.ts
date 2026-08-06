import { config } from '../config/environment';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLogLevel = LOG_LEVELS[config.logLevel as LogLevel] || 2;

const formatTime = () => new Date().toISOString();

const shouldLog = (level: LogLevel) => LOG_LEVELS[level] <= currentLogLevel;

export const logger = {
  error: (message: string, data?: any) => {
    if (shouldLog('error')) {
      console.error(`[${formatTime()}] ERROR:`, message, data || '');
    }
  },

  warn: (message: string, data?: any) => {
    if (shouldLog('warn')) {
      console.warn(`[${formatTime()}] WARN:`, message, data || '');
    }
  },

  info: (message: string, data?: any) => {
    if (shouldLog('info')) {
      console.log(`[${formatTime()}] INFO:`, message, data || '');
    }
  },

  debug: (message: string, data?: any) => {
    if (shouldLog('debug')) {
      console.log(`[${formatTime()}] DEBUG:`, message, data || '');
    }
  },
};
