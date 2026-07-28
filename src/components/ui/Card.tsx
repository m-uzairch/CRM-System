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
  glowColor = 'purple',
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
    switch (glowColor) {
      case 'blue':
        return '0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 25px 0px rgba(59, 130, 246, 0.2)';
      case 'emerald':
        return '0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 25px 0px rgba(16, 185, 129, 0.2)';
      case 'amber':
        return '0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 25px 0px rgba(245, 158, 11, 0.2)';
      case 'none':
        return '0 20px 35px -10px rgba(0, 0, 0, 0.7)';
      case 'purple':
      default:
        return '0 20px 35px -10px rgba(0, 0, 0, 0.7), 0 0 25px 0px rgba(147, 51, 234, 0.2)';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'ai':
        return 'bg-gradient-to-b from-[#1c1836] to-[#151520] border-purple-500/30 shadow-lg shadow-purple-500/10';
      case 'glass':
        return 'bg-[#151520]/80 backdrop-blur-md border-white/[0.08]';
      case 'subtle':
        return 'bg-[#0D0D14] border-white/[0.05]';
      case 'default':
      default:
        return 'bg-[#151520] border-white/[0.06] shadow-xl shadow-black/40';
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
              borderColor: variant === 'ai' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(255, 255, 255, 0.16)',
            }
          : {
              y: -5,
              scale: 1.015,
              borderColor: variant === 'ai' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(255, 255, 255, 0.16)',
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
