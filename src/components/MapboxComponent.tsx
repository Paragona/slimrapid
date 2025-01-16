import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Nastavení Mapbox API klíče
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

interface MapboxComponentProps {
  originCoordinates?: [number, number];
  destinationCoordinates?: [number, number];
  center?: [number, number];
  zoom?: number;
  className?: string;
  routeColor?: string;
  style?: string;
  originMarkerColor?: string;
  destinationMarkerColor?: string;
}
const MapboxComponent = ({
  originCoordinates,
  destinationCoordinates,
  center = [-98.5795, 39.8283], // Centrum USA
  zoom = 4,
  className,
  routeColor = '#3b82f6',
}: MapboxComponentProps): React.ReactElement => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
  
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

     map.current.on('load', () => {
      if (!map.current) return; // Ochrana před null
      if (originCoordinates) {
        new mapboxgl.Marker({ color: '#00FF00' })
          .setLngLat(originCoordinates)
          .addTo(map.current);
      }
  
      if (destinationCoordinates) {
        new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat(destinationCoordinates)
          .addTo(map.current);
      }

      if (originCoordinates && destinationCoordinates) {
        fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates.join(
            ','
          )};${destinationCoordinates.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        )
          .then((res) => res.json())
          .then((data) => {
            const route = data.routes[0].geometry;

            // Přidání zdroje dat pro trasu
            map.current?.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: route.coordinates,
                },
                properties: {}, // Povinné pole, může zůstat prázdné
              },
            });

            // Přidání vrstvy pro trasu
            map.current?.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              paint: {
                'line-color': routeColor,
                'line-width': 4,
              },
            });

            // Vytvoření hranic mapy na základě souřadnic trasy
            const bounds = route.coordinates.reduce(
              (bounds: mapboxgl.LngLatBounds, coord: [number, number]) =>
                bounds.extend(coord as mapboxgl.LngLatLike),
              new mapboxgl.LngLatBounds(
                route.coordinates[0] as mapboxgl.LngLatLike,
                route.coordinates[0] as mapboxgl.LngLatLike
              )
            );

            map.current?.fitBounds(bounds, { padding: 50 });
          })
          .catch((err) => console.error('Chyba při načítání trasy:', err));
      }
    });

    return () => map.current?.remove();
  }, [center, zoom, originCoordinates, destinationCoordinates, routeColor]);

  return <div ref={mapContainer} className={className || 'w-full h-full'} />;
};

export { MapboxComponent };
