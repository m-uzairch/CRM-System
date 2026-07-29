'use me';
'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setIsDisabled(true);
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const updatePosition = () => {
      // Direct lerp calculation for ultra-smooth 60fps+ performance without frame drops
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * 0.22;
      pos.current.x += (targetPos.current.x - pos.current.x) * 0.75;
      pos.current.y += (targetPos.current.y - pos.current.y) * 0.75;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0px) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('interactive-hover');

      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    rafId.current = requestAnimationFrame(updatePosition);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (isDisabled || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      {/* Outer Smooth Trailing Follower Ring with subtle blue-purple glow */}
      <div
        ref={ringRef}
        className={`absolute w-8 h-8 rounded-full border transition-all duration-150 ease-out ${
          isHovered
            ? 'scale-150 border-purple-400/90 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
            : 'scale-100 border-blue-400/40 bg-blue-500/5 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Primary Precision Cursor Dot */}
      <div
        ref={dotRef}
        className={`absolute w-1.5 h-1.5 rounded-full transition-transform duration-100 ease-out ${
          isHovered ? 'scale-125 bg-white shadow-md' : 'scale-100 bg-white shadow-sm'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}

