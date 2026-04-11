'use client';

import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

interface LandingScreenProps {
  isRevealed: boolean;
  musicEnabled: boolean;
  onMusicToggle: () => void;
}

export default function LandingScreen({ isRevealed, musicEnabled, onMusicToggle }: LandingScreenProps) {
  return (
    <div
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Cinematic Particle Background */}
      <ParticleBackground />

      {/* Radial glow behind content */}
      <div
        className="absolute"
        style={{
          width: '70vw',
          height: '70vw',
          maxWidth: 400,
          maxHeight: 400,
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 50 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
        className="relative z-10 text-center px-6 flex flex-col items-center justify-center"
        style={{ marginTop: '5vh' }}
      >
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-2 md:mb-4"
        >
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.5rem' }}>✦</span>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
        </motion.div>

        {/* Telugu Header — FOCUSED FIRST */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.95 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: 'var(--gold-light)',
            fontSize: 'max(1.05rem, 4.2vw)',
            lineHeight: 1.4,
            marginBottom: 20,
            textShadow: '0 2px 12px rgba(212,175,55,0.4)',
            textAlign: 'center'
          }}
        >
          పెట్టుగాని వారి<br />
          వివాహ మహోత్సవ ఆహ్వానము
        </motion.div>

        {/* Staggered Reveal of remaining content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 2.2 }} // Wait for header to settle
          className="flex flex-col items-center"
        >
          {/* Pre-text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: 0 }}
            transition={{ duration: 1, delay: 2.4 }}
            style={{
              fontFamily: 'Lato, sans-serif',
              color: 'rgba(212,175,55,0.8)',
              fontSize: '0.78rem',
              letterSpacing: '0.25em',
              marginBottom: 15,
              lineHeight: 1.6,
              textAlign: 'center'
            }}
          >
            JOIN US IN CELEBRATING<br />THE WEDDING OF
          </motion.p>

          {/* Big Names (Typewriter) */}
          <h1
            style={{
              fontFamily: 'Great Vibes, cursive',
              color: 'var(--cream)',
              fontSize: 'clamp(4.2rem, 14vw, 7.5rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              textShadow: '0 4px 15px rgba(0,0,0,0.8)',
              textAlign: 'center'
            }}
          >
            {/* Lokesh */}
            <div className="flex justify-center">
              {'Lokesh'.split('').map((char, i) => (
                <motion.span
                  key={`l-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 2.5 + i * 0.12 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Ampersand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, delay: 2.5 + 6 * 0.12 }}
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                color: 'var(--gold-light)',
                fontStyle: 'italic',
                margin: '2px 0',
                textShadow: '0 0 15px rgba(212,175,55,0.4)',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              &amp;
            </motion.div>

            {/* BhavyaSri */}
            <div className="flex justify-center">
              {'BhavyaSri'.split('').map((char, i) => (
                <motion.span
                  key={`b-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 2.5 + 7 * 0.12 + i * 0.12 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </h1>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isRevealed ? 1 : 0 }}
            transition={{ duration: 1, delay: 4.5 }}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: 'rgba(212,175,55,0.8)',
              fontSize: 'clamp(1.1rem, 4.5vw, 1.45rem)',
              marginTop: 15,
              letterSpacing: '0.15em',
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            &ldquo;Two Hearts, One Story&rdquo;
          </motion.p>

          {/* Shloka Reveal */}
          <motion.div
            className="flex flex-col items-center gap-1 w-full"
            style={{
              marginTop: 'min(5vh, 40px)',
              fontFamily: 'Cormorant Garamond, serif',
              color: 'var(--gold-light)',
              fontSize: 'clamp(1rem, 4.2vw, 1.25rem)',
              lineHeight: 1.4,
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              textAlign: 'center'
            }}
          >
            <div className="flex flex-wrap justify-center gap-x-2">
              {['“మాంగల్యం', 'తంతునానేన', 'మమ', 'జీవన', 'హేతునా', '!'].map((word, i) => (
                <motion.span
                  key={`l1-${i}`}
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 5 }}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    filter: isRevealed ? 'blur(0px)' : 'blur(8px)',
                    y: isRevealed ? 0 : 5
                  }}
                  transition={{ duration: 1.4, delay: 2.5 + i * 0.8 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-2">
              {['కంఠే', 'బధ్నామి', 'సుభగే', 'త్వం', 'జీవ', 'శరదశ్శతమ్', '!!”'].map((word, i) => (
                <motion.span
                  key={`l2-${i}`}
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 5 }}
                  animate={{
                    opacity: isRevealed ? 1 : 0,
                    filter: isRevealed ? 'blur(0px)' : 'blur(8px)',
                    y: isRevealed ? 0 : 5
                  }}
                  transition={{ duration: 1.4, delay: 2.5 + (6 + i) * 0.8 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Bottom ornament */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isRevealed ? 1 : 0 }}
            transition={{ duration: 1, delay: 14.5 }} // Wait for long shloka to finish
            className="flex items-center justify-center gap-3 mt-10"
          >
            <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>❧</span>
            <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </motion.div>
        </motion.div>
      </motion.div>


      {/* Wrinkled Gold Line Separator at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[6px] z-10 pointer-events-none">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 6" preserveAspectRatio="none">
          <defs>
            <filter id="wrinkleLine" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="10%" stopColor="var(--gold-dark)" />
              <stop offset="50%" stopColor="var(--gold-light)" />
              <stop offset="90%" stopColor="var(--gold-dark)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M 0 3 Q 250 1, 500 3 T 1000 3"
            stroke="url(#goldLineGrad)"
            strokeWidth="3"
            fill="none"
            filter="url(#wrinkleLine)"
            opacity="0.8"
          />
        </svg>
      </div>

    </div>
  );
}
