import { MarketplaceType } from './shift.store';

interface EmployeeInfo {
    name: string;
    role: string;
    avatarUrl?: string;
}

interface PVZInfo {
    address: string;
    rating: number;
    marketplace: MarketplaceType;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

interface ShiftInfo {
    startTime: string;
    endTime: string;
    salary: number;
}

export const MOCK_EMPLOYEE: EmployeeInfo = {
    name: 'Александр Иванов',
    role: 'Старший смены',
};

export const MOCK_PVZ: PVZInfo = {
    address: 'г. Москва, ул. Ленина, д. 1',
    rating: 4.98,
    marketplace: 'wb',
    coordinates: {
        latitude: 55.7558, // Moscow center (for testing)
        longitude: 37.6173,
    },
};

export const MOCK_SHIFT: ShiftInfo = {
    startTime: '09:00',
    endTime: '21:00',
    salary: 3500,
};
