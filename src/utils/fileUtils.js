/**
 * Converts a data URL string into a File object.
 * @param {string} dataurl - The data URL to convert.
 * @param {string} originalFilename - The original filename, used to derive the base name.
 * @param {string} targetMimeType - The target MIME type for the new File object (e.g., 'image/png', 'image/jpeg').
 * @returns {File} The new File object.
 */
export const dataURLtoFile = (dataurl, originalFilename, targetMimeType) => {
  if (!dataurl) {
    console.error("dataURLtoFile: dataurl is undefined or empty");
    // Return a dummy file or throw an error, depending on desired handling
    // For now, returning a small empty text file to avoid crashing downstream
    return new File([""], "error.txt", { type: "text/plain" });
  }

  const arr = dataurl.split(',');
  if (arr.length < 2) {
    console.error("dataURLtoFile: Invalid data URL format (missing comma).");
    return new File([""], "error_invalid_dataurl.txt", { type: "text/plain" });
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  // Use targetMimeType if parsing from dataurl fails, or if it's explicitly provided for conversion
  const mime = targetMimeType || (mimeMatch ? mimeMatch[1] : 'application/octet-stream');

  let newExtension;
  switch (targetMimeType) {
    case 'image/jpeg':
      newExtension = 'jpg';
      break;
    case 'image/webp':
      newExtension = 'webp';
      break;
    case 'image/png':
    default:
      newExtension = 'png'; // Default to png if targetMimeType is not specific for extension
      if (targetMimeType && !['image/png', 'image/jpeg', 'image/webp'].includes(targetMimeType)) {
        // If it's some other known type, try to get extension from it, or use a generic one
        const parts = targetMimeType.split('/');
        if (parts.length > 1 && parts[1].length > 0) newExtension = parts[1];
        else newExtension = 'bin'; // generic binary extension
      } else if (!targetMimeType && mime === 'application/octet-stream') {
        newExtension = 'bin';
      }
      break;
  }

  // Robustly get filename without extension
  const lastDotIndex = originalFilename.lastIndexOf('.');
  const filenameWithoutExtension = lastDotIndex > 0 ? originalFilename.substring(0, lastDotIndex) : originalFilename;
  const newFilename = `${filenameWithoutExtension}.${newExtension}`;

  let byteString;
  if (arr[0].indexOf('base64') >= 0) {
    byteString = atob(arr[1]);
  } else {
    byteString = unescape(arr[1]);
  }

  const u8arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    u8arr[i] = byteString.charCodeAt(i);
  }

  return new File([u8arr], newFilename, { type: mime });
};
