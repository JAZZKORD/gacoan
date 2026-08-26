import { defaultMessages } from './data/messages';
import { defaultSongs } from './data/songs';
import { defaultCoupons } from './data/coupons';
import { defaultCats } from './data/cats';
import { defaultRandomImages } from './data/randomImages';

const SUPABASE_URL = 'https://iegtazzxupzhnlbyitbv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ew2qgJQB3iuyMjr-G6Ot9Q_D_-kxAeV';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Prefer': 'resolution=merge-duplicates',
};

async function seedSupabase() {
  console.log('Seeding Supabase Cloud tables...');

  // 1. Messages
  const msgRes = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(defaultMessages.map(m => ({ id: m.id, text: m.text, color: m.color, type: 'message' }))),
  });
  console.log('Messages seed:', msgRes.status);

  // 2. Songs
  const songRes = await fetch(`${SUPABASE_URL}/rest/v1/songs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(defaultSongs.map(s => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      album: s.album,
      cover_color: s.coverColor,
      cover_emoji: s.coverEmoji,
      duration: s.duration,
      spotify_url: s.spotifyUrl,
      spotify_track_id: s.spotifyTrackId,
      type: 'song'
    }))),
  });
  console.log('Songs seed:', songRes.status);

  // 3. Coupons
  const coupRes = await fetch(`${SUPABASE_URL}/rest/v1/coupons`, {
    method: 'POST',
    headers,
    body: JSON.stringify(defaultCoupons.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      emoji: c.emoji,
      color: c.color,
      bg_color: c.bgColor,
      valid_text: c.validText,
      code: c.code,
      type: 'coupon'
    }))),
  });
  console.log('Coupons seed:', coupRes.status);

  // 4. Cats
  const catRes = await fetch(`${SUPABASE_URL}/rest/v1/cats`, {
    method: 'POST',
    headers,
    body: JSON.stringify(defaultCats.map(c => ({
      id: c.id,
      title: c.title,
      image_url: c.imageUrl,
      caption: c.caption,
      tag: c.tag,
      type: 'cat'
    }))),
  });
  console.log('Cats seed:', catRes.status);

  // 5. Random Images
  const imgRes = await fetch(`${SUPABASE_URL}/rest/v1/random_images`, {
    method: 'POST',
    headers,
    body: JSON.stringify(defaultRandomImages.map(r => ({
      id: r.id,
      title: r.title,
      image_url: r.imageUrl,
      caption: r.caption,
      tag: r.tag,
      type: 'random_image'
    }))),
  });
  console.log('Random Images seed:', imgRes.status);

  console.log('Supabase Cloud Seed Complete!');
}

seedSupabase();
