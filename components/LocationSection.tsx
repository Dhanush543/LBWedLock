'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import Image from 'next/image';

const VENUE_URL = 'https://maps.app.goo.gl/z7r6af1iSYHXfgni8?g_st=aw';

export default function LocationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section 
      id="location" 
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
        {/* Gold ornament + heading — outside the card */}
        <div className="flex items-center justify-center gap-3 mb-3 md:mb-5">
          <div style={{ height: 1, width: 30, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span>
          <div style={{ height: 1, width: 30, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
        </div>
        <div className="text-center mb-4 md:mb-6">
          <p className="section-label" style={{ fontSize: '0.6rem' }}>FIND US</p>
          <h2
            className="section-title mt-1"
            style={{ fontSize: 'clamp(1.5rem, 5vh, 2.4rem)', whiteSpace: 'nowrap' }}
          >
            Wedding Venue
          </h2>
        </div>

        <div className="premium-border w-full max-w-[420px]" style={{ padding: 0, overflow: 'hidden', flexShrink: 1 }}>

          {/* ── Sketch Image Hero ── */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', overflow: 'hidden' }}>
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
                bottom: 12,
                left: 20,
                right: 20,
              }}
            >
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.52rem',
                  letterSpacing: '0.3em',
                  color: 'rgba(212,175,55,0.8)',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                THE VENUE
              </p>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(1.2rem, 4vh, 1.5rem)',
                  fontWeight: 600,
                  color: '#FDF8F0',
                  lineHeight: 1.1,
                }}
              >
                SAI ITA Convention Hall
              </h3>
            </div>
          </div>

          {/* ── Content Block ── */}
          <div style={{ padding: '20px 20px 24px' }}>

            {/* Address */}
            <div style={{ marginBottom: 18, textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.55rem',
                  letterSpacing: '0.25em',
                  color: 'rgba(212,175,55,0.6)',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Address
              </p>
              <p
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.05rem',
                  color: 'var(--cream)',
                  lineHeight: 1.4,
                  opacity: 0.9,
                }}
              >
                South Bypass Road, Ongole.
              </p>
            </div>


          </div>
        </div>
      </motion.div>
    </section>
  );
}
