'use client';

import { useEffect, useRef } from 'react';

/**
 * Cinematic Particle Background
 * Rendeers gold petals/shimmer rising from bottom to top.
 */
export default function ParticleBackground() {
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

    // Particle system configuration
    const particles: {
      x: number; y: number; size: number; speedX: number; speedY: number;
      opacity: number; color: string; rotation: number; rotationSpeed: number;
    }[] = [];

    const colors = ['#D4AF37', '#F0D060', '#C9A96E', '#FFD700', '#B8960C'];

    // Density based on screen size
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 15));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.6 - 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
      });
    }

    const drawPetal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, -size / 2, size / 2.5, size / 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Wrap around bottom
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        
        // Wrap horizontally
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        opacity: 0.65, 
        zIndex: 1, 
        width: '100%', 
        height: '100%' 
      }}
    />
  );
}
