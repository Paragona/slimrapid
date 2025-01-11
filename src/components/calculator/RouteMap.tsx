import { MapPin } from 'lucide-react';
import MapboxComponent from '@/components/MapboxComponent';

interface RouteMapProps {
  originCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
  onRouteCalculated: (distanceInKm: number) => void;
}

export function RouteMap({ originCoordinates, destinationCoordinates, onRouteCalculated }: RouteMapProps) {
  if (!originCoordinates || !destinationCoordinates) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Route Map</h3>
      </div>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-blue-200">
        <MapboxComponent
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          onRouteCalculated={onRouteCalculated}
        />
      </div>
    </div>
  );
}
