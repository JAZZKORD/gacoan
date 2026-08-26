import type { StoreData, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';
import { defaultMessages } from '../data/messages';
import { defaultSongs } from '../data/songs';
import { defaultCoupons } from '../data/coupons';
import { defaultCats } from '../data/cats';
import { defaultRandomImages } from '../data/randomImages';

const CURRENT_KEY = 'gachapon_master_store_v6';

// Scan all known past keys and any localStorage key containing gacha / store
const ALL_KEYS_TO_SCAN = [
  'gachapon_master_store_v6',
  'gachapon_master_store_v5',
  'gachapon_master_store_v4',
  'gachapon_master_store_v3',
  'gachapon_master_store_v2',
  'gachapon_master_store_v1',
  'gachapon_master_store',
  'gachapon_store',
];

function mergeArraysUnique<T extends { id: string }>(defaults: T[], ...storedArrays: (T[] | undefined)[]): T[] {
  const map = new Map<string, T>();

  // Add default items first
  defaults.forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });

  // Aggregate user custom items from all scanned stores
  storedArrays.forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((item) => {
        if (item && item.id) {
          map.set(item.id, item);
        }
      });
    }
  });

  return Array.from(map.values());
}

export function loadStoreData(): StoreData {
  const collectedMessages: MessageResult[][] = [];
  const collectedSongs: SongResult[][] = [];
  const collectedCoupons: CouponResult[][] = [];
  const collectedCats: CatResult[][] = [];
  const collectedImages: RandomImageResult[][] = [];

  try {
    // Scan all keys in localStorage to recover any user created data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('gachapon') || ALL_KEYS_TO_SCAN.includes(key))) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              if (Array.isArray(parsed.messages)) collectedMessages.push(parsed.messages);
              if (Array.isArray(parsed.songs)) collectedSongs.push(parsed.songs);
              if (Array.isArray(parsed.coupons)) collectedCoupons.push(parsed.coupons);
              if (Array.isArray(parsed.cats)) collectedCats.push(parsed.cats);
              if (Array.isArray(parsed.randomImages)) collectedImages.push(parsed.randomImages);
            }
          }
        } catch {
          // ignore invalid JSON
        }
      }
    }
  } catch {
    // ignore localStorage errors
  }

  const finalStore: StoreData = {
    messages: mergeArraysUnique(defaultMessages, ...collectedMessages),
    songs: mergeArraysUnique(defaultSongs, ...collectedSongs),
    coupons: mergeArraysUnique(defaultCoupons, ...collectedCoupons),
    cats: mergeArraysUnique(defaultCats, ...collectedCats),
    randomImages: mergeArraysUnique(defaultRandomImages, ...collectedImages),
  };

  saveStoreData(finalStore);
  return finalStore;
}

export function saveStoreData(data: StoreData): void {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function resetStoreToDefaults(): StoreData {
  const initial: StoreData = {
    messages: defaultMessages,
    songs: defaultSongs,
    coupons: defaultCoupons,
    cats: defaultCats,
    randomImages: defaultRandomImages,
  };
  saveStoreData(initial);
  return initial;
}

export function getAllMessages(): MessageResult[] {
  return loadStoreData().messages;
}

export function getAllSongs(): SongResult[] {
  return loadStoreData().songs;
}

export function getAllCoupons(): CouponResult[] {
  return loadStoreData().coupons;
}

export function getAllCats(): CatResult[] {
  return loadStoreData().cats;
}

export function getAllRandomImages(): RandomImageResult[] {
  return loadStoreData().randomImages;
}

export function extractSpotifyTrackId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (match) return match[1];
  const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];
  return null;
}
