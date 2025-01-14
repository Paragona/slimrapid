'use client';

import { MapPin } from 'lucide-react';
import { CostBreakdownType } from '@/types/calculator';

interface SummaryProps {
  origin: string;
  destination: string;
  costBreakdown: CostBreakdownType | null;
}

export function Summary({ origin, destination, costBreakdown }: SummaryProps) {
  if (!origin || !destination) return null;

  return (
    <div className="mt-6 border rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Route Summary</h3>
      
      {/* Locations */}
      <div className="flex items-start gap-2">
        <MapPin className="w-5 h-5 text-blue-500 mt-1" />
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-sm text-gray-500">From:</span>
            <p className="font-medium">{origin}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">To:</span>
            <p className="font-medium">{destination}</p>
          </div>
          {costBreakdown && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">Distance:</span>
              <p className="font-medium">{costBreakdown.distanceKm.toFixed(1)} km</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
