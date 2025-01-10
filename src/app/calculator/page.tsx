'use client';

import { useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function CalculatorPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const distanceText = response.rows[0].elements[0].distance.text;
        const durationText = response.rows[0].elements[0].duration.text;
        setDistance(`Distance: ${distanceText} (approximately ${durationText} by car)`);
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
      <h1 className="text-3xl font-bold mb-8 text-center">Distance Calculator</h1>
      
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
            Origin
          </label>
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Enter starting point"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={calculateDistance}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate Distance'}
        </button>

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {distance && (
          <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md">
            {distance}
          </div>
        )}
      </div>
    </div>
  );
}
