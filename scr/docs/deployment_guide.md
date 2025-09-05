# Deployment Guide

> Step-by-step instructions for deploying the XML Viewer React app to a Linux-based shared hosting environment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build the Production Bundle](#build-the-production-bundle)
3. [Prepare Files for Upload](#prepare-files-for-upload)
4. [Upload to Shared Hosting](#upload-to-shared-hosting)
5. [Configure SPA Routing](#configure-spa-routing)
6. [Verify Deployment](#verify-deployment)
7. [Troubleshooting](#troubleshooting)
8. [References](#references)

---

## Prerequisites

- Node.js and npm installed locally
- Access to your shared hosting account (FTP/SFTP or control panel)
- Your hosting supports static files and `.htaccess` (for SPA routing)

---

## Build the Production Bundle

1. Open your project directory in the terminal.
2. Run the build command:
   ```bash
   npm run build
   ```
   This generates a `dist/` folder containing all static files for deployment.

---

## Prepare Files for Upload

- The `dist/` folder contains:
  - `index.html`
  - Asset files (JS, CSS, images, etc.)
  - Any static files referenced by your app (e.g., XML, Markdown docs)
- Ensure all required static assets (e.g., `scr/datafiles`, `scr/docs`) are included in the build or copied to the output directory if needed.

---

## Upload to Shared Hosting

1. Connect to your hosting account using FTP/SFTP or your control panel's file manager.
2. Navigate to your web root directory (commonly `public_html`, `www`, or similar).
3. Upload all contents of the `dist/` folder (not the folder itself, just its contents) into the web root.

---

## Configure SPA Routing

If your app uses client-side routing (deep links), add a `.htaccess` file in your web root with the following content:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

This ensures all routes are served by `index.html`, allowing your React app to handle navigation.

---

## Verify Deployment

1. Visit your website URL in a browser.
2. Confirm the app loads and functions correctly.
3. Test navigation, file loading, and deep links.

---

## Troubleshooting

- **Blank page or 404 errors:**  
  Ensure all files from `dist/` are uploaded and `.htaccess` is configured for SPA routing.
- **Static assets not loading:**  
  Check asset paths and verify files are present on the server.
- **Permission issues:**  
  Set correct file permissions (usually 644 for files, 755 for folders).
- **XML/Markdown files not accessible:**  
  Make sure these files are uploaded and paths in your app match their location.

---

## References

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://react.dev/learn/deployment)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shared Hosting Documentation](https://www.namecheap.com/support/knowledgebase/article.aspx/9682/2218/how-to-upload-files-to-your-website/)
- [.htaccess for SPA Routing](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually)

---
