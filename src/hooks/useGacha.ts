import type { GachaCategory, GachaResult } from '../types';
import { getAllMessages, getAllSongs, getAllCoupons, getAllCats, getAllRandomImages } from './useAdminData';

// Weighted probabilities (%)
// Coupon is set to 2% Ultra Rare (hardest to get!)
export const WEIGHTS: Record<GachaCategory, number> = {
  message: 50,      // 50% Common
  cat: 25,          // 25% Common-Rare (Gambar Kucing Cute)
  random_image: 15, // 15% Rare (Gambar Random Aesthetic)
  song: 8,          // 8% Rare (Lagu Spotify)
  coupon: 2,        // 2% ULTRA RARE (Paling Susah Didapat!)
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function rollCategory(recentCategories: GachaCategory[] = []): GachaCategory {
  const adjustedWeights = { ...WEIGHTS };

  // Gently adjust weights if repeated in recent turns to maintain variety
  recentCategories.forEach((cat) => {
    adjustedWeights[cat] = Math.max(1, adjustedWeights[cat] * 0.6);
  });

  const total = Object.values(adjustedWeights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (const [cat, weight] of Object.entries(adjustedWeights)) {
    r -= weight;
    if (r <= 0) return cat as GachaCategory;
  }
  return 'message';
}

function pickRandom<T>(arr: T[]): T {
  if (!arr || arr.length === 0) return null as any;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function rollGacha(recentCategories: GachaCategory[] = []): GachaResult {
  const category = rollCategory(recentCategories);
  switch (category) {
    case 'message': {
      const messages = getAllMessages();
      const template = pickRandom(messages);
      return { ...template, id: generateId() };
    }
    case 'cat': {
      const cats = getAllCats();
      const template = pickRandom(cats);
      return { ...template, id: generateId() };
    }
    case 'random_image': {
      const images = getAllRandomImages();
      const template = pickRandom(images);
      return { ...template, id: generateId() };
    }
    case 'song': {
      const songs = getAllSongs();
      const template = pickRandom(songs);
      return { ...template, id: generateId() };
    }
    case 'coupon': {
      const coupons = getAllCoupons();
      const template = pickRandom(coupons);
      return { ...template, id: generateId() };
    }
  }
}
