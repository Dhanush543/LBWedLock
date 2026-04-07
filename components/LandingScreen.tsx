'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LandingScreenProps {
  isRevealed: boolean;
  musicEnabled: boolean;
  onMusicToggle: () => void;
}

export default function LandingScreen({ isRevealed, musicEnabled, onMusicToggle }: LandingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system
    const particles: {
      x: number; y: number; size: number; speedX: number; speedY: number;
      opacity: number; color: string; rotation: number; rotationSpeed: number;
    }[] = [];

    const colors = ['#D4AF37', '#F0D060', '#C9A96E', '#FFD700', '#B8960C'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 6 + 2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.8 - 0.2,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }

    const drawPetal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, -size / 2, size / 3, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.7 }}
      />

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
        className="relative z-10 text-center px-6"
        style={{ marginTop: '12vh' }} // Forces the centered box downwards reliably
      >
        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.8 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.5rem' }}>✦</span>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
        </motion.div>

        {/* Telugu Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealed ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: 'var(--gold-light)',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            marginBottom: 16,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
          }}
        >
          పెట్టుగాని వారి<br />
          వివాహ మహోత్సవ ఆహ్వానము
        </motion.div>

        {/* Pre-text */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: isRevealed ? 1 : 0, letterSpacing: isRevealed ? '0.2em' : '0.4em' }}
          transition={{ duration: 1.5, delay: 0.1 }}
          style={{
            fontFamily: 'Lato, sans-serif',
            color: 'rgba(212,175,55,0.8)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            marginBottom: 20,
            lineHeight: 1.8
          }}
        >
          JOIN US IN CELEBRATING<br />THE WEDDING OF
        </motion.p>

        {/* Big Names (Typewriter) */}
        <h1
          style={{
            fontFamily: 'Great Vibes, cursive',
            color: 'var(--cream)',
            fontSize: 'clamp(4rem, 15vw, 7.5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            textShadow: '0 4px 15px rgba(0,0,0,0.8)',
          }}
        >
          {/* Lokesh */}
          <div className="flex justify-center">
            {'Lokesh'.split('').map((char, i) => (
              <motion.span
                key={`l-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 1.2 + i * 0.12 }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Ampersand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8, delay: 1.2 + 6 * 0.12 }}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 10vw, 5rem)',
              color: 'var(--gold-light)',
              fontStyle: 'italic',
              margin: '6px 0',
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
                transition={{ duration: 0.4, delay: 1.2 + 7 * 0.12 + i * 0.12 }}
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
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: 'rgba(212,175,55,0.8)',
            fontSize: 'clamp(1rem, 4vw, 1.4rem)',
            marginTop: 24,
            letterSpacing: '0.15em',
            fontStyle: 'italic'
          }}
        >
          &ldquo;Two Hearts, One Story&rdquo;
        </motion.p>

        {/* Shloka Reveal */}
        <motion.div
          className="flex flex-col items-center gap-1 w-full"
          style={{
            marginTop: 'max(8vh, 60px)', // Forces a large, robust gap
            fontFamily: 'Cormorant Garamond, serif', // Looks elegant even for Telugu if standard serif is applied
            color: 'var(--gold-light)',
            fontSize: '1.07rem',
            lineHeight: 1.6,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
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
                transition={{ duration: 1.4, delay: 1.6 + i * 0.85 }}
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
                transition={{ duration: 1.4, delay: 1.6 + (6 + i) * 0.85 }}
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
          transition={{ duration: 1, delay: 13.2 }} // fades in right after shloka finishes
          className="flex items-center justify-center gap-3 mt-8"
        >
          <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>❧</span>
          <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? [0, 8, 0] : -10
        }}
        transition={{
          opacity: { duration: 1, delay: 13.5 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 13.5 }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
      >
        <span
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.45rem',
            letterSpacing: '0.3em',
            color: 'rgba(212,175,55,0.7)',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}
        >
          Scroll
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
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
