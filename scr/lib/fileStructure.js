// File structure utility for the custom file picker
// This provides dynamic, real-time folder/file structure from the datafiles directory

export async function getFileStructure(path = "scr/datafiles") {
  try {
    // Dynamic file structure loading using the directory listing API
    const apiUrl = `http://localhost:3001/api/files?path=${encodeURIComponent(path)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error getting file structure:", error);
    
    // If API fails, try to provide a helpful error message
    throw new Error(`Failed to load directory contents: ${error.message}. Make sure the API server is running on port 3001.`);
  }
}

// Function to check if a file exists and can be loaded
export async function loadFileFromPath(filePath) {
  try {
    const response = await fetch(`/${filePath}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Failed to load file: ${error.message}`);
  }
}

// Utility to expand the file manifest as more files are added
export function addToFileManifest(folderPath, folders = [], files = []) {
  // This would be used to dynamically add new folders/files to the manifest
  // For now, it's a placeholder for future expansion
  console.log(`Adding to manifest: ${folderPath}`, { folders, files });
}
