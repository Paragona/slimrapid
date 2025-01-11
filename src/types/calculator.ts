export interface MoveDetails {
  moveSize: string;
  floorNumber: {
    origin: number;
    destination: number;
  };
  hasElevator: {
    origin: boolean;
    destination: boolean;
  };
  parkingDistance: {
    origin: number;
    destination: number;
  };
  moveDate: Date;
}

export interface CostBreakdownType {
  baseCost: number;
  distanceCost: number;
  floorCost: number;
  parkingCost: number;
  weekendSurcharge: number;
  seasonalSurcharge: number;
  total: number;
  distanceKm: number;
}

export interface AddressSuggestions {
  origin: string[];
  destination: string[];
}
