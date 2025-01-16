import { useState, useCallback, useEffect } from 'react';
import { MoveDetails, CostBreakdown, AddressSuggestions, MapSettings } from '@/types/calculator';
import { calculateMovingCost } from '@/services/calculator/costCalculator';
import { getCoordinates, getRoute, getAddressSuggestions } from '@/services/calculator/geocoding';
import { DEFAULT_MAP_SETTINGS } from '@/services/calculator/mapService';

interface CalculatorState {
  origin: string;
  destination: string;
  moveDetails: MoveDetails;
  costBreakdown: CostBreakdown | null;
  loading: boolean;
  error: string | null;
  originCoordinates: [number, number] | undefined;
  destinationCoordinates: [number, number] | undefined;
  mapSettings: MapSettings;
  addressSuggestions: AddressSuggestions;
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    origin: '',
    destination: '',
    moveDetails: {
      moveSize: '1bed',
      origin: {
        floorNumber: 0,
        hasElevator: false,
        parkingDistance: 0
      },
      destination: {
        floorNumber: 0,
        hasElevator: false,
        parkingDistance: 0
      },
      moveDate: new Date()
    },
    costBreakdown: null,
    loading: false,
    error: null,
    originCoordinates: undefined,
    destinationCoordinates: undefined,
    mapSettings: DEFAULT_MAP_SETTINGS,
    addressSuggestions: {
      origin: [],
      destination: []
    }
  });

  // Update individual state properties
  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle address changes
  const handleAddressChange = useCallback(async (
    type: 'origin' | 'destination',
    value: string
  ) => {
    updateState({ [type]: value });
  }, [updateState]);

  // Calculate costs
  const calculateCosts = useCallback(async () => {
    if (!state.origin || !state.destination) {
      updateState({ error: 'Please enter both origin and destination' });
      return;
    }

    updateState({ loading: true, error: null });

    try {
      // Get coordinates
      const originGeocode = await getCoordinates(state.origin);
      const destinationGeocode = await getCoordinates(state.destination);

      if (!originGeocode || !destinationGeocode) {
        throw new Error('Could not find coordinates for one or both addresses');
      }

      const originCoords: [number, number] = [
        originGeocode.coordinates.longitude,
        originGeocode.coordinates.latitude
      ];
      const destCoords: [number, number] = [
        destinationGeocode.coordinates.longitude,
        destinationGeocode.coordinates.latitude
      ];

      // Get route information
      const route = await getRoute(originGeocode.coordinates, destinationGeocode.coordinates);
      if (!route) {
        throw new Error('Could not calculate route');
      }

      // Calculate costs
      const costBreakdown = calculateMovingCost(state.moveDetails, route.distanceKm);

      updateState({
        originCoordinates: originCoords,
        destinationCoordinates: destCoords,
        costBreakdown,
        error: null
      });
    } catch (err) {
      updateState({
        error: err instanceof Error ? err.message : 'An error occurred'
      });
    } finally {
      updateState({ loading: false });
    }
  }, [state.origin, state.destination, state.moveDetails, updateState]);

  // Update map settings
  const updateMapSettings = useCallback((updates: Partial<MapSettings>) => {
    updateState({
      mapSettings: { ...state.mapSettings, ...updates }
    });
  }, [state.mapSettings, updateState]);

  // Fetch address suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (state.origin.length >= 3) {
        const suggestions = await getAddressSuggestions(state.origin, {
          types: ['address'],
          countries: ['us', 'ca']
        });
        updateState({
          addressSuggestions: {
            ...state.addressSuggestions,
            origin: suggestions
          }
        });
      }

      if (state.destination.length >= 3) {
        const suggestions = await getAddressSuggestions(state.destination, {
          types: ['address'],
          countries: ['us', 'ca']
        });
        updateState({
          addressSuggestions: {
            ...state.addressSuggestions,
            destination: suggestions
          }
        });
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [state.origin, state.destination, state.addressSuggestions, updateState]);

  return {
    ...state,
    setOrigin: (value: string) => handleAddressChange('origin', value),
    setDestination: (value: string) => handleAddressChange('destination', value),
    setMoveDetails: (details: MoveDetails) => updateState({ moveDetails: details }),
    calculateCosts,
    updateMapSettings
  };
}
