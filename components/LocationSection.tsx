'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const VENUE_URL = 'https://maps.app.goo.gl/z7r6af1iSYHXfgni8?g_st=aw';

export default function LocationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="location" ref={sectionRef} className="section-gap">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="section-container"
      >
        {/* Gold ornament + heading — outside the card */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
        </div>
        <div className="text-center mb-6">
          <p className="section-label">FIND US</p>
          <h2
            className="section-title mt-2"
            style={{ fontSize: 'clamp(2rem, 7vw, 3rem)', whiteSpace: 'nowrap' }}
          >
            Wedding Venue
          </h2>
        </div>

        <div className="premium-border" style={{ padding: 0, overflow: 'hidden' }}>

          {/* ── Sketch Image Hero ── */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
            <Image
              src="/images/venue-sketch.png"
              alt="SAI ITA Convention Hall — pencil sketch"
              fill
              style={{
                objectFit: 'cover',
                filter: 'invert(1) sepia(1) saturate(3) hue-rotate(-10deg) brightness(0.9) contrast(1.3)'
              }}
              priority
            />

            {/* Gold gradient overlay at bottom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, transparent 30%, rgba(26,5,5,0.7) 75%, rgba(26,5,5,0.97) 100%)',
              }}
            />

            {/* Venue name floated over bottom of image */}
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: 24,
                right: 24,
              }}
            >
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(212,175,55,0.8)',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                THE VENUE
              </p>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
                  fontWeight: 600,
                  color: '#FDF8F0',
                  lineHeight: 1.15,
                }}
              >
                SAI ITA Convention Hall
              </h3>
            </div>
          </div>

          {/* ── Content Block ── */}
          <div style={{ padding: '28px 24px 32px' }}>

            {/* Address */}
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.25em',
                  color: 'rgba(212,175,55,0.6)',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Address
              </p>
              <p
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.2rem',
                  color: 'var(--cream)',
                  lineHeight: 1.5,
                  opacity: 0.9,
                }}
              >
                South Bypass Road, Ongole.
              </p>
            </div>

            {/* Open Maps pill - Centered */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <motion.a
                href={VENUE_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
                  color: 'var(--gold)',
                  borderRadius: 999,
                  padding: '12px 32px',
                  textDecoration: 'none',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  boxShadow: '0 4px 20px rgba(139,26,26,0.35), inset 0 0 0 1px rgba(212,175,55,0.2)',
                }}
              >
                <span>OPEN MAPS</span>
              </motion.a>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
