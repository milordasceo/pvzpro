import * as Location from 'expo-location';
import { GeoPoint, distanceMeters, normalizeGeoPoint } from '../utils/geo';

export { distanceMeters };

export async function ensureLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<GeoPoint | null> {
  try {
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const point = normalizeGeoPoint({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    } as any);
    return { lat: point.lat, lon: point.lon, latitude: point.latitude, longitude: point.longitude };
  } catch {
    return null;
  }
}
