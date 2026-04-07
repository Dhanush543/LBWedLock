'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MusicToggleProps {
  isPlaying: boolean;
  toggleMusic: () => void;
}

export default function MusicToggle({ isPlaying, toggleMusic }: MusicToggleProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-[60] flex items-center justify-center"
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    >
      <div
        style={{
          background: 'rgba(26, 5, 5, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        }}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ fontSize: '1.4rem', color: 'var(--gold)' }}
              title="Mute"
            >
              🔇
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ fontSize: '1.4rem', color: 'var(--gold)', marginLeft: 4 }}
              title="Play / Resume"
            >
              ▶
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pulsing glow ring for playing state */}
      {isPlaying && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid rgba(139, 26, 26, 0.3)',
            animation: 'pulse-ring 2s ease-out infinite',
          }}
        />
      )}
    </motion.button>
  );
}
