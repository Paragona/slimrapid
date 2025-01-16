'use client';

import { useRef } from 'react';
import { Truck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalculatorForm } from '@/components/calculator/CalculatorForm';
import { CostBreakdown as CostBreakdownComponent } from '@/components/calculator/CostBreakdown';
import { RouteMap } from '@/components/calculator/RouteMap';
import { Summary } from '@/components/calculator/Summary';
import { useCalculator } from '@/hooks/useCalculator';
import { MAP_STYLES } from '@/services/calculator/mapService';
import { MapSettings } from '@/types/calculator';

export default function CalculatorPage() {
  const summaryRef = useRef<HTMLDivElement>(null);
  const {
    origin,
    destination,
    moveDetails,
    costBreakdown,
    loading,
    error,
    originCoordinates,
    destinationCoordinates,
    mapSettings,
    addressSuggestions,
    setOrigin,
    setDestination,
    setMoveDetails,
    calculateCosts,
    updateMapSettings
  } = useCalculator();

  const handleCalculate = async () => {
    await calculateCosts();
    // Scroll to summary after calculation
    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 500);
  };

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
              onCalculate={handleCalculate}
              loading={loading}
              error={error}
              addressSuggestions={addressSuggestions}
            />

            {originCoordinates && destinationCoordinates && (
              <>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Map Style</label>
                    <select 
                      value={mapSettings.style}
                      onChange={(e) => updateMapSettings({ 
                        style: e.target.value as MapSettings['style']
                      })}
                      className="p-2 border rounded"
                    >
                      {MAP_STYLES.map(style => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Route Color</label>
                    <input 
                      type="color" 
                      value={mapSettings.routeColor}
                      onChange={(e) => updateMapSettings({ routeColor: e.target.value })}
                      className="p-1 border rounded h-9 w-16"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Origin Marker</label>
                    <input 
                      type="color" 
                      value={mapSettings.originMarkerColor}
                      onChange={(e) => updateMapSettings({ originMarkerColor: e.target.value })}
                      className="p-1 border rounded h-9 w-16"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination Marker</label>
                    <input 
                      type="color" 
                      value={mapSettings.destinationMarkerColor}
                      onChange={(e) => updateMapSettings({ destinationMarkerColor: e.target.value })}
                      className="p-1 border rounded h-9 w-16"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zoom Level</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={mapSettings.zoom}
                      onChange={(e) => updateMapSettings({ zoom: Number(e.target.value) })}
                      className="w-32"
                    />
                  </div>
                </div>
                <RouteMap
                  originCoordinates={originCoordinates}
                  destinationCoordinates={destinationCoordinates}
                  style={mapSettings.style}
                  routeColor={mapSettings.routeColor}
                  originMarkerColor={mapSettings.originMarkerColor}
                  destinationMarkerColor={mapSettings.destinationMarkerColor}
                  zoom={mapSettings.zoom}
                />
              </>
            )}

            {/* Move Summary */}
            {origin && destination && (
              <Summary
                ref={summaryRef}
                origin={origin}
                destination={destination}
                costBreakdown={costBreakdown}
              />
            )}

            {/* Cost Breakdown */}
            {costBreakdown && (
              <CostBreakdownComponent costBreakdown={costBreakdown} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
