/**
 * Move size options available in the calculator
 */
export type MoveSize = 'studio' | '1bed' | '2bed' | '3bed' | '4bed';

/**
 * Building type options
 */
export type BuildingType = 'house' | 'apartment' | 'office' | 'storage';

/**
 * Parking access options
 */
export type ParkingAccess = 'close' | 'medium' | 'far';

/**
 * Access restrictions that may affect the move
 */
export interface AccessRestrictions {
  /** Whether there are time restrictions for moving */
  hasTimeRestrictions: boolean;
  /** Whether permits are required */
  requiresPermits: boolean;
  /** Whether elevator booking is required */
  requiresElevatorBooking: boolean;
  /** Whether COI (Certificate of Insurance) is required */
  requiresCOI: boolean;
}

/**
 * Location-specific details that are common between origin and destination
 */
export interface LocationDetails {
  parkingDistance: any;
  /** Type of building */
  buildingType: BuildingType;
  /** Floor number of the building (0 for ground floor) */
  floorNumber: number;
  /** Whether the building has a working elevator */
  hasElevator: boolean;
  /** Distance category from parking to entrance */
  parkingAccess: ParkingAccess;
  /** Access restrictions for this location */
  restrictions: AccessRestrictions;
}

/**
 * Complete details about a move
 */
export interface MoveDetails {
  /** Size of the move based on number of rooms */
  moveSize: MoveSize;
  /** Details about the pickup location */
  origin: LocationDetails;
  /** Details about the delivery location */
  destination: LocationDetails;
  /** Scheduled date for the move */
  moveDate: Date;
}

/**
 * Geographic coordinates
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Detailed breakdown of moving costs
 */
export interface CostBreakdown {
  /** Base cost determined by move size */
  baseCost: number;
  /** Cost based on distance */
  distanceCost: number;
  /** Additional cost for floors (when no elevator) */
  floorCost: number;
  /** Cost based on parking distance */
  parkingCost: number;
  /** Additional charge for weekend moves */
  weekendSurcharge: number;
  /** Seasonal pricing adjustment */
  seasonalSurcharge: number;
  /** Total cost of the move */
  total: number;
  /** Distance in kilometers */
  distanceKm: number;
}

/**
 * Address suggestions for autocomplete
 */
export interface AddressSuggestions {
  /** Suggested addresses for origin location */
  origin: string[];
  /** Suggested addresses for destination location */
  destination: string[];
}

/**
 * Map display settings
 */
export interface MapSettings {
  /** Mapbox style identifier */
  style: import('./mapbox').MapboxStyle;
  /** Color for the route line */
  routeColor: string;
  /** Color for origin marker */
  originMarkerColor: string;
  /** Color for destination marker */
  destinationMarkerColor: string;
  /** Map zoom level (1-20) */
  zoom: number;
}

/**
 * Response from geocoding service
 */
export interface GeocodingResponse {
  /** Place name/formatted address */
  placeName: string;
  /** Geographic coordinates */
  coordinates: Coordinates;
  /** Country code */
  countryCode: string;
}

/**
 * Route information between two points
 */
export interface RouteInfo {
  /** Distance in kilometers */
  distanceKm: number;
  /** Estimated duration in minutes */
  durationMinutes: number;
  /** GeoJSON geometry of the route */
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}
