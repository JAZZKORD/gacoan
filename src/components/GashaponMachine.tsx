import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

interface GashaponMachineProps {
  isSpinning: boolean;
  onSpin: () => void;
  capsuleDropped: boolean;
  capsuleColor: string;
}

// Centered capsules inside the dome (cx: 150, cy: 115, radius: 92)
const INSIDE_CAPSULES = [
  // Top Layer
  { id: 1, x: 130, y: 62, size: 27, color: '#FFB3C6', rotation: 12 },
  { id: 2, x: 156, y: 58, size: 26, color: '#E8D5FF', rotation: -25 },
  { id: 3, x: 178, y: 68, size: 28, color: '#B8E4FF', rotation: 35 },
  // Upper-Middle Layer
  { id: 4, x: 108, y: 86, size: 28, color: '#FFE5A0', rotation: -15 },
  { id: 5, x: 136, y: 88, size: 30, color: '#B8F0D0', rotation: 25 },
  { id: 6, x: 164, y: 86, size: 28, color: '#FFC9DE', rotation: -10 },
  { id: 7, x: 190, y: 92, size: 26, color: '#D4B8F0', rotation: 20 },
  // Center Core Layer
  { id: 8, x: 96, y: 115, size: 28, color: '#FFD6B8', rotation: -35 },
  { id: 9, x: 124, y: 118, size: 30, color: '#B8E8FF', rotation: 15 },
  { id: 10, x: 152, y: 115, size: 32, color: '#F0B8D4', rotation: -8 },
  { id: 11, x: 180, y: 118, size: 29, color: '#FFC4A3', rotation: 22 },
  { id: 12, x: 202, y: 112, size: 25, color: '#D0F5E0', rotation: -18 },
  // Lower Layer
  { id: 13, x: 116, y: 144, size: 29, color: '#FFB3C6', rotation: 10 },
  { id: 14, x: 148, y: 146, size: 31, color: '#E8D5FF', rotation: -20 },
  { id: 15, x: 178, y: 142, size: 28, color: '#B8E4FF', rotation: 30 },
];

