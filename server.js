import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// API endpoint to list directory contents
app.get('/api/files', (req, res) => {
  try {
    const requestedPath = req.query.path || 'scr/datafiles';
    
    // Security: Only allow paths within the project directory
    const projectRoot = path.resolve(__dirname);
    const fullPath = path.resolve(projectRoot, requestedPath);
    
    if (!fullPath.startsWith(projectRoot)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Directory not found' });
    }

    // Check if it's actually a directory
    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ error: 'Path is not a directory' });
    }

    // Read directory contents
    const items = [];
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      const itemPath = path.join(fullPath, entry.name);
      const relativePath = path.join(requestedPath, entry.name).replace(/\\/g, '/');
      
      if (entry.isDirectory()) {
        items.push({
          name: entry.name,
          type: 'folder',
          path: relativePath,
          size: 0
        });
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.xml')) {
        const fileStats = fs.statSync(itemPath);
        items.push({
          name: entry.name,
          type: 'file',
          path: relativePath,
          size: fileStats.size
        });
      }
    }

    res.json({ items });
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
});

app.listen(PORT, () => {
  console.log(`File API server running on http://localhost:${PORT}`);
});
