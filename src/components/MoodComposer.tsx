import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { spring } from '../tokens/motion';
import { Tone, TONES, TONE_META, Client } from '../data/clients';

/**
 * The Mood Composer — drag tone tokens into the central target. The signature
 * gradient morphs live, and "applying" stamps the tones onto the active client.
 */
export function MoodComposer({
  client,
  onClose,
  onApply,
  onTone,
}: {
  client: Client;
  onClose: () => void;
  onApply: (tones: Tone[]) => void;
  onTone: (label: string, accent: string) => void;
}) {
  const [selected, setSelected] = useState<Tone[]>(client.tones.slice(0, 2));

  // Compute live gradient based on selection (or fall back to client's)
  const gradient = useMemo(() => {
    if (selected.length === 0) return client.gradient;
    const colors = selected.map(t => TONE_META[t].color);
    const a = colors[0];
    const b = colors[colors.length - 1];
    return [a, b] as [string, string];
  }, [selected, client.gradient]);

  function toggle(t: Tone) {
    setSelected(prev => {
      const next = prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t].slice(-3);
      onTone(next.includes(t) ? `${t} +` : `${t} −`, TONE_META[t].color);
      return next;
    });
  }

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Live morphing backdrop */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(150deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        }}
        transition={{ duration: 0.6 }}
      />
      <div className="grain absolute inset-0 opacity-50" />
      <div className="absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(255,255,255,0.20),transparent_55%),radial-gradient(80%_60%_at_50%_120%,rgba(0,0,0,0.5),transparent_55%)]" />

      {/* Header */}
      <div className="relative pt-16 px-5 pb-2 z-10 flex items-center justify-between">
        <button onClick={onClose} className="text-white/95 text-[15px] font-semibold flex items-center gap-1 drop-shadow">
          <span className="text-lg">‹</span> {client.name.split(' ')[0]}
        </button>
        <button
          onClick={() => onApply(selected)}
          className="text-white text-[12px] uppercase tracking-[0.16em] font-bold bg-black/40 px-3 py-1.5 rounded-full border border-white/15"
        >
          Apply
        </button>
      </div>

      <div className="relative z-10 px-5 mt-1">
        <div className="text-white/85 text-[11px] uppercase tracking-[0.32em] font-semibold">Mood</div>
        <h1 className="text-white font-display italic text-[52px] leading-[0.92] tracking-tight">COMPOSER</h1>
        <p className="text-white/85 text-[13px] mt-1 max-w-[270px]">Drag or tap tones into the target to shape tomorrow's editorial direction.</p>
      </div>

      {/* Target orb */}
      <div className="relative z-10 mt-2 grid place-items-center">
        <Target gradient={gradient} tones={selected} clientName={client.name} />
      </div>

      {/* Tone tokens */}
      <div className="relative z-10 mt-2 px-4 pb-28">
        <div className="text-white/85 text-[11px] uppercase tracking-[0.22em] font-semibold mb-2">Tone tokens</div>
        <div className="flex flex-wrap gap-2.5">
          {TONES.map((t, i) => (
            <ToneToken
              key={t}
              tone={t}
              active={selected.includes(t)}
              onTap={() => toggle(t)}
              index={i}
            />
          ))}
        </div>
        <div className="mt-5 text-white/85 text-[11px] uppercase tracking-[0.22em] font-semibold mb-2">Live signature</div>
        <div className="rounded-2xl overflow-hidden h-14 relative" style={{ background: `linear-gradient(120deg, ${gradient[0]}, ${gradient[1]})` }}>
          <div className="grain absolute inset-0 opacity-50" />
          <div className="absolute inset-0 flex items-center px-4">
            <div className="text-white/95 font-display italic text-2xl truncate">{client.name.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Target({ gradient, tones, clientName }: { gradient: [string, string]; tones: Tone[]; clientName: string }) {
  const [breath, setBreath] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      setBreath(Math.sin((t - start) / 800) * 0.5 + 0.5);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      animate={{ scale: 1 + breath * 0.04 }}
      transition={{ duration: 0 }}
      className="relative w-[230px] h-[230px] rounded-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35), transparent 50%), linear-gradient(140deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        boxShadow: `0 30px 90px -20px ${gradient[0]}aa, inset 0 0 0 1px rgba(255,255,255,0.15)`,
      }}
    >
      <div className="grain absolute inset-0 opacity-60" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center px-3">
          <div className="text-white/85 text-[10px] uppercase tracking-[0.32em] font-semibold">Capsule of</div>
          <div className="text-white font-display italic text-[26px] leading-tight mt-1 drop-shadow">{clientName.toUpperCase()}</div>
          <div className="text-white/85 text-[11px] mt-1">{tones.length === 0 ? 'No tones yet' : tones.join(' · ')}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ToneToken({
  tone,
  active,
  onTap,
  index,
}: {
  tone: Tone;
  active: boolean;
  onTap: () => void;
  index: number;
}) {
  const meta = TONE_META[tone];
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return (
    <motion.button
      onClick={onTap}
      drag
      dragSnapToOrigin
      dragElastic={0.4}
      dragMomentum={false}
      style={{ x, y, background: meta.color, color: meta.ink }}
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: active ? 1.06 : 1 }}
      transition={{ ...spring.bouncy, delay: 0.04 + index * 0.03 }}
      whileTap={{ scale: 1.12 }}
      className="relative px-3.5 py-2 rounded-full font-bold text-[13px] uppercase tracking-[0.12em] select-none"
    >
      {active && (
        <motion.span
          layoutId={`tone-active-${tone}`}
          className="absolute inset-0 rounded-full ring-2 ring-white/80"
          transition={spring.snap}
        />
      )}
      {tone}
    </motion.button>
  );
}
