import { useAppContext } from '@/context/AppContext';
import { TradingViewWidget } from './TradingViewWidget';
import { X } from 'lucide-react';

const SECTORS = [
  'Technology', 'Healthcare', 'Financials', 'Energy', 'Consumer Cyclical',
  'Industrials', 'Communication Services', 'Consumer Defensive', 'Utilities', 'Real Estate', 'Basic Materials',
];

export function SectorHeatmap() {
  const { theme, sectorFilter, setSectorFilter, compactMode } = useAppContext();

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold">Sector Heatmap</h2>
        {sectorFilter && (
          <button
            onClick={() => setSectorFilter(null)}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            {sectorFilter} <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <TradingViewWidget
        widgetType="stock-heatmap"
        height={compactMode ? 300 : 450}
        config={{
          colorTheme: theme,
          dataSource: 'SPX500',
          grouping: 'sector',
          blockSize: 'market_cap_basic',
          blockColor: 'change',
          locale: 'en',
          symbolUrl: 'https://www.tradingview.com/symbols/{tvSymbol}/',
          hasTopBar: true,
          isDataSetEnabled: true,
          isZoomEnabled: true,
          hasSymbolTooltip: true,
          isTransparent: true,
          width: '100%',
          height: compactMode ? 300 : 450,
        }}
        fallbackMessage="Sector heatmap temporarily unavailable from source"
      />
      <div className="flex flex-wrap gap-1.5 mt-3">
        {SECTORS.map(sector => (
          <button
            key={sector}
            onClick={() => setSectorFilter(sectorFilter === sector ? null : sector)}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
              sectorFilter === sector
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>
    </div>
  );
}
