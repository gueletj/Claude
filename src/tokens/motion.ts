// Animation design tokens — every spring lives here.
// Keep these names short and use them everywhere instead of inline numbers.

export const spring = {
  // Snappy default — buttons, toggles, taps
  snap: { type: 'spring', stiffness: 520, damping: 32, mass: 0.9 } as const,
  // Gentle default — lists, cards, settling
  soft: { type: 'spring', stiffness: 280, damping: 30, mass: 1 } as const,
  // Big, weighty — sheets, modals, view transitions
  weighty: { type: 'spring', stiffness: 220, damping: 28, mass: 1.2 } as const,
  // Bouncy — playful confirmations
  bouncy: { type: 'spring', stiffness: 380, damping: 18, mass: 1 } as const,
  // Inertia — drag releases
  drift: { type: 'spring', stiffness: 140, damping: 24, mass: 1 } as const,
} as const;

export const ease = {
  ios: [0.32, 0.72, 0, 1] as const,
  silk: [0.22, 0.61, 0.36, 1] as const,
};

export const duration = {
  micro: 0.18,
  short: 0.28,
  base: 0.42,
  long: 0.7,
} as const;

export const haptic = {
  pressScale: 0.94,
  pressBlur: 6,
  liftScale: 1.04,
} as const;
