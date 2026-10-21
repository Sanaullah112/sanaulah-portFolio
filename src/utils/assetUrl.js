import { BACKEND_ORIGIN } from '../config/endpoints';

/**
 * Converts a raw stored file path or URL into a fully-qualified, browser-accessible URL.
 * Handles:
 * - Stored relative paths: "/uploads/projects/xyz.png" or "uploads/projects/xyz.png"
 * - Windows-style backslashes: "uploads\\projects\\xyz.png"
 * - Old localhost URLs stored in the DB: "http://localhost:5000/uploads/..." -> rewritten to production backend origin
 * - Direct external URLs (Cloudinary, Unsplash, etc.): left untouched
 */
export const getAssetUrl = (assetUrl) => {
  if (typeof assetUrl !== 'string' || !assetUrl.trim()) return '';

  const clean = assetUrl.trim().replace(/\\/g, '/');

  // If already an absolute HTTP/HTTPS URL
  if (/^https?:\/\//i.test(clean)) {
    // If the database has an old localhost URL and we are configured with a real backend origin
    if (
      (clean.includes('localhost:5000') || clean.includes('127.0.0.1:5000')) &&
      BACKEND_ORIGIN &&
      !BACKEND_ORIGIN.includes('localhost')
    ) {
      const pathname = clean.replace(/^https?:\/\/[^/]+/i, '');
      return `${BACKEND_ORIGIN}${pathname}`;
    }
    return clean;
  }

  // Ensure relative path starts with a single slash
  const normalizedPath = clean.startsWith('/') ? clean : `/${clean}`;

  // If a backend origin is known (Render URL or localhost:5000), use it
  if (BACKEND_ORIGIN) {
    return `${BACKEND_ORIGIN}${normalizedPath}`;
  }

  // Fallback to window origin if no backend origin configured
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${normalizedPath}`;
  }

  return normalizedPath;
};
