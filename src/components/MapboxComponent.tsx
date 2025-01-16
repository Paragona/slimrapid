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
  onRouteCalculated?: (distanceInKm: number) => void
}

export function MapboxComponent({ 
  originCoordinates,
  destinationCoordinates,
  center = [-0.127758, 51.507351],
  zoom = 10,
  markers = [],
  onMapLoad,
  onRouteCalculated
}: MapboxComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

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

        if (originCoordinates) {
          new mapboxgl.Marker({
            color: '#00FF00'
          })
            .setLngLat(originCoordinates)
            .addTo(map.current!)
        }

        if (destinationCoordinates) {
          new mapboxgl.Marker({
            color: '#FF0000'
          })
            .setLngLat(destinationCoordinates)
            .addTo(map.current!)
        }

        if (originCoordinates && destinationCoordinates && onRouteCalculated) {
          // Calculate straight-line distance
          const distance = calculateDistance(originCoordinates, destinationCoordinates)
          onRouteCalculated(distance)
        }

        markers.forEach((marker) => {
          new mapboxgl.Marker({
            color: marker.color || '#FF0000'
          })
            .setLngLat(marker.coordinates)
            .addTo(map.current!)
        })
      })
    } catch (error) {
      console.error('Error initializing Mapbox map:', error)
    }

    return () => {
      map.current?.remove()
    }
  }, [center, zoom, markers, onMapLoad, originCoordinates, destinationCoordinates, onRouteCalculated])

  return <div ref={mapContainer} className="w-full h-full" />
}

function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371 // Earth's radius in kilometers
  const lat1 = toRad(coord1[1])
  const lat2 = toRad(coord2[1])
  const dLat = toRad(coord2[1] - coord1[1])
  const dLon = toRad(coord2[0] - coord1[0])

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * Math.PI / 180
}
