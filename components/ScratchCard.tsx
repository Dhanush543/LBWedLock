'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
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

interface ScratchCircleProps {
  id: string;
  hiddenValue: string;
  label: string;
  onComplete: (id: string) => void;
  disabled: boolean;
}

function ScratchCircle({ id, hiddenValue, label, onComplete, disabled }: ScratchCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setTimeout(() => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#B8960C');
      grad.addColorStop(0.3, '#D4AF37');
      grad.addColorStop(0.6, '#FFF8E7');
      grad.addColorStop(0.8, '#D4AF37');
      grad.addColorStop(1, '#B8960C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const b = Math.random() * 30;
        ctx.fillStyle = `rgba(${b > 15 ? 255 : 0}, ${b > 15 ? 220 : 0}, 0, 0.05)`;
        ctx.fillRect(x, y, 1, 1);
      }

      ctx.fillStyle = 'rgba(26, 5, 5, 0.9)'; // High contrast dark maroon
      ctx.font = 'bold 12px Lato';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH', W / 2, H / 2 + 5);
    }, 50);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const scratch = (pos: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched || disabled) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    if (lastPos.current) { ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y); }
    else ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 28;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;

    if (Math.random() > 0.25) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    const data = imageData.data;
    for (let i = 3; i < data.length; i += 4) { if (data[i] < 10) transparent++; }
    const pct = (transparent / (canvas.width * canvas.height)) * 100;
    if (pct > 55 && !isScratched) {
      setIsScratched(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onComplete(id);
    }
  };

  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setHasInteracted(true);
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    if (!isDrawing.current) return;
    const pos = getPos(e);
    if (pos) scratch(pos);
  };
  const onEnd = () => { isDrawing.current = false; lastPos.current = null; };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: 'clamp(80px, 22vw, 100px)',
          height: 'clamp(80px, 22vw, 100px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
          border: '2px solid rgba(212,175,55,0.4)',
          boxShadow: isScratched
            ? '0 0 0 4px rgba(212,175,55,0.3), 0 8px 24px rgba(139,26,26,0.3)'
            : '0 4px 16px rgba(0,0,0,0.15)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        <motion.span
          animate={isScratched ? { scale: [0.8, 1.1, 1] } : {}}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: isScratched ? 'var(--gold-light)' : 'var(--cream)',
            fontSize: 'clamp(1.3rem, 4vw, 1.9rem)',
            fontWeight: 700,
          }}
        >
          {hiddenValue}
        </motion.span>

        {!isScratched && (
          <>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
              style={{ touchAction: 'none', borderRadius: '50%' }}
              onMouseDown={onStart}
              onMouseMove={onMove}
              onMouseUp={onEnd}
              onMouseLeave={onEnd}
              onTouchStart={onStart}
              onTouchMove={onMove}
              onTouchEnd={onEnd}
            />
            {id === 'date' && !hasInteracted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [-15, 15, -15], y: [-5, 5, -5] }}
                transition={{ 
                  opacity: { delay: 1, duration: 0.8 }, 
                  x: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                  y: { repeat: Infinity, duration: 2.1, ease: 'easeInOut' }
                }}
                className="absolute z-10 pointer-events-none"
                style={{ top: '50%', left: '42%' }}
              >
                <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))' }}>👆</span>
              </motion.div>
            )}
          </>
        )}
      </div>
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
}

export default function ScratchCard({ onScratchComplete, isScratched }: ScratchCardProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [clearedNodes, setClearedNodes] = useState<Set<string>>(new Set());
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isScratched) {
      setTime(getTimeLeft());
      const interval = setInterval(() => setTime(getTimeLeft()), 1000);
      return () => clearInterval(interval);
    }
  }, [isScratched]);

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

  const handleCircleComplete = (id: string) => {
    setClearedNodes(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <section id="scratch" ref={sectionRef} className="section-gap">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="section-container"
      >
        <div className="premium-border text-center">
          {/* Ornament */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6))' }} />
            <span style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>✦</span>
            <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(212,175,55,0.6), transparent)' }} />
          </div>

          <p className="section-label">THE BIG DAY</p>
          <h2 className="section-title mt-3 mb-5" style={{ whiteSpace: 'nowrap', fontSize: 'clamp(1.8rem, 6vw, 3rem)' }}>Save The Date</h2>

          <p style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--cream)', fontSize: '1.15rem', opacity: 0.85, marginBottom: 44, fontStyle: 'italic' }}>
            {isScratched
              ? 'The date is set — mark your calendars.'
              : 'Scratch the circles to reveal our wedding date'}
          </p>

          {/* Circles */}
          <div className="flex flex-row items-end justify-center gap-6 md:gap-10">
            <ScratchCircle id="date" hiddenValue="26" label="Date" onComplete={handleCircleComplete} disabled={isScratched} />
            <ScratchCircle id="month" hiddenValue="April" label="Month" onComplete={handleCircleComplete} disabled={isScratched} />
            <ScratchCircle id="year" hiddenValue="2026" label="Year" onComplete={handleCircleComplete} disabled={isScratched} />
          </div>

          {!isScratched && (
            <motion.p
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{ color: 'var(--gold)', fontSize: '0.68rem', marginTop: 36, letterSpacing: '0.24em', fontFamily: 'Lato', fontWeight: 600 }}
            >
              SCRATCH ALL THREE · {clearedNodes.size}/3 DONE
            </motion.p>
          )}

          {isScratched && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: 20, opacity: 0.3 }} />
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-xl">✨</span>
                <p style={{ color: 'var(--gold-dark)', fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontFamily: 'Great Vibes, cursive', whiteSpace: 'nowrap' }}>
                  We can&apos;t wait to see you!
                </p>
                <span className="text-xl">✨</span>
              </div>

              {/* Integrated Countdown */}
              <div className="flex items-center justify-center gap-1.5 flex-nowrap min-h-[70px]">
                {mounted && (
                  <>
                    <TimeUnit value={time.days} label="DAYS" />
                    <span style={{ color: 'var(--gold)', fontSize: '1rem', paddingBottom: 15, opacity: 0.3, flexShrink: 0 }}>:</span>
                    <TimeUnit value={time.hours} label="HOURS" />
                    <span style={{ color: 'var(--gold)', fontSize: '1rem', paddingBottom: 15, opacity: 0.3, flexShrink: 0 }}>:</span>
                    <TimeUnit value={time.minutes} label="MINS" />
                    <span style={{ color: 'var(--gold)', fontSize: '1rem', paddingBottom: 15, opacity: 0.3, flexShrink: 0 }}>:</span>
                    <TimeUnit value={time.seconds} label="SECS" />
                  </>
                )}
              </div>

              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: 'var(--cream)',
                fontSize: '1rem',
                fontStyle: 'italic',
                marginTop: 24,
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
