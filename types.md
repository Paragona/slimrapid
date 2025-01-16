# Types Definitions

## Auth Types

```typescript
export interface AuthToken {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export type ProtectedRouteConfig = {
  path: string;
  requireAuth: boolean;
  redirectTo?: string;
}
```

## Calculator Types

```typescript
export type MoveSize = 'studio' | '1bed' | '2bed' | '3bed' | '4bed';

export interface LocationDetails {
  floorNumber: number;
  hasElevator: boolean;
  parkingDistance: number;
}

export interface MoveDetails {
  // Add relevant fields
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CostBreakdown {
  baseCost: number;
  distanceCost: number;
  floorCost: number;
  parkingCost: number;
  weekendSurcharge: number;
  seasonalSurcharge: number;
  total: number;
  distanceKm: number;
}

export interface AddressSuggestions {
  origin: string[];
  destination: string[];
}

export interface MapSettings {
  style: 'streets-v12' | 'satellite-v9' | 'light-v11' | 'dark-v11';
  routeColor: string;
  originMarkerColor: string;
  destinationMarkerColor: string;
  zoom: number;
}

export interface GeocodingResponse {
  placeName: string;
  coordinates: Coordinates;
  countryCode: string;
}

export interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}
```

## Config Types

```typescript
import { NavigationLink } from './navigation';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
}

export interface FooterConfig {
  company: NavigationLink[];
  support: NavigationLink[];
  legal: NavigationLink[];
  social: NavigationLink[];
}

export interface ThemeConfig {
  // Add relevant fields
}

export interface AppConfig {
  site: SiteConfig;
  theme: ThemeConfig;
}
```

## Navigation Types

```typescript
import { LucideIcon } from 'lucide-react';

export interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: 'sidebar' | 'header' | 'default';
}

export interface NavigationLink {
  href: string;
  icon: LucideIcon;
  label: string;
}

export interface NavigationConfig {
  mainNavLinks: NavigationLink[];
  settingsLinks: NavigationLink[];
}
```

## Mapbox Types

```typescript
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
  location: [number, number];
  name: string;
  code: string;
  uuid: string;
}
```

## Styles Types

```typescript
export interface StyleConfig {
  nav: {
    base: string;
    link: {
      base: string;
      active: string;
      sidebar: string;
    };
    icon: {
      base: string;
      logo: string;
    };
    container: {
      base: string;
      settings: string;
    };
  };
  text: {
    logo: string;
    title: string;
  };
}
```

