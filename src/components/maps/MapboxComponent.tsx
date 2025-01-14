'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 4,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: ' OpenStreetMap contributors'
          },
          'route-geometry': {
            type: 'geojson',
            data: {
              type: "LineString",
              coordinates: [],
            },
          },
        },
        layers: [{
          id: 'tiles',
          type: 'raster',
          source: 'osm-tiles',
        }, {
          id: 'route-geometry',
          type: 'line',
          source: 'route-geometry',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4
          }
        }]
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !originCoordinates || !destinationCoordinates) return;

    const fetchRoute = async () => {
      try {
        // Using OSRM demo server - for production, you should host your own or use a commercial service
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${originCoordinates[0]},${originCoordinates[1]};${destinationCoordinates[0]},${destinationCoordinates[1]}?overview=full&geometries=geojson`
        );
        
        const data = await response.json();
        
        const mapInstance = map.current;
        if (data.routes && data.routes[0] && mapInstance) {
          const route = data.routes[0];
          
          // Update the route on the map
          const source = mapInstance.getSource('route-geometry');
          if (source) {
            (source as maplibregl.GeoJSONSource).setData({
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            });
          }

          // Calculate distance in kilometers
          const distanceKm = route.distance / 1000;
          if (onRouteCalculated) {
            onRouteCalculated(distanceKm);
          }

          // Fit the map to the route bounds with padding
          const coordinates = route.geometry.coordinates;
          const bounds = coordinates.reduce((bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
            return bounds.extend(coord);
          }, new maplibregl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

          mapInstance.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [originCoordinates, destinationCoordinates, onRouteCalculated]);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
  );
}
