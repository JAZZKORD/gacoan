import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Music } from 'lucide-react';
import type { SongResult } from '../types';

interface SongCardProps {
  song: SongResult;
}

export const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const spotifyEmbedUrl = song.spotifyTrackId
    ? `https://open.spotify.com/embed/track/${song.spotifyTrackId}?utm_source=generator&theme=0`
    : null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-5 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(232,213,255,0.45))',
        boxShadow: '0 20px 60px rgba(199,125,255,0.22)',
        border: '2px solid rgba(199,125,255,0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background Ornaments */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15" style={{ background: song.coverColor || '#E8D5FF' }} />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-15" style={{ background: '#FFB3C6' }} />

      {/* Header */}
      <div className="text-center mb-3">
        <span className="text-3xl mb-1 block">🎵</span>
        <p className="font-nunito font-800 text-pink-600 text-xs tracking-widest uppercase" style={{ fontWeight: 800 }}>
          Kamu Dapat Lagu!
        </p>
      </div>

      {/* Album Cover Vinyl Disc */}
      <motion.div
        className="mx-auto mb-3 flex items-center justify-center rounded-2xl relative overflow-hidden"
        style={{
          width: 90,
          height: 90,
          background: `linear-gradient(135deg, ${song.coverColor || '#E8D5FF'}, #FFB3C6)`,
          boxShadow: `0 12px 30px ${song.coverColor || '#E8D5FF'}88`,
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <span style={{ fontSize: 38 }}>{song.coverEmoji || '🎵'}</span>
        <div className="absolute inset-0 rounded-2xl border-4 border-white border-opacity-30" />
      </motion.div>

      {/* Song Title Display */}
      {song.title && (
        <div className="text-center mb-3 px-2">
          <h3 className="font-nunito font-900 text-base text-purple-900 leading-snug">
            {song.title}
          </h3>
          {song.artist && song.artist !== 'Spotify' && (
            <p className="font-quicksand text-xs text-purple-600 opacity-80 mt-0.5">{song.artist}</p>
          )}
        </div>
      )}

      {/* Spotify Embed Player Frame */}
      {spotifyEmbedUrl ? (
        <div className="overflow-hidden rounded-2xl mb-3 shadow-md border border-emerald-100 bg-white">
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Player"
            className="rounded-2xl"
          />
        </div>
      ) : (
        <div className="bg-purple-50/80 rounded-2xl p-3 text-center border border-purple-100 mb-3">
          <Music className="mx-auto text-purple-400 mb-1" size={20} />
          <p className="font-quicksand text-xs text-purple-700 font-medium">
            Belum ada link Spotify Embed.
          </p>
        </div>
      )}

      {/* Button Placed BELOW the Player Frame: Open in Native Spotify App */}
      {song.spotifyUrl && (
        <motion.a
          href={song.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-nunito font-800 text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ExternalLink size={15} />
          Buka & Putar di Aplikasi Spotify
        </motion.a>
      )}
    </motion.div>
  );
};

export default SongCard;
