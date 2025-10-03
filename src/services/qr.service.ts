import { APP_CONFIG } from '../config/app';
import { QrCode, Coordinates, ApiResponse } from '../types';
import { apiClient } from './api';
import {
  computeMac,
  createQrPayload,
  parseQrPayload,
  verifyParsedQr,
  isExpired,
} from '../utils/qr';
import { distanceMeters, normalizeGeoPoint } from '../utils/geo';

/**
 * Сервис для работы с QR кодами
 * Управляет генерацией, валидацией и сканированием QR кодов
 */
export class QrService {
  /**
   * Генерирует новый QR код для точки выдачи
   */
  async generateQrCode(
    pvzId: string,
    ttl: number = APP_CONFIG.QR.TTL_DEFAULT,
  ): Promise<ApiResponse<QrCode>> {
    return apiClient.post<QrCode>('/qr/generate', {
      pvzId,
      ttl: Math.min(ttl, APP_CONFIG.QR.MAX_TTL),
    });
  }

  /**
   * Проверяет валидность QR кода
   */
  async validateQrCode(payload: string): Promise<ApiResponse<{ isValid: boolean; pvzId: string }>> {
    return apiClient.post('/qr/validate', { payload });
  }

  /**
   * Получает QR коды для точки выдачи
   */
  async getQrCodes(pvzId: string): Promise<ApiResponse<QrCode[]>> {
    return apiClient.get<QrCode[]>('/qr/codes', { pvzId });
  }

  /**
   * Деактивирует QR код
   */
  async deactivateQrCode(qrId: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/qr/${qrId}/deactivate`);
  }

  /**
   * Генерирует QR код локально (для демо/тестирования)
   */
  generateLocalQrCode(pvzId: string, ttl: number = APP_CONFIG.QR.TTL_DEFAULT): string {
    const exp = Math.floor(Date.now() / 1000) + ttl;
    return createQrPayload(pvzId, exp);
  }

  /**
   * Парсит QR код
   */
  parseQrCode(data: string): { pvzId: string; exp: number; hmac: string } | null {
    const parsed = parseQrPayload(data);
    if (!parsed) return null;
    return { pvzId: parsed.pvzId, exp: parsed.exp, hmac: parsed.mac };
  }

  /**
   * Проверяет подпись QR кода
   */
  verifyQrSignature(pvzId: string, exp: number, hmac: string): boolean {
    return verifyParsedQr({ kind: 'signed', pvzId, exp, mac: hmac });
  }

  /**
   * Проверяет срок действия QR кода
   */
  isQrExpired(exp: number): boolean {
    return isExpired(exp);
  }

  /**
   * Проверяет геолокацию для QR кода
   */
  async validateGeolocation(
    userLocation: Coordinates,
    pvzId: string,
  ): Promise<{ isValid: boolean; distance: number }> {
    try {
      // Получаем координаты ПВЗ
      const response = await apiClient.get<{ coordinates: Coordinates }>(`/pvz/${pvzId}`);
      if (!response.success || !response.data?.coordinates) {
        return { isValid: false, distance: Infinity };
      }

      const distance = distanceMeters(
        normalizeGeoPoint({ lat: userLocation.latitude, lon: userLocation.longitude }),
        normalizeGeoPoint({
          lat: response.data.coordinates.latitude,
          lon: response.data.coordinates.longitude,
        }),
      );
      const isValid = distance <= APP_CONFIG.LOCATION.GEOLOCATION_RADIUS;

      return { isValid, distance };
    } catch (error) {
      return { isValid: false, distance: Infinity };
    }
  }
}

export const qrService = new QrService();
