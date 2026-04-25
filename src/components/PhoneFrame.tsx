import { ReactNode } from 'react';

/**
 * The "device" — sits in the center of the page so the iOS feel is preserved
 * even on desktop. On small screens it stretches edge-to-edge.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full w-full flex items-center justify-center bg-[#050507] py-0 sm:py-8">
      <div className="relative w-full sm:w-[400px] sm:h-[860px] h-[100dvh] sm:rounded-[56px] rounded-none overflow-hidden bg-ever-ink sm:shadow-[0_40px_120px_-30px_rgba(255,90,31,0.25),0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:border sm:border-white/5">
        {/* Subtle bezel highlight */}
        <div className="pointer-events-none absolute inset-0 sm:rounded-[56px] [background:radial-gradient(120%_60%_at_50%_-10%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(120%_60%_at_50%_110%,rgba(255,90,31,0.08),transparent_60%)]" />
        {children}
      </div>
    </div>
  );
}
