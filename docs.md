# Authentication and Profile System

## Directory Structure

```
src/
├── app/
│   ├── (auth)/                  # Auth group layout
│   │   ├── layout.tsx           # Auth-specific layout (no header/footer)
│   │   ├── login/              
│   │   │   └── page.tsx         # Login page with redirect to '/'
│   │   └── register/
│   │       └── page.tsx         # Registration with optional profile fields
│   └── profile/
│       └── page.tsx             # Profile management page
├── auth/
│   └── AuthContext.tsx          # Authentication context and Firebase integration
└── components/
    ├── nav-user.tsx             # User navigation with profile link and logout
    └── ui/
        └── address-input.tsx     # Reusable address input component
```

## Features

### Authentication

1. JWT Implementation
   - JWT stored in HTTP-only cookies
   - Payload structure:
     ```typescript
     {
       uid: string      // Firebase user ID
       email: string    // User's email
       name?: string    // Optional user name
       exp: number      // Expiration timestamp (7 days)
     }
     ```
   - Token management:
     - Created on login/registration
     - Verified on app initialization
     - Removed on logout
     - Auto-expires after 7 days

2. Login (`/login`)
   - Email/password authentication
   - Google sign-in
   - Redirect to home page after successful login

2. Registration (`/register`)
   - Required fields:
     - Email
     - Password (min 6 characters)
     - Password confirmation
   - Optional fields:
     - Name
     - Mobile number (validated format)
     - Address (using AddressInput component)
     - Zipcode (validated format)
   - Data saved to Firestore on successful registration

3. Logout
   - Available in user dropdown menu
   - Redirects to login page

### Profile Management

1. Profile Page (`/profile`)
   - Protected route (redirects to login if not authenticated)
   - Edit user information:
     - Name
     - Mobile number
     - Address
     - Zipcode
   - Real-time validation
   - Success/error messages
   - Data persistence in Firestore

### Data Validation (Zod Schemas)

1. Registration Schema
```typescript
{
  email: string (email format)
  password: string (min 6 chars)
  confirmPassword: string (must match password)
  name: string (optional)
  mobile: string (regex: /^\+?[1-9]\d{1,14}$/) (optional)
  address: string (optional)
  zipcode: string (regex: /^\d{5}(-\d{4})?$/) (optional)
}
```

2. Profile Schema
```typescript
{
  name: string (optional)
  mobile: string (regex: /^\+?[1-9]\d{1,14}$/) (optional)
  address: string (optional)
  zipcode: string (regex: /^\d{5}(-\d{4})?$/) (optional)
}
```

### Firestore Integration

1. User Collection
```typescript
users/{uid}/
{
  email: string
  name?: string
  mobile?: string
  address?: string
  zipcode?: string
  createdAt: timestamp  // Set during registration
  updatedAt: timestamp  // Updated when profile is modified
}
```

### JWT Utilities (`src/lib/jwt.ts`)

1. Client-side Functions
   ```typescript
   createToken(payload: JWTPayload): string
   verifyToken(token: string): JWTPayload | null
   getTokenFromStorage(): string | null
   setTokenInStorage(token: string): void
   removeTokenFromStorage(): void
   ```

2. Server-side Functions
   ```typescript
   getServerSideToken(headers: Headers): Promise<string | null>
   ```

3. Cookie Configuration
   - Secure flag enabled
   - SameSite=strict
   - 7-day expiration
   - HTTP-only for security

4. Middleware Protection (`middleware.ts`)
   - Protects routes: /profile, /dashboard
   - Redirects to login if no valid token
   - Handles auth-only routes (/login, /register)
   - Preserves intended destination with 'from' parameter

### Components

1. AddressInput
   - Reusable component from calculator
   - Props:
     - id: string
     - label: string
     - value: string
     - onChange: (value: string) => void
     - onSelect: (address: string) => void
     - suggestions: string[]
     - error?: boolean

2. NavUser
   - User dropdown menu
   - Profile link
   - Logout functionality
   - Displays user info:
     - Email
     - Name (if available)
     - Avatar

### Layout System

1. Auth Layout (`(auth)/layout.tsx`)
   - Clean layout without header/footer
   - Centered content
   - Used for login and registration pages

2. Main Layout (`layout.tsx`)
   - Includes header and footer
   - Side navigation
   - Used for authenticated pages

### Navigation Flow

1. Unauthenticated Users
   - Can access: /login, /register
   - Redirected to /login for protected routes

2. Authenticated Users
   - Redirected to / after login
   - Can access all routes
   - Profile accessible via user dropdown
   - Logout returns to login page
