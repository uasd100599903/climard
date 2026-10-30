import { useEffect, useState } from 'react';

/** useState que se guarda en localStorage (tolera navegadores que lo bloquean). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible: la app sigue funcionando */
    }
  }, [key, value]);

  return [value, setValue];
}
