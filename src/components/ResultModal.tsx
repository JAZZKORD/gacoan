import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Download } from 'lucide-react';
import type { GachaResult } from '../types';
import MessageCard from './MessageCard';
import SongCard from './SongCard';
import CouponCard from './CouponCard';
import CatCard from './CatCard';
import RandomImageCard from './RandomImageCard';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'heart' | 'star';
}

const CONFETTI_COLORS = ['#FFB3C6', '#E8D5FF', '#FFD6E0', '#B8E4FF', '#FFF9A0', '#B8F0D0'];

const generateConfetti = (count = 35): ConfettiPiece[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + Math.random() * 10,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    shape: (['circle', 'heart', 'star'] as const)[i % 3],
  }));

interface ResultModalProps {
  result: GachaResult | null;
  onClose: () => void;
  onTryAgain: () => void;
  onSave: () => void;
}

const categoryLabel: Record<string, string> = {
  message: '♡ Pesan ♡',
  cat: '🐱 Kucing Cute 🐱',
  random_image: '🎨 Gambar Random 🎨',
  song: '♫ Lagu ♫',
  coupon: '🎟️ Kupon 🎟️',
};

const categoryColors: Record<string, string> = {
  message: '#E84B7E',
  cat: '#FF7B54',
  random_image: '#38BDF8',
  song: '#9A56F5',
  coupon: '#FF7B54',
};

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose, onTryAgain, onSave }) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (result) {
      setConfetti(generateConfetti(35));
      setSaved(false);
    }
  }, [result]);

  const handleSave = useCallback(() => {
    setSaved(true);
    onSave();
  }, [onSave]);

  const handleTryAgain = useCallback(() => {
    setSaved(false);
    onTryAgain();
  }, [onTryAgain]);

  if (!result) return null;

  const color = categoryColors[result.type] || '#E84B7E';

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(92,61,78,0.5)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute"
                style={{ left: `${piece.x}%`, top: -20, color: piece.color, fontSize: piece.size }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{ y: '100vh', opacity: [1, 1, 0], rotate: Math.random() > 0.5 ? 720 : -720 }}
                transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
              >
                {piece.shape === 'heart' ? '♡' : piece.shape === 'star' ? '★' : (
                  <div style={{ width: piece.size, height: piece.size, borderRadius: '50%', background: piece.color }} />
                )}
              </motion.div>
            ))}
          </div>

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.98)',
              boxShadow: `0 30px 80px rgba(0,0,0,0.2), 0 0 0 3px ${color}44`,
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
            initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.4, rotate: 8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full p-2 transition-all hover:scale-110"
              style={{ background: 'rgba(200,100,140,0.1)' }}
              aria-label="Tutup"
            >
              <X size={18} style={{ color: '#9C6B7F' }} />
            </button>

            {/* Header */}
            <div
              className="px-6 pt-8 pb-5 text-center"
              style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)` }}
            >
              <motion.p
                className="font-nunito font-900 text-xs tracking-widest uppercase mb-1"
                style={{ color: '#9C6B7F', fontWeight: 800 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ✨ Kamu Dapat...
              </motion.p>
              <motion.h2
                className="font-pacifico text-3xl"
                style={{ color }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 15 }}
              >
                {categoryLabel[result.type]}
              </motion.h2>
            </div>

            {/* Content */}
            <div className="px-5 pb-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {result.type === 'message' && <MessageCard message={result} />}
                {result.type === 'cat' && <CatCard cat={result} />}
                {result.type === 'random_image' && <RandomImageCard image={result} />}
                {result.type === 'song' && <SongCard song={result} />}
                {result.type === 'coupon' && <CouponCard coupon={result} />}
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex gap-3 mt-5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={handleTryAgain}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-nunito font-800 text-sm"
                  style={{
                    background: 'rgba(200,100,140,0.1)',
                    color: '#E84B7E',
                    fontWeight: 800,
                    border: '2px solid rgba(200,100,140,0.2)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <RotateCcw size={15} />
                  Coba Lagi
                </motion.button>

                <motion.button
                  onClick={handleSave}
                  disabled={saved}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-nunito font-800 text-sm text-white"
                  style={{
                    background: saved
                      ? 'linear-gradient(135deg, #43AA8B, #2D8B72)'
                      : `linear-gradient(135deg, ${color}, ${color}CC)`,
                    fontWeight: 800,
                    boxShadow: saved ? '0 4px 15px rgba(67,170,139,0.3)' : `0 4px 15px ${color}44`,
                  }}
                  whileHover={{ scale: saved ? 1 : 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {saved ? (
                    '✓ Tersimpan!'
                  ) : (
                    <>
                      <Download size={15} />
                      {result.type === 'coupon' ? 'Simpan Kupon' : 'Simpan'}
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;
