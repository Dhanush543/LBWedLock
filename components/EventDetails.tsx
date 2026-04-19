'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YellowSmokeDrop from './YellowSmokeDrop';
import ParticleBackground from './ParticleBackground';

const events = [
  {
    id: 'haldi',
    title: 'Haldi / హల్డి',
    date: '25th April, 2026',
    time: '8:00 AM',
    venue: 'Flat No 403,Happy Homes Apartment, Bhagyanagar 3rd Lane, Ongole',
    url: 'https://maps.app.goo.gl/5L6Vjxv7MSUzkim59?g_st=aw',
    color: '#FFD700',
    glow: 'rgba(54, 49, 21, 0.25)',
    bg: 'rgba(255,215,0,0.06)',
  },
  {
    id: 'pradanam',
    title: 'Pradanam / ప్రదానం',
    date: '25th April, 2026',
    time: '7:00 PM',
    venue: 'SAI ITA Convention Hall, South Bypass Road, Ongole',
    url: 'https://maps.app.goo.gl/z7r6af1iSYHXfgni8?g_st=aw',
    color: '#FF4D6D',
    glow: 'rgba(255, 77, 109, 0.25)',
    bg: 'rgba(255, 77, 109, 0.06)',
  },
  {
    id: 'upanayanam',
    title: 'Upanayanam / ఉపనయనం',
    date: '26th April, 2026',
    time: '4:05 AM',
    venue: 'SAI ITA Convention Hall, South Bypass Road, Ongole',
    url: 'https://maps.app.goo.gl/z7r6af1iSYHXfgni8?g_st=aw',
    color: '#FB923C',
    glow: 'rgba(251,146,60,0.25)',
    bg: 'rgba(251,146,60,0.06)',
  },
  {
    id: 'marriage',
    title: 'Marriage / వివాహం',
    date: '26th April, 2026',
    time: '10:44 AM',
    venue: 'SAI ITA Convention Hall, South Bypass Road, Ongole',
    url: 'https://maps.app.goo.gl/z7r6af1iSYHXfgni8?g_st=aw',
    color: '#D4AF37',
    glow: 'rgba(212,175,55,0.3)',
    bg: 'rgba(212,175,55,0.07)',
    isSpecial: true,
  },
];

interface EventDetailsProps {
  autoMode?: boolean;
  onComplete?: () => void;
}

