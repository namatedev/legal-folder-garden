# replit.md

## Overview

This is a full-stack legal case management application built with React, TypeScript, Express, and PostgreSQL. The application provides a comprehensive system for managing legal cases with features like case numbering, nomenclature-based categorization, and case status tracking. The frontend uses modern React patterns with shadcn/ui components and Tailwind CSS for styling, while the backend is built with Express and uses Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: React Router DOM for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Database**: PostgreSQL (configured for Neon Database)
- **Migrations**: Drizzle Kit for schema management
- **Schema Location**: `shared/schema.ts` for type sharing between frontend and backend

## Key Components

### Frontend Components
- **LegalCaseList**: Main case listing with grid/list view toggle and filtering
- **LegalCaseCard**: Individual case display in card format
- **LegalCaseListView**: Table-based case listing
- **AddCaseForm**: Form for creating new legal cases
- **CaseNumberManager**: Component for managing case number sequences
- **UI Components**: Comprehensive shadcn/ui component library

### Backend Components
- **Storage Interface**: Abstract storage layer with in-memory implementation
- **Routes**: Express route handlers (currently minimal setup)
- **Vite Integration**: Development server with HMR support

### Shared Components
- **Schema**: Drizzle schema definitions shared between frontend and backend
- **Types**: TypeScript type definitions for legal cases and related entities

## Data Flow

1. **Case Management**: Users can create, view, edit, and delete legal cases
2. **Case Numbering**: Automatic case number generation based on year, nomenclature code, and incremental numbering
3. **Nomenclature System**: Predefined legal case categories with French and Arabic labels
4. **Status Tracking**: Case status management (En cours, Terminé, En attente, Annulé)
5. **Priority System**: Case priority levels (Haute, Moyenne, Basse)

### Current Data Storage
- **Development**: In-memory storage with interface for easy database integration
- **Production Ready**: Configured for PostgreSQL with Drizzle ORM

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React Router, React Hook Form
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: TanStack Query for server state
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Express**: Web server framework
- **Database**: Drizzle ORM with PostgreSQL support
- **Session**: Connect-pg-simple for PostgreSQL session store
- **Development**: TSX for TypeScript execution

### Development Dependencies
- **Build Tools**: Vite with React plugin
- **Database Tools**: Drizzle Kit for migrations
- **Replit Integration**: Replit-specific plugins for development

## Deployment Strategy

### Development
- **Frontend**: Vite development server with HMR
- **Backend**: Express server with automatic TypeScript compilation
- **Database**: PostgreSQL connection via environment variables

### Production
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Static Files**: Frontend built to `dist/public`, served by Express
- **Database**: PostgreSQL with connection pooling
- **Environment**: NODE_ENV-based configuration

### Configuration
- **Database**: Configured via `DATABASE_URL` environment variable
- **Paths**: TypeScript path aliases for clean imports
- **Assets**: Vite alias configuration for asset handling

### Key Features Implemented
1. **Legal Case CRUD Operations**: Complete create, read, update, delete functionality
2. **Case Numbering System**: Automatic generation based on nomenclature and year
3. **Multi-language Support**: French/Arabic nomenclature labels
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Form Validation**: Zod schemas for data validation
6. **Toast Notifications**: User feedback system
7. **Search and Filtering**: Case search and status filtering
8. **View Modes**: Grid and table view options

### Database Schema
- **Users Table**: Basic user management with username/password
- **Future Extensions**: Ready for legal case tables and relationships

The application follows modern full-stack practices with a clean separation of concerns, type safety throughout, and a scalable architecture ready for production deployment.