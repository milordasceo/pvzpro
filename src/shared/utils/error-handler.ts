import { ApiError } from '../types';

/**
 * Глобальная система обработки ошибок
 * Предоставляет унифицированный способ обработки и логирования ошибок
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  UNKNOWN = 'unknown',
}

export interface ErrorInfo {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  code?: string;
  context?: Record<string, any>;
  stack?: string;
  timestamp: Date;
  userId?: string;
  userAgent?: string;
  url?: string;
}

export interface ErrorHandlerOptions {
  enableLogging?: boolean;
  enableRemoteLogging?: boolean;
  maxLocalErrors?: number;
  onError?: (error: ErrorInfo) => void;
}

class ErrorHandler {
  private options: Required<ErrorHandlerOptions>;
  private localErrors: ErrorInfo[] = [];

  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      enableLogging: true,
      enableRemoteLogging: false,
      maxLocalErrors: 100,
      onError: () => {},
      ...options,
    };
  }

  /**
   * Обрабатывает ошибку и создает ErrorInfo
   */
  handleError(error: Error | ApiError | string, context?: Record<string, any>): ErrorInfo {
    const errorInfo = this.createErrorInfo(error, context);

    // Логируем локально
    if (this.options.enableLogging) {
      this.logError(errorInfo);
    }

    // Добавляем в локальный кэш
    this.localErrors.push(errorInfo);
    if (this.localErrors.length > this.options.maxLocalErrors) {
      this.localErrors.shift(); // Удаляем самые старые ошибки
    }

    // Вызываем колбэк
    this.options.onError(errorInfo);

    // Отправляем на сервер (если включено)
    if (this.options.enableRemoteLogging) {
      this.sendToRemote(errorInfo);
    }

    return errorInfo;
  }

  /**
   * Создает объект ErrorInfo из ошибки
   */
  private createErrorInfo(
    error: Error | ApiError | string,
    context?: Record<string, any>,
  ): ErrorInfo {
    const timestamp = new Date();

    if (typeof error === 'string') {
      return {
        id: this.generateErrorId(),
        message: error,
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        context,
        timestamp,
        userAgent: navigator?.userAgent,
        url: window?.location?.href,
      };
    }

    if (error instanceof ApiError) {
      return {
        id: this.generateErrorId(),
        message: error.message,
        category: this.categorizeApiError(error),
        severity: this.getApiErrorSeverity(error),
        code: error.code,
        context: {
          ...context,
          statusCode: error.statusCode,
          details: error.details,
        },
        stack: error.stack,
        timestamp,
        userAgent: navigator?.userAgent,
        url: window?.location?.href,
      };
    }

    return {
      id: this.generateErrorId(),
      message: error.message,
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.HIGH,
      context,
      stack: error.stack,
      timestamp,
      userAgent: navigator?.userAgent,
      url: window?.location?.href,
    };
  }

  /**
   * Определяет категорию API ошибки
   */
  private categorizeApiError(error: ApiError): ErrorCategory {
    if ((error.statusCode ?? 0) === 401 || (error.statusCode ?? 0) === 403) {
      return ErrorCategory.AUTHENTICATION;
    }
    if ((error.statusCode ?? 0) === 400 || (error.statusCode ?? 0) === 422) {
      return ErrorCategory.VALIDATION;
    }
    if ((error.statusCode ?? 0) >= 500) {
      return ErrorCategory.SYSTEM;
    }
    if (error.code?.includes('NETWORK') || error.code?.includes('TIMEOUT')) {
      return ErrorCategory.NETWORK;
    }
    return ErrorCategory.BUSINESS_LOGIC;
  }

  /**
   * Определяет серьезность API ошибки
   */
  private getApiErrorSeverity(error: ApiError): ErrorSeverity {
    if ((error.statusCode ?? 0) >= 500) {
      return ErrorSeverity.CRITICAL;
    }
    if ((error.statusCode ?? 0) === 401 || (error.statusCode ?? 0) === 403) {
      return ErrorSeverity.HIGH;
    }
    if ((error.statusCode ?? 0) === 400 || (error.statusCode ?? 0) === 422) {
      return ErrorSeverity.MEDIUM;
    }
    return ErrorSeverity.LOW;
  }

  /**
   * Генерирует уникальный ID ошибки
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Логирует ошибку в консоль
   */
  private logError(errorInfo: ErrorInfo): void {
    const logMethod = this.getLogMethod(errorInfo.severity);

    console[logMethod](`[${errorInfo.category.toUpperCase()}] ${errorInfo.message}`, {
      id: errorInfo.id,
      code: errorInfo.code,
      context: errorInfo.context,
      stack: errorInfo.stack,
    });
  }

  /**
   * Возвращает метод логирования в зависимости от серьезности
   */
  private getLogMethod(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      default:
        return 'log';
    }
  }

  /**
   * Отправляет ошибку на удаленный сервер
   */
  private async sendToRemote(errorInfo: ErrorInfo): Promise<void> {
    try {
      // Здесь должен быть вызов API для отправки ошибки
    } catch (error) {
      // Если не удалось отправить ошибку, логируем локально
    }
  }

  /**
   * Возвращает все локальные ошибки
   */
  getLocalErrors(): ErrorInfo[] {
    return [...this.localErrors];
  }

  /**
   * Очищает локальные ошибки
   */
  clearLocalErrors(): void {
    this.localErrors = [];
  }

  /**
   * Возвращает ошибки по категории
   */
  getErrorsByCategory(category: ErrorCategory): ErrorInfo[] {
    return this.localErrors.filter((error) => error.category === category);
  }

  /**
   * Возвращает ошибки по серьезности
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorInfo[] {
    return this.localErrors.filter((error) => error.severity === severity);
  }
}

// Глобальный экземпляр обработчика ошибок
export const errorHandler = new ErrorHandler({
  enableLogging: true,
  enableRemoteLogging: false,
  maxLocalErrors: 100,
});

// Удобные функции для обработки ошибок
export const handleError = (error: Error | ApiError | string, context?: Record<string, any>) => {
  return errorHandler.handleError(error, context);
};

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, any>,
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler.handleError(error as Error, context);
    return null;
  }
};
