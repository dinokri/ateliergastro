# Production Deployment Guide

This guide describes how to build, containerize, and deploy Atelier Bistro to production.

## Build Steps

```bash
# 1. Install production dependencies
npm install

# 2. Compile TypeScript and Vite production assets
npm run build
```

The compiled static assets will be located in `/dist`.

## Cloud Run & Containerized Hosting

The application is fully compatible with Google Cloud Run, Vercel, Netlify, or Docker:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Custom Domain & SSL Setup

1. In Google Cloud / Hosting Provider, point DNS `A` records to the assigned IP address.
2. Configure `CNAME` for `www.atelierbistro.ba`.
3. Verify SSL certificate auto-generation.
4. Update `APP_URL` and Google Maps allowed HTTP referrers in Google Cloud Console.
