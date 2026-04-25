import { motion } from 'framer-motion';
import { spring } from '../tokens/motion';
import { CLIENTS, Client, Post } from '../data/clients';

type Item = Post & { client: Client };

export function CalendarView({
  onBack,
  onOpenPost,
}: {
  onBack: () => void;
  onOpenPost: (post: Post, client: Client) => void;
}) {
  // Flatten and group by day
  const items: Item[] = CLIENTS.flatMap(c => c.posts.map(p => ({ ...p, client: c })))
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));

  const groups = groupByDay(items);

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-hidden bg-[#03050a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 [background:radial-gradient(120%_60%_at_50%_-20%,rgba(34,211,164,0.18),transparent_55%)]" />
      <div className="grain absolute inset-0 opacity-50" />

      {/* Header */}
      <div className="relative pt-16 px-5 pb-3 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-emerald-300 text-[15px] font-semibold flex items-center gap-1">
            <span className="text-lg">‹</span> Home
          </button>
          <button className="w-9 h-9 rounded-full glass-light grid place-items-center text-white">⊞</button>
        </div>
        <div className="mt-3">
          <div className="text-emerald-300/90 text-[11px] uppercase tracking-[0.32em] font-semibold">Now playing</div>
          <h1 className="text-white font-display italic text-[56px] leading-[0.92] tracking-tight -ml-0.5">CALENDAR</h1>
          <p className="text-white/60 text-[13px] mt-1 max-w-[280px]">All capsules, one queue. Posts flow like a record — tap to open.</p>
        </div>
      </div>

      {/* Queue */}
      <div className="relative z-10 h-[calc(100%-200px)] overflow-y-auto no-scrollbar px-4 pb-32">
        {groups.map((g, gi) => (
          <div key={g.label} className="mt-4 first:mt-2">
            <div className="sticky top-0 z-10 -mx-1 px-1 py-1.5 backdrop-blur-md bg-black/40 rounded-md flex items-baseline gap-3">
              <div className="text-white font-display italic text-[20px] leading-none">{g.label}</div>
              <div className="text-white/50 text-[11px] uppercase tracking-[0.18em]">{g.items.length} {g.items.length === 1 ? 'post' : 'posts'}</div>
            </div>
            <div className="space-y-2 mt-2">
              {g.items.map((it, i) => (
                <motion.button
                  key={it.id}
                  layoutId={`post-${it.id}`}
                  onClick={() => onOpenPost(it, it.client)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring.soft, delay: 0.04 + (gi * 4 + i) * 0.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left rounded-2xl overflow-hidden block relative"
                  style={{
                    background: `linear-gradient(120deg, ${it.client.gradient[0]}cc 0%, ${it.client.gradient[1]}cc 100%)`,
                    boxShadow: `0 10px 28px -14px ${it.client.gradient[0]}88`,
                  }}
                >
                  <div className="grain absolute inset-0 opacity-40" />
                  <div className="relative p-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/35 grid place-items-center text-2xl flex-shrink-0">
                      {it.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[14.5px] font-semibold truncate">{it.title}</div>
                      <div className="text-white/85 text-[12px] truncate">{it.client.name} · {it.channel}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-[13px] font-bold tabular-nums">{shortTime(it.scheduledAt)}</div>
                      <div className="text-white/80 text-[10px] uppercase tracking-[0.14em]">{it.status}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-0 right-0 bottom-2 flex justify-center z-10">
        <div className="home-indicator" />
      </div>
    </motion.div>
  );
}

function groupByDay(items: Item[]) {
  const m = new Map<string, Item[]>();
  for (const it of items) {
    const d = new Date(it.scheduledAt);
    const key = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
    if (!m.has(key)) m.set(key, []);
    m.get(key)!.push(it);
  }
  return Array.from(m.entries()).map(([label, items]) => ({ label, items }));
}

function shortTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
