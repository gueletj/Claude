import { motion } from 'framer-motion';
import { spring } from '../tokens/motion';
import { useState } from 'react';

export type AppKey = 'capsules' | 'composer' | 'calendar' | 'inbox' | 'studio' | 'pulse' | 'archive' | 'settings';

const APPS: { key: AppKey; label: string; gradient: [string, string]; glyph: string }[] = [
  { key: 'capsules', label: 'Capsules',  gradient: ['#ff5a1f', '#7a1f00'], glyph: '◐' },
  { key: 'composer', label: 'Composer',  gradient: ['#7a86ff', '#0a0a3a'], glyph: '✻' },
  { key: 'calendar', label: 'Calendar',  gradient: ['#22d3a4', '#053b2c'], glyph: '◧' },
  { key: 'inbox',    label: 'Inbox',     gradient: ['#ff3b6b', '#3a0a1a'], glyph: '✉' },
  { key: 'studio',   label: 'Studio',    gradient: ['#ffce8c', '#5a2a00'], glyph: '◉' },
  { key: 'pulse',    label: 'Pulse',     gradient: ['#ffae5e', '#3a1a00'], glyph: '♡' },
  { key: 'archive',  label: 'Archive',   gradient: ['#444', '#111'],       glyph: '▤' },
  { key: 'settings', label: 'Settings',  gradient: ['#9aa0a6', '#222'],    glyph: '⚙' },
];

export function HomeScreen({
  onOpen,
  onTone,
}: {
  onOpen: (key: AppKey) => void;
  onTone: (label: string, accent: string) => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Wallpaper */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(120%_60%_at_20%_0%,#ff7a3a_0%,#ff5a1f_30%,#7a1f00_60%,#1a0700_100%)]" />
        <div className="absolute inset-0 grain" />
        {/* Faux film hero */}
        <div className="absolute inset-0 [background:radial-gradient(80%_50%_at_50%_120%,rgba(0,0,0,0.6),transparent_60%)]" />
      </div>

      {/* EVER mark + greeting */}
      <div className="relative pt-16 px-7 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/70 text-[12px] uppercase tracking-[0.32em] font-semibold">Friday · 25 April</div>
            <h1 className="text-white font-display italic text-[44px] leading-[0.92] tracking-tight mt-1">
              GOOD<br/>MORNING<span className="text-ever-spark">,</span>
            </h1>
            <p className="text-white/85 font-display italic text-[44px] leading-[0.92] tracking-tight">HENRI.</p>
          </div>
        </div>
      </div>

      {/* Today widget */}
      <motion.button
        onClick={() => onOpen('capsules')}
        whileTap={{ scale: 0.97 }}
        transition={spring.snap}
        className="relative z-10 mt-6 mx-5 w-[calc(100%-40px)] text-left rounded-3xl glass p-4 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ever-flame to-ever-ember grid place-items-center text-white text-xl font-bold shadow-press">5</div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">Today's brief</div>
          <div className="text-white font-semibold">5 capsules · 11 posts queued</div>
          <div className="text-white/60 text-sm">Milo's drop goes live in 1h 12m</div>
        </div>
        <div className="text-white/60 text-xl">›</div>
      </motion.button>

      {/* App grid */}
      <div className="relative z-10 mt-7 px-6 grid grid-cols-4 gap-x-4 gap-y-6">
        {APPS.map((app, i) => (
          <AppIcon
            key={app.key}
            label={app.label}
            gradient={app.gradient}
            glyph={app.glyph}
            index={i}
            onPress={() => {
              onTone(`Open · ${app.label}`, app.gradient[0]);
              onOpen(app.key);
            }}
          />
        ))}
      </div>

      {/* Dock */}
      <div className="absolute left-4 right-4 bottom-9 z-10">
        <div className="rounded-[36px] glass-light p-3 flex items-center justify-around">
          {(['capsules','composer','calendar','inbox'] as AppKey[]).map((k, idx) => {
            const meta = APPS.find(a => a.key === k)!;
            return (
              <DockIcon
                key={k}
                gradient={meta.gradient}
                glyph={meta.glyph}
                onPress={() => {
                  onTone(`Open · ${meta.label}`, meta.gradient[0]);
                  onOpen(k);
                }}
                delay={idx * 0.04}
              />
            );
          })}
        </div>
      </div>

      {/* Home indicator */}
      <div className="absolute left-0 right-0 bottom-2 flex justify-center z-10">
        <div className="home-indicator" />
      </div>
    </motion.div>
  );
}

function AppIcon({
  label,
  gradient,
  glyph,
  onPress,
  index,
}: {
  label: string;
  gradient: [string, string];
  glyph: string;
  onPress: () => void;
  index: number;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <motion.button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={onPress}
      className="flex flex-col items-center gap-1.5 select-none"
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring.soft, delay: 0.04 + index * 0.03 }}
      whileTap={{ scale: 0.88 }}
      aria-label={label}
    >
      <motion.div
        className="relative w-[60px] h-[60px] rounded-[18px] grid place-items-center overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
          boxShadow: pressed
            ? `0 2px 8px ${gradient[0]}55, inset 0 0 0 1px rgba(255,255,255,0.08)`
            : `0 14px 32px -10px ${gradient[0]}66, inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.18)`,
        }}
        animate={{
          filter: pressed ? 'blur(0.6px) saturate(1.15)' : 'blur(0px) saturate(1)',
        }}
        transition={spring.snap}
      >
        <div className="absolute inset-0 grain opacity-60" />
        <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-white/15 blur-md" />
        <span className="relative text-white text-[26px] leading-none drop-shadow">{glyph}</span>
      </motion.div>
      <span className="text-white text-[11.5px] font-medium drop-shadow">{label}</span>
    </motion.button>
  );
}

function DockIcon({
  gradient,
  glyph,
  onPress,
  delay,
}: {
  gradient: [string, string];
  glyph: string;
  onPress: () => void;
  delay: number;
}) {
  return (
    <motion.button
      onClick={onPress}
      whileTap={{ scale: 0.86 }}
      transition={spring.snap}
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        background: `linear-gradient(140deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        boxShadow: `0 10px 24px -8px ${gradient[0]}88, inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.18)`,
      }}
      className="relative w-[54px] h-[54px] rounded-[16px] grid place-items-center overflow-hidden"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay } }}
        className="text-white text-[24px] leading-none"
      >
        {glyph}
      </motion.span>
      <div className="absolute inset-0 grain opacity-50" />
    </motion.button>
  );
}
