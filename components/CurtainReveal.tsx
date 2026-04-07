'use client';

import { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

interface CurtainRevealProps {
  onRevealComplete: () => void;
  children: React.ReactNode;
}

const CurtainHalf = ({ isRevealed, isLeft = true }: { isRevealed: boolean; isLeft?: boolean }) => {
  const transition = { duration: 2.8, ease: [0.5, 0, 0.2, 1] as const }; // Cinematic theater ease, much slower

  const pathVariants: Variants = {
    closed: { d: "M 0 0 L 100 0 C 100 25, 100 45, 100 50 C 100 70, 100 90, 100 100 L 0 100 Z" },
    open: { d: "M 0 0 L 55 0 C 55 25, 35 45, 15 50 C 5 70, 15 90, 20 100 L 0 100 Z" },
  };

  const edgeLine: Variants = {
    closed: { d: "M 100 0 C 100 25, 100 45, 100 50 C 100 70, 100 90, 100 100" },
    open: { d: "M 55 0 C 55 25, 35 45, 15 50 C 5 70, 15 90, 20 100" }
  };

  // Generate dense, luxurious fabric folds procedurally
  const linesCount = 14;
  const foldLines = Array.from({ length: linesCount }).map((_, i) => {
    const t = (i + 1) / (linesCount + 1); // 0.06 to 0.93

    const closedX = t * 100;

    // Open path mapping (simulating the gathering at the knot but opening much wider)
    const xTop = t * 55;
    const cp1X = t * 55;
    const cp2X = t * 35;
    const xKnot = 1 + t * 14; // Knots bundle tightly near edge
    const cp3X = t * 5;
    const cp4X = t * 15;
    const xBot = t * 20;

    return {
      closed: { d: `M ${closedX} 0 C ${closedX} 25, ${closedX} 45, ${closedX} 50 C ${closedX} 70, ${closedX} 90, ${closedX} 100` },
      open: { d: `M ${xTop} 0 C ${cp1X} 25, ${cp2X} 45, ${xKnot} 50 C ${cp3X} 70, ${cp4X} 90, ${xBot} 100` }
    };
  });

  return (
    <div className="absolute top-0 bottom-0 w-1/2 pointer-events-none" style={{ [isLeft ? 'left' : 'right']: 0, transform: isLeft ? 'none' : 'scaleX(-1)' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" style={{ filter: isRevealed ? 'drop-shadow(15px 0 25px rgba(0,0,0,1))' : 'none', transition: 'filter 2.8s ease' }}>
        <defs>
          <linearGradient id="velvetCurtain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a0505" />
            <stop offset="25%" stopColor="#3d0b0b" />
            <stop offset="50%" stopColor="#5c0a0a" />
            <stop offset="75%" stopColor="#3d0b0b" />
            <stop offset="100%" stopColor="#1a0505" />
          </linearGradient>


          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(212,175,55,0.7)" />
            <stop offset="40%" stopColor="rgba(255,230,120,0.9)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="60%" stopColor="rgba(255,230,120,0.9)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0.7)" />
          </linearGradient>
        </defs>

        <motion.path
          variants={pathVariants}
          initial="closed"
          animate={isRevealed ? "open" : "closed"}
          transition={transition}
          fill="url(#velvetCurtain)"
        />

        {/* Procedural Fabric Folds (Shadows and Peaks) */}
        {foldLines.map((l, i) => {
          const isMajor = i % 3 === 0;
          return (
            <g key={i}>
              {/* Deep velvet shadows for volume */}
              <motion.path
                variants={l}
                initial="closed"
                animate={isRevealed ? "open" : "closed"}
                transition={transition}
                fill="none"
                stroke="rgba(0,0,0,0.6)"
                strokeWidth={isMajor ? "6" : "3"}
                vectorEffect="non-scaling-stroke"
                style={{ mixBlendMode: 'multiply' }}
              />
              {/* Highlight lines mimicking gold thread or lighting peaks */}
              <motion.path
                variants={l}
                initial="closed"
                animate={isRevealed ? "open" : "closed"}
                transition={transition}
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth={isMajor ? "1.5" : "0.5"}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}

        {/* Thick Glowing Edge Trim */}
        <motion.path
          variants={edgeLine}
          initial="closed"
          animate={isRevealed ? "open" : "closed"}
          transition={transition}
          fill="none"
          stroke="rgba(0,0,0,0.7)"
          strokeWidth="10"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          variants={edgeLine}
          initial="closed"
          animate={isRevealed ? "open" : "closed"}
          transition={transition}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default function CurtainReveal({ onRevealComplete, children }: CurtainRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const triggerReveal = async () => {
    if (isRevealed) return;
    setIsRevealed(true);

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen could not be engaged:", e);
    }

    setTimeout(() => {
      onRevealComplete();
    }, 1200);
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-x-hidden">
      {/* Content revealed underneath */}
      <div className="relative z-0 w-full">{children}</div>

      {/* Curtain overlay */}
      <div
        className={`absolute top-0 left-0 right-0 h-[100svh] z-40 flex overflow-hidden ${!isRevealed ? 'bg-black/10' : ''}`}
        style={{ pointerEvents: isRevealed ? 'none' : 'auto' }}
      >

        <CurtainHalf isRevealed={isRevealed} isLeft={true} />
        <CurtainHalf isRevealed={isRevealed} isLeft={false} />

        {/* Central interact area & knot logic */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
              onClick={triggerReveal}
            >
              <div
                className="relative flex items-center justify-center pointer-events-auto"
                style={{
                  width: 110, height: 110,
                  boxShadow: '0 10px 40px rgba(0,0,0,1)',
                  borderRadius: '50%',
                }}
              >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.5))' }}>
                  <defs>
                    <filter id="wrinkleFoil" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                    </filter>

                    <radialGradient id="foilGrad" cx="40%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffefb3" />
                      <stop offset="50%" stopColor="var(--gold)" />
                      <stop offset="90%" stopColor="#8a6e1c" />
                      <stop offset="100%" stopColor="#4a3b0d" />
                    </radialGradient>
                  </defs>

                  {/* Main wrinkled foil background */}
                  <circle cx="50" cy="50" r="46" fill="url(#foilGrad)" filter="url(#wrinkleFoil)" />

                  {/* Inner ring for realism */}
                  <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" filter="url(#wrinkleFoil)" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" filter="url(#wrinkleFoil)" />
                </svg>

                <div className="relative z-10 w-[85%] h-[85%] flex items-center justify-center rounded-full overflow-hidden">
                  <img 
                    src="/lb-logo.png" 
                    alt="LB Logo" 
                    className="w-full h-full object-cover scale-110"
                    style={{ 
                      mixBlendMode: 'screen',
                    }}
                  />
                </div>

                {/* Native Pointing Emoji */}
                <motion.div
                   animate={{ y: [0, -10, 0], scale: [1, 0.95, 1] }}
                   transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                   className="absolute z-20 pointer-events-none"
                   style={{ top: '68%', fontSize: '3.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))' }}
                >
                  👆
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
