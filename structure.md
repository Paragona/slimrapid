Let me break down the essential elements for the first phase of Destinopia:

## Phase 1 Core Components

1. **Header/Navigation**
```typescript
components/
  layout/
    Header.tsx
    Navigation.tsx
    Footer.tsx
```

2. **Calculator Core**
```typescript
components/
  calculator/
    AddressInput.tsx      // Google Places integration
    HomeSize.tsx          // Room selector
    SpecialItems.tsx      // Piano, safe, etc.
    DatePicker.tsx        // Moving date
    CostBreakdown.tsx     // Price summary
    CalculatorSteps.tsx   // Step wizard
```

3. **Basic Pages**
```typescript
app/
  page.tsx               // Homepage
  calculate/
    page.tsx            // Calculator page
  services/
    page.tsx           // Services overview
  about/
    page.tsx           // About page
```

4. **Essential Types**
```typescript
types/
  calculator.ts

interface MoveDetails {
  origin: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  destination: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  homeSize: 'studio' | '1bed' | '2bed' | '3bed' | '4bed'
  moveDate: Date
  specialItems: SpecialItem[]
  services: AdditionalService[]
}

interface SpecialItem {
  type: 'piano' | 'pool_table' | 'safe' | 'artwork'
  quantity: number
}

interface AdditionalService {
  type: 'packing' | 'storage' | 'insurance'
  details?: string
}

interface CostEstimate {
  baseRate: number
  distanceCost: number
  specialItemsCost: number
  servicesCost: number
  totalEstimate: number
}
```

5. **Core Functions**
```typescript
lib/
  calculator/
    calculateDistance.ts    // Google Distance Matrix
    calculateBaseCost.ts    // Base pricing
    calculateSpecialItems.ts // Special items pricing
    calculateServices.ts    // Additional services
```

6. **API Routes**
```typescript
app/api/
  calculate/
    route.ts              // Calculate cost
  leads/
    route.ts             // Save lead
```

7. **Database Schema (MongoDB)**
```typescript
models/
  Move.ts
  Lead.ts
  Estimate.ts
```

8. **Initial Styling**
```typescript
styles/
  globals.css           // Base Tailwind + custom styles
```

Would you like me to:
1. Start with setup of the project structure?
2. Create the basic calculator component?
3. Implement Google Maps integration?
4. Set up the MongoDB schema?

Choose what you'd like to tackle first and I'll provide the detailed implementation.