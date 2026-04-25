import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { spring } from '../tokens/motion';

/**
 * iOS-style bottom sheet with snap points (as fractions of the container height,
 * measured from the bottom). Drag with inertia; release snaps to the closest snap.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.92],
  initialSnap = 0,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPoints?: number[];
  initialSnap?: number;
}) {
  // Sheet's vertical offset from bottom, in pixels — we work with translateY
  // applied to a sheet that's full-height, with content visible based on it.
  // We measure container via the parent wrapper (PhoneFrame: 860px on desktop, 100dvh mobile).
  const y = useMotionValue(0);

  // Backdrop opacity follows sheet position
  const backdropOpacity = useTransform(y, [0, 600], [0.55, 0]);

  useEffect(() => {
    if (open) {
      // Snap to initial point on open
      const target = computeY(snapPoints[initialSnap]);
      y.set(target);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function computeY(fraction: number) {
    // 0 means closed (fully off screen). The sheet is positioned with bottom: 0
    // and we translate it down by (1 - fraction) * sheetHeight. Sheet height ≈ 92% of frame.
    const frameH = getFrameHeight();
    const sheetH = frameH * 0.92;
    return sheetH * (1 - fraction);
  }

  function getFrameHeight() {
    // Best effort — match PhoneFrame heights
    if (typeof window === 'undefined') return 860;
    return Math.min(window.innerHeight, 860);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const frameH = getFrameHeight();
    const sheetH = frameH * 0.92;
    const current = y.get() + info.velocity.y * 0.18; // inertia kick
    // Candidate positions
    const candidates = [
      ...snapPoints.map(f => ({ f, py: sheetH * (1 - f) })),
      { f: 0, py: sheetH }, // closed
    ];
    let best = candidates[0];
    let bestDist = Infinity;
    for (const c of candidates) {
      const d = Math.abs(c.py - current);
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
    if (best.f === 0) {
      // Animate out then close
      y.set(sheetH);
      setTimeout(onClose, 180);
    } else {
      y.set(best.py);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="absolute inset-0 z-40 bg-black"
            style={{ opacity: backdropOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            className="absolute left-0 right-0 bottom-0 z-50 h-[92%] rounded-t-[28px] glass overflow-hidden"
            style={{ y, touchAction: 'none' }}
            initial={{ y: getFrameHeight() }}
            animate={{ y: computeY(snapPoints[initialSnap]) }}
            exit={{ y: getFrameHeight() }}
            transition={spring.weighty}
            drag="y"
            dragConstraints={{ top: 0, bottom: getFrameHeight() }}
            dragElastic={0.06}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
          >
            <div className="grain absolute inset-0 opacity-40" />
            {/* Grabber */}
            <div className="relative pt-2.5 pb-1 flex flex-col items-center cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-white/30" />
              {title && (
                <div className="mt-2 text-white/85 text-[15px] font-semibold">{title}</div>
              )}
            </div>
            <div className="relative h-[calc(100%-44px)] overflow-y-auto no-scrollbar px-5 pb-10">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