export default function EventDetails({ autoMode, onComplete }: EventDetailsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHaldifying, setIsHaldifying] = useState(false);
  const [isIntroHaldifyDone, setIsIntroHaldifyDone] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // 1. Cinematic Entry Orchestration
  useEffect(() => {
    if (!autoMode) {
      setShowContent(true);
      setActiveId(events[0].id);
      return;
    }
    
    // T+0.4s: Trigger Smoke Explosion
    const triggerTimeout = setTimeout(() => {
      triggerHaldify();
    }, 400);

    // T+3.0s: Fade in the content card while smoke is peaking
    const revealTimeout = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    // T+4.5s: Smoke has cleared, start the focus focus one by one
    const doneTimeout = setTimeout(() => {
      setActiveId(events[0].id);
      setIsIntroHaldifyDone(true);
    }, 4500);

    return () => {
      clearTimeout(triggerTimeout);
      clearTimeout(revealTimeout);
      clearTimeout(doneTimeout);
    };
  }, [autoMode]);

  // 2. Auto-cycle logic — starts AFTER intro reveal is complete
  useEffect(() => {
    if (!autoMode || !isIntroHaldifyDone) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < events.length) {
        setActiveId(events[currentIndex].id);
      } else {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 2500);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoMode, isIntroHaldifyDone, onComplete]);

  useEffect(() => {
    if (autoMode) return;
    const observers: IntersectionObserver[] = [];

    events.forEach((event) => {
      const el = document.getElementById(`event-${event.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(event.id);
        },
        { root: null, rootMargin: '-30% 0px -30% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeEvent = events.find((e) => e.id === activeId) ?? {
    ...events[0],
    color: 'rgba(212,175,55,0.4)',
    glow: 'transparent',
    bg: 'transparent'
  };

  const triggerHaldify = () => {
    setIsHaldifying(true);
    setTimeout(() => setIsHaldifying(false), 3500);
  };

  return (
    <section 
      id="events" 
      className="relative flex items-center justify-center overflow-hidden" 
      style={{ height: '100svh', width: '100%' }}
    >
      <ParticleBackground />
      <YellowSmokeDrop isActive={isHaldifying} />

      <motion.div 
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="section-container relative z-10 flex flex-col items-center justify-center h-full max-h-screen py-4"
      >
        {/* Section header — same style as ScratchCard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full flex flex-col items-center"
        >
          {/* Gold ornament — shrunk for space */}
          <div className="flex items-center justify-center gap-3 mb-3 md:mb-5">
            <div style={{ height: 1, width: 30, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
            <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span>
            <div style={{ height: 1, width: 30, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
          </div>

          <div className="text-center mb-4 md:mb-8">
            <p className="section-label" style={{ fontSize: '0.6rem' }}>THE CELEBRATION</p>
            <h2 className="section-title mt-1 md:mt-3" style={{ fontSize: 'clamp(1.5rem, 6vh, 2.2rem)' }}>Wedding Events</h2>
          </div>

          {/* ── CARD ── */}
          <motion.div
            animate={{ borderColor: activeEvent.color }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[420px]"
            style={{
              border: '1px solid',
              borderRadius: 24,
              background: 'rgba(26, 5, 5, 0.45)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${activeEvent.glow}`,
              padding: '24px 0',
              overflow: 'hidden',
              transition: 'box-shadow 0.8s ease',
              flexShrink: 1,
            }}
          >
            {/* ── TIMELINE ── */}
            <div style={{ position: 'relative', padding: '0 20px' }}>
              {/* Vertical stem */}
              <div
                style={{
                  position: 'absolute',
                  left: 34,
                  top: 8,
                  bottom: 8,
                  width: 1,
                  background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.3) 20%, rgba(212,175,55,0.3) 80%, transparent)',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {events.map((event, i) => {
                  const isActive = activeId === event.id;
                  const isLast = i === events.length - 1;

                  return (
                    <motion.div
                      layout
                      key={event.id}
                      id={`event-${event.id}`}
                      onClick={() => setActiveId(event.id)}
                      style={{
                        position: 'relative',
                        paddingLeft: 30,
                        paddingBottom: isLast ? 0 : 25,
                        cursor: 'pointer',
                      }}
                    >
                      {/* Dot */}
                      <motion.div
                        animate={{
                          width: isActive ? 10 : 6,
                          height: isActive ? 10 : 6,
                          backgroundColor: isActive ? event.color : 'rgba(212,175,55,0.3)',
                          boxShadow: isActive ? `0 0 12px ${event.glow}, 0 0 0 3px ${event.bg}` : 'none',
                        }}
                        transition={{ duration: 0.35 }}
                        style={{
                          position: 'absolute',
                          left: 10,
                          top: 6,
                          borderRadius: '50%',
                          zIndex: 2,
                          transform: isActive ? 'translateX(-2px)' : 'none',
                        }}
                      />

                      {/* Active row highlight */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              top: -10,
                              bottom: isLast ? -10 : 14,
                              left: -4,
                              right: -28,
                              backgroundColor: event.bg,
                              borderRadius: 16,
                              zIndex: 0,
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Content */}
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Title */}
                        <motion.h3
                          layout
                          animate={{
                            color: isActive ? event.color : 'rgba(253,248,240,0.6)',
                          }}
                          transition={{ duration: 0.4 }}
                          style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: isActive ? 'clamp(1.25rem, 4.5vh, 1.55rem)' : 'clamp(1.1rem, 4vh, 1.3rem)',
                            fontWeight: isActive ? 600 : 400,
                            lineHeight: 1.2,
                            marginBottom: isActive ? 4 : 2,
                            transition: 'color 0.4s ease, font-weight 0.4s ease, font-size 0.35s ease',
                            textShadow: isActive ? `0 0 30px ${event.glow}` : 'none',
                          }}
                        >
                          {event.title}
                        </motion.h3>

                        {/* Date & Time */}
                        <motion.div layout style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: isActive ? 3 : 1 }}>
                          <p
                            style={{
                              fontFamily: 'Lato, sans-serif',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: isActive ? event.color : 'rgba(253,248,240,0.35)',
                              letterSpacing: '0.01em',
                              transition: 'color 0.4s ease',
                              margin: 0,
                            }}
                          >
                            {event.date}
                          </p>

                          {/* Time pill */}
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '1px 8px',
                              borderRadius: 999,
                              fontFamily: 'Lato, sans-serif',
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              letterSpacing: '0.08em',
                              background: isActive ? event.color : 'rgba(212,175,55,0.12)',
                              color: isActive ? '#1A0505' : 'rgba(212,175,55,0.5)',
                              transition: 'all 0.4s ease',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {event.time}
                          </span>
                        </motion.div>

                        {/* Venue */}
                        <motion.p
                          layout
                          style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '0.82rem',
                            fontStyle: 'italic',
                            color: '#FFFFFF',
                            marginBottom: isActive ? 10 : 0,
                            lineHeight: 1.3,
                            transition: 'color 0.4s ease',
                          }}
                        >
                          {event.venue}
                        </motion.p>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
