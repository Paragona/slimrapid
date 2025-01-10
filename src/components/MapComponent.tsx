'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapComponentProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
}

export default function MapComponent({ 
  center = { lat: 51.5074, lng: -0.1278 }, // Default to London
  zoom = 13,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const northPoleMarkerRef = useRef<google.maps.Marker | null>(null);
  const southPoleMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['places']
      });

      await loader.importLibrary('maps');
      await loader.importLibrary('places');
      
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: 'terrain', // Better for viewing poles
        minZoom: 2, // Prevent too much distortion
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      
      mapInstanceRef.current = map;

      // Add North Pole marker
      northPoleMarkerRef.current = new google.maps.Marker({
        position: { lat: 90, lng: 0 },
        map,
        title: 'North Pole',
        label: 'N'
      });

      // Add South Pole marker
      southPoleMarkerRef.current = new google.maps.Marker({
        position: { lat: -90, lng: 0 },
        map,
        title: 'South Pole',
        label: 'S'
      });

      // Add click listeners to markers
      northPoleMarkerRef.current.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: '<div><h3>North Pole</h3><p>90°N 0°E</p></div>'
        });
        infoWindow.open(map, northPoleMarkerRef.current);
      });

      southPoleMarkerRef.current.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: '<div><h3>South Pole</h3><p>90°S 0°E</p></div>'
        });
        infoWindow.open(map, southPoleMarkerRef.current);
      });

      const input = document.createElement('input');
      input.className = 'map-search-box';
      input.placeholder = 'Search locations...';
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      const searchBox = new google.maps.places.SearchBox(input);
      searchBoxRef.current = searchBox;

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places?.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        places?.forEach(place => {
          if (!place.geometry || !place.geometry.location) return;

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });

        map.fitBounds(bounds);
      });
    };

    initMap();
  }, [center, zoom]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <style jsx>{`
        :global(.map-search-box) {
          margin: 10px;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          font-size: 14px;
          width: 300px;
        }
      `}</style>
    </div>
  );
}
