import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { StatusBar } from './components/StatusBar';
import { DynamicIsland, IslandState } from './components/DynamicIsland';
import { HomeScreen, AppKey } from './components/HomeScreen';
import { CapsuleList } from './components/CapsuleList';
import { CapsuleDetail } from './components/CapsuleDetail';
import { CalendarView } from './components/CalendarView';
import { MoodComposer } from './components/MoodComposer';
import { PostDetail } from './components/PostDetail';
import { BottomSheet } from './components/BottomSheet';
import { NotificationStack, Toast } from './components/NotificationStack';
import { CLIENTS, Client, Post, Tone, TONE_META } from './data/clients';

type View =
  | { kind: 'home' }
  | { kind: 'capsules' }
  | { kind: 'capsule'; clientId: string }
  | { kind: 'composer'; clientId: string }
  | { kind: 'calendar' }
  | { kind: 'post'; postId: string; clientId: string };

export default function App() {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [view, setView] = useState<View>({ kind: 'home' });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [island, setIsland] = useState<IslandState>({ kind: 'idle' });

  const activeClient = useMemo<Client | undefined>(() => {
    if ('clientId' in view) return clients.find(c => c.id === view.clientId);
    return undefined;
  }, [clients, view]);

  const activePost = useMemo<Post | undefined>(() => {
    if (view.kind !== 'post') return undefined;
    return activeClient?.posts.find(p => p.id === view.postId);
  }, [view, activeClient]);

  // ───────────────────────── Dynamic Island state machine ─────────────────────────
  // It morphs based on what view you're in, but transient gestures take precedence
  // for ~1.4s before falling back.
  const transientUntilRef = useRef(0);

  const flashTone = useCallback((label: string, accent: string) => {
    transientUntilRef.current = Date.now() + 1400;
    setIsland({ kind: 'gesture', label, accent });
    setTimeout(() => {
      if (Date.now() >= transientUntilRef.current) refreshIsland();
    }, 1500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshIsland = useCallback(() => {
    if (Date.now() < transientUntilRef.current) return;
    if (view.kind === 'capsule' && activeClient) {
      setIsland({
        kind: 'pulse',
        clientName: activeClient.name,
        pulse: activeClient.pulse,
        accent: activeClient.accent,
      });
    } else if (view.kind === 'composer' && activeClient) {
      setIsland({
        kind: 'drafting',
        clientName: activeClient.name,
        tones: activeClient.tones,
        accent: activeClient.accent,
      });
    } else if (view.kind === 'post' && activeClient && activePost) {
      const seconds = Math.max(0, Math.round((+new Date(activePost.scheduledAt) - Date.now()) / 1000));
      setIsland({
        kind: 'countdown',
        clientName: activeClient.name,
        postTitle: activePost.title,
        secondsLeft: seconds,
        accent: activeClient.accent,
      });
    } else if (view.kind === 'calendar') {
      // Pick the next upcoming post across all clients
      const next = clients
        .flatMap(c => c.posts.map(p => ({ p, c })))
        .filter(({ p }) => +new Date(p.scheduledAt) > Date.now())
        .sort((a, b) => +new Date(a.p.scheduledAt) - +new Date(b.p.scheduledAt))[0];
      if (next) {
        const seconds = Math.max(0, Math.round((+new Date(next.p.scheduledAt) - Date.now()) / 1000));
        setIsland({
          kind: 'countdown',
          clientName: next.c.name,
          postTitle: next.p.title,
          secondsLeft: seconds,
          accent: next.c.accent,
        });
      } else {
        setIsland({ kind: 'idle' });
      }
    } else {
      setIsland({ kind: 'idle' });
    }
  }, [view, activeClient, activePost, clients]);

  useEffect(() => { refreshIsland(); }, [refreshIsland]);

  // Tick down for countdown
  useEffect(() => {
    if (island.kind !== 'countdown') return;
    const id = setInterval(() => {
      setIsland(s => s.kind === 'countdown' ? { ...s, secondsLeft: Math.max(0, s.secondsLeft - 1) } : s);
    }, 1000);
    return () => clearInterval(id);
  }, [island.kind]);

  // ───────────────────────── Welcome + ambient toasts ─────────────────────────
  useEffect(() => {
    // Welcome toast on mount
    pushToast({
      id: 'welcome',
      app: 'EVER',
      title: 'Reve bigger than ever.',
      body: 'Your 5 capsules are alive and breathing.',
      accent: '#ff5a1f',
    });
    // Schedule ambient
    const t1 = setTimeout(() => pushToast({
      id: 'pulse-up',
      app: 'Pulse',
      title: 'Dax Voltage · +3 in pulse',
      body: 'Cybertruck review just hit 1.2M views.',
      accent: '#22d3a4',
    }), 6500);
    const t2 = setTimeout(() => pushToast({
      id: 'compose',
      app: 'Composer',
      title: 'Ready to draft Milo\'s drop?',
      body: 'Tap to open with last night\'s tones.',
      accent: '#ff7a3a',
    }), 14000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  function pushToast(t: Toast) {
    setToasts(prev => prev.find(p => p.id === t.id) ? prev : [t, ...prev].slice(0, 3));
  }
  function dismissToast(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  // ───────────────────────── Navigation ─────────────────────────
  function openApp(key: AppKey) {
    if (key === 'capsules') setView({ kind: 'capsules' });
    else if (key === 'calendar') setView({ kind: 'calendar' });
    else if (key === 'composer') {
      setView({ kind: 'composer', clientId: clients[0].id });
    } else if (key === 'pulse') {
      setSheetOpen(true);
    } else if (key === 'inbox') {
      pushToast({
        id: `inbox-${Date.now()}`,
        app: 'Inbox',
        title: '3 client threads · 1 unread',
        body: 'Aria asked for cover art revisions.',
        accent: '#7a86ff',
      });
    } else {
      pushToast({
        id: `coming-${key}-${Date.now()}`,
        app: 'EVER',
        title: 'Coming soon',
        body: `${capitalize(key)} is in the next drop.`,
        accent: '#ff7a3a',
      });
    }
  }

  function applyTones(tones: Tone[]) {
    if (!activeClient) return;
    setClients(prev => prev.map(c => c.id === activeClient.id ? { ...c, tones } : c));
    flashTone('Tones applied', tones.length ? TONE_META[tones[0]].color : activeClient.accent);
    pushToast({
      id: `applied-${activeClient.id}-${Date.now()}`,
      app: 'Composer',
      title: `${activeClient.name}'s mood updated`,
      body: tones.join(' · ') || 'No tones',
      accent: activeClient.accent,
    });
    setView({ kind: 'capsule', clientId: activeClient.id });
  }

  return (
    <PhoneFrame>
      <StatusBar />
      <DynamicIsland state={island} />

      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {view.kind === 'home' && (
            <HomeScreen key="home" onOpen={openApp} onTone={flashTone} />
          )}

          {view.kind === 'capsules' && (
            <CapsuleList
              key="capsules"
              clients={clients}
              onBack={() => setView({ kind: 'home' })}
              onOpen={(id) => setView({ kind: 'capsule', clientId: id })}
            />
          )}

          {view.kind === 'capsule' && activeClient && (
            <CapsuleDetail
              key={`capsule-${activeClient.id}`}
              client={activeClient}
              onBack={() => setView({ kind: 'capsules' })}
              onOpenPost={(post) => setView({ kind: 'post', postId: post.id, clientId: activeClient.id })}
              onComposer={() => setView({ kind: 'composer', clientId: activeClient.id })}
            />
          )}

          {view.kind === 'composer' && activeClient && (
            <MoodComposer
              key={`composer-${activeClient.id}`}
              client={activeClient}
              onClose={() => setView({ kind: 'capsule', clientId: activeClient.id })}
              onApply={applyTones}
              onTone={flashTone}
            />
          )}

          {view.kind === 'calendar' && (
            <CalendarView
              key="calendar"
              onBack={() => setView({ kind: 'home' })}
              onOpenPost={(post, client) => setView({ kind: 'post', postId: post.id, clientId: client.id })}
            />
          )}

          {view.kind === 'post' && activeClient && activePost && (
            <PostDetail
              key={`post-${activePost.id}`}
              post={activePost}
              client={activeClient}
              onClose={() => setView({ kind: 'capsule', clientId: activeClient.id })}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Pulse · Agency overview"
        snapPoints={[0.5, 0.92]}
      >
        <PulseSheetContent clients={clients} />
      </BottomSheet>

      <NotificationStack toasts={toasts} onDismiss={dismissToast} />
    </PhoneFrame>
  );
}

function PulseSheetContent({ clients }: { clients: Client[] }) {
  const total = clients.reduce((s, c) => s + c.pulse, 0);
  const avg = Math.round(total / clients.length);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl glass-light p-4">
        <div className="text-white/55 text-[10px] uppercase tracking-[0.22em] font-semibold">Agency pulse</div>
        <div className="flex items-end gap-3 mt-1">
          <div className="text-white font-display italic text-[64px] leading-none">{avg}</div>
          <div className="text-emerald-300 text-[14px] font-semibold mb-1">+4.2 this week</div>
        </div>
        <div className="mt-3 h-12 flex items-end gap-1">
          {sparkline(28).map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-ever-flame/40 to-ever-flame" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {clients
          .slice()
          .sort((a, b) => b.pulse - a.pulse)
          .map(c => (
            <div key={c.id} className="rounded-2xl p-3 flex items-center gap-3"
              style={{ background: `linear-gradient(120deg, ${c.gradient[0]}55, ${c.gradient[1]}55)` }}>
              <div className="w-10 h-10 rounded-xl bg-black/30 grid place-items-center text-white font-display italic text-lg">
                {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1">
                <div className="text-white text-[14px] font-semibold">{c.name}</div>
                <div className="text-white/70 text-[11.5px]">{c.tagline}</div>
              </div>
              <div className="text-right">
                <div className="text-white text-[18px] font-bold tabular-nums">{c.pulse}</div>
                <div className="text-emerald-300 text-[11px] font-semibold">{c.growth}</div>
              </div>
            </div>
          ))}
      </div>
      <div className="text-white/40 text-[11px] text-center pt-2">Drag down to dismiss</div>
    </div>
  );
}

function sparkline(n: number): number[] {
  const arr: number[] = [];
  let v = 50;
  for (let i = 0; i < n; i++) {
    v += (Math.sin(i * 0.7) + Math.cos(i * 0.3)) * 6;
    v = Math.max(20, Math.min(96, v));
    arr.push(v);
  }
  return arr;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
