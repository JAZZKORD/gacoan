import type { StoreData, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';
import { defaultMessages } from '../data/messages';
import { defaultSongs } from '../data/songs';
import { defaultCoupons } from '../data/coupons';
import { defaultCats } from '../data/cats';
import { defaultRandomImages } from '../data/randomImages';
import { fetchCloudStore, updateCloudStore, getLocalCache, saveLocalCache } from '../lib/cloudDb';

export const INITIAL_STORE: StoreData = {
  messages: defaultMessages,
  songs: defaultSongs,
  coupons: defaultCoupons,
  cats: defaultCats,
  randomImages: defaultRandomImages,
};

let memoryStore: StoreData = getLocalCache();

// Trigger background cloud fetch on initialization
fetchCloudStore().then((cloudData) => {
  if (cloudData) {
    memoryStore = cloudData;
  }
});

export function loadStoreData(): StoreData {
  return memoryStore;
}

export async function refreshStoreData(): Promise<StoreData> {
  const fresh = await fetchCloudStore();
  memoryStore = fresh;
  return fresh;
}

export function saveStoreData(data: StoreData): void {
  memoryStore = data;
  saveLocalCache(data);
  // Auto-sync to Cloud DB in background automatically on every change
  updateCloudStore(data).catch(() => {});
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
  return (memoryStore && memoryStore.messages && memoryStore.messages.length > 0)
    ? memoryStore.messages
    : defaultMessages;
}

export function getAllSongs(): SongResult[] {
  return (memoryStore && memoryStore.songs && memoryStore.songs.length > 0)
    ? memoryStore.songs
    : defaultSongs;
}

export function getAllCoupons(): CouponResult[] {
  return (memoryStore && memoryStore.coupons && memoryStore.coupons.length > 0)
    ? memoryStore.coupons
    : defaultCoupons;
}

export function getAllCats(): CatResult[] {
  return (memoryStore && memoryStore.cats && memoryStore.cats.length > 0)
    ? memoryStore.cats
    : defaultCats;
}

export function getAllRandomImages(): RandomImageResult[] {
  return (memoryStore && memoryStore.randomImages && memoryStore.randomImages.length > 0)
    ? memoryStore.randomImages
    : defaultRandomImages;
}

export function extractSpotifyTrackId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (match) return match[1];
  const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];
  return null;
}
