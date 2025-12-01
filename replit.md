# Artisan Market E-Commerce Platform

## Overview

Artisan Market is a modern e-commerce platform for selling handcrafted local goods. The application features a product catalog with categories (Pottery, Kitchen, Home Decor, Bath & Body), shopping cart functionality, product reviews, and a complete checkout flow. Built with React on the frontend and Express on the backend, it emphasizes a clean, mobile-first design that balances professional credibility with an approachable local artisan aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing instead of React Router

**UI Component Strategy:**
- Shadcn UI component library (New York style variant) built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Component aliases configured for clean imports (`@/components`, `@/lib`, `@/hooks`)
- Design system follows modern e-commerce patterns inspired by Shopify and DTC brands

**State Management:**
- TanStack Query (React Query) for server state management with automatic caching and refetching
- React Context API for cart state management with localStorage persistence
- Form state handled by React Hook Form with Zod validation

**Typography & Design:**
- Google Fonts: Inter for UI/body text, Playfair Display for headings
- Responsive typography scale using Tailwind's text sizing
- Custom CSS variables for theme colors supporting light/dark modes

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for the API server
- HTTP server using Node's native `http` module
- Middleware stack: JSON body parsing, URL encoding, static file serving

**API Design:**
- RESTful endpoints for products, reviews, and orders
- Route structure organized in `server/routes.ts`
- Query parameter support for filtering (category, featured, search)
- In-memory storage implementation via `server/storage.ts` with interface-based design for future database migration

**Data Layer:**
- Drizzle ORM configured for PostgreSQL (via Neon serverless driver)
- Schema defined in `shared/schema.ts` with tables for products, reviews, and orders
- Zod schemas generated from Drizzle tables for runtime validation
- Migration support via Drizzle Kit (`drizzle.config.ts`)

**Build & Deployment:**
- Custom build script (`script/build.ts`) that:
  - Builds client with Vite
  - Bundles server with esbuild
  - Selectively externalizes dependencies (allowlist strategy to reduce cold start times)
- Production mode serves static files from `dist/public`
- Development mode uses Vite middleware for HMR

### External Dependencies

**Database:**
- PostgreSQL via Neon serverless (`@neondatabase/serverless`)
- Connection string expected in `DATABASE_URL` environment variable
- Drizzle ORM for type-safe database queries

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components (accordion, dialog, dropdown, select, etc.)
- Embla Carousel for image carousels
- CMDK for command palette patterns
- Lucide React for icon system

**Form & Validation:**
- React Hook Form for performant form state management
- Zod for schema validation
- `@hookform/resolvers` for Zod integration with React Hook Form

**Styling:**
- Tailwind CSS v3 with PostCSS
- `class-variance-authority` for variant-based component styling
- `clsx` and `tailwind-merge` for conditional class composition

**State & Data Fetching:**
- TanStack Query v5 for server state
- Custom query client configuration with error handling
- Fetch API for HTTP requests

**Development Tools:**
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner (development only)
- TypeScript strict mode with path aliases
- ESBuild for server bundling with selective dependency bundling

**Asset Management:**
- Static assets served from `attached_assets` directory
- Image imports via Vite aliases (`@assets`)
- Stock images for product catalog and hero sections