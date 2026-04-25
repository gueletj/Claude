import { motion } from 'framer-motion';
import { Client, Post } from '../data/clients';

export function PostDetail({
  post,
  client,
  onClose,
}: {
  post: Post;
  client: Client;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        layoutId={`post-${post.id}`}
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${client.gradient[0]} 0%, ${client.gradient[1]} 100%)`,
        }}
      >
        <div className="grain absolute inset-0 opacity-60" />
        <div className="absolute inset-0 [background:radial-gradient(80%_60%_at_50%_-10%,rgba(255,255,255,0.18),transparent_55%)]" />
      </motion.div>

      <div className="relative pt-16 px-5 pb-3 z-10 flex items-center justify-between">
        <button onClick={onClose} className="text-white/95 text-[15px] font-semibold flex items-center gap-1 drop-shadow">
          <span className="text-lg">‹</span> Back
        </button>
        <button className="w-9 h-9 rounded-full glass-light grid place-items-center text-white">⤴</button>
      </div>

      <div className="relative z-10 px-6 mt-4">
        <div className="text-white/85 text-[11px] uppercase tracking-[0.28em] font-semibold">{client.name} · {post.channel}</div>
        <div className="text-[80px] leading-none mt-1">{post.emoji}</div>
        <h1 className="text-white font-display italic text-[42px] leading-[0.95] mt-2">{post.title.toUpperCase()}</h1>
        <p className="text-white/95 text-[15px] mt-3 leading-snug max-w-[320px]">{post.caption}</p>
      </div>

      <div className="relative z-10 px-5 mt-6">
        <div className="rounded-2xl glass-light p-4 grid grid-cols-3 gap-3">
          <Stat label="Status" value={post.status} />
          <Stat label="Channel" value={post.channel} />
          <Stat label="Scheduled" value={shortDate(post.scheduledAt)} />
        </div>
      </div>

      <div className="absolute left-5 right-5 bottom-12 z-10 flex gap-2">
        <button className="flex-1 rounded-2xl bg-white text-black font-bold text-[14px] py-3 uppercase tracking-[0.14em]">Open in studio</button>
        <button className="flex-1 rounded-2xl bg-black/50 text-white font-bold text-[14px] py-3 uppercase tracking-[0.14em] border border-white/15">Reschedule</button>
      </div>

      <div className="absolute left-0 right-0 bottom-2 flex justify-center z-10">
        <div className="home-indicator" />
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-white/65 text-[10px] uppercase tracking-[0.18em] font-semibold">{label}</div>
      <div className="text-white text-[13.5px] font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
}
