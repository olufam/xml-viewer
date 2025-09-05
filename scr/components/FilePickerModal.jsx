import React, { useEffect, useState } from "react";
import { getFileStructure, loadFileFromPath } from "../lib/fileStructure";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="currentColor" d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="currentColor" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
    </svg>
  );
}

export default function FilePickerModal({ open, onClose, onFileSelect }) {
  const [currentPath, setCurrentPath] = useState("scr/datafiles");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Block body scroll when modal is open
  useEffect(() => {
    const orig = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Load folder contents when path changes
  useEffect(() => {
    if (!open) return;
    loadFolderContents(currentPath);
  }, [open, currentPath]);

  const loadFolderContents = async (path) => {
    setLoading(true);
    setError("");
    setItems([]);

    try {
      // For now, we'll use a static manifest approach
      // In a real implementation, you might want to create an API endpoint
      const folderStructure = await getFolderStructure(path);
      setItems(folderStructure);
    } catch (err) {
      setError(`Failed to load folder contents: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getFolderStructure = async (path) => {
    return await getFileStructure(path);
  };

  const handleItemClick = async (item) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
    } else if (item.type === "file" && item.name.toLowerCase().endsWith(".xml")) {
      try {
        // Load the file content using our utility
        const text = await loadFileFromPath(item.path);
        
        // Create a File-like object for compatibility with existing loadFile function
        const file = new File([text], item.name, { type: "application/xml" });
        onFileSelect(file);
        onClose();
      } catch (err) {
        setError(`Failed to load file: ${err.message}`);
      }
    }
  };

  const handleBack = () => {
    const pathParts = currentPath.split("/");
    if (pathParts.length > 2) { // Don't go above scr/datafiles
      pathParts.pop();
      setCurrentPath(pathParts.join("/"));
    }
  };

  const canGoBack = currentPath !== "scr/datafiles";
  const currentFolderName = currentPath.split("/").pop();

  // Sorting functionality
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get file size (estimated for XML files)
  const getEstimatedFileSize = async (filePath) => {
    try {
      const response = await fetch(`/${filePath}`, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength) : Math.random() * 50000 + 5000; // Fallback estimate
    } catch {
      return Math.random() * 50000 + 5000; // Random estimate between 5-55KB
    }
  };

  // Filter and sort items based on search query and sort criteria
  const sortedItems = React.useMemo(() => {
    // First filter items based on search query
    let filteredItems = items;
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(query)
      );
    }

    // Then sort the filtered items
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "name") {
        // Alphanumeric sorting
        comparison = a.name.localeCompare(b.name, undefined, { 
          numeric: true, 
          sensitivity: 'base' 
        });
      } else if (sortBy === "size") {
        comparison = (a.size || 0) - (b.size || 0);
      } else if (sortBy === "type") {
        // Folders first, then files
        if (a.type === "folder" && b.type === "file") comparison = -1;
        else if (a.type === "file" && b.type === "folder") comparison = 1;
        else comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [items, sortBy, sortOrder, searchQuery]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[92vw] max-w-3xl max-h-[70vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="flex items-center gap-3">
            {canGoBack && (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
                title="Go back"
              >
                <BackIcon /> Back
              </button>
            )}
            <div className="text-sm text-slate-300">
              {currentFolderName === "datafiles" ? "Select XML File" : `Folder: ${currentFolderName}`}
            </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800"
            aria-label="Close file picker"
            title="Close"
          >
            <XIcon /> Close
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                title="Clear search"
              >
                <XIcon />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto h-[calc(70vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-slate-400">Loading...</div>
            </div>
          )}

          {error && (
            <div className="text-sm text-rose-300 border border-rose-800/50 bg-rose-900/20 rounded-md p-3 mb-4">
              {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-slate-400">No XML files found in this folder.</div>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="border border-slate-700 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-800/50 border-b border-slate-700 px-3 py-2 grid grid-cols-12 gap-3 text-xs font-medium text-slate-400">
                <div className="col-span-1 flex items-center">
                  <button
                    onClick={() => handleSort('type')}
                    className="hover:text-slate-200 transition-colors"
                  >
                    Type
                  </button>
                </div>
                <div className="col-span-7 flex items-center">
                  <button
                    onClick={() => handleSort('name')}
                    className="hover:text-slate-200 transition-colors"
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
                <div className="col-span-4 flex items-center justify-end">
                  <button
                    onClick={() => handleSort('size')}
                    className="hover:text-slate-200 transition-colors"
                  >
                    Size {sortBy === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-slate-700">
                {sortedItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    className="w-full px-3 py-2 grid grid-cols-12 gap-3 hover:bg-slate-800/40 text-left transition-colors items-center"
                  >
                    <div className="col-span-1 text-slate-400 flex justify-center">
                      {item.type === "folder" ? <FolderIcon /> : <FileIcon />}
                    </div>
                    <div className="col-span-7 text-sm text-slate-200 truncate">
                      {item.name}
                    </div>
                    <div className="col-span-4 text-xs text-slate-400 text-right">
                      {item.type === "folder" ? "--" : formatFileSize(item.size)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
