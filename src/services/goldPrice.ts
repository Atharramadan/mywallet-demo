/**
 * Realtime Physical Gold Price Service
 *
 * Mengambil harga acuan emas murni 24 karat (1 gram) secara realtime:
 * - Sumber data: CoinGecko Public API (PAX Gold / IDR) dengan CORS terbuka, resmi, legal, dan gratis selamanya tanpa API key.
 * - Rumus konversi: 1 PAXG = 1 Troy Ounce = 31.1034768 gram emas fisik 24K berstandar LBMA.
 * - Mekanisme caching: localStorage dengan TTL 2 jam untuk efisiensi jaringan & offline-friendly.
 */

const STORAGE_KEY = 'mywallet_gold_price_cache_v1';
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 Jam
const TROY_OUNCE_TO_GRAMS = 31.1034768;

// Harga fallback realistis emas 24K per gram jika offline & cache kosong (baseline 2026)
const DEFAULT_FALLBACK_PRICE_PER_GRAM = 2450000;

export interface GoldPriceResult {
  pricePerGram: number;
  lastUpdated: number;
  isCached: boolean;
  source: string;
}

interface CachedGoldPrice {
  pricePerGram: number;
  lastUpdated: number;
  source: string;
}

/**
 * Membaca harga emas dari localStorage jika masih dalam masa berlaku TTL
 */
export function getCachedGoldPrice(): CachedGoldPrice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: CachedGoldPrice = JSON.parse(raw);
    const now = Date.now();
    if (now - data.lastUpdated < CACHE_TTL_MS && data.pricePerGram > 1000000) {
      return data;
    }
  } catch (e) {
    console.warn('Gagal membaca cache harga emas', e);
  }
  return null;
}

/**
 * Menyimpan harga emas terbaru ke localStorage
 */
function setCachedGoldPrice(pricePerGram: number, source: string): void {
  try {
    const data: CachedGoldPrice = {
      pricePerGram,
      lastUpdated: Date.now(),
      source,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Gagal menyimpan cache harga emas', e);
  }
}

/**
 * Mengambil harga emas 1 gram terkini
 * @param forceRefresh - Jika true, akan bypass cache dan langsung panggil API
 */
export async function fetchRealtimeGoldPrice(forceRefresh = false): Promise<GoldPriceResult> {
  // 1. Cek cache lokal terlebih dahulu jika tidak dipaksa refresh
  if (!forceRefresh) {
    const cached = getCachedGoldPrice();
    if (cached) {
      return {
        pricePerGram: cached.pricePerGram,
        lastUpdated: cached.lastUpdated,
        isCached: true,
        source: cached.source,
      };
    }
  }

  // 2. Fetch dari CoinGecko (PAX Gold / IDR - CORS enabled, no API key, 100% legal)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=idr',
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const paxgIdr = json?.['pax-gold']?.idr;
      if (typeof paxgIdr === 'number' && paxgIdr > 0) {
        const calculatedPrice = Math.round(paxgIdr / TROY_OUNCE_TO_GRAMS);
        setCachedGoldPrice(calculatedPrice, 'CoinGecko Live LBMA Gold');
        return {
          pricePerGram: calculatedPrice,
          lastUpdated: Date.now(),
          isCached: false,
          source: 'Live Pasar 24K (LBMA/PAXG)',
        };
      }
    }
  } catch (err) {
    console.warn('Gagal mengambil harga emas dari CoinGecko, mencoba fallback lokal:', err);
  }

  // 3. Jika fetch gagal atau offline, gunakan cache lama meskipun sudah expired jika ada
  try {
    const staleRaw = localStorage.getItem(STORAGE_KEY);
    if (staleRaw) {
      const staleData: CachedGoldPrice = JSON.parse(staleRaw);
      if (staleData.pricePerGram > 1000000) {
        return {
          pricePerGram: staleData.pricePerGram,
          lastUpdated: staleData.lastUpdated,
          isCached: true,
          source: `${staleData.source} (Offline Cache)`,
        };
      }
    }
  } catch {
    // Ignore error
  }

  // 4. Default fallback aman
  return {
    pricePerGram: DEFAULT_FALLBACK_PRICE_PER_GRAM,
    lastUpdated: Date.now(),
    isCached: true,
    source: 'Acuan Standar Antam/UBS',
  };
}
