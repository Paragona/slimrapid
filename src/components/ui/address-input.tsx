'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { MapPin } from 'lucide-react';

interface AddressInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string) => void;
  suggestions: string[];
  error?: boolean;
}

export function AddressInput({
  id,
  label,
  value,
  onChange,
  onSelect,
  suggestions,
  error
}: AddressInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative">
      <div ref={inputRef} className="relative">
        <Input
          id={id}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className={`pl-8 ${error ? 'border-red-300' : ''}`}
        />
        <MapPin className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
      </div>
      {showSuggestions && suggestions.length > 0 && value.length >= 3 && (
        <div
          ref={suggestionsRef}
          className="absolute z-[100] w-full bg-white border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
              onClick={() => {
                onSelect(suggestion);
                setShowSuggestions(false);
              }}
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
