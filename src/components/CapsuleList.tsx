import { motion } from 'framer-motion';
import { spring } from '../tokens/motion';
import { Client } from '../data/clients';

export function CapsuleList({
  clients,
  onOpen,
  onBack,
}: {
  clients: Client[];
  onOpen: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-20 bg-ever-ink overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="absolute inset-0 [background:radial-gradient(120%_60%_at_50%_-20%,rgba(255,90,31,0.18),transparent_55%)]" />
      <div className="grain absolute inset-0 opacity-50" />

      {/* Header */}
      <div className="relative pt-16 px-5 pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-ever-flame text-[15px] font-semibold flex items-center gap-1"
          >
            <span className="text-lg">‹</span> Home
          </button>
          <button className="w-9 h-9 rounded-full glass-light grid place-items-center text-white">＋</button>
        </div>
        <div className="mt-3">
          <div className="text-ever-flame/90 text-[11px] uppercase tracking-[0.32em] font-semibold">Brand</div>
          <h1 className="text-white font-display italic text-[56px] leading-[0.92] tracking-tight -ml-0.5">CAPSULES</h1>
          <p className="text-white/60 text-[13px] mt-1 max-w-[280px]">Each client lives as a living, breathing capsule. Tap one to enter their world.</p>
        </div>
      </div>

      {/* List */}
      <div className="relative h-[calc(100%-200px)] overflow-y-auto no-scrollbar px-4 pb-32 space-y-3">
        {clients.map((c, i) => (
          <motion.button
            key={c.id}
            layoutId={`capsule-${c.id}`}
            onClick={() => onOpen(c.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.soft, delay: 0.05 + i * 0.04 }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-left relative rounded-3xl overflow-hidden h-[112px] block"
            style={{
              background: `linear-gradient(120deg, ${c.gradient[0]} 0%, ${c.gradient[1]} 100%)`,
              boxShadow: `0 18px 40px -16px ${c.gradient[0]}77`,
            }}
          >
            <motion.div layoutId={`capsule-${c.id}-grain`} className="grain absolute inset-0 opacity-60" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/12 blur-2xl" />
            <div className="relative h-full p-4 flex items-center gap-4">
              <motion.div
                layoutId={`capsule-${c.id}-avatar`}
                className="w-14 h-14 rounded-2xl bg-black/40 grid place-items-center text-white font-display italic text-2xl flex-shrink-0"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }}
              >
                {initials(c.name)}
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.div layoutId={`capsule-${c.id}-name`} className="text-white font-display italic text-[24px] leading-none truncate">
                  {c.name.toUpperCase()}
                </motion.div>
                <motion.div layoutId={`capsule-${c.id}-tag`} className="text-white/80 text-[12.5px] mt-0.5 truncate">
                  {c.tagline}
                </motion.div>
                <div className="mt-2 flex items-center gap-2">
                  {c.tones.slice(0, 2).map(t => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-black/30 text-white/95">{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/70">Pulse</div>
                <div className="text-white font-bold text-[26px] tabular-nums leading-none">{c.pulse}</div>
                <div className="text-white/85 text-[11px] mt-0.5">{c.growth}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="absolute left-0 right-0 bottom-2 flex justify-center z-10">
        <div className="home-indicator" />
      </div>
    </motion.div>
  );
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('');
}
