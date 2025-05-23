/**
 * Default preferences for image processing.
 * @type {{defaultOutputFormat: string, defaultRotation: number, defaultIsGrayscale: boolean}}
 */
export const DEFAULT_PREFERENCES = {
  defaultOutputFormat: 'image/png',
  defaultRotation: 0, // 0, 90, 180, 270
  defaultIsGrayscale: false,
};

/**
 * Loads user preferences from localStorage.
 * Falls back to DEFAULT_PREFERENCES if nothing is stored, data is invalid, or an error occurs.
 * @returns {{defaultOutputFormat: string, defaultRotation: number, defaultIsGrayscale: boolean}} The loaded preferences.
 */
export const loadPreferences = () => {
  try {
    const storedPrefs = localStorage.getItem('imageConverterPrefs');
    if (storedPrefs) {
      const parsedPrefs = JSON.parse(storedPrefs);
      // Basic validation to ensure essential keys and types match
      if (
        parsedPrefs &&
        typeof parsedPrefs.defaultOutputFormat === 'string' &&
        ['image/png', 'image/jpeg', 'image/webp'].includes(parsedPrefs.defaultOutputFormat) &&
        typeof parsedPrefs.defaultRotation === 'number' &&
        [0, 90, 180, 270].includes(parsedPrefs.defaultRotation) &&
        typeof parsedPrefs.defaultIsGrayscale === 'boolean'
      ) {
        return parsedPrefs;
      } else {
        console.warn("Stored preferences are invalid or incomplete. Falling back to defaults.");
      }
    }
  } catch (error) {
    console.error("Failed to load or parse preferences from localStorage:", error);
  }
  return { ...DEFAULT_PREFERENCES }; // Return a copy of defaults
};

/**
 * Saves user preferences to localStorage.
 * @param {{defaultOutputFormat: string, defaultRotation: number, defaultIsGrayscale: boolean}} prefs - The preferences object to save.
 */
export const savePreferences = (prefs) => {
  try {
    // Optional: Add validation here to ensure `prefs` object is valid before saving
    if (prefs && 
        typeof prefs.defaultOutputFormat === 'string' &&
        typeof prefs.defaultRotation === 'number' &&
        typeof prefs.defaultIsGrayscale === 'boolean') {
      localStorage.setItem('imageConverterPrefs', JSON.stringify(prefs));
    } else {
      console.error("Attempted to save invalid preferences object:", prefs);
    }
  } catch (error) {
    console.error("Failed to save preferences to localStorage:", error);
  }
};

/**
 * Clears user preferences from localStorage.
 */
export const clearPreferences = () => {
  try {
    localStorage.removeItem('imageConverterPrefs');
  } catch (error) {
    console.error("Failed to clear preferences from localStorage:", error);
  }
};
