import type { StoreData } from '../types';
import { defaultMessages } from '../data/messages';
import { defaultSongs } from '../data/songs';
import { defaultCoupons } from '../data/coupons';
import { defaultCats } from '../data/cats';
import { defaultRandomImages } from '../data/randomImages';

// Public Cloud DB Bin ID for instant auto-sync across all devices
const CLOUD_BIN_ID = '67be1a80ad19ca34f8a846c4'; // Cloud JSON DB Bin
const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${CLOUD_BIN_ID}`;
const JSONBIN_ACCESS_KEY = '$2a$10$w8T0M9L4G.4Y/tNqZ8e7xeuT8F9xH2R8oO5k9D9x0L1M2N3P4Q5R6'; // Public Master Key

export const INITIAL_DEFAULT_STORE: StoreData = {
  messages: defaultMessages,
  songs: defaultSongs,
  coupons: defaultCoupons,
  cats: defaultCats,
  randomImages: defaultRandomImages,
};

const LOCAL_CACHE_KEY = 'gacoan_cloud_db_cache_v1';

export function getLocalCache(): StoreData {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
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
 * Fetch latest live master database from Cloud DB
 */
export async function fetchCloudStore(): Promise<StoreData> {
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
        const cloudData: StoreData = {
          messages: Array.isArray(record.messages) ? record.messages : defaultMessages,
          songs: Array.isArray(record.songs) ? record.songs : defaultSongs,
          coupons: Array.isArray(record.coupons) ? record.coupons : defaultCoupons,
          cats: Array.isArray(record.cats) ? record.cats : defaultCats,
          randomImages: Array.isArray(record.randomImages) ? record.randomImages : defaultRandomImages,
        };
        saveLocalCache(cloudData);
        return cloudData;
      }
    }
  } catch (err) {
    console.warn('Cloud DB fetch fallback to cache:', err);
  }

  return getLocalCache();
}

/**
 * Automatically update master database in Cloud DB (called on every Admin Add/Edit/Delete)
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
