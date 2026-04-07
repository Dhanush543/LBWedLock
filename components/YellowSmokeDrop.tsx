'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface YellowSmokeDropProps {
  isActive: boolean;
}

// Canvas-based particle smoke effect
function SmokeCanvas({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const startTime = useRef<number>(0);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
    decay: number;
    color: string;
  }

  const COLORS = [
    'rgba(255, 215, 0,',   // Gold
    'rgba(255, 180, 0,',   // Amber
    'rgba(255, 230, 50,',  // Bright yellow
    'rgba(255, 200, 20,',  // Golden yellow
    'rgba(255, 160, 0,',   // Deep amber
  ];

  function spawnParticle(canvas: HTMLCanvasElement): Particle {
    const cx = canvas.width / 2;
    const cy = canvas.height;

    // Spread cone from center-bottom upward
    const angle = (Math.random() * Math.PI * 0.9) + (Math.PI * 0.05); // ~10° to ~170° (bottom hemisphere → upward)
    const speed = 2.5 + Math.random() * 4.5;
    const spread = (Math.random() - 0.5) * canvas.width * 0.6;

    return {
      x: cx + spread,
      y: cy,
      vx: Math.cos(Math.PI - angle) * speed * 0.7 + (Math.random() - 0.5) * 1.5,
      vy: -Math.sin(angle) * speed,
      radius: 60 + Math.random() * 100,
      alpha: 0.6 + Math.random() * 0.4,
      decay: 0.006 + Math.random() * 0.008,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(animRef.current);
      particles.current = [];
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d')!;
    particles.current = [];
    startTime.current = performance.now();

    // Pre-seed particles — all start at the bottom, then simulate forward so the fill feels explosive
    for (let i = 0; i < 80; i++) {
      const p = spawnParticle(canvas);
      // Simulate up to 40 physics ticks forward so particles have traveled upward already
      const steps = Math.floor(Math.random() * 40);
      for (let s = 0; s < steps; s++) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.99;
        p.radius += 1.2;
        p.alpha -= p.decay * 0.3;
      }
      if (p.alpha > 0) particles.current.push(p);
    }

    function draw() {
      const elapsed = (performance.now() - startTime.current) / 1000;
      
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      // Spawn new particles during the fill phase (first 1.5s)
      if (elapsed < 1.5) {
        for (let i = 0; i < 6; i++) {
          particles.current.push(spawnParticle(canvas!));
        }
      }

      // Draw each particle as a soft radial smoke puff
      particles.current.forEach((p) => {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `${p.color} ${p.alpha.toFixed(2)})`);
        grad.addColorStop(0.4, `${p.color} ${(p.alpha * 0.5).toFixed(2)})`);
        grad.addColorStop(1, `${p.color} 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.99;
        p.radius += 1.2;

        // Fade out faster after 2s
        if (elapsed > 2) {
          p.alpha -= p.decay * 3;
        } else {
          p.alpha -= p.decay * 0.3;
        }
      });

      // Remove dead particles
      particles.current = particles.current.filter((p) => p.alpha > 0);

      if (particles.current.length > 0 || elapsed < 2) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      }
    }

    animRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animRef.current);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998, width: '100vw', height: '100vh' }}
    />
  );
}

export default function YellowSmokeDrop({ isActive }: YellowSmokeDropProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Canvas particle smoke */}
          <SmokeCanvas isActive={isActive} />

          {/* Full screen yellow flash — rises from bottom */}
          <motion.div
            key="smoke-bg"
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 9997,
              background:
                'radial-gradient(ellipse 120% 100% at 50% 110%, rgba(255,200,0,0.55) 0%, rgba(255,160,0,0.3) 40%, transparent 75%)',
              filter: 'blur(20px)',
            }}
            initial={{ scaleY: 0, transformOrigin: 'bottom center', opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Top golden haze — fills top after explosion */}
          <motion.div
            key="smoke-top"
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 9996,
              background:
                'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,215,0,0.25) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 3.5, times: [0, 0.5, 1], ease: 'easeInOut' }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
