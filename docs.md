# Project Structure Documentation

## Source Directory (`/src`)

The source directory is organized into several key folders, each serving a specific purpose in the Next.js application:

### App Directory (`/src/app`)
Contains the core application pages and layouts using Next.js 13+ App Router:
- `layout.tsx` - Root layout component that wraps all pages
- `page.tsx` - Main homepage component
- `/calculator` - Calculator feature subdirectory
  - `layout.tsx` - Calculator-specific layout
  - `page.tsx` - Moving cost calculator component with interactive features

### Components Directory (`/src/components`)
Houses all React components, divided into feature components, calculator components, and reusable UI components:

#### Feature Components
- `Features.tsx` - Features showcase component
- `Footer.tsx` - Site-wide footer component
- `Header.tsx` - Site-wide header/navigation component
- `Hero.tsx` - Hero/banner section component
- `HowItWorks.tsx` - Process explanation component
- `MapboxComponent.tsx` - Interactive map component with route visualization
- `Testimonials.tsx` - User testimonials component

#### Calculator Components (`/src/components/calculator`)
- `CalculatorForm.tsx` - Form component handling all move details inputs
- `CostBreakdown.tsx` - Component displaying detailed cost breakdown
- `RouteMap.tsx` - Component handling map display and route visualization

#### UI Components (`/src/components/ui`)
Reusable UI components library:
- `address-input.tsx` - Enhanced address input with auto-complete suggestions
- `button.tsx` - Button component
- `calendar.tsx` - Calendar/date picker component
- `card.tsx` - Card container component
- `input.tsx` - Input field component
- `label.tsx` - Form label component
- `select.tsx` - Select/dropdown component
- `tooltip.tsx` - Tooltip component for displaying helpful information

### Library Directory (`/src/lib`)
Contains utility functions and shared code:
- `utils.ts` - General utility functions and helpers

### Types Directory (`/src/types`)
Contains TypeScript type definitions:
- `calculator.ts` - Shared types for calculator components including:
  - MoveDetails - Type for move specifications
  - CostBreakdownType - Type for cost calculation results

### Styles Directory (`/src/styles`)
Contains global styling assets:
- `globals.css` - Global CSS styles
- `favicon.ico` - Site favicon

## Calculator Features

The moving cost calculator is built with a modular architecture, with the main logic in `/src/app/calculator/page.tsx` and specialized components in `/src/components/calculator/`. It includes several interactive features:

### Address Input
- Real-time address suggestions using Mapbox geocoding API
- Auto-complete dropdown with click-outside behavior
- Visual feedback for required fields
- Address validation and error handling

### Cost Calculation and Breakdown
- Real-time cost updates as inputs change
- Comprehensive route summary showing:
  - Origin and destination addresses
  - Total distance in kilometers
- Smart price calibration with dynamic base rates:
  - Studio: $500-$870
  - 1 Bedroom: $700-$1,900
  - 2 Bedrooms: $1,000-$3,200
  - 3 Bedrooms: $1,500-$5,000
  - 4+ Bedrooms: $2,000-$6,000
- Sophisticated seasonal pricing:
  - Peak summer (June-August): 15% surcharge
  - Secondary peak (April-May, September): 10% surcharge
  - Weekend moves: 15% surcharge
- Advanced distance cost calculation:
  - 0-50 miles: $2/mile
  - 51-100 miles: $1.8/mile
  - 101-500 miles: $1.5/mile
  - 500+ miles: $1.2/mile
- Additional costs:
  - Floor cost ($50 per floor without elevator)
  - Parking distance cost ($1 per foot)

### Interactive UI
- Collapsible sections for better organization:
  - Basic Information (addresses)
  - Move Details (size and date)
  - Origin Details (floor, elevator, parking)
  - Destination Details (floor, elevator, parking)
- Tooltips providing helpful information for each input
- Loading states and error handling
- Responsive design for all screen sizes

### Map Integration
- Interactive map showing route between addresses
- Route visualization using Mapbox Directions API
- Distance calculation for accurate cost estimation
- Visual representation of origin and destination

### User Experience
- Form validation and error messages
- Visual feedback for input states
- Smooth transitions and animations
- Enhanced cost breakdown with:
  - Route summary section
  - Detailed cost itemization with icons
  - Clear separation of costs by category
- Modern and clean interface
- Optimized scrolling behavior:
  - Proper viewport handling
  - Smooth scrolling on all screen sizes
  - No content overflow issues

### Layout and Responsiveness
- Hierarchical layout structure:
  - Root layout (`layout.tsx`) with proper overflow handling
  - Calculator-specific layout for feature isolation
  - Responsive container sizing
- Scroll behavior optimization:
  - Vertical scrolling enabled at layout level
  - Horizontal overflow prevention
  - Content containment within viewport
- Mobile-friendly design with proper spacing

This structure follows modern React/Next.js best practices with a clear separation of concerns:
- App router pages for routing and layouts
- Modular components for UI elements
- Shared TypeScript types for type safety
- Shared utilities in lib
- Global styles in a dedicated directory
- Component-specific logic encapsulated in dedicated components
