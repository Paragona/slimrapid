import { CALCULATOR_CONSTANTS } from './constants';
import { Coordinates, CostBreakdown } from '@/types/calculator';

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  origin: Coordinates,
  destination: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(destination.latitude - origin.latitude);
  const dLon = toRadians(destination.longitude - origin.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(origin.latitude)) * Math.cos(toRadians(destination.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Calculate appropriate zoom level based on distance
 */
export function calculateZoomLevel(distanceKm: number): number {
  if (distanceKm <= 10) return 12;
  if (distanceKm <= 50) return 10;
  if (distanceKm <= 200) return 8;
  if (distanceKm <= 500) return 6;
  return CALCULATOR_CONSTANTS.DEFAULT_ZOOM;
}

/**
 * Format cost breakdown for display
 */
export function formatCostBreakdown(breakdown: CostBreakdown): {
  [K in keyof CostBreakdown]: string;
} {
  return {
    ...breakdown,
    baseCost: formatCurrency(breakdown.baseCost),
    distanceCost: formatCurrency(breakdown.distanceCost),
    floorCost: formatCurrency(breakdown.floorCost),
    parkingCost: formatCurrency(breakdown.parkingCost),
    weekendSurcharge: formatCurrency(breakdown.weekendSurcharge),
    seasonalSurcharge: formatCurrency(breakdown.seasonalSurcharge),
    total: formatCurrency(breakdown.total),
    distanceKm: `${Math.round(breakdown.distanceKm)} km`
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculate map bounds to fit both origin and destination
 */
export function calculateMapBounds(
  origin: Coordinates,
  destination: Coordinates
): {
  center: [number, number];
  zoom: number;
} {
  const centerLat = (origin.latitude + destination.latitude) / 2;
  const centerLng = (origin.longitude + destination.longitude) / 2;
  const distance = calculateDistance(origin, destination);

  return {
    center: [centerLng, centerLat],
    zoom: calculateZoomLevel(distance)
  };
}

/**
 * Debounce function for address input
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validate move date constraints
 */
export function isValidMoveDate(date: Date): boolean {
  const now = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1); // Allow booking up to 1 year in advance

  return date > now && date < maxDate;
}

/**
 * Get seasonal pricing factor based on date
 */
export function getSeasonalFactor(date: Date): number {
  const month = date.getMonth();
  // Peak summer season (June-August)
  if (month >= 5 && month <= 7) return 1.15;
  // Secondary peak (April-May, September)
  if (month === 3 || month === 4 || month === 8) return 1.1;
  return 1.0;
}

/**
 * Get weekend pricing factor
 */
export function getWeekendFactor(date: Date): number {
  const day = date.getDay();
  return day === 0 || day === 6 ? 1.15 : 1.0;
}
