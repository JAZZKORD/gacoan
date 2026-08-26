import type { StoreData, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';
import { defaultMessages } from '../data/messages';
import { defaultSongs } from '../data/songs';
import { defaultCoupons } from '../data/coupons';
import { defaultCats } from '../data/cats';
import { defaultRandomImages } from '../data/randomImages';
import { getSupabase } from '../lib/supabase';

const CURRENT_KEY = 'gachapon_master_store_v6';

function mergeArraysUnique<T extends { id: string }>(defaults: T[], ...storedArrays: (T[] | undefined)[]): T[] {
  const map = new Map<string, T>();
  defaults.forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });
  storedArrays.forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((item) => {
        if (item && item.id) map.set(item.id, item);
      });
    }
  });
  return Array.from(map.values());
}

export function loadLocalStoreData(): StoreData {
  const collectedMessages: MessageResult[][] = [];
  const collectedSongs: SongResult[][] = [];
  const collectedCoupons: CouponResult[][] = [];
  const collectedCats: CatResult[][] = [];
  const collectedImages: RandomImageResult[][] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('gachapon')) {
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
    messages: mergeArraysUnique(defaultMessages, ...collectedMessages),
    songs: mergeArraysUnique(defaultSongs, ...collectedSongs),
    coupons: mergeArraysUnique(defaultCoupons, ...collectedCoupons),
    cats: mergeArraysUnique(defaultCats, ...collectedCats),
    randomImages: mergeArraysUnique(defaultRandomImages, ...collectedImages),
  };
}

export function saveStoreData(data: StoreData): void {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadStoreData(): StoreData {
  const local = loadLocalStoreData();
  saveStoreData(local);
  return local;
}

// ─── SUPABASE REALTIME CLOUD SYNC ────────────────────────────────────────────

export async function fetchSupabaseData(): Promise<StoreData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const [msgRes, songRes, coupRes, catRes, imgRes] = await Promise.all([
      supabase.from('messages').select('*'),
      supabase.from('songs').select('*'),
      supabase.from('coupons').select('*'),
      supabase.from('cats').select('*'),
      supabase.from('random_images').select('*'),
    ]);

    if (msgRes.error || songRes.error || coupRes.error || catRes.error || imgRes.error) {
      console.warn('Supabase fetch notice:', msgRes.error || songRes.error || coupRes.error || catRes.error || imgRes.error);
      return null;
    }

    const messages: MessageResult[] = (msgRes.data || []).map((m: any) => ({
      type: 'message',
      id: m.id,
      text: m.text,
      color: m.color || '#FFB3C6',
    }));

    const songs: SongResult[] = (songRes.data || []).map((s: any) => ({
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

    const coupons: CouponResult[] = (coupRes.data || []).map((c: any) => ({
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

    const cats: CatResult[] = (catRes.data || []).map((c: any) => ({
      type: 'cat',
      id: c.id,
      title: c.title,
      imageUrl: c.image_url,
      caption: c.caption,
      tag: c.tag || 'Cute Cat',
    }));

    const randomImages: RandomImageResult[] = (imgRes.data || []).map((r: any) => ({
      type: 'random_image',
      id: r.id,
      title: r.title,
      imageUrl: r.image_url,
      caption: r.caption,
      tag: r.tag || 'Aesthetic',
    }));

    const localData = loadLocalStoreData();
    const merged: StoreData = {
      messages: mergeArraysUnique(messages, localData.messages),
      songs: mergeArraysUnique(songs, localData.songs),
      coupons: mergeArraysUnique(coupons, localData.coupons),
      cats: mergeArraysUnique(cats, localData.cats),
      randomImages: mergeArraysUnique(randomImages, localData.randomImages),
    };

    saveStoreData(merged);
    return merged;
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return null;
  }
}

export async function syncStoreToSupabase(data: StoreData): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    if (data.messages.length > 0) {
      await supabase.from('messages').upsert(
        data.messages.map((m) => ({ id: m.id, text: m.text, color: m.color, type: 'message' }))
      );
    }
    if (data.songs.length > 0) {
      await supabase.from('songs').upsert(
        data.songs.map((s) => ({
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
        }))
      );
    }
    if (data.coupons.length > 0) {
      await supabase.from('coupons').upsert(
        data.coupons.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          emoji: c.emoji,
          color: c.color,
          bg_color: c.bgColor,
          valid_text: c.validText,
          code: c.code,
          type: 'coupon',
        }))
      );
    }
    if (data.cats.length > 0) {
      await supabase.from('cats').upsert(
        data.cats.map((c) => ({
          id: c.id,
          title: c.title,
          image_url: c.imageUrl,
          caption: c.caption,
          tag: c.tag,
          type: 'cat',
        }))
      );
    }
    if (data.randomImages.length > 0) {
      await supabase.from('random_images').upsert(
        data.randomImages.map((r) => ({
          id: r.id,
          title: r.title,
          image_url: r.imageUrl,
          caption: r.caption,
          tag: r.tag,
          type: 'random_image',
        }))
      );
    }
    return true;
  } catch (err) {
    console.error('Supabase sync exception:', err);
    return false;
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

export async function deleteSupabaseItem(table: string, id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from(table).delete().eq('id', id);
  } catch {
    // ignore
  }
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
