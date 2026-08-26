import React from 'react';
import { motion } from 'framer-motion';

interface Decoration {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const DECORATIONS: Decoration[] = [
  // Hearts
  { id: 1, emoji: '♡', x: 5, y: 10, size: 22, delay: 0, duration: 6, opacity: 0.35 },
  { id: 2, emoji: '♡', x: 88, y: 5, size: 18, delay: 1.5, duration: 8, opacity: 0.3 },
  { id: 3, emoji: '♡', x: 15, y: 55, size: 14, delay: 3, duration: 7, opacity: 0.25 },
  { id: 4, emoji: '♡', x: 93, y: 60, size: 20, delay: 0.8, duration: 9, opacity: 0.3 },
  { id: 5, emoji: '♡', x: 50, y: 2, size: 16, delay: 2, duration: 6.5, opacity: 0.25 },
  { id: 6, emoji: '💕', x: 78, y: 30, size: 18, delay: 4, duration: 7.5, opacity: 0.3 },
  // Stars
  { id: 7, emoji: '★', x: 10, y: 30, size: 16, delay: 1, duration: 5, opacity: 0.3 },
  { id: 8, emoji: '✦', x: 85, y: 45, size: 14, delay: 2.5, duration: 6, opacity: 0.25 },
  { id: 9, emoji: '⭐', x: 30, y: 8, size: 16, delay: 0.5, duration: 8, opacity: 0.25 },
  { id: 10, emoji: '✨', x: 70, y: 15, size: 18, delay: 3.5, duration: 6.5, opacity: 0.35 },
  { id: 11, emoji: '★', x: 60, y: 90, size: 14, delay: 1.8, duration: 7, opacity: 0.2 },
  { id: 12, emoji: '✦', x: 20, y: 80, size: 12, delay: 4.5, duration: 5.5, opacity: 0.25 },
  // Capsules
  { id: 13, emoji: '💊', x: 2, y: 70, size: 14, delay: 2.2, duration: 9, opacity: 0.2 },
  { id: 14, emoji: '💊', x: 95, y: 80, size: 12, delay: 3.8, duration: 8, opacity: 0.2 },
  // Sparkles
  { id: 15, emoji: '🌸', x: 40, y: 95, size: 18, delay: 1.2, duration: 7, opacity: 0.3 },
  { id: 16, emoji: '🌸', x: 75, y: 92, size: 14, delay: 5, duration: 6, opacity: 0.25 },
];

const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {DECORATIONS.map((d) => (
        <motion.div
          key={d.id}
          className="absolute select-none"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            fontSize: d.size,
            opacity: d.opacity,
            color: '#E84B7E',
          }}
          animate={{
            y: [0, -18, -8, -20, 0],
            x: [0, 5, -3, 4, 0],
            rotate: [0, 8, -5, 6, 0],
            scale: [1, 1.05, 0.98, 1.03, 1],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {d.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingDecorations;
