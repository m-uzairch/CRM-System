'use me';
'use client';

import React, { useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'variant'> {
  children: React.ReactNode;
  variant?: 'default' | 'ai' | 'glass' | 'subtle';
  interactive?: boolean;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'emerald' | 'amber' | 'none';
}

export default function Card({
  children,
  variant = 'default',
  interactive = true,
  className = '',
  glowColor = 'none',
  ...props
}: CardProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const getGlowShadow = () => {
    return '0 20px 35px -10px rgba(0, 0, 0, 0.8), 0 0 20px 0px rgba(255, 255, 255, 0.08)';
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'ai':
        return 'bg-zinc-900 border-zinc-700 shadow-xl shadow-black/60';
      case 'glass':
        return 'bg-zinc-900/90 backdrop-blur-md border-zinc-800';
      case 'subtle':
        return 'bg-zinc-950 border-zinc-800';
      case 'default':
      default:
        return 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/50';
    }
  };

  const baseClasses = twMerge(
    clsx(
      'rounded-2xl border transition-colors duration-200 overflow-hidden relative',
      getVariantStyles(),
      className
    )
  );

  if (!interactive) {
    return (
      <div className={baseClasses} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      whileHover={
        reducedMotion
          ? {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }
          : {
              y: -5,
              scale: 1.015,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              boxShadow: getGlowShadow(),
            }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
