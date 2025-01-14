# RapidMove24 Documentation

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Auth group layout
│   │   ├── layout.tsx     # Auth-specific layout
│   │   ├── login/        
│   │   └── register/
│   ├── calculator/        # Cost calculator
│   ├── dashboard/         # User dashboard
│   └── profile/           # Profile management
├── auth/                  # Authentication
│   └── AuthContext.tsx    # Auth context & Firebase
├── components/           
│   ├── calculator/        # Calculator components
│   ├── home/             # Homepage components
│   ├── layout/           # Layout components
│   ├── maps/             # Map components
│   ├── navigation/       # Navigation components
│   └── ui/               # Reusable UI components
├── config/               # App configuration
│   ├── index.ts         # Central config export
│   ├── navigation.ts    # Navigation structure
│   ├── site.ts         # Site-wide settings
│   ├── styles.ts       # Global styles
│   └── theme.ts        # Theme configuration
├── lib/                 # Utilities
├── styles/             # Global styles
└── types/              # TypeScript types
    ├── auth.ts         # Auth types
    ├── calculator.ts   # Calculator types
    ├── config.ts       # Config types
    ├── navigation.ts   # Navigation types
    └── styles.ts       # Style types
```

## Configuration System

### Site Configuration (`config/site.ts`)
```typescript
{
  name: string           // Site name
  description: string    // Site description
  url: string           // Site URL
  ogImage: string       // Open Graph image
  links: {
    twitter: string
    github: string
  }
}
```

### Theme Configuration (`config/theme.ts`)
```typescript
{
  defaultTheme: 'light' | 'dark' | 'system'
  themes: string[]      // Available themes
}
```

### Navigation Structure (`config/navigation.ts`)
```typescript
// Main navigation
mainNavLinks: NavigationLink[]
// Settings navigation
settingsLinks: NavigationLink[]
// Footer navigation
footerLinks: {
  company: NavigationLink[]
  support: NavigationLink[]
  legal: NavigationLink[]
  social: NavigationLink[]
}
```

### Style Configuration (`config/styles.ts`)
```typescript
{
  nav: {
    base: string
    link: {
      base: string
      active: string
      sidebar: string
    }
    icon: {
      base: string
      logo: string
    }
    container: {
      base: string
      settings: string
    }
  }
  text: {
    logo: string
    title: string
  }
  layout: {
    spacing: {
      base: string
      tight: string
    }
  }
}
```

## Type System

### Auth Types (`types/auth.ts`)
```typescript
interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthToken {
  userId: string
  email: string
  exp: number
  iat: number
}

type ProtectedRouteConfig = {
  path: string
  requireAuth: boolean
  redirectTo?: string
}
```

### Navigation Types (`types/navigation.ts`)
```typescript
interface NavLinkProps {
  href: string
  icon: LucideIcon
  label: string
  variant?: 'sidebar' | 'header' | 'default'
}

interface NavigationLink {
  href: string
  icon: LucideIcon
  label: string
}
```

## Component Organization

### Layout Components
- `Header.tsx` - Main navigation header
- `Footer.tsx` - Site footer with configurable sections
- `Sidebar.tsx` - Navigation sidebar with collapsible support
- `AppSidebar.tsx` - Application sidebar with mobile responsiveness

### Navigation Components
- `NavMain.tsx` - Main navigation with icon support
- `NavUser.tsx` - User navigation with profile display
- `NavProjects.tsx` - Projects navigation
- `NavSecondary.tsx` - Secondary navigation with custom styling

### Home Components
- `Hero.tsx` - Hero section
- `Features.tsx` - Features section
- `HowItWorks.tsx` - How it works section
- `Testimonials.tsx` - Testimonials section

### Map Components
- `MapboxComponent.tsx` - Enhanced Mapbox integration with:
  - Route visualization
  - Distance calculation
  - Custom markers
  - Responsive controls

## UI Components

### Tooltip Component
```typescript
interface TooltipProps {
  text: string
  children: React.ReactNode
}
```

### ScrollArea Component
Provides custom scrolling functionality with:
- Smooth scrolling
- Custom scrollbar styling
- Touch device support

## Authentication System

### Auth Context
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
```

### Protected Routes
- `/profile/*` - User profile and settings
- `/calculator` - Cost calculator
- `/dashboard` - User dashboard

### Auth-only Routes
- `/login` - Login page
- `/register` - Registration page

## Best Practices

### Component Organization
1. Use named exports for components
2. Keep components focused and single-responsibility
3. Implement proper TypeScript types for props
4. Use composition over inheritance

### State Management
1. Use AuthContext for authentication state
2. Implement proper loading states
3. Handle errors gracefully
4. Use proper type safety

### Styling
1. Use consistent class naming
2. Implement responsive design
3. Follow the style configuration system
4. Use CSS variables for theming

### Performance
1. Implement proper code splitting
2. Use proper image optimization
3. Implement proper caching strategies
4. Use proper lazy loading

## Usage Examples

### Importing Components
```typescript
import { Header, Footer, Sidebar } from '@/components/layout'
import { Hero, Features } from '@/components/home'
import { MapboxComponent } from '@/components'
```

### Using Configuration
```typescript
import { siteConfig, navigationConfig, styleConfig } from '@/config'

// Access site name
console.log(siteConfig.name)

// Access navigation
console.log(navigationConfig.mainNavLinks)

// Access styles
console.log(styleConfig.nav.base)
```

### Using Auth Context
```typescript
import { useAuth } from '@/auth/AuthContext'

function ProfileComponent() {
  const { user, signOut } = useAuth()
  
  if (!user) return null
  
  return (
    <div>
      <p>Welcome, {user.name || user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
