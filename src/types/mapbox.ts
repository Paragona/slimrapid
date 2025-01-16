/**
 * Available Mapbox style options
 */
export type MapboxStyle = 'streets-v12' | 'satellite-v9' | 'light-v11' | 'dark-v11';

/**
 * Mapbox map instance options
 */
export interface MapboxOptions {
  container: HTMLElement | string;
  style: string | object;
  center?: [number, number];
  zoom?: number;
  bearing?: number;
  pitch?: number;
  minZoom?: number;
  maxZoom?: number;
  interactive?: boolean;
  attributionControl?: boolean;
}

/**
 * Mapbox layer paint properties
 */
export interface MapboxLayerPaint {
  'line-color'?: string;
  'line-width'?: number;
  'line-opacity'?: number;
}

/**
 * Mapbox layer layout properties
 */
export interface MapboxLayerLayout {
  'line-join'?: 'bevel' | 'round' | 'miter';
  'line-cap'?: 'butt' | 'round' | 'square';
  visibility?: 'visible' | 'none';
}

/**
 * Mapbox layer style
 */
export interface MapboxLayerStyle {
  type: string;
  layout?: MapboxLayerLayout;
  paint?: MapboxLayerPaint;
}

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
