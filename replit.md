# Replit.md - Gaming Profile Link Tree Application

## Overview

This is a full-stack web application built as a gaming-themed "link tree" style personal profile page. The application features a modern, gaming-inspired design with an entrance animation and allows users to display their profile information along with customizable social media and platform links.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack
- **Frontend**: React with TypeScript, Vite build tool
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Animation**: Framer Motion for smooth transitions
- **Icons**: Font Awesome for social media icons

### Architecture Pattern
The application follows a monorepo structure with clear separation between client, server, and shared code:
- **Client**: React frontend in `/client` directory
- **Server**: Express API in `/server` directory  
- **Shared**: Common schemas and types in `/shared` directory

## Key Components

### Frontend Architecture
- **Component Structure**: Uses shadcn/ui component library for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for API state with custom query client
- **Styling**: Tailwind CSS with custom gaming theme colors and design tokens
- **Animation**: Framer Motion for entrance overlay and smooth transitions

### Backend Architecture
- **API Design**: RESTful endpoints for profile and link management
- **Data Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage**: In-memory storage implementation with interface for future database integration
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Database Schema
- **Users**: Basic user authentication structure
- **Profiles**: User profile information (username, bio, images)
- **Links**: Social media and platform links with customizable icons and colors

## Data Flow

1. **Initial Load**: Application checks localStorage for entrance overlay preference
2. **Profile Data**: Fetches user profile and links from API endpoints
3. **Admin Features**: Toggle admin panel for editing profile and managing links
4. **Real-time Updates**: Uses TanStack Query for optimistic updates and cache invalidation

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL solution
- **Drizzle ORM**: Type-safe database operations and migrations

### UI Libraries
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `/dist/public`
- **Backend**: ESBuild bundles Node.js server to `/dist`
- **Environment**: Supports both development and production modes

### Environment Configuration
- **Development**: Uses Vite dev server with proxy to Express API
- **Production**: Serves static files from Express with API routes
- **Database**: Requires `DATABASE_URL` environment variable

### Key Features
- **Gaming Theme**: Purple and cyan color scheme with gaming-inspired animations
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Admin Panel**: Toggle-able admin interface for content management
- **Link Management**: Create, edit, and delete social media links
- **Profile Customization**: Edit username, bio, and upload profile/background images
- **Entrance Animation**: Smooth entrance overlay with localStorage persistence

The application is designed to be easily deployable to platforms like Replit, with built-in development tools and production optimization.