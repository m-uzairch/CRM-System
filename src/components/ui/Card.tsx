'use me';
'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  const getVariantStyles = () => {
    switch (variant) {
      case 'ai':
        return 'bg-[#161622] border-purple-500/20 shadow-xl shadow-black/60';
      case 'glass':
        return 'bg-[#14141E]/90 backdrop-blur-md border-white/[0.08]';
      case 'subtle':
        return 'bg-[#0E0E16] border-white/[0.06]';
      case 'default':
      default:
        return 'bg-[#14141E] border-white/[0.08] shadow-xl shadow-black/50';
    }
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-200 ease-out hover:border-purple-500/40 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-purple-500/10'
    : '';

  const baseClasses = twMerge(
    clsx(
      'rounded-2xl border overflow-hidden relative',
      getVariantStyles(),
      interactiveStyles,
      className
    )
  );

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

