import { create } from 'zustand';
import { demoStorage } from '../lib/storage';
import type { AppSettings, ThemeMode } from '../db/schema';

interface SettingsState {
  settings: AppSettings;
  loading: boolean;
  isUnlocked: boolean;
  refresh: () => Promise<void>;
  setupPin: (pin: string) => Promise<void>;
  verifyAndUnlock: (pin: string) => Promise<boolean>;
  changePin: (newPin: string) => Promise<void>;
  disablePin: () => Promise<void>;
  lock: () => void;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setUserName: (name: string) => Promise<void>;
  markInstallBannerSeen: () => Promise<void>;
  markInstalled: () => Promise<void>;
  markBackedUp: () => Promise<void>;
  setWealthTarget: (target: number) => Promise<void>;
  setEmergencyFundTarget: (target: number) => Promise<void>;
  setEmergencyFundBalance: (balance: number) => Promise<void>;
}

function applyThemeClass(theme: ThemeMode | string) {
  const root = document.documentElement;
  root.classList.remove('dark');
  if (theme === 'dark' || theme !== 'light') {
    root.classList.add('dark');
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = demoStorage.getSettings();
  applyThemeClass(initial.theme);

  return {
    settings: initial,
    loading: false,
    isUnlocked: true, // Auto unlocked for demo
    refresh: async () => {
      const s = demoStorage.getSettings();
      applyThemeClass(s.theme);
      set({ settings: s, loading: false });
    },
    setupPin: async () => { set({ isUnlocked: true }); },
    verifyAndUnlock: async () => true,
    changePin: async () => {},
    disablePin: async () => {},
    lock: () => {},
    setTheme: async (theme) => {
      applyThemeClass(theme);
      const updated = { ...get().settings, theme };
      demoStorage.saveSettings(updated);
      set({ settings: updated });
    },
    setNotificationsEnabled: async (enabled) => {
      const updated = { ...get().settings, notificationsEnabled: enabled };
      demoStorage.saveSettings(updated);
      set({ settings: updated });
    },
    setUserName: async (userName) => {
      const updated = { ...get().settings, userName };
      demoStorage.saveSettings(updated);
      set({ settings: updated });
    },
    markInstallBannerSeen: async () => {},
    markInstalled: async () => {},
    markBackedUp: async () => {},
    setWealthTarget: async (wealthTarget) => {
      const updated = { ...get().settings, wealthTarget };
      demoStorage.saveSettings(updated);
      set({ settings: updated });
    },
    setEmergencyFundTarget: async (emergencyFundTarget) => {
      const updated = { ...get().settings, emergencyFundTarget };
      demoStorage.saveSettings(updated);
      set({ settings: updated });
    },
    setEmergencyFundBalance: async (emergencyFundBalance) => {
      const updated = { ...get().settings, emergencyFundBalance };
      demoStorage.saveSettings(updated);
      set({ settings: updated });
    },
  };
});
