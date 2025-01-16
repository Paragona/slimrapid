import { Coordinates, GeocodingResponse, RouteInfo } from '@/types/calculator';
import { MapboxFeature, MapboxGeocoding, MapboxDirections, MapboxContext } from '@/types/mapbox';

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

/**
 * Get coordinates for an address using Mapbox Geocoding API
 */
export async function getCoordinates(address: string): Promise<GeocodingResponse | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
      `access_token=${MAPBOX_API_KEY}`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = (data as MapboxGeocoding).features[0];
      const [longitude, latitude] = feature.center;
      
      return {
        placeName: feature.place_name,
        coordinates: { latitude, longitude },
        countryCode: feature.context?.find((c: MapboxContext) => c.id.startsWith('country'))?.short_code || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Get route information between two points using Mapbox Directions API
 */
export async function getRoute(origin: Coordinates, destination: Coordinates): Promise<RouteInfo | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};` +
      `${destination.longitude},${destination.latitude}?` +
      `access_token=${MAPBOX_API_KEY}&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error('Failed to calculate route');
    }

    const data = await response.json() as MapboxDirections;
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found between these locations');
    }

    const route = data.routes[0];
    return {
      distanceKm: route.distance / 1000,
      durationMinutes: route.duration / 60,
      geometry: route.geometry
    };
  } catch (error) {
    console.error('Routing error:', error);
    return null;
  }
}

/**
 * Get address suggestions for autocomplete
 */
export async function getAddressSuggestions(
  address: string,
  options: { 
    types?: string[],
    countries?: string[]
  } = {}
): Promise<string[]> {
  if (address.length < 3 || !MAPBOX_API_KEY) {
    return [];
  }

  try {
    const queryParams = new URLSearchParams({
      access_token: MAPBOX_API_KEY,
      ...(options.types && { types: options.types.join(',') }),
      ...(options.countries && { country: options.countries.join(',') })
    });

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    const geocoding = data as MapboxGeocoding;
    return geocoding.features
      .filter((f: MapboxFeature) => 
        f.context && Array.isArray(f.context) && 
        (!options.countries?.length || 
          f.context.some((c: MapboxContext) => 
            c.id.startsWith('country') && 
            options.countries?.includes(c.short_code || '')
          ))
      )
      .map((f: MapboxFeature) => f.place_name);
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
}
