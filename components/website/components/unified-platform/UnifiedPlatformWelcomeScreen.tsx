import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedPlatformWelcomeScreenProps {
  firstName?: string | null;
  onboardingDone?: boolean;
}

const STORAGE_KEY_POST_LOGIN = 'pr_post_login_splash';

export const UnifiedPlatformWelcomeScreen: React.FC<UnifiedPlatformWelcomeScreenProps> = ({
  firstName,
  onboardingDone: onboardingDoneProp,
}) => {
  const [introPhase, setIntroPhase] = useState<'entering' | 'textExiting' | 'exiting' | 'done'>('entering');
  const [dashboardFirstName, setDashboardFirstName] = useState<string | null>(firstName || null);
  const introFinishedRef = useRef(false);

  useEffect(() => {
    const onProfileLoaded = (e: Event) => {
      const loadedFirstName = (e as CustomEvent).detail?.firstName;
      if (loadedFirstName) setDashboardFirstName(loadedFirstName);
    };
    window.addEventListener('app:profileLoaded', onProfileLoaded);
    return () => window.removeEventListener('app:profileLoaded', onProfileLoaded);
  }, []);

  useEffect(() => {
    if (firstName) setDashboardFirstName(firstName);
  }, [firstName]);

  const shouldShow = (() => {
    if (typeof window === 'undefined') return false;
    const hasDomainFlag = new URLSearchParams(window.location.search).get('domain') === 'main';
    const hasPostLoginFlag = sessionStorage.getItem(STORAGE_KEY_POST_LOGIN) === '1';
    console.log('[UnifiedPlatformWelcomeScreen] shouldShow check:', { hasDomainFlag, hasPostLoginFlag, location: window.location.href });
    return hasDomainFlag || hasPostLoginFlag;
  })();

  const onboardingDone = (() => {
    if (onboardingDoneProp !== undefined) return onboardingDoneProp;
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('pr_welcome_get_started_dismissed') === '1' ||
      localStorage.getItem('hasCompletedBriefing') === '1' ||
      localStorage.getItem('welcome_dismissed') === '1'
    );
  })();

  const welcomeName = (() => {
    const name = dashboardFirstName || '';
    const first = String(name).split(' ')[0].replace(/@.*/, '').replace(/^[a-z]/, c => c.toUpperCase());
    return first;
  })();

  console.log('[UnifiedPlatformWelcomeScreen] render:', { shouldShow, introPhase, welcomeName, onboardingDone });

  useEffect(() => {
    if (introFinishedRef.current || !shouldShow) return;

    console.log('[UnifiedPlatformWelcomeScreen] starting splash animation');
    const holdTimer = setTimeout(() => {
      console.log('[UnifiedPlatformWelcomeScreen] introPhase -> textExiting');
      setIntroPhase('textExiting');
      const textExitTimer = setTimeout(() => {
        console.log('[UnifiedPlatformWelcomeScreen] introPhase -> exiting, dispatching app:introComplete');
        setIntroPhase('exiting');
        window.dispatchEvent(new CustomEvent('app:introComplete'));
        const exitTimer = setTimeout(() => {
          console.log('[UnifiedPlatformWelcomeScreen] introPhase -> done, clearing flag');
          setIntroPhase('done');
          introFinishedRef.current = true;
          document.body.classList.add('app-ready');
          try { sessionStorage.removeItem(STORAGE_KEY_POST_LOGIN); } catch {}
        }, 900);
        return () => clearTimeout(exitTimer);
      }, 500);
      return () => clearTimeout(textExitTimer);
    }, 5000);

    return () => clearTimeout(holdTimer);
  }, [shouldShow]);

  if (!shouldShow || introPhase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-xl"
        initial={{ opacity: 1, filter: 'blur(0px)' }}
        animate={introPhase === 'entering' || introPhase === 'textExiting'
          ? { opacity: 1, filter: 'blur(0px)' }
          : { opacity: 0, scale: 1.05, filter: 'blur(12px)' }
        }
        exit={{ opacity: 0, transition: { duration: 0 } }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30, scale: 0.82, filter: 'blur(8px)' }}
          animate={introPhase === 'entering'
            ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, y: -40, scale: 0.92, filter: 'blur(10px)' }
          }
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          style={{ willChange: 'transform, opacity, filter' }}
        >
          <>
            <motion.p
              className="text-sm md:text-base text-white/60 tracking-[0.2em] uppercase font-medium select-none mb-2"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
            >
              Welcome
            </motion.p>
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-4 select-none"
              initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.92 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
            >
              <span className="text-red-500">Capt.</span>{' '}
              <span className="text-white">{welcomeName || 'Pilot'}</span>
            </motion.h1>
            <motion.p
              className="text-sm md:text-base text-white/60 tracking-[0.15em] uppercase font-medium select-none"
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const, delay: 0.8 }}
            >
              {onboardingDone ? 'loading flight deck' : 'getting things ready'}
            </motion.p>
          </>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
