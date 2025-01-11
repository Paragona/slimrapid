import { DollarSign, MapPin, Truck, Building, Calendar as CalendarIcon } from 'lucide-react';

import { CostBreakdownType } from '@/types/calculator';

interface CostBreakdownProps {
  costBreakdown: CostBreakdownType | null;
  origin?: string;
  destination?: string;
}

export function CostBreakdown({ costBreakdown, origin, destination }: CostBreakdownProps) {
  if (!costBreakdown) return null;

  return (
    <div className="mt-6 border rounded-lg p-6 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold">Cost Breakdown</h3>
      </div>
      
      {/* Route Summary */}
      {(origin || destination) && (
        <div className="mb-4 p-3 bg-white rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-500 mt-1" />
            <div className="flex-1 space-y-2">
              {origin && (
                <div>
                  <span className="text-sm text-gray-500">From:</span>
                  <p className="text-sm font-medium">{origin}</p>
                </div>
              )}
              {destination && (
                <div>
                  <span className="text-sm text-gray-500">To:</span>
                  <p className="text-sm font-medium">{destination}</p>
                </div>
              )}
              <div className="text-sm text-gray-600">
                Distance: {costBreakdown.distanceKm.toFixed(1)} km
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            Base Rate
          </span>
          <span className="font-medium">${costBreakdown.baseCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            Distance Cost
          </span>
          <span className="font-medium">${costBreakdown.distanceCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <span className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-400" />
            Floor Cost
          </span>
          <span className="font-medium">${costBreakdown.floorCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            Parking Distance Cost
          </span>
          <span className="font-medium">${costBreakdown.parkingCost.toLocaleString()}</span>
        </div>
        {costBreakdown.weekendSurcharge > 0 && (
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              Weekend Surcharge (15%)
            </span>
            <span className="font-medium">${costBreakdown.weekendSurcharge.toLocaleString()}</span>
          </div>
        )}
        {costBreakdown.seasonalSurcharge > 0 && (
          <div className="flex justify-between items-center p-2 bg-white rounded">
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              Peak Season Surcharge (10%)
            </span>
            <span className="font-medium">${costBreakdown.seasonalSurcharge.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-lg mt-4">
          <span className="flex items-center gap-2 font-semibold">
            <DollarSign className="w-5 h-5" />
            Total Estimated Cost
          </span>
          <span className="text-xl font-bold">${costBreakdown.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
