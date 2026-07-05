# Production Deployment Guide

Jnan Store compiles to a bundle of optimized static assets (HTML, JS, CSS, and images). This guide outlines the steps to build, configure, and deploy the application to production hosting portals.

---

## 1. Production Build Process

To compile the application, run:
```bash
npm run build
```

This command executes two steps:
1. **TypeScript Typecheck (`tsc`)**: Runs the compiler in non-emitting mode to verify that the code contains no syntax or type errors.
2. **Vite Production Bundler (`vite build`)**: Compiles, minifies, and bundles assets into the `/dist` directory.

---

## 2. Environment Configuration

The application validates environment variables at boot using the Zod schema defined in `src/config/env.ts`. Ensure these keys are configured in your hosting environment:

| Key | Format | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_URL` | `z.string().url()` | Backend REST API endpoint base URL | `https://api.jnan-store.com/v1` |
| `VITE_APP_NAME` | `z.string()` | Storefront user-facing brand name | `Jnan Store` |

---

## 3. SPA Client Routing Configuration

Since this is a Single Page Application (SPA) using React Router, all client-side URL requests must be redirected to `index.html`. If these redirect rules are missing, navigating directly to `/shop` or `/profile` will return a HTTP 404 error.

### Vercel Integration (`vercel.json`)
Create a `vercel.json` file in your root folder:
```json
{
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify Integration (`_redirects`)
Create a file named `_redirects` in your public directory:
```text
/*    /index.html   200
```

---

## 4. Static Hosting Solutions

### Cloud Platforms (Vercel & Netlify)
1. Link your GitHub repository to the hosting platform.
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure your Environment Variables in the platform's dashboard.
4. Trigger the deployment.

### AWS S3 & CloudFront
1. Upload the contents of the `/dist` directory directly to your S3 bucket.
2. Enable **Static Web Hosting** on the S3 bucket, setting the index document to `index.html`.
3. Configure a **CloudFront Distribution** pointing to the S3 bucket.
4. Set up a custom error response in CloudFront:
   - **HTTP Error Code**: `404`
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: `200`
   - This ensures React Router can handle routing for deep links.

---

## 5. Dockerization Blueprint

For setups that require containerized deployments (such as Kubernetes or AWS ECS), use this production-ready **Dockerfile** with **Nginx** configuration.

### A. Dockerfile (`Dockerfile.production`)
Create a Dockerfile in your root folder:
```dockerfile
# Step 1: Build Phase
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Step 2: Nginx Static Server Phase
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### B. Nginx Routing Configuration (`nginx.conf`)
Create an Nginx configuration file to support SPA routing:
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```
