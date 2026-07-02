const STORAGE_PREFIX = 'jnan_';

// Simple Base64 mock encryption helper to avoid plaintext storage of tokens
const encryptValue = (val: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(val)));
  } catch {
    return val;
  }
};

const decryptValue = (val: string): string => {
  try {
    return decodeURIComponent(escape(atob(val)));
  } catch {
    return val;
  }
};

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? (JSON.parse(item) as T) : null;
    } catch (err) {
      console.error(`localStorage read error for key "${key}":`, err);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (err) {
      console.error(`localStorage write error for key "${key}":`, err);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

export const secureStorage = {
  get: <T>(key: string): T | null => {
    try {
      const encryptedItem = localStorage.getItem(`${STORAGE_PREFIX}sec_${key}`);
      if (!encryptedItem) return null;
      const decrypted = decryptValue(encryptedItem);
      return JSON.parse(decrypted) as T;
    } catch (err) {
      console.error(`secureStorage read error for key "${key}":`, err);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      const raw = JSON.stringify(value);
      const cipher = encryptValue(raw);
      localStorage.setItem(`${STORAGE_PREFIX}sec_${key}`, cipher);
    } catch (err) {
      console.error(`secureStorage write error for key "${key}":`, err);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}sec_${key}`);
  },
};

export default storage;
