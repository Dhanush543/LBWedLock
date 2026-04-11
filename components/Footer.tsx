'use client';

import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

export default function Footer() {
  return (
    <footer className="overflow-hidden" style={{ background: '#1a0505', position: 'relative' }}>
      
      {/* ── THANK YOU SECTION ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          height: '100svh',
          padding: '20px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(26,5,5,1) 18%, #0f0303 100%)'
        }}
      >
        <ParticleBackground />
        {/* Deep radial background bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(139,26,26,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Gold glow bloom */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '30%', left: '50%', transform: 'translateX(-50%)',
            width: '90vw', height: '90vw', maxWidth: 450, maxHeight: 450,
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative z-10 flex items-center justify-center gap-3 mb-6 md:mb-8"
        >
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.5em' }}>✦ ✦ ✦</span>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(212,175,55,0.6), transparent)' }} />
        </motion.div>

        {/* THANK YOU script */}
        <motion.p
          initial={{ opacity: 0, y: 40, scale: 0.88 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.25, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="great-vibes relative z-10"
          style={{
            fontSize: 'clamp(3.5rem, 15vw, 6rem)',
            lineHeight: 1.05,
            background: 'linear-gradient(160deg, #F0D060 0%, #D4AF37 45%, #B8960C 75%, #F0D060 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% auto',
            filter: 'drop-shadow(0 0 50px rgba(212,175,55,0.25))',
            marginBottom: 8,
          }}
        >
          Thank You
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative z-10"
          style={{
            fontFamily: 'Lato, sans-serif',
            color: 'rgba(253,248,240,0.6)',
            fontSize: '0.58rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          For being a part of our story
        </motion.p>

        {/* Animated Heart */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.75, type: 'spring', stiffness: 200 }}
          viewport={{ once: true }}
          className="relative z-10"
          style={{ marginBottom: 16 }}
        >
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontSize: '2rem',
              display: 'block',
              filter: 'drop-shadow(0 0 24px rgba(180,30,30,0.8))',
            }}
          >
            ❤️
          </motion.span>
        </motion.div>

        {/* Couple names */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          viewport={{ once: true }}
          className="relative z-10 text-center"
        >
          <span
            className="great-vibes block"
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
              color: 'var(--cream)',
              lineHeight: 1.1,
              textShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            Lokesh
          </span>
          <span
            className="block"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.4rem, 6vw, 2rem)',
              color: 'var(--gold)',
              fontStyle: 'italic',
              margin: '2px 0',
              filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.4))',
            }}
          >
            &amp;
          </span>
          <span
            className="great-vibes block"
            style={{
              fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
              color: 'var(--cream)',
              lineHeight: 1.1,
              textShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            BhavyaSri
          </span>
        </motion.div>

        {/* Bottom twinkling stars */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="relative z-10 flex justify-center gap-3 mt-12"
        >
          {[...Array(7)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6 + i * 0.3, repeat: Infinity, delay: i * 0.28 }}
              style={{ color: 'var(--gold)', fontSize: i === 3 ? '1rem' : '0.6rem', opacity: 0 }}
            >
              ✦
            </motion.span>
          ))}
        </motion.div>

        {/* Bottom stamp */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.5rem',
            letterSpacing: '0.25em',
            color: 'rgba(253,248,240,0.2)',
            textAlign: 'center',
            marginTop: 48,
            textTransform: 'uppercase',
          }}
          className="relative z-10"
        >
          With love · Lokesh &amp; BhavyaSri · 2026
        </motion.p>
      </section>
    </footer>
  );
}
