// src/components/icons.jsx
import React from "react";

export const Icon = {
  Logo: () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#g)" />
      <path d="M7 16l5-8m5 8l-5-8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M11 4a7 7 0 105.29 12l3.4 3.4 1.42-1.42-3.4-3.4A7 7 0 0011 4zm0 2a5 5 0 110 10A5 5 0 0111 6z"/></svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M12 3l4 4h-3v6h-2V7H8l4-4zm-7 12h14v4H5v-4zm-2 2a2 2 0 002 2h14a2 2 0 002-2v-4h-7v2H9v-2H3v4z"/></svg>
  ),
  Cog: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4l-1.7-.98.3-1.95-2.02-2.02-1.95.3L14 3h-4l-.63 3.35-1.95-.3L5.4 8.07l.3 1.95L4 12l1.7.98-.3 1.95 2.02 2.02 1.95-.3L10 21h4l.63-3.35 1.95.3 2.02-2.02-.3-1.95L21 12z"/></svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.8 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.22 19.78l1.8 1.79 1.79-1.8-1.79-1.79-1.8 1.8zM20 13h3v-2h-3v2zM19.78 4.22l-1.8-1.79-1.79 1.8 1.79 1.79 1.8-1.8zM11 4h2V1h-2v3zm7.78 15.56l-1.8-1.79-1.79 1.8 1.79 1.79 1.8-1.8zM12 7a5 5 0 100 10A5 5 0 0012 7z"/></svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M20 12.41A8 8 0 1111.59 4 6 6 0 0020 12.41z"/></svg>
  ),
  Link: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M10.59 13.41a1.996 1.996 0 010-2.82l3.18-3.18a2 2 0 112.83 2.83l-1.42 1.41-1.41-1.41 1.41-1.41-.01-.01-3.18 3.18 1.41 1.41-1.41 1.41-1.41-1.41zM7.05 17.66a4 4 0 010-5.66l1.41-1.41 1.41 1.41-1.41 1.41a2 2 0 002.83 2.83l1.41-1.41 1.41 1.41-1.41 1.41a4 4 0 01-5.65 0z"/></svg>
  ),
  Folder: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M10 4l2 2h7a2 2 0 012 2v1H3V6a2 2 0 012-2h5zM3 10h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z"/></svg>
  ),
  File: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm1 7H8V7h7v2z"/></svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M9 6l6 6-6 6z"/></svg>
  )
};
