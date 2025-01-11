'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

    // Add markers for origin and destination
    const originMarker = new mapboxgl.Marker({ color: '#22c55e' })
      .setLngLat(originCoordinates)
      .addTo(map.current);

    const destinationMarker = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(destinationCoordinates)
      .addTo(map.current);

    markers.current = [originMarker, destinationMarker];

    // Get route
    const getRoute = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
        );
        const data = await response.json();

        if (data.code !== 'Ok') {
          throw new Error('Failed to get route');
        }

        const route = data.routes[0];
        const routeGeometry = route.geometry;

        // Calculate distance in kilometers
        const distanceInKm = route.distance / 1000;
        onRouteCalculated?.(distanceInKm);

        const coordinates = routeGeometry.coordinates;
        const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
          return bounds.extend(coord as mapboxgl.LngLatLike);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.current?.fitBounds(bounds, {
          padding: 50
        });

        // Remove existing route layer and source if they exist
        if (map.current?.getLayer('route')) {
          map.current?.removeLayer('route');
        }
        if (map.current?.getSource('route')) {
          map.current?.removeSource('route');
        }

        // Add route to map
        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeGeometry
          }
        });

        map.current?.addLayer({
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

      } catch (error) {
        console.error('Error getting route:', error);
      }
    };

    getRoute();
  }, [originCoordinates, destinationCoordinates, onRouteCalculated]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg" />
  );
}
