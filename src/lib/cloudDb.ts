import type { StoreData, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';
import { defaultMessages } from '../data/messages';
import { defaultSongs } from '../data/songs';
import { defaultCoupons } from '../data/coupons';
import { defaultCats } from '../data/cats';
import { defaultRandomImages } from '../data/randomImages';

// Public Cloud DB Bin ID for instant auto-sync across all devices
const CLOUD_BIN_ID = '67be1a80ad19ca34f8a846c4'; // Cloud JSON DB Bin
const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}`;
const JSONBIN_ACCESS_KEY = '$2a$10$w8T0M9L4G.4Y/tNqZ8e7xeuT8F9xH2R8oO5k9D9x0L1M2N3P4Q5R6'; // Public Master Key

function mergeUnique<T extends { id: string }>(defaults: T[], ...sources: (T[] | undefined)[]): T[] {
  const map = new Map<string, T>();
  defaults.forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });
  sources.forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((item) => {
        if (item && item.id) map.set(item.id, item);
      });
    }
  });
  return Array.from(map.values());
}

function scanAllLocalStorageData(): Partial<StoreData> {
  const collectedMessages: MessageResult[][] = [];
  const collectedSongs: SongResult[][] = [];
  const collectedCoupons: CouponResult[][] = [];
  const collectedCats: CatResult[][] = [];
  const collectedImages: RandomImageResult[][] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('gachapon') || key.includes('gacoan'))) {
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
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  return {
    messages: mergeUnique(defaultMessages, ...collectedMessages),
    songs: mergeUnique(defaultSongs, ...collectedSongs),
    coupons: mergeUnique(defaultCoupons, ...collectedCoupons),
    cats: mergeUnique(defaultCats, ...collectedCats),
    randomImages: mergeUnique(defaultRandomImages, ...collectedImages),
  };
}

export const INITIAL_DEFAULT_STORE: StoreData = scanAllLocalStorageData() as StoreData;

const LOCAL_CACHE_KEY = 'gacoan_cloud_db_cache_v1';

export function getLocalCache(): StoreData {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          messages: mergeUnique(defaultMessages, parsed.messages),
          songs: mergeUnique(defaultSongs, parsed.songs),
          coupons: mergeUnique(defaultCoupons, parsed.coupons),
          cats: mergeUnique(defaultCats, parsed.cats),
          randomImages: mergeUnique(defaultRandomImages, parsed.randomImages),
        };
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_DEFAULT_STORE;
}

export function saveLocalCache(data: StoreData): void {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch {
    // fallback
  }
}

/**
 * Fetch latest live master database from Cloud DB & merge with local restore
 */
export async function fetchCloudStore(): Promise<StoreData> {
  const localData = getLocalCache();

  try {
    const res = await fetch(`${JSONBIN_API_URL}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_ACCESS_KEY,
      },
    });

    if (res.ok) {
      const json = await res.json();
      const record = json.record || json;
      if (record && (record.messages || record.songs || record.coupons)) {
        const merged: StoreData = {
          messages: mergeUnique(defaultMessages, record.messages, localData.messages),
          songs: mergeUnique(defaultSongs, record.songs, localData.songs),
          coupons: mergeUnique(defaultCoupons, record.coupons, localData.coupons),
          cats: mergeUnique(defaultCats, record.cats, localData.cats),
          randomImages: mergeUnique(defaultRandomImages, record.randomImages, localData.randomImages),
        };

        saveLocalCache(merged);
        // Automatically ensure Cloud DB contains all merged custom items
        if (JSON.stringify(merged) !== JSON.stringify(record)) {
          updateCloudStore(merged).catch(() => {});
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn('Cloud DB fetch fallback to cache:', err);
  }

  // Push local merged restore to Cloud DB if fetch failed
  updateCloudStore(localData).catch(() => {});
  return localData;
}

/**
 * Automatically update master database in Cloud DB
 */
export async function updateCloudStore(data: StoreData): Promise<boolean> {
  saveLocalCache(data);

  try {
    const res = await fetch(JSONBIN_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_ACCESS_KEY,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Cloud DB update error:', err);
  }

  return false;
}
