import { create } from 'zustand';
import { demoStorage } from '../lib/storage';
import type { WealthSnapshot } from '../db/schema';
import { format } from 'date-fns';

interface WealthState {
  snapshots: WealthSnapshot[];
  loading: boolean;
  refresh: () => Promise<void>;
  addSnapshot: (crypto: number, mutualFund: number, note?: string) => Promise<void>;
}

export const useWealthStore = create<WealthState>((set, get) => ({
  snapshots: demoStorage.getWealth(),
  loading: false,
  refresh: async () => {
    set({ snapshots: demoStorage.getWealth(), loading: false });
  },
  addSnapshot: async (cryptoAmount, mutualFundAmount, note) => {
    const month = format(new Date(), 'yyyy-MM');
    const existing = get().snapshots;
    const foundIndex = existing.findIndex(s => s.month === month);
    let updated: WealthSnapshot[];
    if (foundIndex >= 0) {
      updated = [...existing];
      updated[foundIndex] = {
        ...updated[foundIndex],
        cryptoAmount,
        mutualFundAmount,
        note,
      };
    } else {
      const newSnap: WealthSnapshot = {
        id: Date.now(),
        month,
        cryptoAmount,
        mutualFundAmount,
        note,
        createdAt: new Date(),
      };
      updated = [newSnap, ...existing];
    }
    demoStorage.saveWealth(updated);
    set({ snapshots: updated });
  },
}));

export interface WealthDetails {
  rdpu: number;
  rdSaham: number;
  btc: number;
  eth: number;
}

export function parseWealthNote(note?: string): WealthDetails {
  const defaultDetails: WealthDetails = { rdpu: 0, rdSaham: 0, btc: 0, eth: 0 };
  if (!note) return defaultDetails;
  
  try {
    const parsed = JSON.parse(note);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        rdpu: Number(parsed.rdpu) || 0,
        rdSaham: Number(parsed.rdSaham) || 0,
        btc: Number(parsed.btc) || 0,
        eth: Number(parsed.eth) || 0,
      };
    }
  } catch (e) {
    // defaults
  }
  return defaultDetails;
}
