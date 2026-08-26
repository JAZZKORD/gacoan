import React from 'react';
import { motion } from 'framer-motion';
import type { CouponResult } from '../types';

interface CouponCardProps {
  coupon: CouponResult;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: `linear-gradient(135deg, ${coupon.bgColor}, rgba(255,255,255,0.97))`,
        boxShadow: `0 20px 60px ${coupon.color}44`,
        border: `2px solid ${coupon.color}55`,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Header strip */}
      <div
        className="px-6 pt-6 pb-4 text-center"
        style={{ background: `linear-gradient(135deg, ${coupon.color}, ${coupon.color}BB)` }}
      >
        <motion.div
          className="text-5xl mb-2 block"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {coupon.emoji}
        </motion.div>
        <p className="font-nunito font-900 text-white text-xs tracking-widest uppercase opacity-90" style={{ fontWeight: 800 }}>
          🎟️ Kupon Spesial • Ultra Rare (2%) 🎟️
        </p>
      </div>

      {/* Tear line */}
      <div className="flex items-center px-0 py-0 relative" style={{ height: 20 }}>
        <div className="absolute -left-3 w-6 h-6 rounded-full" style={{ background: '#fff0f5' }} />
        <div className="flex-1 mx-5 border-dashed border-t-2" style={{ borderColor: `${coupon.color}55` }} />
        <div className="absolute -right-3 w-6 h-6 rounded-full" style={{ background: '#fff0f5' }} />
      </div>

      {/* Body */}
      <div className="px-6 pb-6 pt-2 text-center">
        <motion.h3
          className="font-nunito font-900 text-2xl mb-2"
          style={{ color: coupon.color, fontWeight: 900 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {coupon.title}
        </motion.h3>

        <motion.p
          className="font-quicksand text-sm leading-relaxed mb-4"
          style={{ color: '#7A5060' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {coupon.description}
        </motion.p>

        <motion.div
          className="rounded-2xl px-4 py-2 mb-4"
          style={{ background: `${coupon.color}15`, border: `1px dashed ${coupon.color}66` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-quicksand text-xs" style={{ color: coupon.color }}>
            📌 {coupon.validText}
          </p>
        </motion.div>

        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${coupon.color}44` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="font-nunito text-xs font-700" style={{ color: '#9C6B7F', fontWeight: 700 }}>Kode:</span>
          <span className="font-nunito font-900 text-xs tracking-widest" style={{ color: coupon.color, fontWeight: 900 }}>
            {coupon.code}
          </span>
        </motion.div>
      </div>

      <div className="absolute top-4 right-4 text-white opacity-40 text-lg">★</div>
      <div className="absolute top-8 right-8 text-white opacity-20 text-sm">✦</div>
    </motion.div>
  );
};

export default CouponCard;
