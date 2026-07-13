import { useCallback, useEffect, useState } from 'react';

/**
 * useLocalStorage
 *
 * A small, defensive wrapper around localStorage that behaves like useState.
 * Used by ThemeContext (theme preference) and InterviewContext (in-progress
 * session persistence) so a page refresh never silently loses state that
 * the backend has no way of returning to us later.
 *
 * Reads/writes are wrapped in try/catch: private browsing modes, storage
 * quota errors, or disabled storage should degrade to in-memory state
 * rather than crash the app.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: failed to read key "${key}"`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        try {
          if (nextValue === undefined) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          }
        } catch (error) {
          console.warn(`useLocalStorage: failed to write key "${key}"`, error);
        }
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`useLocalStorage: failed to remove key "${key}"`, error);
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
