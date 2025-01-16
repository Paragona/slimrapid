import { MapPin } from 'lucide-react';
import { MapboxComponent } from '@/components/maps/MapboxComponent';

import { MapSettings } from '@/types/calculator';

interface RouteMapProps extends Partial<MapSettings> {
  originCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
}

export function RouteMap({ 
  originCoordinates, 
  destinationCoordinates,
  style = 'streets-v12',
  routeColor = '#3b82f6',
  originMarkerColor = '#00FF00',
  destinationMarkerColor = '#FF0000',
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
        <MapboxComponent
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          style={style}
          routeColor={routeColor}
          originMarkerColor={originMarkerColor}
          destinationMarkerColor={destinationMarkerColor}
          zoom={zoom}
        />
      </div>
    </div>
  );
}
