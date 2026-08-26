import type { StoreData, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';
import { defaultMessages } from '../data/messages';
import { defaultSongs } from '../data/songs';
import { defaultCoupons } from '../data/coupons';
import { defaultCats } from '../data/cats';
import { defaultRandomImages } from '../data/randomImages';

const SUPABASE_URL = 'https://iegtazzxupzhnlbyitbv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ew2qgJQB3iuyMjr-G6Ot9Q_D_-kxAeV';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

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

function scanAllLocalStorageData(): StoreData {
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

export const INITIAL_DEFAULT_STORE: StoreData = scanAllLocalStorageData();
const LOCAL_CACHE_KEY = 'gacoan_cloud_db_cache_v2';

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
 * Fetch live data from Supabase Cloud Database REST API
 */
export async function fetchCloudStore(): Promise<StoreData> {
  const localData = getLocalCache();

  try {
    const [msgRes, songRes, coupRes, catRes, imgRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/messages?select=*`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/songs?select=*`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/coupons?select=*`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/cats?select=*`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/random_images?select=*`, { headers }),
    ]);

    if (msgRes.ok && songRes.ok && coupRes.ok && catRes.ok && imgRes.ok) {
      const [messagesData, songsData, couponsData, catsData, imagesData] = await Promise.all([
        msgRes.json(), songRes.json(), coupRes.json(), catRes.json(), imgRes.json()
      ]);

      const messages: MessageResult[] = (messagesData || []).map((m: any) => ({
        type: 'message',
        id: m.id,
        text: m.text,
        color: m.color || '#FFB3C6',
      }));

      const songs: SongResult[] = (songsData || []).map((s: any) => ({
        type: 'song',
        id: s.id,
        title: s.title,
        artist: s.artist || 'Spotify',
        album: s.album || 'Spotify',
        coverColor: s.cover_color || '#E8D5FF',
        coverEmoji: s.cover_emoji || '🎵',
        duration: s.duration || 180,
        spotifyUrl: s.spotify_url,
        spotifyTrackId: s.spotify_track_id,
      }));

      const coupons: CouponResult[] = (couponsData || []).map((c: any) => ({
        type: 'coupon',
        id: c.id,
        title: c.title,
        description: c.description,
        emoji: c.emoji || '🎟️',
        color: c.color || '#E84B7E',
        bgColor: c.bg_color || '#FFD6E0',
        validText: c.valid_text || 'Berlaku kapan saja',
        code: c.code,
      }));

      const cats: CatResult[] = (catsData || []).map((c: any) => ({
        type: 'cat',
        id: c.id,
        title: c.title,
        imageUrl: c.image_url,
        caption: c.caption,
        tag: c.tag || 'Cute Cat',
      }));

      const randomImages: RandomImageResult[] = (imagesData || []).map((r: any) => ({
        type: 'random_image',
        id: r.id,
        title: r.title,
        imageUrl: r.image_url,
        caption: r.caption,
        tag: r.tag || 'Aesthetic',
      }));

      const merged: StoreData = {
        messages: mergeUnique(defaultMessages, messages, localData.messages),
        songs: mergeUnique(defaultSongs, songs, localData.songs),
        coupons: mergeUnique(defaultCoupons, coupons, localData.coupons),
        cats: mergeUnique(defaultCats, cats, localData.cats),
        randomImages: mergeUnique(defaultRandomImages, randomImages, localData.randomImages),
      };

      saveLocalCache(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Supabase Cloud fetch notice:', err);
  }

  return localData;
}

/**
 * Automatically update master database in Supabase Cloud REST API
 */
export async function updateCloudStore(data: StoreData): Promise<boolean> {
  saveLocalCache(data);

  const upsertHeaders = {
    ...headers,
    'Prefer': 'resolution=merge-duplicates',
  };

  try {
    await Promise.all([
      data.messages.length > 0 && fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers: upsertHeaders,
        body: JSON.stringify(data.messages.map((m) => ({ id: m.id, text: m.text, color: m.color, type: 'message' }))),
      }),
      data.songs.length > 0 && fetch(`${SUPABASE_URL}/rest/v1/songs`, {
        method: 'POST',
        headers: upsertHeaders,
        body: JSON.stringify(data.songs.map((s) => ({
          id: s.id,
          title: s.title,
          artist: s.artist,
          album: s.album,
          cover_color: s.coverColor,
          cover_emoji: s.coverEmoji,
          duration: s.duration,
          spotify_url: s.spotifyUrl,
          spotify_track_id: s.spotifyTrackId,
          type: 'song',
        }))),
      }),
      data.coupons.length > 0 && fetch(`${SUPABASE_URL}/rest/v1/coupons`, {
        method: 'POST',
        headers: upsertHeaders,
        body: JSON.stringify(data.coupons.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          emoji: c.emoji,
          color: c.color,
          bg_color: c.bgColor,
          valid_text: c.validText,
          code: c.code,
          type: 'coupon',
        }))),
      }),
      data.cats.length > 0 && fetch(`${SUPABASE_URL}/rest/v1/cats`, {
        method: 'POST',
        headers: upsertHeaders,
        body: JSON.stringify(data.cats.map((c) => ({
          id: c.id,
          title: c.title,
          image_url: c.imageUrl,
          caption: c.caption,
          tag: c.tag,
          type: 'cat',
        }))),
      }),
      data.randomImages.length > 0 && fetch(`${SUPABASE_URL}/rest/v1/random_images`, {
        method: 'POST',
        headers: upsertHeaders,
        body: JSON.stringify(data.randomImages.map((r) => ({
          id: r.id,
          title: r.title,
          image_url: r.imageUrl,
          caption: r.caption,
          tag: r.tag,
          type: 'random_image',
        }))),
      }),
    ]);
    return true;
  } catch (err) {
    console.warn('Supabase Cloud update error:', err);
    return false;
  }
}
