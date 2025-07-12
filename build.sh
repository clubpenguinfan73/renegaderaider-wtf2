#!/bin/bash

# Build the frontend
echo "Building frontend..."
npm run build

# Copy _redirects file to output directory
echo "Copying _redirects file..."
mkdir -p dist/public
cp client/public/_redirects dist/public/

# Build the Netlify function
echo "Building Netlify functions..."
mkdir -p dist/functions
npx esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/functions

# Copy migration files
echo "Copying migration files..."
mkdir -p dist/migrations
cp migrations/*.sql dist/migrations/

echo "Build completed successfully!"