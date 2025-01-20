'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Truck, Building, Info, DollarSign, Home, Building2, Warehouse, Clock, FileCheck, ArrowUpDown, ShieldAlert } from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip";
import { AddressInput } from "@/components/ui/address-input";
import { MoveDetailsSection } from './MoveDetailsSection';

import { MoveDetails, AddressSuggestions, BuildingType, ParkingAccess, AccessRestrictions } from '@/types/calculator';
import { cn } from "@/lib/utils";

const buildingTypes: { value: BuildingType; label: string; icon: React.ReactElement }[] = [
  { value: 'house', label: 'House', icon: <Home className="w-5 h-5" /> },
  { value: 'apartment', label: 'Apartment', icon: <Building2 className="w-5 h-5" /> },
  { value: 'office', label: 'Office Building', icon: <Building className="w-5 h-5" /> },
  { value: 'storage', label: 'Storage Unit', icon: <Warehouse className="w-5 h-5" /> },
];

const parkingOptions: { value: ParkingAccess; label: string }[] = [
  { value: 'close', label: 'Close (0-30 feet)' },
  { value: 'medium', label: 'Medium (30-100 feet)' },
  { value: 'far', label: 'Far (100+ feet)' },
];

const defaultRestrictions: AccessRestrictions = {
  hasTimeRestrictions: false,
  requiresPermits: false,
  requiresElevatorBooking: false,
  requiresCOI: false,
};

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
  addressSuggestions: AddressSuggestions;
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

  // Helper function to ensure restrictions are initialized
  const getRestrictions = (restrictions?: AccessRestrictions) => {
    return restrictions || { ...defaultRestrictions };
  };

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
            {/* Building Type */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {buildingTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onMoveDetailsChange({
                    ...moveDetails,
                    origin: {
                      ...moveDetails.origin,
                      buildingType: type.value,
                      restrictions: getRestrictions(moveDetails.origin.restrictions)
                    }
                  })}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                    moveDetails.origin.buildingType === type.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                  )}
                >
                  {type.icon}
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Floor & Elevator */}
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                  value={moveDetails.origin.floorNumber}
                  onChange={(e) => onMoveDetailsChange({
                    ...moveDetails,
                    origin: {
                      ...moveDetails.origin,
                      floorNumber: parseInt(e.target.value)
                    }
                  })}
                  min="0"
                  className="pl-4"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Has Elevator
                  <Tooltip text="Check if the building has a working elevator">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </Label>
                <button
                  type="button"
                  onClick={() => onMoveDetailsChange({
                    ...moveDetails,
                    origin: {
                      ...moveDetails.origin,
                      hasElevator: !moveDetails.origin.hasElevator
                    }
                  })}
                  className={cn(
                    "w-full p-2 rounded-lg border-2 flex items-center justify-center gap-2 transition-all",
                    moveDetails.origin.hasElevator
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-green-200 hover:bg-green-50"
                  )}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{moveDetails.origin.hasElevator ? "Yes" : "No"}</span>
                </button>
              </div>
            </div>

            {/* Parking Access */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Label>Parking Access</Label>
                <Tooltip text="Select the approximate distance from parking to entrance">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {parkingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onMoveDetailsChange({
                      ...moveDetails,
                      origin: {
                        ...moveDetails.origin,
                        parkingAccess: option.value
                      }
                    })}
                    className={cn(
                      "p-2 rounded-lg border-2 text-sm transition-all",
                      moveDetails.origin.parkingAccess === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Access Restrictions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>Access Restrictions</Label>
                <Tooltip text="Select any access restrictions that apply">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.origin.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      origin: {
                        ...moveDetails.origin,
                        restrictions: {
                          ...restrictions,
                          hasTimeRestrictions: !restrictions.hasTimeRestrictions
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.origin.restrictions?.hasTimeRestrictions
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time Restrictions</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.origin.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      origin: {
                        ...moveDetails.origin,
                        restrictions: {
                          ...restrictions,
                          requiresPermits: !restrictions.requiresPermits
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.origin.restrictions?.requiresPermits
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <FileCheck className="w-4 h-4" />
                  <span className="text-sm">Permits Required</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.origin.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      origin: {
                        ...moveDetails.origin,
                        restrictions: {
                          ...restrictions,
                          requiresElevatorBooking: !restrictions.requiresElevatorBooking
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.origin.restrictions?.requiresElevatorBooking
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm">Elevator Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.origin.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      origin: {
                        ...moveDetails.origin,
                        restrictions: {
                          ...restrictions,
                          requiresCOI: !restrictions.requiresCOI
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.origin.restrictions?.requiresCOI
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-sm">COI Required</span>
                </button>
              </div>
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
            {/* Building Type */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {buildingTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onMoveDetailsChange({
                    ...moveDetails,
                    destination: {
                      ...moveDetails.destination,
                      buildingType: type.value,
                      restrictions: getRestrictions(moveDetails.destination.restrictions)
                    }
                  })}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                    moveDetails.destination.buildingType === type.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                  )}
                >
                  {type.icon}
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Floor & Elevator */}
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                  value={moveDetails.destination.floorNumber}
                  onChange={(e) => onMoveDetailsChange({
                    ...moveDetails,
                    destination: {
                      ...moveDetails.destination,
                      floorNumber: parseInt(e.target.value)
                    }
                  })}
                  min="0"
                  className="pl-4"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Has Elevator
                  <Tooltip text="Check if the building has a working elevator">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </Tooltip>
                </Label>
                <button
                  type="button"
                  onClick={() => onMoveDetailsChange({
                    ...moveDetails,
                    destination: {
                      ...moveDetails.destination,
                      hasElevator: !moveDetails.destination.hasElevator
                    }
                  })}
                  className={cn(
                    "w-full p-2 rounded-lg border-2 flex items-center justify-center gap-2 transition-all",
                    moveDetails.destination.hasElevator
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-green-200 hover:bg-green-50"
                  )}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{moveDetails.destination.hasElevator ? "Yes" : "No"}</span>
                </button>
              </div>
            </div>

            {/* Parking Access */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Label>Parking Access</Label>
                <Tooltip text="Select the approximate distance from parking to entrance">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {parkingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onMoveDetailsChange({
                      ...moveDetails,
                      destination: {
                        ...moveDetails.destination,
                        parkingAccess: option.value
                      }
                    })}
                    className={cn(
                      "p-2 rounded-lg border-2 text-sm transition-all",
                      moveDetails.destination.parkingAccess === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Access Restrictions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>Access Restrictions</Label>
                <Tooltip text="Select any access restrictions that apply">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.destination.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      destination: {
                        ...moveDetails.destination,
                        restrictions: {
                          ...restrictions,
                          hasTimeRestrictions: !restrictions.hasTimeRestrictions
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.destination.restrictions?.hasTimeRestrictions
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time Restrictions</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.destination.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      destination: {
                        ...moveDetails.destination,
                        restrictions: {
                          ...restrictions,
                          requiresPermits: !restrictions.requiresPermits
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.destination.restrictions?.requiresPermits
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <FileCheck className="w-4 h-4" />
                  <span className="text-sm">Permits Required</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.destination.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      destination: {
                        ...moveDetails.destination,
                        restrictions: {
                          ...restrictions,
                          requiresElevatorBooking: !restrictions.requiresElevatorBooking
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.destination.restrictions?.requiresElevatorBooking
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-sm">Elevator Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const restrictions = getRestrictions(moveDetails.destination.restrictions);
                    onMoveDetailsChange({
                      ...moveDetails,
                      destination: {
                        ...moveDetails.destination,
                        restrictions: {
                          ...restrictions,
                          requiresCOI: !restrictions.requiresCOI
                        }
                      }
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    moveDetails.destination.restrictions?.requiresCOI
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-200 hover:bg-yellow-50"
                  )}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-sm">COI Required</span>
                </button>
              </div>
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
