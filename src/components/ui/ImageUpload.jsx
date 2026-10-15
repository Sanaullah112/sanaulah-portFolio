import { useCallback, useState } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { isValidImage } from '../../utils/validators';
import { getAssetUrl } from '../../utils/assetUrl';

/**
 * Drag & drop image upload with preview.
 * value: existing image URL (string) or null
 * onChange(file) is called with the raw File object
 */
const ImageUpload = ({ value, onChange, label = 'Image', error }) => {
  const [preview, setPreview] = useState(getAssetUrl(value) || null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      if (!isValidImage(file)) {
        toast.error('Please upload a valid image (jpg, png, webp, gif) under 5MB');
        return;
      }
      setPreview(URL.createObjectURL(file));
      onChange(file);
    },
    [onChange]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clear = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('image-upload-input').click()}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
        }`}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {preview ? (
          <div className="relative">
            <img src={preview} alt="preview" className="h-32 w-32 object-cover rounded-lg" />
            <button
              type="button"
              onClick={clear}
              className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white shadow"
            >
              <FiX size={12} />
            </button>
          </div>
        ) : (
          <>
            <FiUploadCloud size={28} className="text-gray-400" />
            <p className="text-sm text-gray-500">
              <span className="text-blue-600 font-medium">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
          </>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default ImageUpload;
