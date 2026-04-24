import React, { useRef, useState, useEffect } from 'react';
import { shouldEnableHeavyAnimations } from '@/src/lib/device-detection';

interface RevealOnScrollProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
    children,
    className = "",
    delay = 0
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    // Check if animations should be enabled
    const enableAnimations = shouldEnableHeavyAnimations();

    useEffect(() => {
        // Skip animations on low-end devices
        if (!enableAnimations) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.disconnect();
            }
        };
    }, [delay, enableAnimations]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${className}`}
        >
            {children}
        </div>
    );
};
