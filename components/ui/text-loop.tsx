import React, { useState, useEffect, Children } from "react";
import { AnimatePresence, motion, Variants, Transition } from "framer-motion";

type TextLoopProps = { 
  children: React.ReactNode[]; 
  className?: string; 
  interval?: number; 
  transition?: Transition; 
  variants?: Variants; 
  onIndexChange?: (index: number) => void; 
  stopOnEnd?: boolean; 
};

export function TextLoop({ children, className, interval = 2, transition = { duration: 0.3 }, variants, onIndexChange, stopOnEnd = false }: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);
  
  useEffect(() => {
    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        if (stopOnEnd && current === items.length - 1) {
          clearInterval(timer);
          return current;
        }
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, stopOnEnd]);
  
  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };
  
  return (
    <div className="relative inline-block whitespace-nowrap">
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.div key={currentIndex} initial='initial' animate='animate' exit='exit' transition={transition} variants={variants || motionVariants} className={className}>
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