const GashaponMachine: React.FC<GashaponMachineProps> = ({
  isSpinning,
  onSpin,
  capsuleDropped,
  capsuleColor,
}) => {
  const [handleAngle, setHandleAngle] = useState(0);
  const controls = useAnimation();

  const handleTurn = async () => {
    if (isSpinning) return;

    // Trigger machine body shake/bounce animation
    controls.start({
      rotate: [0, -4, 5, -4, 4, -2, 2, 0],
      y: [0, -6, 2, -4, 1, 0],
      scale: [1, 1.02, 0.99, 1.01, 1],
      transition: { duration: 0.7, ease: 'easeInOut' },
    });

    // Rotate handle
    setHandleAngle((prev) => prev + 360);
    onSpin();
  };

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Machine SVG Container (Responsive Mobile Scaling) */}
      <motion.div
        animate={controls}
        className="relative cursor-pointer w-[250px] h-[366px] sm:w-[290px] sm:h-[425px] transition-all"
        onClick={handleTurn}
        whileHover={{ scale: isSpinning ? 1 : 1.02 }}
        whileTap={{ scale: isSpinning ? 1 : 0.98 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Soft Shadow */}
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#E84B7E" floodOpacity="0.18" />
            </filter>

            {/* Globe Gradient */}
            <radialGradient id="globeGlass" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset="45%" stopColor="rgba(255, 235, 245, 0.45)" />
              <stop offset="85%" stopColor="rgba(235, 215, 245, 0.65)" />
              <stop offset="100%" stopColor="rgba(255, 182, 205, 0.75)" />
            </radialGradient>

            {/* Glass Shine */}
            <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* Base Body Gradient */}
            <linearGradient id="bodyBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#FFF0F5" />
              <stop offset="100%" stopColor="#FFD4E2" />
            </linearGradient>

            <linearGradient id="pinkAccent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF85AE" />
              <stop offset="100%" stopColor="#E84B7E" />
            </linearGradient>

            {/* Slot Interior Depth Gradient */}
            <linearGradient id="slotDepth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A0A14" />
              <stop offset="35%" stopColor="#2D1323" />
              <stop offset="100%" stopColor="#180713" />
            </linearGradient>

            {/* Dome Clipping for Capsules */}
            <clipPath id="domeClip">
              <circle cx="150" cy="115" r="92" />
            </clipPath>
          </defs>

          {/* ── BASE FLOOR SHADOW ── */}
          <ellipse cx="150" cy="430" rx="100" ry="10" fill="rgba(232, 75, 126, 0.2)" />

          {/* ── MACHINE FEET ── */}
          <rect x="75" y="405" width="40" height="20" rx="8" fill="#E84B7E" />
          <rect x="185" y="405" width="40" height="20" rx="8" fill="#E84B7E" />

          {/* ── LOWER BASE BODY ── */}
          <rect
            x="40"
            y="190"
            width="220"
            height="220"
            rx="32"
            fill="url(#bodyBg)"
            stroke="#FFB3CD"
            strokeWidth="4"
            filter="url(#shadow)"
          />

          {/* Body Top Mold Trim */}
          <rect x="35" y="180" width="230" height="24" rx="12" fill="url(#pinkAccent)" />
          <rect x="45" y="185" width="210" height="4" rx="2" fill="rgba(255,255,255,0.4)" />

          {/* ── DOME GLOBE BACKGROUND & CAPSULES ── */}
          <circle cx="150" cy="115" r="95" fill="rgba(255,240,245,0.95)" stroke="#FFB3CD" strokeWidth="4" />

          {/* Inside Swirling Capsules (CENTERED) */}
          <g clipPath="url(#domeClip)">
            {INSIDE_CAPSULES.map((cap) => (
              <motion.g
                key={cap.id}
                animate={
                  isSpinning
                    ? {
                        y: [0, -18, 10, -14, 6, 0],
                        x: [0, 12, -12, 10, -6, 0],
                        rotate: [cap.rotation, cap.rotation + 180, cap.rotation + 360],
                      }
                    : {
                        y: [0, -4, 0, 3, 0],
                        rotate: [cap.rotation, cap.rotation + 5, cap.rotation - 5, cap.rotation],
                      }
                }
                transition={
                  isSpinning
                    ? { duration: 0.8, repeat: 1, ease: 'easeInOut' }
                    : { duration: 3 + (cap.id % 3), repeat: Infinity, ease: 'easeInOut' }
                }
              >
                {/* Capsule top half */}
                <path
                  d={`M ${cap.x - cap.size / 2} ${cap.y} A ${cap.size / 2} ${cap.size / 2} 0 0 1 ${
                    cap.x + cap.size / 2
                  } ${cap.y} Z`}
                  fill={cap.color}
                />
                {/* Capsule bottom half */}
                <path
                  d={`M ${cap.x - cap.size / 2} ${cap.y} A ${cap.size / 2} ${cap.size / 2} 0 0 0 ${
                    cap.x + cap.size / 2
                  } ${cap.y} Z`}
                  fill="#FFFFFF"
                  opacity="0.9"
                />
                {/* Capsule Center Seam Line */}
                <line
                  x1={cap.x - cap.size / 2}
                  y1={cap.y}
                  x2={cap.x + cap.size / 2}
                  y2={cap.y}
                  stroke={cap.color}
                  strokeWidth="2"
                />
                {/* Shine */}
                <circle cx={cap.x - cap.size / 4} cy={cap.y - cap.size / 4} r={cap.size / 6} fill="#FFF" opacity="0.7" />
              </motion.g>
            ))}
          </g>

          {/* Dome Glass Cover Shader & Reflection */}
          <circle cx="150" cy="115" r="95" fill="url(#globeGlass)" />
          <path d="M 80 70 A 90 90 0 0 1 220 70 A 95 95 0 0 0 80 70 Z" fill="url(#glassReflection)" />
          <ellipse cx="110" cy="55" rx="35" ry="18" fill="#FFF" opacity="0.5" transform="rotate(-25 110 55)" />

          {/* Dome Outer Rim Highlight */}
          <circle cx="150" cy="115" r="95" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />

          {/* ── FRONT PANEL DECORATIONS & ABSTRACT CUTE STICKERS ── */}

          {/* Japanese Pricing Label */}
          <g transform="translate(52, 218)">
            <rect x="0" y="0" width="68" height="32" rx="8" fill="#FFF" stroke="#FF85AE" strokeWidth="2" />
            <text x="34" y="21" textAnchor="middle" fill="#E84B7E" fontSize="14" fontFamily="Nunito" fontWeight="900">
              ¥200
            </text>
          </g>

          {/* Coin Slot Sticker */}
          <g transform="translate(180, 218)">
            <rect x="0" y="0" width="68" height="32" rx="8" fill="#FFF5C0" stroke="#FFD000" strokeWidth="2" />
            <rect x="26" y="6" width="16" height="4" rx="2" fill="#888" />
            <text x="34" y="24" textAnchor="middle" fill="#B38600" fontSize="9" fontFamily="Nunito" fontWeight="800">
              100円専用
            </text>
          </g>

          {/* Abstract Cute Sticker Badges Scattered on Machine Body */}

          {/* Cute Heart Sticker Left */}
          <text x="48" y="272" fontSize="15">💖</text>
          {/* Sakura Blossom Sticker Right */}
          <text x="236" y="268" fontSize="15">🌸</text>

          {/* Ribbon Badge Sticker Left Middle */}
          <g transform="translate(46, 290) rotate(-6)">
            <rect x="0" y="0" width="46" height="16" rx="5" fill="#FFE5D0" stroke="#FF7B54" strokeWidth="1" />
            <text x="23" y="11" textAnchor="middle" fill="#FF7B54" fontSize="7" fontFamily="Nunito" fontWeight="900">♡ Gacoan Box</text>
          </g>

          {/* Star Sparkle Sticker Right Middle */}
          <g transform="translate(210, 290) rotate(8)">
            <rect x="0" y="0" width="44" height="16" rx="5" fill="#E8D5FF" stroke="#9A56F5" strokeWidth="1" />
            <text x="22" y="11" textAnchor="middle" fill="#9A56F5" fontSize="7" fontFamily="Nunito" fontWeight="900">LUCKY ✨</text>
          </g>

          {/* Small Abstract Polka Dots & Sparkles */}
          <circle cx="56" cy="335" r="3" fill="#FF85AE" opacity="0.6" />
          <circle cx="242" cy="338" r="3" fill="#9A56F5" opacity="0.6" />
          <text x="48" y="360" fontSize="13">✨</text>
          <text x="238" y="360" fontSize="13">⭐</text>

          {/* ── CENTRAL ROTATING HANDLE ── */}
          <g transform="translate(150, 298)">
            {/* Outer Dial Ring */}
            <circle cx="0" cy="0" r="40" fill="url(#pinkAccent)" filter="url(#shadow)" />
            <circle cx="0" cy="0" r="34" fill="#FFF" />
            <circle cx="0" cy="0" r="30" fill="#FFF0F5" stroke="#FFB3CD" strokeWidth="2" />

            {/* Rotatable Handle Knob */}
            <motion.g
              animate={{ rotate: handleAngle }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {/* Knob Grip Wing Left & Right */}
              <rect x="-28" y="-9" width="56" height="18" rx="9" fill="url(#pinkAccent)" />
              <rect x="-24" y="-5" width="48" height="5" rx="2.5" fill="rgba(255,255,255,0.4)" />
              <circle cx="0" cy="0" r="11" fill="#FFF" />
              <text x="0" y="4" textAnchor="middle" fill="#E84B7E" fontSize="10">
                ♡
              </text>
            </motion.g>
          </g>

          {/* Instruction Text Below Handle */}
          <text x="150" y="352" textAnchor="middle" fill="#E84B7E" fontSize="9" fontFamily="Nunito" fontWeight="800">
            ▲ PUTAR DI SINI ▲
          </text>

          {/* ── TALLER 3D OUTPUT CHUTE DOOR / HOLE (TALLER HEIGHT FOR CAPSULE SIZE) ── */}
          <rect x="85" y="356" width="130" height="58" rx="18" fill="#E84B7E" opacity="0.5" />
          <rect x="88" y="359" width="124" height="52" rx="16" fill="#3D1E2D" />
          <rect x="92" y="362" width="116" height="46" rx="14" fill="url(#slotDepth)" />
          {/* 3D Chute Inner Top Shadow & Flap Rim */}
          <path d="M 92 362 L 208 362 A 14 14 0 0 1 208 370 L 92 370 Z" fill="rgba(0,0,0,0.6)" />
          <rect x="92" y="362" width="116" height="46" rx="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        </svg>

        {/* ── FLUID ANIMATED DROPPING CAPSULE FROM TOP TO BOTTOM INSIDE HOLE ── */}
        <AnimatePresence>
          {capsuleDropped && (
            <motion.div
              className="absolute z-20 pointer-events-none flex flex-col items-center"
              style={{ bottom: 30, left: '50%', transform: 'translateX(-50%)' }}
              initial={{ y: -52, opacity: 1, scale: 0.6, rotate: -25 }}
              animate={{
                y: [ -52, 6, -3, 0 ],
                opacity: 1,
                scale: [ 0.6, 1.1, 0.96, 1 ],
                rotate: [ -25, 14, -6, 0 ],
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{
                duration: 0.85,
                times: [0, 0.55, 0.8, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="relative flex flex-col items-center drop-shadow-xl">
                {/* Capsule Top Half */}
                <div
                  className="w-13 h-7.5 rounded-t-full relative border-t border-l border-r border-white/50"
                  style={{
                    width: 52,
                    height: 30,
                    backgroundColor: capsuleColor,
                    boxShadow: `0 -4px 14px ${capsuleColor}aa, inset 0 2px 4px rgba(255,255,255,0.6)`,
                  }}
                >
                  {/* Glossy Curved Highlight */}
                  <div className="absolute top-1.5 left-2.5 w-4 h-2.5 rounded-full bg-white opacity-75 transform -rotate-12" />
                </div>

                {/* Capsule Seam Rim */}
                <div className="w-14 h-1 bg-white/90 shadow-sm z-10" style={{ width: 54 }} />

                {/* Capsule Bottom Half */}
                <div
                  className="w-13 h-7.5 rounded-b-full bg-white relative border-b border-l border-r border-gray-200"
                  style={{ width: 52, height: 30 }}
                >
                  <div className="absolute bottom-1.5 right-2.5 w-3 h-2 rounded-full bg-pink-100 opacity-90" />
                </div>

                {/* Ground Landing Shadow */}
                <motion.div
                  className="w-12 h-2 rounded-full bg-black/35 mt-1 blur-xs"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1.2, 1] }}
                  transition={{ duration: 0.85 }}
                />

                {/* Pop Sparkles & Hearts */}
                <motion.div
                  className="absolute -top-5 -right-5 text-2xl"
                  animate={{ scale: [0, 1.4, 1], rotate: [0, 180] }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-5 text-xl"
                  animate={{ scale: [0, 1.3, 1], rotate: [0, -180] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  💖
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── MAIN INTERACTIVE GACHA BUTTON ── */}
      <motion.button
        id="gacha-btn"
        onClick={handleTurn}
        disabled={isSpinning}
        className="btn-gacha font-nunito text-white rounded-full px-7 sm:px-10 py-3 sm:py-4 text-base sm:text-lg tracking-wide shadow-xl"
        style={{ fontWeight: 900 }}
        whileHover={{ scale: isSpinning ? 1 : 1.05, y: isSpinning ? 0 : -3 }}
        whileTap={{ scale: isSpinning ? 1 : 0.95 }}
      >
        {isSpinning ? (
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
            🎀 MEMUTAR KAPSUL...
          </motion.span>
        ) : (
          '🎀 PUTAR MESIN GACHA ♡'
        )}
      </motion.button>
    </div>
  );
};

export default GashaponMachine;
