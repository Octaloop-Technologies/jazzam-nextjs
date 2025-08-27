/**
 * Utility functions for safely working with localStorage.
 * These helpers check if code is running in a browser environment
 * to prevent errors during server-side rendering.
 */

/**
 * Safely retrieves an item from localStorage
 * @param key The key to retrieve from localStorage
 * @returns The stored value or null if not found or not in browser
 */
export const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

/**
 * Safely stores an item in localStorage
 * @param key The key to store in localStorage
 * @param value The value to store in localStorage
 */
export const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

/**
 * Safely removes an item from localStorage
 * @param key The key to remove from localStorage
 */
export const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

/**
 * Safely retrieves an object from localStorage and parses it
 * @param key The key to retrieve from localStorage
 * @param defaultValue Default value to return if item doesn't exist
 * @returns The parsed object or defaultValue if not found or parsing fails
 */
export const getObjectFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = getLocalStorageItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage item with key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely stores an object in localStorage by stringifying it
 * @param key The key to store in localStorage
 * @param value The object to stringify and store
 */
export const setObjectInLocalStorage = <T>(key: string, value: T): void => {
  try {
    setLocalStorageItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error stringifying object for localStorage with key "${key}":`, error);
  }
};
