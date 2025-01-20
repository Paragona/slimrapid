import { MapSettings } from '@/types/calculator';

/**
 * Fetch route coordinates between two points using OSRM
 */
export async function fetchRoute(
  originCoords: [number, number],
  destinationCoords: [number, number]
): Promise<[number, number][]> {
  const [originLng, originLat] = originCoords;
  const [destLng, destLat] = destinationCoords;
  
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch route');
    }

    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes?.[0]?.geometry?.coordinates) {
      throw new Error('Invalid route data received');
    }

    return data.routes[0].geometry.coordinates as [number, number][];
  } catch (error) {
    console.error('Error fetching route:', error);
    // Fallback to direct line if route fetching fails
    return [originCoords, destinationCoords];
  }
}

/**
 * Default map settings
 */
export const DEFAULT_MAP_SETTINGS: MapSettings = {
  style: 'streets-v12',
  routeColor: '#3b82f6',
  originMarkerColor: '#00FF00',
  destinationMarkerColor: '#FF0000',
  zoom: 4
};

/**
 * Available map styles
 */
export const MAP_STYLES = [
  { value: 'streets-v12', label: 'Streets' },
  { value: 'satellite-v9', label: 'Satellite' },
  { value: 'light-v11', label: 'Light' },
  { value: 'dark-v11', label: 'Dark' }
] as const;

/**
 * Calculate appropriate zoom level based on route distance
 */
export function calculateZoomLevel(distanceKm: number): number {
  if (distanceKm <= 10) return 12;
  if (distanceKm <= 50) return 10;
  if (distanceKm <= 200) return 8;
  if (distanceKm <= 500) return 6;
  return 4;
}

/**
 * Calculate map bounds to fit both origin and destination
 */
export function calculateMapBounds(
  originCoords: [number, number],
  destinationCoords: [number, number]
): {
  center: [number, number];
  zoom: number;
} {
  const [originLng, originLat] = originCoords;
  const [destLng, destLat] = destinationCoords;

  // Calculate center point
  const centerLng = (originLng + destLng) / 2;
  const centerLat = (originLat + destLat) / 2;

  // Calculate distance between points (rough approximation)
  const distanceKm = calculateDistance(
    originLat,
    originLng,
    destLat,
    destLng
  );

  return {
    center: [centerLng, centerLat],
    zoom: calculateZoomLevel(distanceKm)
  };
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Generate GeoJSON route line style
 */
export function getRouteLineStyle(color: string) {
  return {
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': color,
      'line-width': 4,
      'line-opacity': 0.8
    }
  };
}

/**
 * Generate marker element with specified color
 */
export function createMarkerElement(color: string): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundColor = color;
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';
  return el;
}
