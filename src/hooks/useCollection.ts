import { useState, useEffect } from 'react';
import type { CollectionState, GachaHistoryItem, GachaResult, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';

const COLLECTION_KEY = 'gachapon_collection_v2';
const HISTORY_KEY = 'gachapon_history_v2';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function useCollection() {
  const [collection, setCollection] = useState<CollectionState>(() =>
    loadFromStorage<CollectionState>(COLLECTION_KEY, { messages: [], songs: [], coupons: [], cats: [], randomImages: [] })
  );

  const [history, setHistory] = useState<GachaHistoryItem[]>(() =>
    loadFromStorage<GachaHistoryItem[]>(HISTORY_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  }, [collection]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addToCollection = (result: GachaResult) => {
    setCollection((prev) => {
      switch (result.type) {
        case 'message':
          return { ...prev, messages: [result as MessageResult, ...(prev.messages || [])] };
        case 'song':
          return { ...prev, songs: [result as SongResult, ...(prev.songs || [])] };
        case 'coupon':
          return { ...prev, coupons: [result as CouponResult, ...(prev.coupons || [])] };
        case 'cat':
          return { ...prev, cats: [result as CatResult, ...(prev.cats || [])] };
        case 'random_image':
          return { ...prev, randomImages: [result as RandomImageResult, ...(prev.randomImages || [])] };
        default:
          return prev;
      }
    });

    const historyItem: GachaHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      category: result.type,
      timestamp: Date.now(),
      result,
    };
    setHistory((prev) => [historyItem, ...prev].slice(0, 20));
  };

  const clearCollection = () => {
    setCollection({ messages: [], songs: [], coupons: [], cats: [], randomImages: [] });
    setHistory([]);
  };

  return { collection, history, addToCollection, clearCollection };
}
