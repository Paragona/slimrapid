import { MapPin } from 'lucide-react';
import LeafletMapComponent from '@/components/maps/LeafletMapComponent';

import { MapSettings } from '@/types/calculator';

interface RouteMapProps extends Partial<MapSettings> {
  originCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
}

export function RouteMap({ 
  originCoordinates, 
  destinationCoordinates,
  routeColor = '#3b82f6',
  zoom = 4
}: RouteMapProps) {
  if (!originCoordinates || !destinationCoordinates) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Route Map</h3>
      </div>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-blue-200">
        <LeafletMapComponent
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          style={JSON.stringify({ zIndex: 1 })}
          routeColor={routeColor}
          zoom={zoom}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
