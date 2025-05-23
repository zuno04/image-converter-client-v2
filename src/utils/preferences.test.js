import { DEFAULT_PREFERENCES, loadPreferences, savePreferences, clearPreferences } from './preferences';

// Mock localStorage
let mockLocalStorageStore = {};

const mockLocalStorage = {
  getItem: jest.fn((key) => mockLocalStorageStore[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorageStore[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete mockLocalStorageStore[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorageStore = {};
  }),
};

// Assign the mock to the global object if testing in an environment where 'localStorage' is global (like Jest with jsdom)
// Or, if running in a pure Node environment for testing utils, you might need to handle this differently
// For this example, we assume 'global.localStorage' or similar is applicable.
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });


describe('Preference Utilities', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage store before each test
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear(); // Clears our mock store
    mockLocalStorageStore = {}; // Explicitly reset our store
  });

  describe('loadPreferences', () => {
    it('should return default preferences if localStorage is empty', () => {
      const prefs = loadPreferences();
      expect(prefs).toEqual(DEFAULT_PREFERENCES);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('imageConverterPrefs');
    });

    it('should return saved preferences if localStorage has valid data', () => {
      const saved = {
        defaultOutputFormat: 'image/jpeg',
        defaultRotation: 90,
        defaultIsGrayscale: true,
      };
      mockLocalStorageStore['imageConverterPrefs'] = JSON.stringify(saved);
      const prefs = loadPreferences();
      expect(prefs).toEqual(saved);
    });

    it('should return default preferences if localStorage has invalid JSON', () => {
      mockLocalStorageStore['imageConverterPrefs'] = 'invalid json';
      const prefs = loadPreferences();
      expect(prefs).toEqual(DEFAULT_PREFERENCES);
    });

    it('should return default preferences if stored preferences are incomplete', () => {
      const incompletePrefs = { defaultOutputFormat: 'image/webp' }; // Missing other keys
      mockLocalStorageStore['imageConverterPrefs'] = JSON.stringify(incompletePrefs);
      const prefs = loadPreferences();
      expect(prefs).toEqual(DEFAULT_PREFERENCES);
    });
    
    it('should return default preferences if stored preference values are of wrong type or invalid value', () => {
      const invalidPrefs = {
        defaultOutputFormat: 'image/gif', // Invalid format
        defaultRotation: 70, // Invalid rotation
        defaultIsGrayscale: 'yes', // Invalid boolean
      };
      mockLocalStorageStore['imageConverterPrefs'] = JSON.stringify(invalidPrefs);
      const prefs = loadPreferences();
      expect(prefs).toEqual(DEFAULT_PREFERENCES);
    });
  });

  describe('savePreferences', () => {
    it('should save preferences to localStorage', () => {
      const prefsToSave = {
        defaultOutputFormat: 'image/webp',
        defaultRotation: 180,
        defaultIsGrayscale: false,
      };
      savePreferences(prefsToSave);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('imageConverterPrefs', JSON.stringify(prefsToSave));
      expect(mockLocalStorageStore['imageConverterPrefs']).toBe(JSON.stringify(prefsToSave));
    });

    it('should not save if preferences object is invalid or incomplete', () => {
      const invalidPrefs = { defaultOutputFormat: 'image/png' }; // Missing keys
      savePreferences(invalidPrefs);
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled(); // Or called with an error/default if validation logic changes
    });
  });

  describe('clearPreferences', () => {
    it('should remove preferences from localStorage', () => {
      mockLocalStorageStore['imageConverterPrefs'] = JSON.stringify(DEFAULT_PREFERENCES); // Pre-populate
      clearPreferences();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('imageConverterPrefs');
      expect(mockLocalStorageStore['imageConverterPrefs']).toBeUndefined();
    });
  });
});
