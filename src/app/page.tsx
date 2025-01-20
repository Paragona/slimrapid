'use client';

import { Hero, Features, HowItWorks, Testimonials } from "@/components/home";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import { CostBreakdown } from "@/components/calculator/CostBreakdown";
import { useCalculator } from "@/hooks/useCalculator";

export default function Home() {
  const {
    moveDetails,
    setMoveDetails,
    origin,
    destination,
    setOrigin,
    setDestination,
    calculateCosts,
    loading,
    error,
    addressSuggestions,
    costBreakdown
  } = useCalculator();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <div id="calculator-section" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Calculate Your Moving Costs</h2>
            <p className="text-lg text-gray-600">Get an instant estimate for your move with our detailed calculator</p>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <CalculatorForm 
              moveDetails={moveDetails}
              onMoveDetailsChange={setMoveDetails}
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onCalculate={calculateCosts}
              loading={loading}
              error={error}
              addressSuggestions={addressSuggestions}
            />
            {costBreakdown && (
              <div className="mt-8">
                <CostBreakdown costBreakdown={costBreakdown} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Features />
      <HowItWorks />
      <Testimonials />
    </main>
  );
}
