import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Ensure the access token is set correctly
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || ''

interface MapboxComponentProps {
  originCoordinates?: [number, number]
  destinationCoordinates?: [number, number]
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    coordinates: [number, number]
    color?: string
  }>
  onMapLoad?: (map: mapboxgl.Map) => void
}

export function MapboxComponent({ 
  originCoordinates,
  destinationCoordinates,
  center = [-0.127758, 51.507351],
  zoom = 10,
  markers = [],
  onMapLoad
}: MapboxComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      })

      map.current.on('load', () => {
        if (onMapLoad && map.current) {
          onMapLoad(map.current)
        }
      })
    } catch (error) {
      console.error('Error initializing Mapbox map:', error)
    }

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, []) // Empty dependency array for one-time initialization

  // Handle map view updates
  useEffect(() => {
    if (!map.current) return
    map.current.setCenter(center)
    map.current.setZoom(zoom)
  }, [center, zoom])

  // Handle markers
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    const existingMarkers = document.getElementsByClassName('mapboxgl-marker')
    while (existingMarkers[0]) {
      existingMarkers[0].remove()
    }

    // Add origin marker
    if (originCoordinates) {
      new mapboxgl.Marker({
        color: '#00FF00'
      })
        .setLngLat(originCoordinates)
        .addTo(map.current)
    }

    // Add destination marker
    if (destinationCoordinates) {
      new mapboxgl.Marker({
        color: '#FF0000'
      })
        .setLngLat(destinationCoordinates)
        .addTo(map.current)
    }

    // Add additional markers
    markers.forEach((marker) => {
      new mapboxgl.Marker({
        color: marker.color || '#FF0000'
      })
        .setLngLat(marker.coordinates)
        .addTo(map.current!)
    })
  }, [originCoordinates, destinationCoordinates, markers])

  return <div ref={mapContainer} className="w-full h-full" />
}
