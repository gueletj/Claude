import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { spring } from '../tokens/motion';

export type Toast = {
  id: string;
  app: string;
  title: string;
  body: string;
  accent: string;
};

export function NotificationStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  // Auto-dismiss after 4.2s
  useEffect(() => {
    const timers = toasts.map(t => setTimeout(() => onDismiss(t.id), 4200));
    return () => timers.forEach(clearTimeout);
  }, [toasts, onDismiss]);

  return (
    <div className="absolute left-3 right-3 top-14 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t, i) => (
          <motion.div
            key={t.id}
            layout
            initial={{ y: -60, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 - i * 0.02 }}
            exit={{ y: -40, opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
            transition={spring.weighty}
            drag="y"
            dragConstraints={{ top: -100, bottom: 20 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.y < -30 || info.velocity.y < -400) onDismiss(t.id);
            }}
            className="pointer-events-auto rounded-2xl glass px-3 py-2.5 flex items-center gap-3 shadow-soft"
          >
            <div
              className="w-9 h-9 rounded-[10px] grid place-items-center text-white text-[15px] font-bold flex-shrink-0"
              style={{
                background: `linear-gradient(140deg, ${t.accent}, ${shade(t.accent, -0.5)})`,
                boxShadow: `0 6px 16px -6px ${t.accent}88, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
            >
              {t.app[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[12px] uppercase tracking-[0.16em] text-white/55 font-semibold">{t.app}</span>
                <span className="text-[11px] text-white/40">now</span>
              </div>
              <div className="text-white text-[14px] font-semibold truncate">{t.title}</div>
              <div className="text-white/70 text-[12.5px] line-clamp-2">{t.body}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function shade(hex: string, amt: number) {
  // amt in [-1, 1]
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const nr = Math.round((t - r) * p + r);
  const ng = Math.round((t - g) * p + g);
  const nb = Math.round((t - b) * p + b);
  return `#${[nr, ng, nb].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}
