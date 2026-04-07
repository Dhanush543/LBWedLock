'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YellowSmokeDrop from './YellowSmokeDrop';

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
    venue: 'Astona Juntion, South Bypass Road, Ongole',
    url: 'https://maps.app.goo.gl/bxqosF1XsCXD3NAbA?g_st=aw',
    color: '#E05252',
    glow: 'rgba(224,82,82,0.25)',
    bg: 'rgba(224,82,82,0.06)',
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

export default function EventDetails() {
  const [activeId, setActiveId] = useState(events[0].id);
  const [isHaldifying, setIsHaldifying] = useState(false);

  useEffect(() => {
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

  const activeEvent = events.find((e) => e.id === activeId) ?? events[0];

  const triggerHaldify = () => {
    setIsHaldifying(true);
    setTimeout(() => setIsHaldifying(false), 3500);
  };

  return (
    <section id="events" className="section-gap" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <YellowSmokeDrop isActive={isHaldifying} />

      <div className="section-container">
        {/* Section header — same style as ScratchCard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Gold ornament */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
            <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span>
            <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
          </div>

          <div className="text-center mb-8">
            <p className="section-label">THE CELEBRATION</p>
            <h2 className="section-title mt-3">Wedding Events</h2>
          </div>

          {/* ── CARD — matches premium-border style ── */}
          <motion.div
            animate={{ borderColor: activeEvent.color }}
            transition={{ duration: 0.8 }}
            style={{
              border: '1px solid',
              borderRadius: 28,
              background: 'rgba(26, 5, 5, 0.55)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${activeEvent.glow}`,
              padding: '36px 0',
              marginTop: 8,
              overflow: 'hidden',
              transition: 'box-shadow 0.8s ease',
            }}
          >
            {/* ── TIMELINE ── */}
            <div style={{ position: 'relative', padding: '0 28px' }}>
              {/* Vertical stem */}
              <div
                style={{
                  position: 'absolute',
                  left: 44,
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
                        paddingLeft: 38,
                        paddingBottom: isLast ? 0 : 48,
                        cursor: 'pointer',
                      }}
                    >
                      {/* Dot */}
                      <motion.div
                        animate={{
                          width: isActive ? 14 : 8,
                          height: isActive ? 14 : 8,
                          backgroundColor: isActive ? event.color : 'rgba(212,175,55,0.3)',
                          boxShadow: isActive ? `0 0 12px ${event.glow}, 0 0 0 3px ${event.bg}` : 'none',
                        }}
                        transition={{ duration: 0.35 }}
                        style={{
                          position: 'absolute',
                          left: 12,
                          top: 7,
                          borderRadius: '50%',
                          zIndex: 2,
                          transform: isActive ? 'translateX(-3px)' : 'none',
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
                            fontSize: isActive ? 'clamp(1.9rem, 7vw, 2.4rem)' : 'clamp(1.4rem, 5vw, 1.7rem)',
                            fontWeight: isActive ? 600 : 400,
                            lineHeight: 1.05,
                            marginBottom: 6,
                            transition: 'font-size 0.35s ease',
                            textShadow: isActive ? `0 0 30px ${event.glow}` : 'none',
                          }}
                        >
                          {event.title}
                        </motion.h3>

                        {/* Date & Time */}
                        <motion.div layout style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 3 }}>
                          <p
                            style={{
                              fontFamily: 'Lato, sans-serif',
                              fontSize: '0.78rem',
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
                              padding: '2px 10px',
                              borderRadius: 999,
                              fontFamily: 'Lato, sans-serif',
                              fontSize: '0.65rem',
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
                            fontSize: '0.92rem',
                            fontStyle: 'italic',
                            color: 'rgba(253,248,240,0.35)',
                            marginBottom: isActive ? 18 : 0,
                            transition: 'color 0.4s ease',
                          }}
                        >
                          {event.venue}
                        </motion.p>

                        {/* Buttons — only for active */}
                        <AnimatePresence mode="popLayout">
                          {isActive && (
                            <motion.div
                              layout
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: 'flex', flexWrap: 'wrap', gap: 10, overflow: 'hidden' }}
                            >
                              {event.id === 'haldi' && (
                                <button
                                  onClick={triggerHaldify}
                                  style={{
                                    backgroundColor: event.color,
                                    color: '#1A0505',
                                    borderRadius: 999,
                                    padding: '9px 20px',
                                    fontSize: '0.58rem',
                                    fontFamily: 'Lato, sans-serif',
                                    fontWeight: 800,
                                    letterSpacing: '0.22em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: `0 4px 20px ${event.glow}`,
                                  }}
                                >
                                  HALDIFY ✨
                                </button>
                              )}

                              <button
                                onClick={() => window.open(event.url, '_blank')}
                                style={{
                                  backgroundColor: 'transparent',
                                  color: event.color,
                                  borderRadius: 999,
                                  padding: '9px 20px',
                                  fontSize: '0.58rem',
                                  fontFamily: 'Lato, sans-serif',
                                  fontWeight: 700,
                                  letterSpacing: '0.2em',
                                  border: `1.5px solid ${event.color}`,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                }}
                              >
                                OPEN MAPS
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
