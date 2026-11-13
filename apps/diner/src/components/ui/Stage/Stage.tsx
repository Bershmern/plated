'use client';

import React from 'react';

interface StageProps {
  children: React.ReactNode;
  accentHex?: string;
  className?: string;
}

export function Stage({ children, accentHex = '#B08D57', className = '' }: StageProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-ink text-chalk flex flex-col items-center justify-center p-6 ${className}`}
      style={{ minHeight: '260px' }}
    >
      {/* Dim Room Spotlight Halo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 70%, ${accentHex} 0%, transparent 70%)`,
        }}
      />

      {/* Lit Table Surface Zone (--linen) */}
      <div className="relative w-full max-w-xs h-40 bg-linen/90 rounded-[40px] shadow-2xl border border-porcelain/40 flex items-center justify-center backdrop-blur-xs overflow-hidden">
        {/* Subtle Oval Table Rim Glow */}
        <div
          className="absolute inset-x-4 bottom-2 h-12 rounded-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${accentHex} 0%, transparent 80%)`,
          }}
        />

        {children}
      </div>
    </div>
  );
}
