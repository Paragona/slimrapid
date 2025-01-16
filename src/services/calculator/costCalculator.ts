import { MoveDetails, CostBreakdown } from '@/types/calculator';

const BASE_RATES = {
  'studio': { min: 500, max: 870 },
  '1bed': { min: 700, max: 1900 },
  '2bed': { min: 1000, max: 3200 },
  '3bed': { min: 1500, max: 5000 },
  '4bed': { min: 2000, max: 6000 }
} as const;

/**
 * Get base rate for move based on size and distance
 */
export function getBaseRate(moveSize: keyof typeof BASE_RATES, distance: number): number {
  return distance < 100 ? BASE_RATES[moveSize].min : BASE_RATES[moveSize].max;
}

/**
 * Calculate seasonal and weekend multiplier
 */
export function getSeasonalMultiplier(date: Date): number {
  const month = date.getMonth();
  const day = date.getDay();
  
  // Peak summer season (June-August)
  const isSummerPeak = month >= 5 && month <= 7;
  // Secondary peak (April-May, September)
  const isSecondaryPeak = month === 3 || month === 4 || month === 8;
  // Weekend
  const isWeekend = day === 0 || day === 6;
  
  let multiplier = 1;
  if (isSummerPeak) multiplier *= 1.15;
  if (isSecondaryPeak) multiplier *= 1.1;
  if (isWeekend) multiplier *= 1.15;
  
  return multiplier;
}

/**
 * Calculate cost based on distance with bracketed pricing
 */
export function getDistanceCost(distance: number): number {
  if (distance <= 50) return distance * 2;
  if (distance <= 100) return 100 + (distance - 50) * 1.8;
  if (distance <= 500) return 190 + (distance - 100) * 1.5;
  return 790 + (distance - 500) * 1.2;
}

/**
 * Calculate floor cost based on floor number and elevator availability
 */
export function getFloorCost(floorNumber: number, hasElevator: boolean): number {
  return !hasElevator ? floorNumber * 50 : 0;
}

/**
 * Calculate total moving cost
 */
export function calculateMovingCost(moveDetails: MoveDetails, distanceKm: number = 0): CostBreakdown {
  // Convert distance to miles
  const distanceInMiles = distanceKm * 0.621371;
  
  // Get base rate based on move size and distance
  const baseRate = getBaseRate(moveDetails.moveSize, distanceInMiles);
  
  // Calculate distance cost using bracketed pricing
  const distanceCost = getDistanceCost(distanceInMiles);
  
  // Get seasonal and timing multiplier
  const seasonalMultiplier = getSeasonalMultiplier(moveDetails.moveDate);
  
  // Calculate floor costs
  const originFloorCost = getFloorCost(moveDetails.origin.floorNumber, moveDetails.origin.hasElevator);
  const destinationFloorCost = getFloorCost(moveDetails.destination.floorNumber, moveDetails.destination.hasElevator);
  const totalFloorCost = originFloorCost + destinationFloorCost;
  
  // Calculate parking costs
  const totalParkingCost = moveDetails.origin.parkingDistance + moveDetails.destination.parkingDistance;
  
  // Calculate surcharges
  const isWeekend = moveDetails.moveDate.getDay() === 0 || moveDetails.moveDate.getDay() === 6;
  const weekendSurcharge = isWeekend ? (baseRate + distanceCost) * 0.15 : 0;
  
  const month = moveDetails.moveDate.getMonth();
  const isSummerPeak = month >= 5 && month <= 7;
  const isSecondaryPeak = month === 3 || month === 4 || month === 8;
  const seasonalSurcharge = isSummerPeak ? (baseRate + distanceCost) * 0.15 :
                           isSecondaryPeak ? (baseRate + distanceCost) * 0.10 : 0;
  
  // Calculate total
  const subtotal = baseRate + distanceCost;
  const total = Math.round(
    (subtotal * seasonalMultiplier) +
    totalFloorCost +
    totalParkingCost
  );

  return {
    baseCost: baseRate,
    distanceCost: Math.round(distanceCost),
    floorCost: totalFloorCost,
    parkingCost: totalParkingCost,
    weekendSurcharge: Math.round(weekendSurcharge),
    seasonalSurcharge: Math.round(seasonalSurcharge),
    distanceKm,
    total
  };
}
