import { AnimatePresence, motion } from 'framer-motion';
import { spring } from '../tokens/motion';
import { useEffect, useState } from 'react';

export type IslandState =
  | { kind: 'idle' }
  | { kind: 'pulse'; clientName: string; pulse: number; accent: string }
  | { kind: 'countdown'; clientName: string; postTitle: string; secondsLeft: number; accent: string }
  | { kind: 'drafting'; clientName: string; tones: string[]; accent: string }
  | { kind: 'gesture'; label: string; accent: string };

const ISLAND_BASE_W = 124;
const ISLAND_BASE_H = 36;

const variants = {
  idle:      { width: ISLAND_BASE_W, height: ISLAND_BASE_H, borderRadius: 28 },
  pulse:     { width: 260, height: 44, borderRadius: 26 },
  countdown: { width: 290, height: 56, borderRadius: 28 },
  drafting:  { width: 300, height: 64, borderRadius: 32 },
  gesture:   { width: 200, height: 44, borderRadius: 26 },
} as const;

export function DynamicIsland({ state }: { state: IslandState }) {
  const [, force] = useState(0);
  // Re-render every second when in countdown so the timer ticks down visually.
  useEffect(() => {
    if (state.kind !== 'countdown') return;
    const id = setInterval(() => force(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [state.kind]);

  const variant = variants[state.kind];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pt-2 flex items-start justify-center pointer-events-none">
      <motion.div
        layout
        animate={variant}
        transition={spring.weighty}
        className="relative bg-black text-white shadow-island overflow-hidden pointer-events-auto"
        style={{ borderRadius: 28 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state.kind === 'idle' && (
            <motion.div
              key="idle"
              className="w-full h-full flex items-center justify-end pr-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Faux camera lens */}
              <div className="w-3 h-3 rounded-full bg-[#0d0d10] border border-white/10 relative">
                <div className="absolute inset-[3px] rounded-full bg-[#1c1c22]" />
              </div>
            </motion.div>
          )}

          {state.kind === 'pulse' && (
            <motion.div
              key="pulse"
              className="w-full h-full flex items-center px-3 gap-3"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={spring.snap}
            >
              <PulseDot accent={state.accent} />
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Pulse</div>
              <div className="text-[13px] font-semibold flex-1 truncate">{state.clientName}</div>
              <div className="text-[13px] font-bold tabular-nums" style={{ color: state.accent }}>
                {state.pulse}
              </div>
            </motion.div>
          )}

          {state.kind === 'countdown' && (
            <motion.div
              key="countdown"
              className="w-full h-full flex items-center px-3 gap-3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={spring.snap}
            >
              <Ring accent={state.accent} progress={ringProgress(state.secondsLeft)} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">Goes live in</div>
                <div className="text-[13px] font-semibold truncate">{state.postTitle}</div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold tabular-nums">{formatCountdown(state.secondsLeft)}</div>
                <div className="text-[10px] text-white/50 truncate">{state.clientName}</div>
              </div>
            </motion.div>
          )}

          {state.kind === 'drafting' && (
            <motion.div
              key="drafting"
              className="w-full h-full flex items-center px-3 gap-3"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={spring.weighty}
            >
              <DraftingOrb accent={state.accent} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">Composing</div>
                <div className="text-[13px] font-semibold truncate">{state.clientName}</div>
              </div>
              <div className="flex gap-1 flex-wrap justify-end max-w-[120px]">
                {state.tones.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.08)', color: state.accent }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {state.kind === 'gesture' && (
            <motion.div
              key="gesture"
              className="w-full h-full flex items-center px-4 gap-2"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={spring.bouncy}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: state.accent, boxShadow: `0 0 16px ${state.accent}` }} />
              <div className="text-[13px] font-semibold uppercase tracking-[0.12em]">{state.label}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function PulseDot({ accent }: { accent: string }) {
  return (
    <div className="relative w-3 h-3">
      <div className="absolute inset-0 rounded-full pulse-ring" style={{ background: accent }} />
    </div>
  );
}

function DraftingOrb({ accent }: { accent: string }) {
  return (
    <motion.div
      className="w-7 h-7 rounded-full"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${accent}, transparent 70%), radial-gradient(circle at 70% 70%, #fff, ${accent})`,
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration: 6 }}
    />
  );
}

function Ring({ accent, progress }: { accent: string; progress: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="3" fill="none" />
      <circle
        cx="18" cy="18" r={r}
        stroke={accent}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - progress * c}
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
}

function ringProgress(secondsLeft: number) {
  const total = 60 * 60; // up to 1h displayed visually
  return Math.max(0, Math.min(1, 1 - secondsLeft / total));
}

function formatCountdown(s: number) {
  if (s <= 0) return 'now';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  if (m > 0) return `${m}:${sec.toString().padStart(2, '0')}`;
  return `${sec}s`;
}
