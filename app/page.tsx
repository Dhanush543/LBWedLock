'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Components
import LandingScreen from '@/components/LandingScreen';
import CurtainReveal from '@/components/CurtainReveal';
import ScratchCard from '@/components/ScratchCard';
import EventDetails from '@/components/EventDetails';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';
import MusicToggle from '@/components/MusicToggle';
import { SmokeBackground } from '@/components/ui/spooky-smoke-animation';


export default function Home() {
  const [isCurtainRevealed, setIsCurtainRevealed] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const shlokaAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAudio, setActiveAudio] = useState<'shloka' | 'main'>('shloka');

  useEffect(() => {
    // Initialize audio
    shlokaAudioRef.current = new Audio('/audio/shlokam.mp3');
    
    // Main background music
    mainAudioRef.current = new Audio('/audio/bgm.mp3');
    mainAudioRef.current.loop = true;
    mainAudioRef.current.volume = 0; // Force start at 0 so it fades in smoothly
    
    // Create a 60fps butter-smooth volume crossfade loop
    let fadeFrame: number;
    const updateVolumes = () => {
      // 1. Shloka Fade Out (last 3 seconds)
      const sAudio = shlokaAudioRef.current;
      if (sAudio && sAudio.duration) {
        const sFade = 3.0;
        const sLeft = sAudio.duration - sAudio.currentTime;
        if (sLeft <= sFade && sLeft > 0) {
          sAudio.volume = Math.max(0, sLeft / sFade);
        }
      }

      // 2. BGM Fade In / Fade Out (for looping)
      const mAudio = mainAudioRef.current;
      if (mAudio && mAudio.duration && !mAudio.paused) {
        const mFade = 3.0;
        const mLeft = mAudio.duration - mAudio.currentTime;
        if (mLeft <= mFade && mLeft > 0) {
          // Crossfade out at end of loop
          mAudio.volume = Math.max(0, mLeft / mFade);
        } else if (mAudio.currentTime < mFade) {
          // Crossfade in at start
          mAudio.volume = Math.min(1, mAudio.currentTime / mFade);
        } else {
          mAudio.volume = 1;
        }
      }

      fadeFrame = requestAnimationFrame(updateVolumes);
    };
    
    // Start the volume manager
    fadeFrame = requestAnimationFrame(updateVolumes);

    // When shloka finishes, transition to main music
    shlokaAudioRef.current.onended = () => {
      setActiveAudio('main');
      mainAudioRef.current?.play().catch(console.error);
    };

    return () => {
      cancelAnimationFrame(fadeFrame);
      shlokaAudioRef.current?.pause();
      mainAudioRef.current?.pause();
    };
  }, []);

  const toggleMusic = () => {
    const currentAudio = activeAudio === 'shloka' ? shlokaAudioRef.current : mainAudioRef.current;
    if (!currentAudio) return;

    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play().catch(() => console.error('Audio playback blocked'));
    }
    setIsPlaying(!isPlaying);
  };

  const handleRevealComplete = () => {
    setIsCurtainRevealed(true);
    setTimeout(() => {
      if (!isPlaying && shlokaAudioRef.current) {
        shlokaAudioRef.current.play().catch(() => console.log('Music play blocked by browser'));
        setIsPlaying(true);
      }
    }, 1000);
  };

  return (
    <main className="relative min-h-screen">
      {/* Unified Seamless Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #1A0505 0%, #2D0808 35%, #3D0B0B 70%, #1A0505 100%)' }}
        />
        <SmokeBackground smokeColor="#D4AF37" className="opacity-15" />
      </div>

      <CurtainReveal onRevealComplete={handleRevealComplete}>
        <div>
          {/* ── Hero section – transparent to show global background ── */}
          <LandingScreen
            isRevealed={isCurtainRevealed}
            musicEnabled={isPlaying}
            onMusicToggle={toggleMusic}
          />

          {/* ── All other sections are gated ── */}
          {isCurtainRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="relative w-full z-10"
            >
              <ScratchCard
                onScratchComplete={() => setIsScratched(true)}
                isScratched={isScratched}
              />

              {/* Revealed only after scratching the date */}
              {isScratched && (
                <div className="animate-in fade-in slide-in-from-bottom-[30px] duration-700 ease-out">
                  {/* Countdown is now integrated inside ScratchCard */}
                </div>
              )}

              {/* All other sections */}
              <EventDetails />
              <LocationSection />
              <Footer />
            </motion.div>
          )}
        </div>
      </CurtainReveal>

      {/* Persistent audio toggle */}
      {isCurtainRevealed && (
        <MusicToggle isPlaying={isPlaying} toggleMusic={toggleMusic} />
      )}
    </main>
  );
}
