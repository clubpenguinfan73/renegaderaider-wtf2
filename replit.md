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
- **Netlify DB**: Serverless PostgreSQL solution powered by Neon
- **Drizzle ORM**: Type-safe database operations and migrations

### UI Libraries
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production

### Netlify Integration
- **Netlify Functions**: Serverless API endpoints
- **Netlify DB**: Integrated PostgreSQL database
- **Netlify CLI**: Development and deployment tooling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `/dist/public`
- **Backend**: ESBuild bundles Netlify Functions to `/dist/functions`
- **Environment**: Supports both development and production modes

### Netlify Configuration
- **Development**: Uses Vite dev server with proxy to Express API
- **Production**: Serves static files from CDN with Netlify Functions API
- **Database**: Automatic `DATABASE_URL` configuration via Netlify DB
- **Build**: Custom build script handles both frontend and function bundling

### Database Setup
To set up Netlify DB for your deployment:
1. Deploy to Netlify (database will be auto-provisioned)
2. Claim your database within 7 days via Netlify dashboard
3. Database tables will be created automatically via migration script

### Key Features
- **Gaming Theme**: Purple and cyan color scheme with gaming-inspired animations
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Admin Panel**: Toggle-able admin interface with secure authentication
- **Link Management**: Create, edit, and delete social media links
- **Profile Customization**: Edit username, bio, and upload profile/background images (including GIFs)
- **Website Music**: Upload and control background music with visitor controls
- **Entrance Animation**: Smooth entrance overlay with localStorage persistence
- **Secure Authentication**: Admin access protected with username/password (Cat / Cat@Renagde.wtf73)
- **Persistent Storage**: Netlify DB integration for data persistence across deployments
- **Live Discord Integration**: Real-time Discord profile display with 24/7 connection showing authentic avatar, username, and badges
- **Animated Browser Titles**: Dynamic typewriter effect in browser tab titles
- **Video Background Support**: Full video background support (.mp4, .webm, .mov formats) with automatic playback and looping
- **Audio/Video Sync**: Synchronized audio control for video backgrounds with volume controls
- **Authentic Discord Badges**: Official Discord badge SVG icons for proper badge display

## Recent Changes (July 2025)
- **July 11, 2025**: Removed theme template system per user request to avoid overlap with custom backgrounds
- **July 11, 2025**: Added comprehensive video background support with multiple format compatibility
- **July 11, 2025**: Implemented audio synchronization for video backgrounds with volume controls
- **July 11, 2025**: Updated Discord badge system with official SVG icons for proper rendering
- **July 11, 2025**: Enhanced video background controls with auto-play and mute functionality
- **July 11, 2025**: Implemented real-time Spotify integration with live track display, album art, and progress bars
- **July 11, 2025**: Added Spotify authentication helper at /spotify-auth endpoint for easy token generation
- **July 11, 2025**: Created comprehensive OAuth flow handling for Spotify API credentials
- **July 11, 2025**: Fixed and perfected animated title system with progressive word building (e.g., "m,me,meo,meow,meow!")
- **July 11, 2025**: Added manual speed control slider for animated titles with real-time adjustment capability
- **July 12, 2025**: Completed comprehensive codebase review and deployment preparation
- **July 12, 2025**: Fixed music upload functionality with proper MP3/WAV/OGG support and error handling
- **July 12, 2025**: Updated Netlify function with all Discord and Spotify endpoints for production deployment
- **July 12, 2025**: Enhanced database storage implementation with complete profile field handling
- **July 12, 2025**: Created production deployment package with all features verified and working
- **July 12, 2025**: Fixed black screen deployment issue by updating client/index.html with working frontend that loads from API
- **July 12, 2025**: Resolved API function routing problems for proper Netlify deployment
- **July 12, 2025**: Successfully deployed working version with profile and links loading from live API
- **July 12, 2025**: COMPLETE BLACK SCREEN FIX - Replaced problematic HTML with bulletproof version
- **July 12, 2025**: Eliminated React/HTML conflicts, fixed API paths, added comprehensive error handling
- **July 12, 2025**: Created robust data loading system with immediate display and multiple fallbacks
- **July 12, 2025**: Verified all API endpoints working, site ready for final deployment
- **July 12, 2025**: Fixed wave and pulse username effects with character-by-character animation
- **July 12, 2025**: Enhanced snow effect with realistic CSS snowflakes instead of emojis
- **July 12, 2025**: Improved rain effect with realistic droplets and gradient styling
- **July 12, 2025**: Added comprehensive effect preview system in admin panel
- **July 12, 2025**: Resolved CSS animation conflicts and warnings

The application is designed to be easily deployable to Netlify with automatic database provisioning and serverless architecture.