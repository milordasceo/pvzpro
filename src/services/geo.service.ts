export type GeoSuggestion = { title: string; lat: number; lon: number };

const NOMINATIM = 'https://nominatim.openstreetmap.org';

export async function suggestAddresses(query: string): Promise<GeoSuggestion[]> {
  if (!query || query.trim().length < 3) return [];
  const url = `${NOMINATIM}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=ru`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'wb-pvz-app' } } as any);
  const json: any[] = await resp.json();
  return json.map((it) => ({
    title: it.display_name as string,
    lat: Number(it.lat),
    lon: Number(it.lon),
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `${NOMINATIM}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=ru`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'wb-pvz-app' } } as any);
  const json: any = await resp.json();
  return json?.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}
