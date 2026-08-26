import { useState, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { GachaResult, GachaCategory } from './types';
import { rollGacha } from './hooks/useGacha';
import { useCollection } from './hooks/useCollection';
import GashaponMachine from './components/GashaponMachine';
import ResultModal from './components/ResultModal';
import Collection from './components/Collection';
import FloatingDecorations from './components/FloatingDecorations';
import AdminPage from './pages/AdminPage';

const CAPSULE_COLORS_BY_TYPE: Record<string, string> = {
  message: '#FFB3C6',
  song: '#C77DFF',
  coupon: '#FFB385',
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main Page ───────────────────────────────────────────────────────────────
function MainPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [capsuleDropped, setCapsuleDropped] = useState(false);
  const [capsuleColor, setCapsuleColor] = useState('#FFB3C6');
  const [shownResult, setShownResult] = useState<GachaResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const recentCategories = useRef<GachaCategory[]>([]);
  const { collection, history, addToCollection } = useCollection();

  const handleSpin = useCallback(async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCapsuleDropped(false);
    setShownResult(null);

    const result = rollGacha(recentCategories.current);
    setCapsuleColor(CAPSULE_COLORS_BY_TYPE[result.type] || '#FFB3C6');
    recentCategories.current = [result.type, ...recentCategories.current].slice(0, 3);

    // Turn handle & tumble capsules inside dome
    await delay(750);
    // Drop capsule into output slot tray
    setCapsuleDropped(true);
    await delay(1000);
    // Open capsule modal
    setCapsuleDropped(false);
    setShownResult(result);
    setIsSpinning(false);
  }, [isSpinning]);

  const handleClose = useCallback(() => {
    setShownResult(null);
    setIsSaved(false);
  }, []);

  const handleTryAgain = useCallback(() => {
    setShownResult(null);
    setIsSaved(false);
    setTimeout(() => handleSpin(), 300);
  }, [handleSpin]);

  const handleSave = useCallback(() => {
    if (shownResult && !isSaved) {
      addToCollection(shownResult);
      setIsSaved(true);
    }
  }, [shownResult, isSaved, addToCollection]);

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(160deg,#fff0f5 0%,#fde8ee 40%,#f3e6ff 80%,#fff0f5 100%)' }}>
      <div className="fixed inset-0 bg-dots opacity-40 pointer-events-none" />
      <FloatingDecorations />

      {/* Hero Header */}
      <section className="relative z-10 flex flex-col items-center pt-6 sm:pt-12 pb-3 sm:pb-6 px-4 text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 sm:mb-5 font-nunito text-xs font-800"
          style={{ background: 'rgba(255,179,205,0.3)', border: '1px solid rgba(232,75,126,0.25)', color: '#E84B7E', fontWeight: 800, backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>🎀</motion.span>
          <span>Hadiah spesial, khusus untukmu</span>
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>♡</motion.span>
        </motion.div>

        <motion.h1
          className="font-pacifico mb-3 leading-tight"
          style={{
            fontSize: 'clamp(1.8rem, 8vw, 3.2rem)',
            background: 'linear-gradient(135deg,#E84B7E,#C77DFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          Ada Apa di Dalam
          <br />
          Gachamu? 🎁
        </motion.h1>

        <motion.p
          className="font-quicksand max-w-xs leading-relaxed"
          style={{ color: '#9C6B7F', fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Putar handlenya dan lihat kejutan apa yang menunggumu ♡
        </motion.p>

        <motion.div className="mt-4 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="font-quicksand text-sm" style={{ color: '#9C6B7F' }}>Total putaran:</span>
          <span className="font-nunito font-900 text-lg" style={{ color: '#E84B7E', fontWeight: 900 }}>{history.length}</span>
          <span className="text-sm">🌸</span>
        </motion.div>

        {/* Probability Rates */}
        <motion.div
          className="mt-3 flex items-center justify-center gap-1.5 flex-wrap max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span className="font-nunito font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-pink-100/80 text-pink-600 border border-pink-200">
            💌 Pesan (50%)
          </span>
          <span className="font-nunito font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-orange-100/80 text-orange-600 border border-orange-200">
            🐱 Kucing (25%)
          </span>
          <span className="font-nunito font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-sky-100/80 text-sky-600 border border-sky-200">
            🎨 Gambar (15%)
          </span>
          <span className="font-nunito font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-purple-100/80 text-purple-600 border border-purple-200">
            🎵 Lagu (8%)
          </span>
          <span className="font-nunito font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-red-100/80 text-red-600 border border-red-200 shadow-xs">
            🎟️ Kupon (2% - Ultra Rare!)
          </span>
        </motion.div>
      </section>

      {/* Machine Section */}
      <section className="relative z-10 flex flex-col items-center pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <GashaponMachine
            isSpinning={isSpinning}
            onSpin={handleSpin}
            capsuleDropped={capsuleDropped}
            capsuleColor={capsuleColor}
          />
        </motion.div>
        <motion.p className="font-quicksand text-xs mt-3 text-center opacity-60" style={{ color: '#9C6B7F' }} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1 }}>
          Klik mesin atau tombol untuk memutar ✨
        </motion.p>
      </section>

      {/* Divider */}
      <div className="relative z-10 flex items-center gap-4 px-8 max-w-2xl mx-auto mb-4">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(232,75,126,0.3))' }} />
        <span className="font-pacifico text-sm" style={{ color: '#E84B7E', opacity: 0.6 }}>✦ ✦ ✦</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(232,75,126,0.3),transparent)' }} />
      </div>

      <Collection collection={collection} />

      {/* Footer */}
      <footer className="relative z-10 text-center pb-10 px-4">
        <motion.p className="font-pacifico text-sm" style={{ color: '#E84B7E', opacity: 0.5 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
          dibuat dengan cinta ♡
        </motion.p>
      </footer>

      <ResultModal result={shownResult} onClose={handleClose} onTryAgain={handleTryAgain} onSave={handleSave} />
    </div>
  );
}

// ─── App Router with Hidden Admin Route ──────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* Secret Admin Route - Accessible only via direct secret URL */}
        <Route path="/secret-admin-gate" element={<AdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
