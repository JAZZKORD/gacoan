import React from 'react';
import { motion } from 'framer-motion';
import type { GachaHistoryItem, GachaCategory } from '../types';

interface GachaHistoryProps {
  history: GachaHistoryItem[];
}

const CATEGORY_CONFIG: Record<GachaCategory, { icon: string; label: string; color: string }> = {
  message: { icon: '💌', label: 'Pesan', color: '#E84B7E' },
  cat: { icon: '🐱', label: 'Gambar Kucing', color: '#FF7B54' },
  random_image: { icon: '🎨', label: 'Gambar Aesthetic', color: '#38BDF8' },
  song: { icon: '🎵', label: 'Lagu Spotify', color: '#9A56F5' },
  coupon: { icon: '🎟️', label: 'Kupon', color: '#FF7B54' },
};

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'baru saja';
  if (minutes === 1) return '1 menit lalu';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours === 1) return '1 jam lalu';
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return 'kemarin';
  return `${days} hari lalu`;
}

function getPreview(item: GachaHistoryItem): string {
  const r = item.result;
  if (r.type === 'message') return `"${r.text.slice(0, 42)}..."`;
  if (r.type === 'cat') return r.title;
  if (r.type === 'random_image') return r.title;
  if (r.type === 'song') return r.title || '🎵 Lagu Spotify';
  if (r.type === 'coupon') return r.title;
  return '';
}

const GachaHistory: React.FC<GachaHistoryProps> = ({ history }) => {
  if (history.length === 0) return null;
  return (
    <section className="relative z-10 max-w-2xl mx-auto px-4 pb-16">
      <motion.div
        className="rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255,179,205,0.4)',
          boxShadow: '0 8px 30px rgba(232,75,126,0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h3 className="font-pacifico text-xl mb-5 text-center" style={{ color: '#E84B7E' }}>
          Riwayat Gacha Kamu ✨
        </h3>
        <div className="flex flex-col gap-2">
          {history.slice(0, 10).map((item, i) => {
            const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.message;
            return (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: `${config.color}10` }}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center justify-center rounded-xl flex-shrink-0 text-base"
                  style={{ width: 36, height: 36, background: `${config.color}20` }}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-nunito font-800 text-xs block" style={{ color: config.color, fontWeight: 800 }}>
                    {config.label}
                  </span>
                  <p className="font-quicksand text-xs truncate opacity-70" style={{ color: '#5C3D4E' }}>
                    {getPreview(item)}
                  </p>
                </div>
                <span className="font-quicksand text-xs flex-shrink-0" style={{ color: '#9C6B7F' }}>
                  {timeAgo(item.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default GachaHistory;
