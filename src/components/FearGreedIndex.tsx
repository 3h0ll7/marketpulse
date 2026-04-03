import { useMemo } from 'react';

const SEGMENTS = [
  { label: 'Extreme Fear', color: 'hsl(0, 70%, 50%)', min: 0, max: 25 },
  { label: 'Fear', color: 'hsl(30, 70%, 50%)', min: 25, max: 45 },
  { label: 'Neutral', color: 'hsl(50, 70%, 50%)', min: 45, max: 55 },
  { label: 'Greed', color: 'hsl(100, 50%, 45%)', min: 55, max: 75 },
  { label: 'Extreme Greed', color: 'hsl(130, 60%, 40%)', min: 75, max: 100 },
];

function getSegment(value: number) {
  return SEGMENTS.find(s => value >= s.min && value < s.max) || SEGMENTS[SEGMENTS.length - 1];
}

function generateDailyValue(): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return Math.floor((x - Math.floor(x)) * 100);
}

export function FearGreedIndex() {
  const value = useMemo(() => generateDailyValue(), []);
  const segment = getSegment(value);
  const rotation = -90 + (value / 100) * 180;

  return (
    <div className="glass-card p-4 animate-fade-in">
      <h2 className="font-display text-lg font-semibold mb-3">Fear & Greed Index</h2>
      <div className="flex flex-col items-center gap-3">
        {/* Gauge */}
        <div className="relative w-48 h-24 overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background arc segments */}
            {SEGMENTS.map((seg, i) => {
              const startAngle = -90 + (seg.min / 100) * 180;
              const endAngle = -90 + (seg.max / 100) * 180;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 100 + 80 * Math.cos(startRad);
              const y1 = 100 + 80 * Math.sin(startRad);
              const x2 = 100 + 80 * Math.cos(endRad);
              const y2 = 100 + 80 * Math.sin(endRad);
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity={0.8}
                />
              );
            })}
            {/* Needle */}
            <line
              x1="100"
              y1="100"
              x2={100 + 60 * Math.cos((rotation * Math.PI) / 180)}
              y2={100 + 60 * Math.sin((rotation * Math.PI) / 180)}
              className="stroke-foreground"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="4" className="fill-foreground" />
          </svg>
        </div>
        <div className="text-center">
          <span className="text-3xl font-display font-bold" style={{ color: segment.color }}>{value}</span>
          <p className="text-sm font-medium" style={{ color: segment.color }}>{segment.label}</p>
        </div>
        <div className="flex gap-1 w-full">
          {SEGMENTS.map((seg, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-1.5 rounded-full mb-1" style={{ backgroundColor: seg.color, opacity: segment === seg ? 1 : 0.3 }} />
              <span className="text-[9px] text-muted-foreground leading-tight block">{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
