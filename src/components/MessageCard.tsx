import React from 'react';
import { motion } from 'framer-motion';
import type { MessageResult } from '../types';

interface MessageCardProps {
  message: MessageResult;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-6 text-center"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.95), ${message.color}55)`,
        boxShadow: `0 20px 60px ${message.color}66`,
        border: `2px solid ${message.color}88`,
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Decorative */}
      <div className="absolute top-3 left-4 text-2xl opacity-25 animate-pulse-heart">💕</div>
      <div className="absolute top-3 right-4 text-xl opacity-25 animate-pulse-heart" style={{ animationDelay: '0.5s' }}>🌸</div>
      <div className="absolute bottom-3 left-4 text-lg opacity-20">✨</div>
      <div className="absolute bottom-3 right-4 text-lg opacity-20">⭐</div>
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-15" style={{ background: message.color }} />
      <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full opacity-15" style={{ background: message.color }} />

      {/* Icon */}
      <motion.div
        className="text-5xl mb-4 block"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        💌
      </motion.div>

      {/* Header */}
      <p className="font-nunito font-800 text-pink-600 text-xs tracking-widest uppercase mb-4" style={{ fontWeight: 800 }}>
        ♡ Pesan Manis Untukmu ♡
      </p>

      {/* Message */}
      <motion.blockquote
        className="font-quicksand text-base leading-relaxed relative z-10 px-2"
        style={{ color: '#5C3D4E', fontSize: '0.97rem', lineHeight: 1.75 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        "{message.text}"
      </motion.blockquote>

      {/* Divider */}
      <motion.div
        className="mx-auto mt-5 h-0.5 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${message.color}, transparent)`,
          maxWidth: 120,
        }}
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />


    </motion.div>
  );
};

export default MessageCard;
