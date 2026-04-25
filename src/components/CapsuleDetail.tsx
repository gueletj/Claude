import { motion } from 'framer-motion';
import { spring } from '../tokens/motion';
import { Client, Post } from '../data/clients';
import { useEffect, useState } from 'react';

export function CapsuleDetail({
  client,
  onBack,
  onOpenPost,
  onComposer,
}: {
  client: Client;
  onBack: () => void;
  onOpenPost: (post: Post) => void;
  onComposer: () => void;
}) {
  // Animated breathing pulse value
  const [breath, setBreath] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      setBreath(Math.sin((t - start) / 1200) * 0.5 + 0.5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden bg-ever-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Gradient signature backdrop with breathing */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${client.gradient[0]} 0%, ${client.gradient[1]} 90%)`,
        }}
        animate={{ scale: 1 + breath * 0.02 }}
        transition={{ duration: 0 }}
      />
      <div className="grain absolute inset-0 opacity-60" />
      <div className="absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(255,255,255,0.18),transparent_60%)]" />

      {/* Header bar */}
      <div className="relative pt-16 px-5 pb-2 z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-white/95 text-[15px] font-semibold flex items-center gap-1 drop-shadow"
        >
          <span className="text-lg">‹</span> Capsules
        </button>
        <button className="w-9 h-9 rounded-full glass-light grid place-items-center text-white">⋯</button>
      </div>

      {/* Hero — shared elements */}
      <div className="relative px-5 z-10">
        <motion.div
          layoutId={`capsule-${client.id}-avatar`}
          className="w-20 h-20 rounded-3xl bg-black/40 grid place-items-center text-white font-display italic text-4xl"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)' }}
        >
          {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </motion.div>
        <motion.h1
          layoutId={`capsule-${client.id}-name`}
          className="text-white font-display italic text-[44px] leading-[0.92] tracking-tight mt-3"
        >
          {client.name.toUpperCase()}
        </motion.h1>
        <motion.p layoutId={`capsule-${client.id}-tag`} className="text-white/85 text-[14px] mt-1">
          {client.tagline} · {client.handle}
        </motion.p>
      </div>

      {/* Stats card */}
      <div className="relative z-10 mt-5 mx-4 rounded-3xl glass p-4 flex items-stretch gap-4">
        <PulseGauge value={client.pulse} accent={client.accent} breath={breath} />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <Stat label="Followers" value={client.followers} />
          <Stat label="Growth" value={client.growth} positive />
          <Stat label="Cadence" value={`${client.cadencePerWeek}/wk`} />
          <Stat label="Posts" value={String(client.posts.length)} />
        </div>
      </div>

      {/* Tone chips */}
      <div className="relative z-10 px-4 mt-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/60 font-semibold mb-2">Editorial tones</div>
        <div className="flex gap-2 flex-wrap">
          {client.tones.map(t => (
            <span key={t} className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-black/35 text-white border border-white/10">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Now playing — content queue */}
      <div className="relative z-10 mt-5 px-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/60 font-semibold">Now playing</div>
            <div className="text-white font-semibold">Content queue</div>
          </div>
          <button onClick={onComposer} className="text-[12px] uppercase tracking-[0.16em] font-bold text-white bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            Compose
          </button>
        </div>
        <div className="space-y-2 pb-32">
          {client.posts.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => onOpenPost(p)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring.soft, delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left rounded-2xl glass p-3 flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl grid place-items-center text-2xl"
                style={{ background: `linear-gradient(140deg, ${client.gradient[0]}66, ${client.gradient[1]}66)` }}>
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[14px] font-semibold truncate">{p.title}</div>
                <div className="text-white/60 text-[12px] truncate">{p.caption}</div>
              </div>
              <div className="text-right">
                <StatusPill status={p.status} accent={client.accent} />
                <div className="text-white/55 text-[10.5px] mt-1">{shortDate(p.scheduledAt)}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PulseGauge({ value, accent, breath }: { value: number; accent: string; breath: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-[88px] h-[88px] flex-shrink-0">
      <svg width="88" height="88" viewBox="0 0 88 88" className="absolute inset-0">
        <circle cx="44" cy="44" r={r} stroke="rgba(255,255,255,0.16)" strokeWidth="6" fill="none" />
        <circle
          cx="44" cy="44" r={r}
          stroke={accent}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          style={{ filter: `drop-shadow(0 0 ${6 + breath * 6}px ${accent})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-white font-bold text-[24px] leading-none tabular-nums">{value}</div>
          <div className="text-white/60 text-[9px] uppercase tracking-[0.16em] mt-0.5">Pulse</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="text-white/55 text-[10px] uppercase tracking-[0.18em] font-semibold">{label}</div>
      <div className={`text-[16px] font-bold ${positive ? 'text-emerald-300' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function StatusPill({ status, accent }: { status: Post['status']; accent: string }) {
  const map: Record<Post['status'], { bg: string; fg: string; label: string }> = {
    Draft:     { bg: 'rgba(255,255,255,0.10)', fg: 'rgba(255,255,255,0.85)', label: 'Draft' },
    Scheduled: { bg: `${accent}33`,             fg: accent,                   label: 'Scheduled' },
    Live:      { bg: '#ff5a1f',                 fg: '#fff',                   label: '● Live' },
    Idea:      { bg: 'rgba(255,255,255,0.06)', fg: 'rgba(255,255,255,0.7)',  label: 'Idea' },
  };
  const m = map[status];
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
      style={{ background: m.bg, color: m.fg }}>
      {m.label}
    </span>
  );
}

function shortDate(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time}`;
}
