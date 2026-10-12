export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

export const isValidUrl = (value) => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isValidImage = (file) => {
  if (!file) return false;
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowed.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5MB
};

export const isValidPdf = (file) => {
  if (!file) return false;
  return file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024; // 10MB
};

export const maxLength = (value, max) => !value || String(value).length <= max;
