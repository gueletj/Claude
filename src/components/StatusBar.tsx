import { useEffect, useState } from 'react';

export function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute top-0 left-0 right-0 z-40 h-12 flex items-center justify-between px-7 pt-3 text-white text-[15px] font-semibold tracking-tight select-none">
      <span className="font-sans">{time}</span>
      <div className="flex items-center gap-1.5 opacity-95">
        {/* Signal */}
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="1" fill="white" />
          <rect x="5" y="4" width="3" height="7" rx="1" fill="white" />
          <rect x="10" y="2" width="3" height="9" rx="1" fill="white" />
          <rect x="15" y="0" width="3" height="11" rx="1" fill="white" />
        </svg>
        {/* Wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M8 10.5l1.7-2a2.4 2.4 0 0 0-3.4 0L8 10.5z" fill="white"/>
          <path d="M8 6.5c1.3 0 2.5.5 3.4 1.4l1.4-1.4A6.7 6.7 0 0 0 8 4.6a6.7 6.7 0 0 0-4.8 1.9l1.4 1.4A4.7 4.7 0 0 1 8 6.5z" fill="white"/>
          <path d="M8 2.6c2.3 0 4.5.9 6.1 2.5l1.4-1.4A10.7 10.7 0 0 0 8 0.7 10.7 10.7 0 0 0 .5 3.7l1.4 1.4A8.7 8.7 0 0 1 8 2.6z" fill="white"/>
        </svg>
        {/* Battery */}
        <div className="relative w-[26px] h-[12px] rounded-[3.5px] border border-white/70">
          <div className="absolute inset-[1.5px] rounded-[2px] bg-white" style={{ width: '78%' }} />
          <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[5px] rounded-r bg-white/70" />
        </div>
      </div>
    </div>
  );
}

function formatTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
