import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { APP_CONFIG } from '../config/app';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface GeolocationState {
    location: Coordinates | null;
    isLoading: boolean;
    error: string | null;
    isInZone: boolean;
    distance: number | null; // meters
}

interface UseGeolocationOptions {
    pvzCoordinates?: Coordinates;
    radiusMeters?: number;
}

/**
 * Calculates distance between two coordinates using Haversine formula
 */
const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export const useGeolocation = (options?: UseGeolocationOptions): GeolocationState & { refresh: () => Promise<void> } => {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        isLoading: false,
        error: null,
        isInZone: false,
        distance: null,
    });

    const radiusMeters = options?.radiusMeters ?? APP_CONFIG.LOCATION.GEOLOCATION_RADIUS;

    const getLocation = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            // Request permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: 'Разрешение на геолокацию не предоставлено',
                }));
                return;
            }

            // Get current position
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const location: Coordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            let isInZone = false;
            let distance: number | null = null;

            // Check if within PVZ zone
            if (options?.pvzCoordinates) {
                distance = calculateDistance(location, options.pvzCoordinates);
                isInZone = distance <= radiusMeters;
            }

            setState({
                location,
                isLoading: false,
                error: null,
                isInZone,
                distance,
            });
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Не удалось определить местоположение',
            }));
        }
    }, [options?.pvzCoordinates, radiusMeters]);

    useEffect(() => {
        getLocation();
    }, [getLocation]);

    return { ...state, refresh: getLocation };
};
