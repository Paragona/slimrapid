import { DollarSign, MapPin, Truck, Calendar as CalendarIcon } from 'lucide-react';
import { CostBreakdownType } from '@/types/calculator';

interface CostBreakdownProps {
  costBreakdown: CostBreakdownType | null;
}

export function CostBreakdown({ costBreakdown }: CostBreakdownProps) {
  if (!costBreakdown) return null;

  return (
    <div className="mt-6 border rounded-lg p-6 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold">Cost Breakdown</h3>
      </div>
      
      <div className="space-y-3">
        {/* Base Cost */}
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium">Base Cost</p>
              <p className="text-sm text-gray-500">Basic moving service charge</p>
            </div>
          </div>
          <span className="font-semibold">${costBreakdown.baseCost.toLocaleString()}</span>
        </div>

        {/* Distance Cost */}
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium">Distance Cost</p>
              <p className="text-sm text-gray-500">Based on {costBreakdown.distanceKm.toFixed(1)} km</p>
            </div>
          </div>
          <span className="font-semibold">${costBreakdown.distanceCost.toLocaleString()}</span>
        </div>

        {/* Floor Cost */}
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium">Floor Cost</p>
              <p className="text-sm text-gray-500">Additional charges for floor levels</p>
            </div>
          </div>
          <span className="font-semibold">${costBreakdown.floorCost.toLocaleString()}</span>
        </div>

        {/* Parking Cost */}
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            <div>
              <p className="font-medium">Parking Distance Cost</p>
              <p className="text-sm text-gray-500">Based on parking accessibility</p>
            </div>
          </div>
          <span className="font-semibold">${costBreakdown.parkingCost.toLocaleString()}</span>
        </div>

        {/* Surcharges */}
        {costBreakdown.weekendSurcharge > 0 && (
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="font-medium">Weekend Surcharge</p>
                <p className="text-sm text-gray-500">Additional 15% for weekend moves</p>
              </div>
            </div>
            <span className="font-semibold">${costBreakdown.weekendSurcharge.toLocaleString()}</span>
          </div>
        )}

        {costBreakdown.seasonalSurcharge > 0 && (
          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <div>
                <p className="font-medium">Peak Season Surcharge</p>
                <p className="text-sm text-gray-500">Additional 10% for peak season</p>
              </div>
            </div>
            <span className="font-semibold">${costBreakdown.seasonalSurcharge.toLocaleString()}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg mt-4 font-bold">
          <span className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            Total Estimated Cost
          </span>
          <span className="text-xl text-blue-600">${costBreakdown.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
