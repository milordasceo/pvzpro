import { APP_CONFIG } from '../config/app';
import { ApiResponse, ApiError } from '../types';

/**
 * Базовый API клиент
 * Обеспечивает единый интерфейс для работы с API
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = APP_CONFIG.API.BASE_URL;
    this.timeout = APP_CONFIG.API.TIMEOUT;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let lastError: ApiResponse<T> | null = null;
    const maxRetries = APP_CONFIG.API.RETRY_ATTEMPTS;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Retry only on 5xx errors
          if (response.status >= 500 && attempt < maxRetries) {
            await this.delay(this.getRetryDelay(attempt));
            continue;
          }
          throw new ApiError(
            `HTTP_${response.status}`,
            `HTTP Error: ${response.status} ${response.statusText}`,
            response.status,
          );
        }

        const data = await response.json();

        return {
          success: true,
          data,
        };
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          return {
            success: false,
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
          };
        }

        if ((error as any)?.name === 'AbortError') {
          lastError = {
            success: false,
            error: {
              code: 'TIMEOUT',
              message: 'Request timeout',
            },
          };
          // Retry on timeout
          if (attempt < maxRetries) {
            await this.delay(this.getRetryDelay(attempt));
            continue;
          }
          return lastError;
        }

        lastError = {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: (error as any)?.message || 'Network error',
          },
        };
        // Retry on network error
        if (attempt < maxRetries) {
          await this.delay(this.getRetryDelay(attempt));
          continue;
        }
      }
    }

    return lastError ?? {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Unknown error occurred',
      },
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s...
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<T>(`${endpoint}${queryString}`);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
