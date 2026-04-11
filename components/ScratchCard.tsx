'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import confetti from 'canvas-confetti';

const WEDDING_DATE = new Date('2026-04-26T00:00:00');

function getTimeLeft() {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const [displayed, setDisplayed] = useState(value);
  useEffect(() => {
    if (value !== displayed) {
      const t = setTimeout(() => setDisplayed(value), 150);
      return () => clearTimeout(t);
    }
  }, [value, displayed]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{
        minWidth: 'clamp(52px, 14vw, 64px)',
        padding: '10px 4px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        borderRadius: 10,
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        <motion.span
          key={displayed}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
            fontWeight: 600,
            color: 'var(--gold-light)',
            display: 'block',
            lineHeight: 1,
          }}
        >
          {String(displayed).padStart(2, '0')}
        </motion.span>
      </div>
      <p style={{ fontFamily: 'Lato', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gold)', opacity: 0.5 }}>
        {label}
      </p>
    </div>
  );
}

interface CounterCircleProps {
  id: string;
  hiddenValue: string;
  label: string;
  onComplete: (id: string) => void;
  isActive: boolean;
  isFinished: boolean;
}

function CounterCircle({ id, hiddenValue, label, onComplete, isActive, isFinished }: CounterCircleProps) {
  const [shutterValue, setShutterValue] = useState<string>(hiddenValue);
  const items = useRef<string[]>([]);
  
  useEffect(() => {
    const count = 10;
    if (id === 'date') {
      items.current = [...Array(count)].map(() => String(Math.floor(Math.random() * 28 + 1)));
    } else if (id === 'month') {
      const months = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      items.current = [...Array(count)].map(() => months[Math.floor(Math.random() * 11)]);
    } else {
      items.current = [...Array(count)].map(() => String(2020 + Math.floor(Math.random() * 10)));
    }
  }, [id]);

  useEffect(() => {
    if (!isActive || isFinished) return;

    // Rapid shutter effect
    const interval = setInterval(() => {
      const rand = items.current[Math.floor(Math.random() * items.current.length)];
      setShutterValue(rand);
    }, 80);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      onComplete(id);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, isFinished, id, onComplete]);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{
          scale: isActive && !isFinished ? 1.18 : 1,
          rotateY: isActive && !isFinished ? [0, 180, 360] : 0,
          boxShadow: isFinished 
            ? '0 0 40px rgba(212,175,55,0.5), 0 8px 32px rgba(139,26,26,0.4)' 
            : isActive 
              ? '0 0 60px rgba(212,175,55,0.7)' 
              : '0 4px 16px rgba(0,0,0,0.15)',
          borderColor: isFinished ? 'rgba(212,175,55,1)' : isActive ? 'rgba(212,175,55,0.8)' : 'rgba(212,175,55,0.2)',
        }}
        transition={{ 
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          rotateY: isActive && !isFinished 
            ? { repeat: Infinity, duration: 1.5, ease: 'linear' } 
            : { type: 'spring', stiffness: 100, damping: 20 },
          boxShadow: { duration: 1 },
        }}
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: 'clamp(80px, 22vw, 100px)',
          height: 'clamp(80px, 22vw, 100px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
          border: '2px solid',
          perspective: '1000px', // Enhances the 3D effect
        }}
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
          <motion.span
            key={isFinished ? 'final' : isActive ? 'shutter' : 'hidden'}
            initial={isActive && !isFinished ? { filter: 'blur(8px)', opacity: 0.4 } : { filter: 'blur(0px)', opacity: 1 }}
            animate={{ 
              filter: isFinished ? 'blur(0px)' : isActive ? 'blur(4px)' : 'blur(0px)',
              opacity: isFinished ? 1 : isActive ? 0.6 : 0.3,
              scale: isFinished ? [1.2, 1] : 1
            }}
            transition={{ 
              filter: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: 0.5, ease: 'backOut' }
            }}
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: isFinished ? 'var(--gold-light)' : 'var(--cream)',
              fontSize: 'clamp(1.3rem, 4vw, 1.9rem)',
              fontWeight: 700,
            }}
          >
            {isFinished ? hiddenValue : isActive ? shutterValue : '??'}
          </motion.span>
        </div>

        {/* Bloom Bloom Bloom! */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ x: '-150%', skewX: -45 }}
              animate={{ x: '150%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,248,220,0.4), transparent)',
                width: '200%',
              }}
            />
          )}
        </AnimatePresence>

        {/* Mist Effect when active */}
        {isActive && !isFinished && (
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)' }}
          />
        )}
      </motion.div>
      <p style={{
        fontFamily: 'Lato',
        fontSize: '0.62rem',
        letterSpacing: '0.28em',
        color: 'var(--gold)',
        opacity: 0.8,
        marginTop: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        transition: 'color 0.3s',
      }}>
        {label}
      </p>
    </div>
  );
}

interface ScratchCardProps {
  onScratchComplete?: () => void;
  isScratched: boolean;
  autoMode?: boolean;
}

