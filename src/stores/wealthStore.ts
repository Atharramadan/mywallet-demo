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

export interface AssetHoldingItem {
  id: string;
  name: string;
  amount: number;
}

export interface EmergencyFundSource {
  id: string;
  name: string;
  amount: number;
}

export interface EmasDetails {
  type: 'fisik' | 'digital';
  weightGram?: number;
  pricePerGram?: number;
  lastUpdated?: string;
}

export interface WealthDetails {
  rdpu: number;
  rdSaham: number;
  btc: number;
  eth: number;
  emas: number;
  emasDetails?: EmasDetails;
  cryptoHoldings: AssetHoldingItem[];
  sahamHoldings: AssetHoldingItem[];
  obligasiHoldings: AssetHoldingItem[];
  reksadanaHoldings: AssetHoldingItem[];
  emergencyFundSources: EmergencyFundSource[];
}

export function parseWealthNote(note?: string): WealthDetails {
  const defaultDetails: WealthDetails = {
    rdpu: 0,
    rdSaham: 0,
    btc: 0,
    eth: 0,
    emas: 0,
    emasDetails: undefined,
    cryptoHoldings: [],
    sahamHoldings: [],
    obligasiHoldings: [],
    reksadanaHoldings: [],
    emergencyFundSources: [],
  };
  if (!note) return defaultDetails;
  
  try {
    const parsed = JSON.parse(note);
    if (typeof parsed === 'object' && parsed !== null) {
      let rdpu = Number(parsed.rdpu) || 0;
      let rdSaham = Number(parsed.rdSaham) || 0;
      let btc = Number(parsed.btc) || 0;
      let eth = Number(parsed.eth) || 0;
      const emas = Number(parsed.emas) || 0;

      let cryptoHoldings: AssetHoldingItem[] = [];
      if (Array.isArray(parsed.cryptoHoldings) && parsed.cryptoHoldings.length > 0) {
        cryptoHoldings = parsed.cryptoHoldings.map((item, idx) => ({
          id: item.id || 'crypto-' + idx,
          name: String(item.name || '').trim(),
          amount: Number(item.amount) || 0,
        })).filter(item => item.name || item.amount > 0);

        if (!btc) {
          const btcItem = cryptoHoldings.find(c => c.name.toUpperCase() === 'BTC' || c.name.toLowerCase().includes('bitcoin'));
          if (btcItem) btc = btcItem.amount;
        }
        if (!eth) {
          const ethItem = cryptoHoldings.find(c => c.name.toUpperCase() === 'ETH' || c.name.toLowerCase().includes('ethereum'));
          if (ethItem) eth = ethItem.amount;
        }
      } else {
        if (btc > 0) cryptoHoldings.push({ id: 'legacy-btc', name: 'BTC', amount: btc });
        if (eth > 0) cryptoHoldings.push({ id: 'legacy-eth', name: 'ETH', amount: eth });
      }

      let sahamHoldings: AssetHoldingItem[] = [];
      if (Array.isArray(parsed.sahamHoldings)) {
        sahamHoldings = parsed.sahamHoldings.map((item, idx) => ({
          id: item.id || 'saham-' + idx,
          name: String(item.name || '').trim(),
          amount: Number(item.amount) || 0,
        })).filter(item => item.name || item.amount > 0);
      }

      let obligasiHoldings: AssetHoldingItem[] = [];
      if (Array.isArray(parsed.obligasiHoldings)) {
        obligasiHoldings = parsed.obligasiHoldings.map((item, idx) => ({
          id: item.id || 'obligasi-' + idx,
          name: String(item.name || '').trim(),
          amount: Number(item.amount) || 0,
        })).filter(item => item.name || item.amount > 0);
      }

      let reksadanaHoldings: AssetHoldingItem[] = [];
      if (Array.isArray(parsed.reksadanaHoldings) && parsed.reksadanaHoldings.length > 0) {
        reksadanaHoldings = parsed.reksadanaHoldings.map((item, idx) => ({
          id: item.id || 'rd-' + idx,
          name: String(item.name || '').trim(),
          amount: Number(item.amount) || 0,
        })).filter(item => item.name || item.amount > 0);

        if (!rdpu && !rdSaham) {
          reksadanaHoldings.forEach(item => {
            const lower = item.name.toLowerCase();
            if (lower.includes('pasar uang') || lower.includes('rdpu') || lower.includes('pendapatan tetap') || lower.includes('rdpt')) {
              rdpu += item.amount;
            } else {
              rdSaham += item.amount;
            }
          });
        }
      } else {
        if (rdpu > 0) reksadanaHoldings.push({ id: 'legacy-rdpu', name: 'RDPU (Pasar Uang)', amount: rdpu });
        if (rdSaham > 0) reksadanaHoldings.push({ id: 'legacy-rds', name: 'RD Saham / Campuran', amount: rdSaham });
      }

      let emergencyFundSources: EmergencyFundSource[] = [];
      if (Array.isArray(parsed.emergencyFundSources) && parsed.emergencyFundSources.length > 0) {
        emergencyFundSources = parsed.emergencyFundSources.map((item, idx) => ({
          id: item.id || 'ef-' + idx,
          name: String(item.name || '').trim(),
          amount: Number(item.amount) || 0,
        })).filter(item => item.name || item.amount > 0);
      } else if (rdpu > 0) {
        emergencyFundSources.push({
          id: 'default-rdpu',
          name: 'RDPU (Pasar Uang)',
          amount: rdpu,
        });
      }

      let emasDetails: EmasDetails | undefined = undefined;
      if (parsed.emasDetails && typeof parsed.emasDetails === 'object') {
        emasDetails = {
          type: parsed.emasDetails.type === 'fisik' ? 'fisik' : 'digital',
          weightGram: Number(parsed.emasDetails.weightGram) || 0,
          pricePerGram: Number(parsed.emasDetails.pricePerGram) || 0,
          lastUpdated: parsed.emasDetails.lastUpdated || '',
        };
      }

      return {
        rdpu,
        rdSaham,
        btc,
        eth,
        emas,
        emasDetails,
        cryptoHoldings,
        sahamHoldings,
        obligasiHoldings,
        reksadanaHoldings,
        emergencyFundSources,
      };
    }
  } catch (e) {}
  return defaultDetails;
}
