import { useState, useEffect } from "react";

function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get value from sessionStorage or use initialValue
  const readValueFromStorage = (): T => {
    try {
      const storedValue = sessionStorage.getItem(key);

      if (storedValue) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.warn(`Error reading sessionStorage key “${key}”:`, error);
    }

    return initialValue;
  };

  const [storedValue, setStoredValue] = useState<T>(readValueFromStorage);

  // Update sessionStorage when storedValue changes
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting sessionStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useSessionStorage;
