# Complete Project Architecture

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Installation & Setup](#installation--setup)
4. [Project Dependencies](#project-dependencies)
5. [Directory Structure](#directory-structure)
6. [Core Architecture](#core-architecture)
7. [State Management](#state-management)
8. [Authentication System](#authentication-system)
9. [Routing & Middleware](#routing--middleware)
10. [Data Flow & Integration](#data-flow--integration)
11. [Build & Deployment](#build--deployment)
12. [Development Guidelines](#development-guidelines)

## Overview

## Technology Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type-safe JavaScript development
- **Tailwind CSS 4** - Utility-first CSS framework

### State Management & Data

- **Redux Toolkit 2.8** - Predictable state management
- **React Redux 9.2** - React bindings for Redux

### AI & Analytics

<!-- - **OpenAI** - GPT integration -->

### Visualization & Animation

- **D3.js 7.9** - Data visualization
- **GSAP 3.13** - High-performance animations
- **@gsap/react** - React GSAP integration

### Content & Markdown

<!-- - **React Markdown** - Markdown rendering -->
<!-- - **Remark GFM** - GitHub Flavored Markdown support -->

### Development Tools

- **ESLint 9** - Code linting
- **Turbopack** - Fast bundler for development
- **Critters** - Critical CSS inlining

## Installation & Setup

### Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm or yarn package manager
- Git for version control

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd <Project-name>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Configure your API keys and environment variables


# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### .env.example

```

```

# ----------------| BASE URLS |----------------

NEXT*PUBLIC* =

```

```

### Available Scripts

```bash
# Development with Turbopack (faster)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Project Dependencies

### Production Dependencies

```json
{
  "@gsap/react": "^2.1.2", // GSAP React bindings
  "@reduxjs/toolkit": "^2.8.0", // Redux state management
  "@types/d3": "^7.4.3", // D3 TypeScript definitions
  "critters": "^0.0.23", // Critical CSS optimization
  "d3": "^7.9.0", // Data visualization
  "gsap": "^3.13.0", // Animation library
  "next": "^15.3.2", // React framework
  "react": "^19.0.0", // UI library
  "react-redux": "^9.2.0" // Redux React bindings
}
```

### Development Dependencies

```json
{
  "@eslint/eslintrc": "^3", // ESLint configuration
  "@tailwindcss/postcss": "^4", // Tailwind PostCSS plugin
  "@types/node": "^20", // Node.js TypeScript definitions
  "@types/react": "^19", // React TypeScript definitions
  "@types/react-dom": "^19", // React DOM TypeScript definitions
  "eslint": "^9", // Code linting
  "eslint-config-next": "15.2.1", // Next.js ESLint config
  "tailwindcss": "^4", // CSS framework
  "typescript": "^5" // TypeScript compiler
}
```

## Directory Structure

```
civil-dijest-new/
├── docs/                          # Documentation
│   └── ARCHITECTURE_SUMMARY.md    # This file
├── public/                        # Static assets
│   ├── assets/
│   │   ├── fonts/                 # Custom fonts
│   │   ├── icons/                 # Favicons and app icons
│   │   ├── images/                # Static images
│   │   └── videos/                # Static videos
│   ├── scripts/                   # Client-side scripts
│   └── sw.js                      # Service worker
├── src/                           # Source code
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Authentication routes
│   │   ├── api/                   # API routes
│   │   └── layout.tsx             # Root layout
│   ├── components/                # Reusable components
│   │   ├── shared/                # Cross-feature components
│   │   ├── svgs/                  # SVG components
│   │   ├── ui/                    # UI primitives
│   │   └── view/                  # Feature-specific components
│   ├── contexts/                  # React contexts
│   ├── hooks/                     # Custom React hooks
│   ├── providers/                 # Context providers
│   ├── redux/                     # Redux store and slices
│   ├── styles/                    # Global styles
│   └── lib/                       # lIbraries and utils
├── types/                         # TypeScript definitions
└── Configuration Files
    ├── eslint.config.mjs          # ESLint configuration
    ├── next.config.ts             # Next.js configuration
    ├── package.json               # Dependencies and scripts
    ├── postcss.config.mjs         # PostCSS configuration
    ├── tsconfig.json              # TypeScript configuration
    └── vercel.json                # Vercel deployment config
```

### Key Directory Details

#### `/src/app/` - Next.js App Router

- **(auth)/** - Authentication pages (signin, signup, etc.)
- **api/** - Server-side API endpoints
- **layout.tsx** - Root layout with providers

#### `/src/components/` - Component Library

- **shared/** - Cross-feature components (charts, logos, etc.)
- **ui/** - Primitive UI components (buttons, cards, modals)
- **view/** - Feature-specific view components
- **svgs/** - SVG icon components

#### `/src/redux/` - State Management

- **store.ts** - Redux store configuration
- **slices/** - Feature-based state slices (auth, ui, settings)

## Core Architecture

### App Router Structure

The application uses Next.js 15 App Router with route groups for organization:

```typescript
app/
├── (auth)/layout.tsx              # Auth layout
├── layout.tsx                     # Root layout
└── page.tsx                       # Home page
```

### Configuration Architecture

#### Next.js Configuration (`next.config.ts`)

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  reactStrictMode: process.env.NODE_ENV === "development",
  transpilePackages: ["gsap", "@gsap/react"],
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["gsap", "@gsap/react"],
  },
};
```

#### TypeScript Configuration (`tsconfig.json`)

```typescript
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## State Management

### Redux Architecture

The application uses Redux Toolkit with a feature-based slice structure:

```typescript
// Store Configuration
export const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication state
    ui: uiReducer, // UI state (sidebar, modals)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
```

### State Structure

#### Auth Slice (`src/redux/slices/authSlice.ts`)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

Key features:

- Async thunks for login/register/logout
- Automatic localStorage and cookie synchronization
- Security-first error handling
- Type-safe selectors

#### Typed Redux Hooks

```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Authentication System

### Security Architecture

#### Multi-layer Authentication

1. **Client-side state** - Redux auth slice
2. **localStorage** - User data persistence
3. **HTTP-only cookies** - Secure token storage
4. **Middleware** - Route protection

#### Middleware Protection (`src/middleware.ts`)

```typescript
const protectedRoutes = ["/profile"];
const authRoutes = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;

  // Route protection logic
  // Security headers in production
}
```

#### Authentication Flow

1. User submits credentials
2. API validates and returns JWT
3. Token stored in cookies + localStorage
4. Redux state updated
5. Middleware protects routes
6. Auto-redirect based on auth status

### Security Features

- HTTP-only cookies for token storage
- CSRF protection via SameSite cookies
- XSS protection with Content Security Policy
- Frame protection with X-Frame-Options
- Environment-based security headers

## Routing & Middleware

### Route Structure

#### Public Routes

- `/` - Homepage

#### Protected Routes

- `/profile` - User profile
- `/settings` - User settings

#### Authentication Routes

- `/signin` - Sign in page
- `/signup` - Sign up page
- `/verify-code` - Email verification
- `/password-recovery` - Password reset

### Middleware Features

#### Route Protection

```typescript
// Redirect authenticated users from auth pages
if (token && user && authRoutes.includes(path)) {
  return NextResponse.redirect(new URL("/", request.url));
}

// Redirect unauthenticated users from protected pages
if ((!token || !user) && protectedRoutes.includes(path)) {
  return NextResponse.redirect(new URL("/signin", request.url));
}
```

#### Security Headers (Production)

```typescript
response.headers.set("X-Frame-Options", "SAMEORIGIN");
response.headers.set(
  "Content-Security-Policy",
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'nonce-console-blocker';"
);
```

### UI Component Library

#### Atomic Design Structure

- **Atoms** - Basic elements (buttons, inputs, icons)
- **Molecules** - Simple combinations (search bars, cards)
- **Organisms** - Complex components (headers, sidebars)
- **Templates** - Page layouts
- **Pages** - Complete page implementations

## Data Flow & Integration

### API Integration Pattern

#### Async Thunk Pattern

```typescript
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ credentials }, { rejectWithValue }) => {
    try {
      const response = await fetch(url, fetchOptions("POST", credentials));
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(apiError(error, "Login failed"));
    }
  }
);
```

#### Content Analysis Pipeline

1. Article content ingestion
2. AI processing (Claude/Gemini/GPT)
3. Analysis result storage
4. Real-time streaming updates
5. User interface updates

### Data Visualization

#### D3.js Integration

```typescript
// Chart components using D3
import * as d3 from 'd3';

// Custom chart components
<BarChart data={analytics} />
<LineChart data={trends} />
<PieChart data={distribution} />
```

## Build & Deployment

### Build Configuration

#### Next.js Optimizations

- **Turbopack** - Fast development builds
- **CSS Optimization** - Critical CSS inlining with Critters
- **Package Optimization** - Tree shaking for GSAP and other libraries
- **Image Optimization** - Automatic WebP conversion and responsive images

### Performance Optimizations

#### Code Splitting

- Route-based splitting with App Router
- Component-level lazy loading
- Dynamic imports for heavy libraries

#### Caching Strategy

- Static asset caching
- API response caching
- Service worker implementation

#### Bundle Optimization

- Tree shaking unused code
- Package optimization for GSAP/D3
- Critical CSS extraction

## Development Guidelines

### Code Organization Principles

1. **Feature-based organization** - Group related files together
2. **Separation of concerns** - Clear boundaries between layers
3. **Type safety** - TypeScript throughout the application
4. **Consistent naming** - PascalCase for components, camelCase for functions
5. **Error boundary usage** - Graceful error handling

### Best Practices

#### Component Development

````typescript
// Use TypeScript interfaces
interface Props {
  title: string;
  onClick: () => void;
}



#### State Management

- Keep state minimal and normalized
- Use selectors for computed values
- Handle loading and error states consistently
- Use async thunks for API calls

#### Performance

- Use React.memo for expensive components
- Implement proper key props for lists
- Lazy load routes and heavy components
- Optimize images and assets

### Development Workflow

1. **Local Development**

   ```bash
   npm run dev    # Start with Turbopack
````

2. **Code Quality**

   ```bash
   npm run lint   # ESLint checking
   ```

3. **Building**

   ```bash
   npm run build  # Production build
   npm start      # Production server
   ```

4. **Deployment**
   - Automatic deployment via Vercel
   - Environment variable configuration
   - Performance monitoring

## Conclusion

Key architectural strengths:

- **Modern tech stack** with latest React/Next.js features
- **Type-safe development** with comprehensive TypeScript usage
- **Scalable state management** with Redux Toolkit
- **Security-first approach** with multiple authentication layers
- **Performance optimization** with advanced build configurations
- **Developer experience** with fast development tools and clear patterns

This architecture is designed to scale with the application's growth while maintaining code quality and development velocity.
