export type Tone = 'Bold' | 'Soft' | 'Punchy' | 'Editorial' | 'Playful' | 'Cinematic';

export type Post = {
  id: string;
  title: string;
  caption: string;
  channel: 'Instagram' | 'TikTok' | 'LinkedIn' | 'Newsletter';
  status: 'Draft' | 'Scheduled' | 'Live' | 'Idea';
  scheduledAt: string; // ISO
  emoji: string;
};

export type Client = {
  id: string;
  name: string;
  handle: string;
  tagline: string;
  // Two-stop signature gradient
  gradient: [string, string];
  // Used for accent / glow
  accent: string;
  tones: Tone[];
  pulse: number; // 0-100
  cadencePerWeek: number;
  followers: string;
  growth: string;
  posts: Post[];
};

export const CLIENTS: Client[] = [
  {
    id: 'milo',
    name: 'Milo Versace',
    handle: '@milo.versace',
    tagline: 'Streetwear couturier · Paris',
    gradient: ['#ff5a1f', '#7a1f00'],
    accent: '#ff7a3a',
    tones: ['Bold', 'Editorial', 'Punchy'],
    pulse: 88,
    cadencePerWeek: 6,
    followers: '184K',
    growth: '+12.4%',
    posts: [
      { id: 'm1', title: 'Atelier Drop 03', caption: 'Hand-stitched in 11 hours.', channel: 'Instagram', status: 'Scheduled', scheduledAt: '2026-04-26T08:00:00Z', emoji: '🧵' },
      { id: 'm2', title: 'Backstage cut', caption: 'Raw studio film, no edits.', channel: 'TikTok', status: 'Draft', scheduledAt: '2026-04-26T18:00:00Z', emoji: '🎬' },
      { id: 'm3', title: 'Letter from Milo', caption: 'On craft over speed.', channel: 'Newsletter', status: 'Idea', scheduledAt: '2026-04-28T09:00:00Z', emoji: '✍️' },
      { id: 'm4', title: 'Capsule teaser', caption: '15s of fabric in motion.', channel: 'Instagram', status: 'Live', scheduledAt: '2026-04-25T11:30:00Z', emoji: '✨' },
    ],
  },
  {
    id: 'aria',
    name: 'Aria Sound',
    handle: '@ariasound',
    tagline: 'Producer · Berlin nights',
    gradient: ['#5b6cff', '#0a0a3a'],
    accent: '#7a86ff',
    tones: ['Cinematic', 'Soft', 'Editorial'],
    pulse: 71,
    cadencePerWeek: 4,
    followers: '92K',
    growth: '+6.1%',
    posts: [
      { id: 'a1', title: 'Track 04 — Velvet', caption: 'Drops Friday at midnight.', channel: 'Instagram', status: 'Scheduled', scheduledAt: '2026-04-26T22:00:00Z', emoji: '🎧' },
      { id: 'a2', title: 'Studio diary', caption: 'A walk through Velvet.', channel: 'TikTok', status: 'Draft', scheduledAt: '2026-04-27T19:00:00Z', emoji: '🎚️' },
      { id: 'a3', title: 'On synthesis', caption: 'Long-form essay, 1.2k words.', channel: 'Newsletter', status: 'Scheduled', scheduledAt: '2026-04-29T07:00:00Z', emoji: '📓' },
    ],
  },
  {
    id: 'noor',
    name: 'Noor Atelier',
    handle: '@noor.atelier',
    tagline: 'Ceramicist · Marrakech',
    gradient: ['#f0b86c', '#5a2a00'],
    accent: '#ffce8c',
    tones: ['Soft', 'Editorial', 'Cinematic'],
    pulse: 64,
    cadencePerWeek: 3,
    followers: '41K',
    growth: '+3.8%',
    posts: [
      { id: 'n1', title: 'Wheel 06', caption: 'Earth, water, breath.', channel: 'Instagram', status: 'Scheduled', scheduledAt: '2026-04-26T10:00:00Z', emoji: '🏺' },
      { id: 'n2', title: 'Glaze test', caption: 'Cobalt rising.', channel: 'TikTok', status: 'Idea', scheduledAt: '2026-04-30T16:00:00Z', emoji: '🌀' },
    ],
  },
  {
    id: 'dax',
    name: 'Dax Voltage',
    handle: '@daxvoltage',
    tagline: 'EV reviewer · LA · 2.1M subs',
    gradient: ['#22d3a4', '#053b2c'],
    accent: '#5af0c4',
    tones: ['Punchy', 'Playful', 'Bold'],
    pulse: 93,
    cadencePerWeek: 9,
    followers: '2.1M',
    growth: '+18.7%',
    posts: [
      { id: 'd1', title: 'Cybertruck review', caption: 'It’s weirder than you think.', channel: 'TikTok', status: 'Live', scheduledAt: '2026-04-25T14:00:00Z', emoji: '⚡️' },
      { id: 'd2', title: 'LinkedIn op-ed', caption: 'Why dealerships are dying.', channel: 'LinkedIn', status: 'Scheduled', scheduledAt: '2026-04-26T07:00:00Z', emoji: '🗞️' },
      { id: 'd3', title: '0-60 in silence', caption: '15s reel, no voiceover.', channel: 'Instagram', status: 'Draft', scheduledAt: '2026-04-27T20:00:00Z', emoji: '🛞' },
    ],
  },
  {
    id: 'jules',
    name: 'Jules Marin',
    handle: '@jules.marin',
    tagline: 'Chef · Lisbon coast',
    gradient: ['#ff8e8e', '#3a0a1a'],
    accent: '#ffb1b1',
    tones: ['Playful', 'Editorial', 'Soft'],
    pulse: 58,
    cadencePerWeek: 4,
    followers: '67K',
    growth: '+4.2%',
    posts: [
      { id: 'j1', title: 'Sea bass, salt crust', caption: 'A kitchen love letter.', channel: 'Instagram', status: 'Scheduled', scheduledAt: '2026-04-26T19:00:00Z', emoji: '🐟' },
      { id: 'j2', title: 'Market run', caption: 'Before the sun is up.', channel: 'TikTok', status: 'Idea', scheduledAt: '2026-04-28T05:30:00Z', emoji: '🧺' },
    ],
  },
];

export const TONES: Tone[] = ['Bold', 'Soft', 'Punchy', 'Editorial', 'Playful', 'Cinematic'];

export const TONE_META: Record<Tone, { color: string; ink: string }> = {
  Bold:       { color: '#ff5a1f', ink: '#fff' },
  Soft:       { color: '#ffd4b8', ink: '#3a1a00' },
  Punchy:     { color: '#ff3b6b', ink: '#fff' },
  Editorial:  { color: '#0a0a0b', ink: '#f5f1ea' },
  Playful:    { color: '#ffd45a', ink: '#3a2a00' },
  Cinematic:  { color: '#5b6cff', ink: '#fff' },
};
