'use client';

import { useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MapComponent from '@/components/MapComponent';
import { format } from 'date-fns';

interface MoveDetails {
  moveSize: string;
  floorNumber: {
    origin: number;
    destination: number;
  };
  hasElevator: {
    origin: boolean;
    destination: boolean;
  };
  parkingDistance: {
    origin: number;
    destination: number;
  };
  moveDate: Date;
}

export default function CalculatorPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
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
  const [cost, setCost] = useState<number | null>(null);

  const calculateCost = (distanceInKm: number) => {
    // Base rates per move size
    const baseRates = {
      'studio': 500,
      '1bed': 700,
      '2bed': 1000,
      '3bed': 1500,
      '4bed': 2000
    };

    // Convert distance to miles
    const distanceInMiles = distanceInKm * 0.621371;
    
    // Base cost calculation
    let totalCost = baseRates[moveDetails.moveSize as keyof typeof baseRates];
    
    // Add distance cost ($2 per mile)
    totalCost += distanceInMiles * 2;
    
    // Add floor cost ($50 per floor without elevator)
    if (!moveDetails.hasElevator.origin) {
      totalCost += moveDetails.floorNumber.origin * 50;
    }
    if (!moveDetails.hasElevator.destination) {
      totalCost += moveDetails.floorNumber.destination * 50;
    }
    
    // Add parking distance cost ($1 per foot)
    totalCost += (moveDetails.parkingDistance.origin + moveDetails.parkingDistance.destination);
    
    // Weekend surcharge (15%)
    const moveDay = moveDetails.moveDate.getDay();
    if (moveDay === 0 || moveDay === 6) {
      totalCost *= 1.15;
    }
    
    // Peak season surcharge (May-September, 10%)
    const moveMonth = moveDetails.moveDate.getMonth();
    if (moveMonth >= 4 && moveMonth <= 8) {
      totalCost *= 1.1;
    }

    return Math.round(totalCost);
  };

  const calculateDistance = async () => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['places', 'routes']
      });

      await loader.load();
      const service = new google.maps.DistanceMatrixService();

      const response = await service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
      });

      if (response.rows[0].elements[0].status === 'OK') {
        const distanceValue = response.rows[0].elements[0].distance.value / 1000; // Convert to km
        const distanceText = response.rows[0].elements[0].distance.text;
        const durationText = response.rows[0].elements[0].duration.text;
        setDistance(`Distance: ${distanceText} (approximately ${durationText} by car)`);
        setCost(calculateCost(distanceValue));
        setShowMap(true);
      } else {
        setError('Could not calculate distance. Please check your inputs.');
      }
    } catch (err) {
      setError('An error occurred while calculating the distance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Moving Cost Calculator</CardTitle>
          <CardDescription>
            Calculate the estimated cost of your move based on distance and additional factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin Address</Label>
                <Input
                  id="origin"
                  placeholder="Enter origin address"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Address</Label>
                <Input
                  id="destination"
                  placeholder="Enter destination address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Move Size</Label>
                <Select
                  value={moveDetails.moveSize}
                  onValueChange={(value) => setMoveDetails({...moveDetails, moveSize: value})}
                >
                  <option value="studio">Studio</option>
                  <option value="1bed">1 Bedroom</option>
                  <option value="2bed">2 Bedrooms</option>
                  <option value="3bed">3 Bedrooms</option>
                  <option value="4bed">4+ Bedrooms</option>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Move Date</Label>
                <Calendar
                  mode="single"
                  selected={moveDetails.moveDate}
                  onSelect={(date) => date && setMoveDetails({...moveDetails, moveDate: date})}
                  className="rounded-md border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Origin Details</Label>
                <div className="grid gap-2">
                  <Input
                    type="number"
                    placeholder="Floor number"
                    value={moveDetails.floorNumber.origin}
                    onChange={(e) => setMoveDetails({
                      ...moveDetails,
                      floorNumber: {
                        ...moveDetails.floorNumber,
                        origin: parseInt(e.target.value)
                      }
                    })}
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={moveDetails.hasElevator.origin}
                      onChange={(e) => setMoveDetails({
                        ...moveDetails,
                        hasElevator: {
                          ...moveDetails.hasElevator,
                          origin: e.target.checked
                        }
                      })}
                    />
                    <span>Has Elevator</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Parking distance (feet)"
                    value={moveDetails.parkingDistance.origin}
                    onChange={(e) => setMoveDetails({
                      ...moveDetails,
                      parkingDistance: {
                        ...moveDetails.parkingDistance,
                        origin: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Destination Details</Label>
                <div className="grid gap-2">
                  <Input
                    type="number"
                    placeholder="Floor number"
                    value={moveDetails.floorNumber.destination}
                    onChange={(e) => setMoveDetails({
                      ...moveDetails,
                      floorNumber: {
                        ...moveDetails.floorNumber,
                        destination: parseInt(e.target.value)
                      }
                    })}
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={moveDetails.hasElevator.destination}
                      onChange={(e) => setMoveDetails({
                        ...moveDetails,
                        hasElevator: {
                          ...moveDetails.hasElevator,
                          destination: e.target.checked
                        }
                      })}
                    />
                    <span>Has Elevator</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Parking distance (feet)"
                    value={moveDetails.parkingDistance.destination}
                    onChange={(e) => setMoveDetails({
                      ...moveDetails,
                      parkingDistance: {
                        ...moveDetails.parkingDistance,
                        destination: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={calculateDistance}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Calculating...' : 'Calculate Cost'}
            </Button>

            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}

            {distance && (
              <div className="text-center space-y-2">
                <p className="text-lg">{distance}</p>
                {cost && (
                  <p className="text-2xl font-bold">
                    Estimated Cost: ${cost.toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {showMap && (
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                <MapComponent
                  center={{ lat: 0, lng: 0 }}
                  zoom={2}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
