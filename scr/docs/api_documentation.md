# API Documentation

> This document describes the backend API endpoints provided by the XML Viewer Express server for file operations and directory listing.

---

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Endpoints](#endpoints)
   - [GET /api/files](#get-apifiles)
4. [Error Handling](#error-handling)
5. [Security Considerations](#security-considerations)
6. [CORS Configuration](#cors-configuration)
7. [Example Usage](#example-usage)
8. [Testing the API](#testing-the-api)
9. [References](#references)

---

## Overview

The XML Viewer backend provides a simple Express.js API server that serves file listing functionality. This API is primarily used by the frontend to enable folder browsing and file selection capabilities.

---

## Base URL

The API server runs on **port 3001** by default:

```
http://localhost:3001
```

---

## Endpoints

### GET /api/files

Returns a list of files in the `scr/datafiles` directory with their metadata.

**URL:** `/api/files`

**Method:** `GET`

**Response Format:** JSON array of file objects

**Response Example:**
```json
[
  {
    "name": "example.xml",
    "size": 1024,
    "type": "file",
    "path": "scr/datafiles/example.xml"
  },
  {
    "name": "subdirectory",
    "size": 4096,
    "type": "directory",
    "path": "scr/datafiles/subdirectory"
  }
]
```

**Response Fields:**
- `name`: File or directory name
- `size`: Size in bytes
- `type`: Either "file" or "directory"
- `path`: Full relative path from project root

**Error Responses:**
- `500 Internal Server Error`: If directory cannot be read
- `400 Bad Request`: If path traversal attempt detected

**Security Notes:**
- Path traversal attacks are prevented by validating the directory path
- Only files within `scr/datafiles` and its subdirectories are accessible

---

## Error Handling

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (path traversal detected) |
| 500 | Internal Server Error (directory read failure) |

Error responses include a JSON object with error details:
```json
{
  "error": "Error message description"
}
```

---

## Security Considerations

### Path Traversal Prevention
The API includes security measures to prevent directory traversal attacks:
- Validates that requested paths stay within the `scr/datafiles` directory
- Rejects paths containing `../` or other traversal patterns
- Uses path normalization to ensure security

### CORS Configuration
The server is configured with CORS to allow requests from the frontend development server (typically http://localhost:5173).

---

## CORS Configuration

The server is configured with the following CORS settings:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Vite development server
  optionsSuccessStatus: 200
}));
```

This allows cross-origin requests from the frontend during development.

---

## Example Usage

### Using curl to test the API
```bash
curl http://localhost:3001/api/files
```

### Expected response:
```json
[
  {
    "name": "LD.LD.PARAM.xml",
    "size": 24576,
    "type": "file",
    "path": "scr/datafiles/LD.LD.PARAM.xml"
  },
  {
    "name": "PM.LD.PARAM.xml",
    "size": 32768,
    "type": "file",
    "path": "scr/datafiles/PM.LD.PARAM.xml"
  }
]
```

### JavaScript fetch example:
```javascript
async function getFiles() {
  try {
    const response = await fetch('http://localhost:3001/api/files');
    const files = await response.json();
    console.log('Available files:', files);
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}
```

---

## Testing the API

### Start the API server:
```bash
npm run api
```

### Verify the server is running:
```bash
curl http://localhost:3001/api/files
```

### Expected behavior:
- Returns JSON array of files in `scr/datafiles`
- Handles errors gracefully with appropriate status codes
- Prevents path traversal attacks

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [Node.js File System API](https://nodejs.org/api/fs.html)
- [CORS Middleware](https://www.npmjs.com/package/cors)
- [Path Module Documentation](https://nodejs.org/api/path.html)

---

**Note:** This API is designed for development use with the XML Viewer frontend. For production deployment, consider additional security measures such as authentication, rate limiting, and more restrictive CORS settings.