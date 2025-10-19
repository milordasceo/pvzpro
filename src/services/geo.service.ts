export type GeoSuggestion = { title: string; lat: number; lon: number };

const NOMINATIM = 'https://nominatim.openstreetmap.org';

/**
 * Формирует чистый адрес из данных Nominatim
 * Возвращает только: город, улица, дом
 */
function formatCleanAddress(address: any, includeCity: boolean = true): string {
  const parts: string[] = [];

  // Город (приоритет: city > town > village)
  const city = address.city || address.town || address.village;
  if (city && includeCity) parts.push(city);

  // Улица
  const street = address.road || address.street;
  if (street) parts.push(street);

  // Номер дома
  const house = address.house_number;
  if (house) parts.push(house);

  // Если ничего не получилось, возвращаем fallback
  if (parts.length === 0) {
    return address.display_name || 'Адрес';
  }

  return parts.join(', ');
}

export async function suggestAddresses(query: string, skipCity: boolean = false): Promise<GeoSuggestion[]> {
  if (!query || query.trim().length < 3) return [];
  const url = `${NOMINATIM}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=ru`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'wb-pvz-app' } } as any);
  const json: any[] = await resp.json();
  return json.map((it) => ({
    title: formatCleanAddress(it.address, !skipCity), // Если skipCity = true, не включаем город
    lat: Number(it.lat),
    lon: Number(it.lon),
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `${NOMINATIM}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=ru`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'wb-pvz-app' } } as any);
  const json: any = await resp.json();
  
  // Используем чистое форматирование адреса
  if (json?.address) {
    return formatCleanAddress(json.address);
  }
  
  return json?.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}
