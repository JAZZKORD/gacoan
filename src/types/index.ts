// Types for the Gashapon system

export type GachaCategory = 'message' | 'song' | 'coupon' | 'cat' | 'random_image';

export interface MessageResult {
  type: 'message';
  id: string;
  text: string;
  color: string;
}

export interface SongResult {
  type: 'song';
  id: string;
  title: string;
  artist: string;
  album: string;
  coverColor: string;
  coverEmoji: string;
  duration: number; // seconds
  spotifyUrl?: string;   // full Spotify track URL
  spotifyTrackId?: string; // extracted track ID for embed
  audioUrl?: string; // direct mp3 / audio preview URL
}

export interface CouponResult {
  type: 'coupon';
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
  validText: string;
  code: string;
}

export interface CatResult {
  type: 'cat';
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  tag: string;
}

export interface RandomImageResult {
  type: 'random_image';
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  tag: string;
}

export type GachaResult = MessageResult | SongResult | CouponResult | CatResult | RandomImageResult;

export interface GachaHistoryItem {
  id: string;
  category: GachaCategory;
  timestamp: number;
  result: GachaResult;
}

export interface CollectionState {
  messages: MessageResult[];
  songs: SongResult[];
  coupons: CouponResult[];
  cats: CatResult[];
  randomImages: RandomImageResult[];
}

export interface StoreData {
  messages: MessageResult[];
  songs: SongResult[];
  coupons: CouponResult[];
  cats: CatResult[];
  randomImages: RandomImageResult[];
}
