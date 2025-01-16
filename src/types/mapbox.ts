export interface MapboxContext {
  id: string;
  short_code?: string;
  text: string;
}

export interface MapboxGeometry {
  type: string;
  coordinates: [number, number];
}

export interface MapboxFeature {
  id: string;
  type: string;
  place_type: string[];
  place_name: string;
  center: [number, number];
  geometry: MapboxGeometry;
  context?: MapboxContext[];
}

export interface MapboxGeocoding {
  type: string;
  features: MapboxFeature[];
  attribution: string;
}

export interface MapboxRoute {
  distance: number;
  duration: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

export interface MapboxDirections {
  routes: MapboxRoute[];
  waypoints: {
    location: [number, number];
    name: string;
  }[];
  code: string;
  uuid: string;
}
