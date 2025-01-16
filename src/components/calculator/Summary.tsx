'use client';

import { MapPin } from 'lucide-react';
import { CostBreakdown } from '@/types/calculator';
import { forwardRef } from 'react';

interface SummaryProps {
  origin: string;
  destination: string;
  costBreakdown: CostBreakdown | null;
}

export const Summary = forwardRef<HTMLDivElement, SummaryProps>(
  ({ origin, destination, costBreakdown }, ref) => {
  if (!origin || !destination) return null;

  return (
    <div ref={ref} className="mt-6 border rounded-lg p-6 bg-gray-50">
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
});

Summary.displayName = 'Summary';
