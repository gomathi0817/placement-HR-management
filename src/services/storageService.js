import { Preferences } from '@capacitor/preferences';

export const storageService = {
  async setItem(key, value) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      await Preferences.set({ key, value: stringValue });
    } catch (e) {
      // Web fallback
    }
    localStorage.setItem(key, stringValue);
  },

  async getItem(key) {
    try {
      const { value } = await Preferences.get({ key });
      if (value !== null && value !== undefined) {
        return value;
      }
    } catch (e) {
      // Fall through to localStorage
    }
    return localStorage.getItem(key);
  },

  async removeItem(key) {
    try {
      await Preferences.remove({ key });
    } catch (e) {}
    localStorage.removeItem(key);
  },

  async clear() {
    try {
      await Preferences.clear();
    } catch (e) {}
    localStorage.clear();
  }
};
