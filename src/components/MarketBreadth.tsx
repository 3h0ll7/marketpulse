import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface BreadthData {
  label: string;
  advancing: number;
  declining: number;
  unchanged: number;
}

function generateBreadth(seed: number): BreadthData[] {
  const rng = (s: number) => {
    const x = Math.sin(s) * 43758.5453;
    return x - Math.floor(x);
  };
  const markets = [
    { label: 'NYSE', total: 3200 },
    { label: 'NASDAQ', total: 3500 },
    { label: 'S&P 500', total: 500 },
  ];
  return markets.map((m, i) => {
    const r = rng(seed + i * 137);
    const advPct = 0.3 + r * 0.4;
    const decPct = 0.3 + rng(seed + i * 251) * 0.35;
    const advancing = Math.round(m.total * advPct);
    const declining = Math.round(m.total * decPct * (1 - advPct));
    const unchanged = m.total - advancing - declining;
    return { label: m.label, advancing, declining, unchanged: Math.max(0, unchanged) };
  });
}

function BarSegment({ adv, dec, unch }: { adv: number; dec: number; unch: number }) {
  const total = adv + dec + unch;
  const advPct = (adv / total) * 100;
  const decPct = (dec / total) * 100;
  return (
    <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
      <div className="bg-gain transition-all" style={{ width: `${advPct}%` }} />
      <div className="bg-muted-foreground/30 transition-all" style={{ width: `${100 - advPct - decPct}%` }} />
      <div className="bg-loss transition-all" style={{ width: `${decPct}%` }} />
    </div>
  );
}

export function MarketBreadth() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const data = useMemo(() => generateBreadth(seed), [seed]);

  const totalAdv = data.reduce((s, d) => s + d.advancing, 0);
  const totalDec = data.reduce((s, d) => s + d.declining, 0);
  const ratio = (totalAdv / (totalDec || 1)).toFixed(2);

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold">Market Breadth</h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>A/D Ratio: <span className="font-semibold text-foreground">{ratio}</span></span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{d.label}</span>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-0.5 text-gain">
                  <TrendingUp className="w-3 h-3" /> {d.advancing}
                </span>
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Minus className="w-3 h-3" /> {d.unchanged}
                </span>
                <span className="flex items-center gap-0.5 text-loss">
                  <TrendingDown className="w-3 h-3" /> {d.declining}
                </span>
              </div>
            </div>
            <BarSegment adv={d.advancing} dec={d.declining} unch={d.unchanged} />
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gain inline-block" /> Advancing</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/30 inline-block" /> Unchanged</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-loss inline-block" /> Declining</span>
      </div>
    </div>
  );
}
