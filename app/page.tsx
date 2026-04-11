'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import LandingScreen from '@/components/LandingScreen';
import CurtainReveal from '@/components/CurtainReveal';
import ScratchCard from '@/components/ScratchCard';
import EventDetails from '@/components/EventDetails';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';
import MusicToggle from '@/components/MusicToggle';
import { SmokeBackground } from '@/components/ui/spooky-smoke-animation';


type Step = 'none' | 'landing' | 'scratch' | 'events' | 'venue' | 'thanks';

export default function Home() {
  const [step, setStep] = useState<Step>('none');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCurtainExiting, setIsCurtainExiting] = useState(false);
  const shlokaAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const stepRef = useRef<Step>(step);
  const thanksEntryTimeRef = useRef<number>(0);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    // Initialize audio ONCE on mount
    shlokaAudioRef.current = new Audio('/audio/shlokam.mp3');
    mainAudioRef.current = new Audio('/audio/bgm.mp3');
    mainAudioRef.current.loop = true;
    mainAudioRef.current.volume = 0;

    // Crossfade volume manager
    let fadeFrame: number;
    const updateVolumes = () => {
      const currentStep = stepRef.current;
      const sAudio = shlokaAudioRef.current;
      if (sAudio && sAudio.duration && !sAudio.paused) {
        const sFade = 3.0;
        const sLeft = sAudio.duration - sAudio.currentTime;
        if (sLeft <= sFade && sLeft > 0) sAudio.volume = Math.max(0, sLeft / sFade);
      }

      const mAudio = mainAudioRef.current;
      if (mAudio && mAudio.duration && !mAudio.paused) {
        const mFade = 3.0;
        // Fade in logic if it just started
        if (mAudio.currentTime < mFade) {
          mAudio.volume = Math.min(1, mAudio.currentTime / mFade);
        } else if (currentStep !== 'thanks') {
          mAudio.volume = 1;
        }

        // Global fade out if in thanks step — ONLY after 8 seconds
        if (currentStep === 'thanks') {
          const elapsed = performance.now() - thanksEntryTimeRef.current;
          if (elapsed > 8000) {
            // Rapid fade out in last 2 seconds (0.012 per frame)
            const newVol = Math.max(0, mAudio.volume - 0.012);
            mAudio.volume = newVol;
            if (newVol <= 0.01) {
              mAudio.volume = 0;
              if (newVol === 0) mAudio.pause();
            }
          } else {
            mAudio.volume = 1; // Keep full volume during wait
          }
        }
      }
      fadeFrame = requestAnimationFrame(updateVolumes);
    };
    fadeFrame = requestAnimationFrame(updateVolumes);

    // shlokaAudioRef.current.onended = () => {
    //   mainAudioRef.current?.play().catch(console.error);
    //   setIsCurtainExiting(true);
    //   setStep('scratch');
    // };

    return () => {
      cancelAnimationFrame(fadeFrame);
      // Clean cleanup only on unmount
      shlokaAudioRef.current?.pause();
      mainAudioRef.current?.pause();
    };
  }, []); // Mount only

  const handleRevealComplete = () => {
    setIsRevealed(true);
    setStep('landing');
    
    // T+2.5s: START SHLOKA AUDIO, NAMES, AND TEXT SYNC
    setTimeout(() => {
      if (shlokaAudioRef.current) {
        shlokaAudioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }, 2500);

    // T+16.5s: Transition to Scratch ONLY after shloka is visually finished
    // (Start 2.5s + Shloka 12.0s + Polish 2.0s = 16.5s)
    setTimeout(() => {
      setIsCurtainExiting(true);
      setStep('scratch');
      mainAudioRef.current?.play().catch(console.error);
    }, 16500);
  };

  const handleScratchComplete = () => {
    setTimeout(() => setStep('events'), 5000);
  };

  const handleEventsComplete = () => {
    setStep('venue');
    setTimeout(() => setStep('thanks'), 7000);
  };

  // 3. Automatic Replay Timer
  useEffect(() => {
    if (step === 'thanks') {
      thanksEntryTimeRef.current = performance.now();
      const replayTimer = setTimeout(() => {
        resetFlow();
      }, 10000); // 10 seconds wait as requested
      return () => clearTimeout(replayTimer);
    }
  }, [step]);

  const resetFlow = () => {
    setStep('none');
    setIsRevealed(false);
    setIsPlaying(false);
    setIsCurtainExiting(false);
    if (shlokaAudioRef.current) {
      shlokaAudioRef.current.pause();
      shlokaAudioRef.current.currentTime = 0;
    }
    if (mainAudioRef.current) {
      mainAudioRef.current.pause();
      mainAudioRef.current.currentTime = 0;
      mainAudioRef.current.volume = 0;
    }
  };

  const toggleMusic = () => {
    const currentAudio = step === 'landing' ? shlokaAudioRef.current : mainAudioRef.current;
    if (!currentAudio) return;
    if (isPlaying) currentAudio.pause();
    else currentAudio.play().catch(console.error);
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#1A0505] p-[10px]">
      {/* Unified Seamless Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div 
          className="absolute inset-0" 
          style={{ background: 'linear-gradient(160deg, #1A0505 0%, #2D0808 35%, #3D0B0B 70%, #1A0505 100%)' }} 
        />
        <SmokeBackground smokeColor="#D4AF37" className="opacity-15" />
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {(step === 'none' || step === 'landing') && (
            <motion.div 
              key="curtain-container"
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 z-50 overflow-hidden"
            >
              <CurtainReveal 
                onRevealComplete={handleRevealComplete} 
                isExiting={isCurtainExiting}
              >
                {step === 'landing' && (
                  <motion.div
                    key="landing-inner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="w-full h-full"
                  >
                    <LandingScreen isRevealed={isRevealed} musicEnabled={isPlaying} onMusicToggle={toggleMusic} />
                  </motion.div>
                )}
              </CurtainReveal>
            </motion.div>
          )}

          {step === 'scratch' && (
            <motion.div
              key="scratch"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 1 }}
              className="w-full h-full flex items-center justify-center"
            >
              <ScratchCard isScratched={false} autoMode={true} onScratchComplete={handleScratchComplete} />
            </motion.div>
          )}

          {step === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 1 }}
              className="w-full h-full"
            >
              <EventDetails autoMode={true} onComplete={handleEventsComplete} />
            </motion.div>
          )}

          {step === 'venue' && (
            <motion.div
              key="venue"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="w-full h-full"
            >
              <LocationSection />
            </motion.div>
          )}

          {step === 'thanks' && (
            <motion.div
              key="thanks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="w-full h-full cursor-pointer"
              onClick={resetFlow}
            >
              <Footer />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
                className="fixed bottom-10 left-0 right-0 text-center flex flex-col items-center gap-5"
              >
                {/* Global Get Venue Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const VENUE_URL = 'https://maps.app.goo.gl/z7r6af1iSYHXfgni8?g_st=aw';
                    window.open(VENUE_URL, '_blank');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, var(--maroon-dark), var(--maroon))',
                    color: 'var(--gold)',
                    border: '1px solid rgba(212,175,55,0.4)',
                    borderRadius: '999px',
                    padding: '12px 28px',
                    fontSize: '0.65rem',
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    boxShadow: '0 8px 32px rgba(139,26,26,0.5), inset 0 0 0 1px rgba(212,175,55,0.1)',
                    cursor: 'pointer'
                  }}
                >
                  GET VENUE LOCATION
                </motion.button>

                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-16 h-px" 
                    style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.4 }} 
                  />
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ 
                      fontFamily: 'Lato', 
                      fontSize: '0.65rem', 
                      color: 'var(--gold)', 
                      letterSpacing: '0.3em',
                      fontWeight: 700,
                      textShadow: '0 0 12px rgba(212,175,55,0.4)'
                    }}
                  >
                    TAP TO REPLAY ↺
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global UI */}
        {(step !== 'none' && step !== 'thanks') && (
          <div className="fixed bottom-6 right-6 z-[60]">
            <MusicToggle isPlaying={isPlaying} toggleMusic={toggleMusic} />
          </div>
        )}
      </div>
    </main>
  );
}
