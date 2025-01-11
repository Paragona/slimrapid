'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';

interface MapboxComponentProps {
  originCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  onRouteCalculated?: (distance: number) => void;
}

export default function MapboxComponent({
  originCoordinates,
  destinationCoordinates,
  onRouteCalculated
}: MapboxComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY!;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-96, 37.8], // Center of US
      zoom: 3
    });

    map.current = newMap;

    return () => {
      if (map.current?.getLayer('route')) {
        map.current?.removeLayer('route');
      }
      if (map.current?.getSource('route')) {
        map.current?.removeSource('route');
      }
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    // Remove markers when coordinates change
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (!map.current || !originCoordinates || !destinationCoordinates) {
      return;
    }

    if (originCoordinates && destinationCoordinates) {
      setIsCalculating(true);

      // Add markers
      const originMarker = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(originCoordinates)
        .addTo(map.current);

      const destinationMarker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(destinationCoordinates)
        .addTo(map.current);

      markers.current = [originMarker, destinationMarker];

      // Calculate route
      const bounds = new mapboxgl.LngLatBounds()
        .extend(originCoordinates)
        .extend(destinationCoordinates);

      map.current?.fitBounds(bounds, {
        padding: 50
      });

      // Simulate calculation time for better UX
      setTimeout(async () => {
        try {
          const routeData = {
            type: 'Feature' as const,
            properties: {},
            geometry: {
              type: 'LineString' as const,
              coordinates: [
                originCoordinates,
                destinationCoordinates
              ]
            }
          };

          const addRouteToMap = () => {
            if (!map.current) return;

            // Remove existing route layer and source if they exist
            if (map.current.getLayer('route')) {
              map.current.removeLayer('route');
            }
            if (map.current.getSource('route')) {
              map.current.removeSource('route');
            }

            // Add route to map
            map.current.addSource('route', {
              type: 'geojson',
              data: routeData
            });

            map.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          };

          if (!map.current?.loaded()) {
            map.current?.on('load', addRouteToMap);
          } else {
            addRouteToMap();
          }

          // Calculate straight-line distance
          const distance = calculateDistance(
            originCoordinates[1],
            originCoordinates[0],
            destinationCoordinates[1],
            destinationCoordinates[0]
          );

          onRouteCalculated?.(distance);
        } catch (error) {
          console.error('Error getting route:', error);
        } finally {
          setIsCalculating(false);
        }
      }, 800); // Add a delay for better UX
    }
  }, [originCoordinates, destinationCoordinates, onRouteCalculated]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      {isCalculating && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Calculating route...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}
