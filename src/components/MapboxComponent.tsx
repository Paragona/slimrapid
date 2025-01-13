'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Focus } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapyComponentProps {
  originCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  onRouteCalculated?: (distance: number) => void;
}

export default function MapyComponent({
  originCoordinates,
  destinationCoordinates,
  onRouteCalculated
}: MapyComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentBounds, setCurrentBounds] = useState<mapboxgl.LngLatBounds | null>(null);

  const centerMap = () => {
    if (map.current && currentBounds) {
      map.current.fitBounds(currentBounds, {
        padding: 50,
        duration: 1000
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY!;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-96, 37.8], // Center of US
      zoom: 3,
      maxZoom: 16,
      maxBounds: [
        [-167.276413, 25.641526], // Southwest coordinates
        [-50.979469, 49.384358]  // Northeast coordinates
      ]
    });

    // Wait for map to load before setting the reference
    newMap.on('load', () => {
      map.current = newMap;
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        if (map.current.getLayer('route')) {
          map.current.removeLayer('route');
        }
        if (map.current.getSource('route')) {
          map.current.removeSource('route');
        }
        map.current.remove();
      }
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

    const fetchRoute = async () => {
      setIsCalculating(true);

      try {
        // Add markers
        const originMarker = new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat(originCoordinates)
          .addTo(map.current!);

        const destinationMarker = new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat(destinationCoordinates)
          .addTo(map.current!);

        markers.current = [originMarker, destinationMarker];

        // Get driving route from Mapy.cz API
        const response = await fetch(
          `https://api.mapy.cz/v1/routing?from=${originCoordinates[1]},${originCoordinates[0]}&to=${destinationCoordinates[1]},${destinationCoordinates[0]}`,
          {
            headers: {
              'Accept': 'application/json',
              'Api-Key': '-qdeR3Tj7IYKEXsdSnb9AlM1aXmxRu7yUWGhg-qoce4'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch route');
        }

        const data = await response.json();
        
        if (!data.result || !data.result.length) {
          throw new Error('No route found');
        }

        const distance = data.result[0].length / 1000; // Convert to kilometers
        
        if (onRouteCalculated) {
          onRouteCalculated(distance);
        }

        // Create bounds from the route coordinates
        const bounds = new mapboxgl.LngLatBounds();
        // Assuming the route coordinates are in the response data
        // You might need to adjust this based on the actual response format
        data.result[0].coordinates.forEach((coord: [number, number]) => {
          bounds.extend(coord);
        });
        setCurrentBounds(bounds);

        // Add route to map
        if (map.current) {
          // Remove existing route layer and source if they exist
          if (map.current.getLayer('route')) {
            map.current.removeLayer('route');
          }
          if (map.current.getSource('route')) {
            map.current.removeSource('route');
          }

          // Add the route source
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: data.result[0].coordinates
              }
            }
          });

          // Add the route layer
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 8,
              'line-opacity': 0.8
            }
          });

          // Fit the map to show the entire route
          map.current.fitBounds(bounds, {
            padding: 50,
            duration: 1000
          });
        }
      } catch (error) {
        console.error('Error getting route:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    fetchRoute();
  }, [originCoordinates, destinationCoordinates, onRouteCalculated]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {isCalculating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}
      {currentBounds && (
        <button 
          onClick={centerMap}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Center map on route"
        >
          <Focus className="w-5 h-5 text-blue-500" />
        </button>
      )}
    </div>
  );
}
