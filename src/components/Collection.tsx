import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CollectionState, GachaResult, MessageResult, SongResult, CouponResult, CatResult, RandomImageResult } from '../types';
import ResultModal from './ResultModal';

interface CollectionProps {
  collection: CollectionState;
}

type Tab = 'messages' | 'cats' | 'randomImages' | 'songs' | 'coupons';

const TABS = [
  { key: 'messages' as Tab, label: 'Pesan', icon: '💌' },
  { key: 'cats' as Tab, label: 'Kucing', icon: '🐱' },
  { key: 'randomImages' as Tab, label: 'Gambar', icon: '🎨' },
  { key: 'songs' as Tab, label: 'Lagu', icon: '🎵' },
  { key: 'coupons' as Tab, label: 'Kupon', icon: '🎟️' },
];

const MessageMini: React.FC<{ item: MessageResult; onClick: () => void }> = ({ item, onClick }) => (
  <motion.button
    onClick={onClick}
    className="text-left w-full p-4 rounded-2xl cursor-pointer"
    style={{ background: `linear-gradient(135deg,rgba(255,255,255,0.9),${item.color}44)`, border: `1.5px solid ${item.color}88`, boxShadow: `0 4px 15px ${item.color}33` }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-xl mb-2">💌</div>
    <p className="font-quicksand text-xs leading-relaxed" style={{ color: '#5C3D4E', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
      "{item.text}"
    </p>
  </motion.button>
);

const CatMini: React.FC<{ item: CatResult; onClick: () => void }> = ({ item, onClick }) => (
  <motion.button
    onClick={onClick}
    className="text-left w-full p-3 rounded-2xl cursor-pointer bg-white/90 border border-orange-200 overflow-hidden shadow-sm"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="w-full h-24 rounded-xl overflow-hidden mb-2 bg-orange-100">
      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
    </div>
    <p className="font-nunito font-bold text-xs text-orange-950 truncate">{item.title}</p>
  </motion.button>
);

const RandomImageMini: React.FC<{ item: RandomImageResult; onClick: () => void }> = ({ item, onClick }) => (
  <motion.button
    onClick={onClick}
    className="text-left w-full p-3 rounded-2xl cursor-pointer bg-white/90 border border-sky-200 overflow-hidden shadow-sm"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="w-full h-24 rounded-xl overflow-hidden mb-2 bg-sky-100">
      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
    </div>
    <p className="font-nunito font-bold text-xs text-sky-950 truncate">{item.title}</p>
  </motion.button>
);

const SongMini: React.FC<{ item: SongResult; onClick: () => void }> = ({ item, onClick }) => (
  <motion.button
    onClick={onClick}
    className="text-left w-full p-4 rounded-2xl cursor-pointer"
    style={{ background: `linear-gradient(135deg,rgba(255,255,255,0.9),${item.coverColor || '#E8D5FF'}55)`, border: `1.5px solid ${item.coverColor || '#E8D5FF'}88`, boxShadow: `0 4px 15px ${item.coverColor || '#E8D5FF'}33` }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 text-lg" style={{ background: `linear-gradient(135deg,${item.coverColor || '#E8D5FF'},#FFB3C6)` }}>
      {item.coverEmoji || '🎵'}
    </div>
    <p className="font-nunito font-bold text-xs text-purple-700 truncate">{item.title || '🎵 Lagu Spotify'}</p>
  </motion.button>
);

const CouponMini: React.FC<{ item: CouponResult; onClick: () => void }> = ({ item, onClick }) => (
  <motion.button
    onClick={onClick}
    className="text-left w-full p-4 rounded-2xl cursor-pointer"
    style={{ background: `linear-gradient(135deg,rgba(255,255,255,0.9),${item.bgColor})`, border: `1.5px solid ${item.color}55`, boxShadow: `0 4px 15px ${item.color}22` }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-2xl mb-1">{item.emoji}</div>
    <p className="font-nunito font-900 text-xs" style={{ color: item.color, fontWeight: 900 }}>{item.title}</p>
    <p className="font-quicksand text-xs opacity-70 mt-0.5" style={{ color: '#7A5060', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
      {item.description}
    </p>
  </motion.button>
);

const Collection: React.FC<CollectionProps> = ({ collection }) => {
  const [activeTab, setActiveTab] = useState<Tab>('messages');
  const [detailResult, setDetailResult] = useState<GachaResult | null>(null);

  const messages = collection.messages || [];
  const songs = collection.songs || [];
  const coupons = collection.coupons || [];
  const cats = collection.cats || [];
  const randomImages = collection.randomImages || [];

  const isEmpty = messages.length === 0 && songs.length === 0 && coupons.length === 0 && cats.length === 0 && randomImages.length === 0;

  const tabCounts: Record<Tab, number> = {
    messages: messages.length,
    cats: cats.length,
    randomImages: randomImages.length,
    songs: songs.length,
    coupons: coupons.length,
  };

  return (
    <section className="relative z-10 max-w-2xl mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-pacifico text-3xl mb-2" style={{ color: '#E84B7E' }}>
          Koleksi Gacha Kamu ♡
        </h2>
        <p className="font-quicksand text-sm" style={{ color: '#9C6B7F' }}>
          Semua hadiahmu tersimpan di sini 🌸
        </p>
      </motion.div>

      {isEmpty ? (
        <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-5xl mb-4 animate-bounce-gentle">🎀</div>
          <p className="font-quicksand" style={{ color: '#9C6B7F' }}>Koleksimu masih kosong!</p>
          <p className="font-quicksand text-sm mt-1 opacity-70" style={{ color: '#9C6B7F' }}>Putar mesin untuk mulai mengumpulkan ♡</p>
        </motion.div>
      ) : (
        <>
          <div className="flex gap-1.5 mb-6 p-1.5 rounded-2xl flex-wrap" style={{ background: 'rgba(255,179,205,0.2)' }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-nunito text-xs sm:text-sm transition-all"
                style={{
                  fontWeight: 800,
                  background: activeTab === tab.key ? 'linear-gradient(135deg,#FF85A1,#E84B7E)' : 'transparent',
                  color: activeTab === tab.key ? 'white' : '#9C6B7F',
                  boxShadow: activeTab === tab.key ? '0 4px 12px rgba(232,75,126,0.3)' : 'none',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tabCounts[tab.key] > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                    background: activeTab === tab.key ? 'rgba(255,255,255,0.3)' : 'rgba(232,75,126,0.15)',
                    color: activeTab === tab.key ? 'white' : '#E84B7E',
                  }}>
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'messages' && (messages.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 text-center py-10">
                  <p className="font-quicksand text-sm" style={{ color: '#9C6B7F' }}>Belum ada pesan ♡</p>
                </div>
              ) : messages.map((item) => (
                <MessageMini key={item.id} item={item} onClick={() => setDetailResult(item)} />
              )))}

              {activeTab === 'cats' && (cats.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 text-center py-10">
                  <p className="font-quicksand text-sm" style={{ color: '#9C6B7F' }}>Belum ada gambar kucing ♡</p>
                </div>
              ) : cats.map((item) => (
                <CatMini key={item.id} item={item} onClick={() => setDetailResult(item)} />
              )))}

              {activeTab === 'randomImages' && (randomImages.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 text-center py-10">
                  <p className="font-quicksand text-sm" style={{ color: '#9C6B7F' }}>Belum ada gambar random ♡</p>
                </div>
              ) : randomImages.map((item) => (
                <RandomImageMini key={item.id} item={item} onClick={() => setDetailResult(item)} />
              )))}

              {activeTab === 'songs' && (songs.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 text-center py-10">
                  <p className="font-quicksand text-sm" style={{ color: '#9C6B7F' }}>Belum ada lagu ♡</p>
                </div>
              ) : songs.map((item) => (
                <SongMini key={item.id} item={item} onClick={() => setDetailResult(item)} />
              )))}

              {activeTab === 'coupons' && (coupons.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 text-center py-10">
                  <p className="font-quicksand text-sm" style={{ color: '#9C6B7F' }}>Belum ada kupon ♡</p>
                </div>
              ) : coupons.map((item) => (
                <CouponMini key={item.id} item={item} onClick={() => setDetailResult(item)} />
              )))}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {detailResult && (
        <ResultModal
          result={detailResult}
          onClose={() => setDetailResult(null)}
          onTryAgain={() => setDetailResult(null)}
          onSave={() => {}}
        />
      )}
    </section>
  );
};

export default Collection;
