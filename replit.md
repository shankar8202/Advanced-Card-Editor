# Overview

This is a browser-based design editor focused on business card design - a simplified version of Canva/Figma. The application allows users to create, edit, and export business cards with various design elements including text, images, shapes, and icons. Built with React, TypeScript, Redux Toolkit, and Tailwind CSS for the frontend, with an Express.js backend and PostgreSQL database using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **State Management**: Redux Toolkit for global state management of editor elements, selection, and history
- **UI Components**: shadcn/ui component library with Radix UI primitives and Tailwind CSS styling
- **Routing**: Wouter for lightweight client-side routing
- **Query Management**: TanStack React Query for server state management

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Configured for connect-pg-simple session store
- **Development Server**: Vite middleware integration for hot module replacement

## Design Editor Features
- **Canvas System**: Fixed-size business card canvas (600×350px) with zoom controls
- **Element Types**: Text blocks, images, shapes (rectangles, circles), and SVG icons
- **Element Manipulation**: Drag-and-drop positioning, resizing with handles, rotation, and deletion
- **Layer Management**: Sidebar panel for element reordering and selection
- **Properties Panel**: Dynamic controls for element-specific properties (fonts, colors, sizes)
- **Export Functionality**: PNG export using html2canvas library
- **Undo/Redo**: History management for design changes

## Data Storage
- **Database Schema**: PostgreSQL with users table for authentication
- **In-Memory Storage**: MemStorage implementation for development/testing
- **Type Safety**: Drizzle-Zod integration for runtime schema validation

## Styling System
- **CSS Framework**: Tailwind CSS with custom CSS variables for theming
- **Component Styling**: Class Variance Authority (CVA) for component variants
- **Design Tokens**: Comprehensive color system and spacing using CSS custom properties
- **Font Integration**: Google Fonts (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full TypeScript support across frontend and backend
- **Vite**: Build tool and development server with HMR

## UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with PostCSS
- **shadcn/ui**: Pre-built component library using Radix UI and Tailwind
- **Lucide React**: Icon library for UI elements

## State Management
- **Redux Toolkit**: Simplified Redux for global state management
- **TanStack React Query**: Server state management and caching

## Backend Infrastructure
- **Express.js**: Web framework for API endpoints
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database provider
- **ESBuild**: Fast JavaScript bundler for production builds

## Development Tools
- **Replit Integration**: Vite plugins for Replit environment support
- **TSX**: TypeScript execution for development server
- **html2canvas**: Canvas export functionality for design export

## Form and Validation
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## Utility Libraries
- **clsx & tailwind-merge**: Conditional CSS class composition
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation
- **class-variance-authority**: Component variant management