export default function ScratchCard({ onScratchComplete, isScratched, autoMode }: ScratchCardProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [clearedNodes, setClearedNodes] = useState<Set<string>>(new Set());
  const [activeCircleIndex, setActiveCircleIndex] = useState(-1); // -1: waiting for caption
  const [isCaptionFinished, setIsCaptionFinished] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isScratched) {
      setTime(getTimeLeft());
      setIsCaptionFinished(true); // Ensure circles are visible if already scratched
      const interval = setInterval(() => setTime(getTimeLeft()), 1000);
      return () => clearInterval(interval);
    }
  }, [isScratched]);

  // Synchronize Circle Start with Caption Finish
  useEffect(() => {
    if (isCaptionFinished && activeCircleIndex === -1 && !isScratched) {
      setTimeout(() => setActiveCircleIndex(0), 500); // Small pause after text finishes
    }
  }, [isCaptionFinished, activeCircleIndex, isScratched]);

  // Handle sequential flow
  const handleCircleComplete = (id: string) => {
    setClearedNodes(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => setActiveCircleIndex(prev => prev + 1), 600); // Small pause between circles
  };

  // ⚠️ Fire confetti + callback OUTSIDE the setState updater to avoid
  // "Cannot update a component while rendering a different component" React error
  useEffect(() => {
    if (clearedNodes.size === 3 && !isScratched) {
      const rect = sectionRef.current?.getBoundingClientRect();
      const originY = rect ? (rect.top + rect.bottom) / 2 / window.innerHeight : 0.5;
      confetti({ particleCount: 160, spread: 110, origin: { y: originY }, colors: ['#D4AF37', '#8B1A1A', '#FDF8F0', '#F0D060'], ticks: 320 });
      if (onScratchComplete) onScratchComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearedNodes.size]);

  return (
    <section 
      id="scratch" 
      ref={sectionRef} 
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '100svh', width: '100%' }}
    >
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="section-container relative z-10 flex flex-col items-center justify-center h-full max-h-screen py-4"
      >
        <div className="premium-border text-center w-full max-w-[420px]" style={{ padding: '24px 15px' }}>
          {/* Ornament */}
          <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
            <div style={{ height: 1, width: 30, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6))' }} />
            <span style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>✦</span>
            <div style={{ height: 1, width: 30, background: 'linear-gradient(90deg, rgba(212,175,55,0.6), transparent)' }} />
          </div>

          <p className="section-label" style={{ fontSize: '0.6rem' }}>THE BIG DAY</p>
          <h2 className="section-title mt-2 mb-3 md:mb-5" style={{ whiteSpace: 'nowrap', fontSize: 'clamp(1.6rem, 5vh, 2.4rem)' }}>Save The Date</h2>

          <div style={{ minHeight: '1.2rem', marginBottom: 20 }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', fontSize: '1rem', opacity: 0.85, fontStyle: 'italic' }}>
              {isScratched ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  The date is set — mark your calendars.
                </motion.span>
              ) : (
                "Witness the beginning of our forever".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.1, delay: 0.8 + (i * 0.05) }}
                    onAnimationComplete={() => {
                      if (i === 35) setIsCaptionFinished(true); // 35 is the last index of the 36 char string
                    }}
                  >
                    {char}
                  </motion.span>
                ))
              )}
            </p>
          </div>

          {/* Circles */}
          <div className="flex flex-row items-end justify-center gap-6 md:gap-10">
            <CounterCircle 
              id="date" 
              hiddenValue="26" 
              label="Date" 
              onComplete={handleCircleComplete} 
              isActive={activeCircleIndex === 0 && !isScratched} 
              isFinished={clearedNodes.has('date') || isScratched} 
            />
            <CounterCircle 
              id="month" 
              hiddenValue="April" 
              label="Month" 
              onComplete={handleCircleComplete} 
              isActive={activeCircleIndex === 1 && !isScratched} 
              isFinished={clearedNodes.has('month') || isScratched} 
            />
            <CounterCircle 
              id="year" 
              hiddenValue="2026" 
              label="Year" 
              onComplete={handleCircleComplete} 
              isActive={activeCircleIndex === 2 && !isScratched} 
              isFinished={clearedNodes.has('year') || isScratched} 
            />
          </div>

          {isScratched && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-4 md:mt-8"
            >
              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 16, opacity: 0.3 }} />

              <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                <span className="text-lg">✨</span>
                <p style={{ color: 'var(--gold-dark)', fontSize: 'clamp(1.2rem, 4vh, 1.6rem)', fontFamily: 'Great Vibes, cursive', whiteSpace: 'nowrap' }}>
                  We can&apos;t wait to see you!
                </p>
                <span className="text-lg">✨</span>
              </div>

              {/* Integrated Countdown */}
              <div className="flex items-center justify-center gap-1 flex-nowrap min-h-[60px]">
                {mounted && (
                  <>
                    <TimeUnit value={time.days} label="DAYS" />
                    <span style={{ color: 'var(--gold)', fontSize: '0.9rem', paddingBottom: 12, opacity: 0.3, flexShrink: 0 }}>:</span>
                    <TimeUnit value={time.hours} label="HOURS" />
                    <span style={{ color: 'var(--gold)', fontSize: '0.9rem', paddingBottom: 12, opacity: 0.3, flexShrink: 0 }}>:</span>
                    <TimeUnit value={time.minutes} label="MINS" />
                    <span style={{ color: 'var(--gold)', fontSize: '0.9rem', paddingBottom: 12, opacity: 0.3, flexShrink: 0 }}>:</span>
                    <TimeUnit value={time.seconds} label="SECS" />
                  </>
                )}
              </div>

              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: 'var(--cream)',
                fontSize: '0.85rem',
                fontStyle: 'italic',
                marginTop: 15,
                opacity: 0.6,
              }}>
                &ldquo;Count the days, cherish the moments&rdquo;
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

    </section>
  );
}
