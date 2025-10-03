import { Coordinates } from '../types';

/**
 * Унифицированная модель геоточек. Для совместимости допускаем синонимы lat/lon.
 */
export interface GeoPoint extends Coordinates {
  lat?: number;
  lon?: number;
}

const toCoordinates = (point: GeoPoint | { lat: number; lon: number }): Coordinates => {
  if ('latitude' in point && 'longitude' in point) {
    return { latitude: point.latitude, longitude: point.longitude };
  }

  return {
    latitude: (point as any).lat,
    longitude: (point as any).lon,
  };
};

/**
 * Нормализует точку в формат { latitude, longitude } и добавляет совместимые свойства.
 */
export const normalizeGeoPoint = (
  point: GeoPoint | { lat: number; lon: number },
): GeoPoint => {
  const coordinates = toCoordinates(point as any);

  return {
    ...coordinates,
    lat: coordinates.latitude,
    lon: coordinates.longitude,
  };
};

/**
 * Вычисляет расстояние между точками по формуле Хаверсайна (в метрах).
 */
export const distanceMeters = (
  a: GeoPoint | { lat: number; lon: number },
  b: GeoPoint | { lat: number; lon: number },
): number => {
  const pointA = normalizeGeoPoint(a);
  const pointB = normalizeGeoPoint(b);

  const R = 6_371_000; // Радиус Земли в метрах
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(pointB.latitude - pointA.latitude);
  const dLon = toRad(pointB.longitude - pointA.longitude);
  const lat1 = toRad(pointA.latitude);
  const lat2 = toRad(pointB.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const a2 = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));

  return R * c;
};

/**
 * Проверяет, находится ли точка A в пределах радиуса от точки B.
 */
export const isWithinRadius = (
  a: GeoPoint | { lat: number; lon: number },
  b: GeoPoint | { lat: number; lon: number },
  radiusMeters: number,
) => distanceMeters(a, b) <= radiusMeters;
