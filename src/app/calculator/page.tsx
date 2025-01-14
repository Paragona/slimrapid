'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Truck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalculatorForm } from '@/components/calculator/CalculatorForm';
import { CostBreakdown } from '@/components/calculator/CostBreakdown';
import { RouteMap } from '@/components/calculator/RouteMap';
import { Summary } from '@/components/calculator/Summary';
import { MoveDetails, CostBreakdownType } from '@/types/calculator';

interface MapboxFeature {
  place_name: string;
  context?: Array<{
    id: string;
    short_code?: string;
  }>;
}

export default function CalculatorPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originCoordinates, setOriginCoordinates] = useState<[number, number]>();
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number]>();
  const [moveDetails, setMoveDetails] = useState<MoveDetails>({
    moveSize: '1bed',
    floorNumber: {
      origin: 0,
      destination: 0
    },
    hasElevator: {
      origin: false,
      destination: false
    },
    parkingDistance: {
      origin: 0,
      destination: 0
    },
    moveDate: new Date()
  });
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownType | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState({
    origin: [] as string[],
    destination: [] as string[]
  });
  const summaryRef = useRef<HTMLDivElement>(null);

  const getBaseRate = (moveSize: string, distance: number) => {
    const baseRates = {
      'studio': {min: 500, max: 870},
      '1bed': {min: 700, max: 1900},
      '2bed': {min: 1000, max: 3200},
      '3bed': {min: 1500, max: 5000},
      '4bed': {min: 2000, max: 6000}
    };

    return distance < 100 ? 
      baseRates[moveSize as keyof typeof baseRates].min : 
      baseRates[moveSize as keyof typeof baseRates].max;
  };

  const getSeasonalMultiplier = (date: Date) => {
    const month = date.getMonth();
    const day = date.getDay();
    
    // Peak summer season (June-August)
    const isSummerPeak = month >= 5 && month <= 7;
    // Secondary peak (April-May, September)
    const isSecondaryPeak = month === 3 || month === 4 || month === 8;
    // Weekend
    const isWeekend = day === 0 || day === 6;
    
    let multiplier = 1;
    if (isSummerPeak) multiplier *= 1.15;
    if (isSecondaryPeak) multiplier *= 1.1;
    if (isWeekend) multiplier *= 1.15;
    
    return multiplier;
  };

  const getDistanceCost = (distance: number) => {
    if (distance <= 50) return distance * 2;
    if (distance <= 100) return 100 + (distance - 50) * 1.8;
    if (distance <= 500) return 190 + (distance - 100) * 1.5;
    return 790 + (distance - 500) * 1.2;
  };

  const calculateCost = useCallback((distanceInKm: number = 0) => {
    // Convert distance to miles
    const distanceInMiles = distanceInKm * 0.621371;
    
    // Get base rate based on move size and distance
    const baseRate = getBaseRate(moveDetails.moveSize, distanceInMiles);
    
    // Calculate distance cost using bracketed pricing
    const distanceCost = getDistanceCost(distanceInMiles);
    
    // Get seasonal and timing multiplier
    const seasonalMultiplier = getSeasonalMultiplier(moveDetails.moveDate);
    
    // Initial cost calculation
    let totalCost = (baseRate + distanceCost);
    
    // Add floor cost ($50 per floor without elevator)
    if (!moveDetails.hasElevator.origin) {
      totalCost += moveDetails.floorNumber.origin * 50;
    }
    if (!moveDetails.hasElevator.destination) {
      totalCost += moveDetails.floorNumber.destination * 50;
    }
    
    // Add parking distance cost ($1 per foot)
    totalCost += (moveDetails.parkingDistance.origin + moveDetails.parkingDistance.destination);
    
    // Apply seasonal multiplier to base costs
    totalCost *= seasonalMultiplier;

    const breakdown: CostBreakdownType = {
      baseCost: baseRate,
      distanceCost: Math.round(distanceCost),
      floorCost: (!moveDetails.hasElevator.origin ? moveDetails.floorNumber.origin * 50 : 0) +
                 (!moveDetails.hasElevator.destination ? moveDetails.floorNumber.destination * 50 : 0),
      parkingCost: moveDetails.parkingDistance.origin + moveDetails.parkingDistance.destination,
      weekendSurcharge: 0,
      seasonalSurcharge: 0,
      distanceKm: distanceInKm,
      total: Math.round(totalCost + 
             (!moveDetails.hasElevator.origin ? moveDetails.floorNumber.origin * 50 : 0) +
             (!moveDetails.hasElevator.destination ? moveDetails.floorNumber.destination * 50 : 0) +
             moveDetails.parkingDistance.origin + 
             moveDetails.parkingDistance.destination)
    };

    setCostBreakdown(breakdown);
    return breakdown.total;
  }, [moveDetails]);

  const getCoordinates = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return [lng, lat];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const calculateDistance = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const originCoords = await getCoordinates(origin);
      const destinationCoords = await getCoordinates(destination);

      if (!originCoords || !destinationCoords) {
        throw new Error('Could not find coordinates for one or both addresses');
      }

      setOriginCoordinates(originCoords);
      setDestinationCoordinates(destinationCoords);

      // Get the actual driving route and distance using Mapbox Directions API
      const directionsResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords[0]},${originCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?` +
        `access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&geometries=geojson`
      );

      if (!directionsResponse.ok) {
        throw new Error('Failed to calculate route');
      }

      const directionsData = await directionsResponse.json();
      
      if (!directionsData.routes || directionsData.routes.length === 0) {
        throw new Error('No route found between these locations');
      }

      // Distance comes in meters, convert to kilometers
      const distanceInKm = directionsData.routes[0].distance / 1000;
      calculateCost(distanceInKm);
      
      // Scroll to summary after calculation
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 500); // Small delay to ensure the summary is rendered

    } catch (err) {
      setError('An error occurred while calculating the distance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced address search
  useEffect(() => {
    const searchAddress = async (address: string, type: 'origin' | 'destination') => {
      if (address.length < 3) {
        setAddressSuggestions(prev => ({ ...prev, [type]: [] }));
        return;
      }

      if (!process.env.NEXT_PUBLIC_MAPBOX_API_KEY) {
        console.error('Mapbox API key is not configured');
        return;
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?` +
          `access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}` +
          `&types=address` +
          `&country=us,ca` // Restrict to USA and Canada
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.features || !Array.isArray(data.features)) {
          console.error('Unexpected API response format:', data);
          setAddressSuggestions(prev => ({ ...prev, [type]: [] }));
          return;
        }

        const suggestions = data.features
          .filter((f: MapboxFeature) => 
            f && f.context && Array.isArray(f.context) && 
            f.context.some((c) => c && c.id && c.id.startsWith('country') && 
              (c.short_code === 'us' || c.short_code === 'ca'))
          )
          .map((f: MapboxFeature) => f.place_name);
          
        setAddressSuggestions(prev => ({ ...prev, [type]: suggestions }));
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setAddressSuggestions(prev => ({ ...prev, [type]: [] }));
      }
    };

    const timeoutId = setTimeout(() => {
      if (origin) searchAddress(origin, 'origin');
      if (destination) searchAddress(destination, 'destination');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [origin, destination]);

  // Calculate cost whenever move details change
  useEffect(() => {
    if (moveDetails) {
      calculateCost();
    }
  }, [moveDetails, calculateCost]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen overflow-auto">
      <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-500" />
            <CardTitle>Moving Cost Calculator</CardTitle>
          </div>
          <CardDescription>
            Calculate the estimated cost of your move based on distance and additional factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 relative">
            <CalculatorForm
              moveDetails={moveDetails}
              onMoveDetailsChange={setMoveDetails}
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onCalculate={calculateDistance}
              loading={loading}
              error={error}
              addressSuggestions={addressSuggestions}
            />

            {originCoordinates && destinationCoordinates && (
              <div className="h-[400px]">
                <RouteMap
                  originCoordinates={originCoordinates}
                  destinationCoordinates={destinationCoordinates}
                  onRouteCalculated={(distance) => calculateCost(distance)}
                />
              </div>
            )}

            {/* Move Summary */}
            {origin && destination && (
              <Summary
                origin={origin}
                destination={destination}
                costBreakdown={costBreakdown}
              />
            )}

            {/* Cost Breakdown */}
            {costBreakdown && (
              <CostBreakdown costBreakdown={costBreakdown} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
