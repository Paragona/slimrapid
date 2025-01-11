'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Truck, Building, Info, DollarSign } from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip";
import { AddressInput } from "@/components/ui/address-input";
import { MoveDetailsSection } from './MoveDetailsSection';

import { MoveDetails } from '@/types/calculator';

interface CalculatorFormProps {
  moveDetails: MoveDetails;
  onMoveDetailsChange: (details: MoveDetails) => void;
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onCalculate: () => void;
  loading: boolean;
  error: string | null;
  addressSuggestions: {
    origin: string[];
    destination: string[];
  };
}

export function CalculatorForm({
  moveDetails,
  onMoveDetailsChange,
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onCalculate,
  loading,
  error,
  addressSuggestions,
}: CalculatorFormProps) {
  const [expandedSection, setExpandedSection] = useState<'basic' | 'move' | 'origin' | 'destination' | null>('basic');

  return (
    <div className="grid gap-6 relative">
      {/* Basic Information Section */}
      <div className="border rounded-lg p-4 relative hover:border-blue-200 transition-colors">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'basic' ? null : 'basic')}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <Tooltip text="Enter your pickup and delivery addresses">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <span className="text-xl">{expandedSection === 'basic' ? '−' : '+'}</span>
        </div>
        
        {expandedSection === 'basic' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin">Origin Address</Label>
              <AddressInput
                id="origin"
                label="Origin Address"
                value={origin}
                onChange={onOriginChange}
                onSelect={onOriginChange}
                suggestions={addressSuggestions.origin}
                error={!origin}
              />
            </div>
            <div>
              <Label htmlFor="destination">Destination Address</Label>
              <AddressInput
                id="destination"
                label="Destination Address"
                value={destination}
                onChange={onDestinationChange}
                onSelect={onDestinationChange}
                suggestions={addressSuggestions.destination}
                error={!destination}
              />
            </div>
          </div>
        )}
      </div>

      {/* Move Details Section */}
      <div className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'move' ? null : 'move')}
        >
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Move Details</h3>
            <Tooltip text="Specify the size of your move and preferred date">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <span className="text-xl">{expandedSection === 'move' ? '−' : '+'}</span>
        </div>
        
        <MoveDetailsSection
          moveDetails={moveDetails}
          onMoveDetailsChange={onMoveDetailsChange}
          expanded={expandedSection === 'move'}
        />
      </div>

      {/* Origin Details Section */}
      <div className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'origin' ? null : 'origin')}
        >
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Origin Details</h3>
            <Tooltip text="Provide details about the pickup location">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <span className="text-xl">{expandedSection === 'origin' ? '−' : '+'}</span>
        </div>
        
        {expandedSection === 'origin' && (
          <div className="mt-4 grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Floor Number</Label>
                <Tooltip text="Enter the floor number (additional charges apply for higher floors without elevator)">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <Input
                type="number"
                placeholder="Floor number"
                value={moveDetails.floorNumber.origin}
                onChange={(e) => onMoveDetailsChange({
                  ...moveDetails,
                  floorNumber: {
                    ...moveDetails.floorNumber,
                    origin: parseInt(e.target.value)
                  }
                })}
                min="0"
                className="pl-8"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={moveDetails.hasElevator.origin}
                onChange={(e) => onMoveDetailsChange({
                  ...moveDetails,
                  hasElevator: {
                    ...moveDetails.hasElevator,
                    origin: e.target.checked
                  }
                })}
                className="rounded"
              />
              <span>Has Elevator</span>
              <Tooltip text="Check if the building has a working elevator">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Parking Distance</Label>
                <Tooltip text="Distance in feet from parking to entrance">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <Input
                type="number"
                placeholder="Distance in feet"
                value={moveDetails.parkingDistance.origin}
                onChange={(e) => onMoveDetailsChange({
                  ...moveDetails,
                  parkingDistance: {
                    ...moveDetails.parkingDistance,
                    origin: parseInt(e.target.value)
                  }
                })}
                min="0"
                className="pl-8"
              />
            </div>
          </div>
        )}
      </div>

      {/* Destination Details Section */}
      <div className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedSection(expandedSection === 'destination' ? null : 'destination')}
        >
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Destination Details</h3>
            <Tooltip text="Provide details about the delivery location">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <span className="text-xl">{expandedSection === 'destination' ? '−' : '+'}</span>
        </div>
        
        {expandedSection === 'destination' && (
          <div className="mt-4 grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Floor Number</Label>
                <Tooltip text="Enter the floor number (additional charges apply for higher floors without elevator)">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <Input
                type="number"
                placeholder="Floor number"
                value={moveDetails.floorNumber.destination}
                onChange={(e) => onMoveDetailsChange({
                  ...moveDetails,
                  floorNumber: {
                    ...moveDetails.floorNumber,
                    destination: parseInt(e.target.value)
                  }
                })}
                min="0"
                className="pl-8"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={moveDetails.hasElevator.destination}
                onChange={(e) => onMoveDetailsChange({
                  ...moveDetails,
                  hasElevator: {
                    ...moveDetails.hasElevator,
                    destination: e.target.checked
                  }
                })}
                className="rounded"
              />
              <span>Has Elevator</span>
              <Tooltip text="Check if the building has a working elevator">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
              </Tooltip>
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Parking Distance</Label>
                <Tooltip text="Distance in feet from parking to entrance">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <Input
                type="number"
                placeholder="Distance in feet"
                value={moveDetails.parkingDistance.destination}
                onChange={(e) => onMoveDetailsChange({
                  ...moveDetails,
                  parkingDistance: {
                    ...moveDetails.parkingDistance,
                    destination: parseInt(e.target.value)
                  }
                })}
                min="0"
                className="pl-8"
              />
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={onCalculate}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-6"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Calculating...</span>
          </>
        ) : (
          <>
            <DollarSign className="w-5 h-5" />
            <span>Calculate Cost</span>
          </>
        )}
      </Button>

      {error && (
        <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
