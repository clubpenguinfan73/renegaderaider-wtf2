#!/bin/bash

# Build the frontend
echo "Building frontend..."
npm run build

# Build the Netlify function
echo "Building Netlify functions..."
mkdir -p dist/functions
npx esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/functions

echo "Build completed successfully!"