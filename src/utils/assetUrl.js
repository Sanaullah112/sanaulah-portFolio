import { BASE_URL } from '../config/endpoints';

const backendBaseUrl = BASE_URL.replace(/\/api\/?$/i, '');

export const getAssetUrl = (assetUrl) => {
  if (typeof assetUrl !== 'string' || !assetUrl) return assetUrl;

  const normalizedUrl = assetUrl.replace(/\\/g, '/');
  const url = new URL(normalizedUrl, window.location.origin);
  if (!url.pathname.startsWith('/uploads/')) return assetUrl;

  const backendUrl = new URL(backendBaseUrl, window.location.origin);
  return `${backendUrl.origin}${url.pathname}${url.search}${url.hash}`;
};
