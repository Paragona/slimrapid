'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import type { LatLngTuple } from 'leaflet';
import { fetchRoute } from '@/services/calculator/mapService';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

// Import styles only on client side
const useLeafletInit = () => {
  useEffect(() => {
    Promise.all([
      import('leaflet/dist/leaflet.css' as string),
      import('leaflet')
    ]).then(([, L]) => {
      // Fix Leaflet default marker icon issue
      delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);
};

interface LeafletMapComponentProps {
  /** Origin coordinates in [longitude, latitude] format */
  originCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  center?: LatLngTuple;
  zoom?: number;
  className?: string;
  routeColor?: string;
  style?: string;
  originMarkerColor?: string;
  destinationMarkerColor?: string;
}

// Component to handle route drawing and map updates
// Import Marker and Popup components
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const RouteLayer = dynamic(
  () => import('react-leaflet').then((mod) => {
    const RouteLayerComponent = ({ 
      originCoordinates, 
      destinationCoordinates, 
      routeColor 
    }: { 
      originCoordinates?: [number, number];
      destinationCoordinates?: [number, number];
      routeColor: string;
    }) => {
      const map = mod.useMap();
      const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

      useEffect(() => {
        if (originCoordinates && destinationCoordinates) {
          // Fetch the actual route
          fetchRoute(originCoordinates, destinationCoordinates)
            .then(coordinates => {
              setRouteCoordinates(coordinates);
            })
            .catch(error => {
              console.error('Error fetching route:', error);
              // Fallback to direct line
              setRouteCoordinates([originCoordinates, destinationCoordinates]);
            });
        }
      }, [originCoordinates, destinationCoordinates]);

      useEffect(() => {
        if (routeCoordinates.length > 0) {
          import('leaflet').then((L) => {
            // Convert all coordinates from [lng, lat] to [lat, lng] for Leaflet
            const latLngCoords = routeCoordinates.map(([lng, lat]) => [lat, lng] as L.LatLngTuple);

            // Create a polyline for the route
            const newRouteLayer = L.polyline(latLngCoords, {
              color: routeColor,
              weight: 4,
              opacity: 0.8,
            });

            // Add to map and store reference
            newRouteLayer.addTo(map);

            // Fit bounds to show the entire route
            const bounds = L.latLngBounds(latLngCoords);
            map.fitBounds(bounds, { padding: [50, 50] });

            return () => {
              if (newRouteLayer) {
                newRouteLayer.remove();
              }
            };
          });
        }
      }, [map, routeCoordinates, routeColor]);

      // Add markers for origin and destination
      if (originCoordinates && destinationCoordinates) {
        return (
          <>
            <Marker position={[originCoordinates[1], originCoordinates[0]]}>
              <Popup>Origin</Popup>
            </Marker>
            <Marker position={[destinationCoordinates[1], destinationCoordinates[0]]}>
              <Popup>Destination</Popup>
            </Marker>
          </>
        );
      }

      return null;
    };
    return RouteLayerComponent;
  }),
  { ssr: false }
);

const LeafletMapComponent = ({
  originCoordinates,
  destinationCoordinates,
  center = [51.505, -0.09],
  zoom = 13,
  className = '',
  routeColor = '#3B82F6',
  style,
}: LeafletMapComponentProps) => {
  useLeafletInit();

  return typeof window !== 'undefined' ? (
    <MapContainer
      center={center}
      zoom={zoom}
      className={cn('h-[400px] w-full rounded-lg', className)}
      style={style ? JSON.parse(style) : undefined}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {originCoordinates && destinationCoordinates && (
        <RouteLayer
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          routeColor={routeColor}
        />
      )}
    </MapContainer>
  ) : null;
};

export default LeafletMapComponent;
