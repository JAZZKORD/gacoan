import React from 'react';
import { motion } from 'framer-motion';
import type { CatResult } from '../types';

interface CatCardProps {
  cat: CatResult;
}

export const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-5 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,229,217,0.45))',
        boxShadow: '0 20px 60px rgba(255,159,122,0.22)',
        border: '2px solid rgba(255,159,122,0.3)',
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Background Ornaments */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15 bg-orange-300" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-15 bg-pink-300" />

      {/* Header */}
      <div className="text-center mb-3">
        <span className="text-3xl mb-1 block">🐱</span>
        <p className="font-nunito font-800 text-orange-600 text-xs tracking-widest uppercase" style={{ fontWeight: 800 }}>
          Kamu Dapat Gambar Kucing Cute!
        </p>
      </div>

      {/* Cat Image Box */}
      <div className="relative mx-auto mb-3 rounded-2xl overflow-hidden shadow-md border-2 border-orange-200 aspect-4/3 max-h-52 bg-orange-50">
        <img
          src={cat.imageUrl}
          alt={cat.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white font-nunito font-bold text-[10px]">
          {cat.tag || 'Cute Cat'}
        </div>
      </div>

      {/* Title & Caption */}
      <div className="text-center px-1">
        <h3 className="font-nunito font-900 text-base text-orange-950 mb-1 leading-snug">
          {cat.title}
        </h3>
        <p className="font-quicksand text-xs text-orange-900/80 leading-relaxed bg-orange-50/80 p-3 rounded-2xl border border-orange-100/60">
          "{cat.caption}"
        </p>
      </div>
    </motion.div>
  );
};

export default CatCard;
