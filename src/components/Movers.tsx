import { useAppContext } from '@/context/AppContext';
import { TradingViewWidget } from './TradingViewWidget';

export function Movers() {
  const { theme, compactMode } = useAppContext();

  const h = compactMode ? 300 : 400;

  return (
    <div className="glass-card p-4 animate-fade-in">
      <h2 className="font-display text-lg font-semibold mb-3">Biggest Movers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Pre-Market</h3>
          <TradingViewWidget
            widgetType="hotlists"
            height={h}
            config={{
              colorTheme: theme,
              dateRange: '1D',
              exchange: 'US',
              showChart: true,
              locale: 'en',
              largeChartUrl: 'https://www.tradingview.com/chart/?symbol={tvsymbol}',
              isTransparent: true,
              showSymbolLogo: true,
              showFloatingTooltip: false,
              width: '100%',
              height: h,
              plotLineColorGrowing: 'hsl(145, 63%, 42%)',
              plotLineColorFalling: 'hsl(0, 72%, 55%)',
            }}
            fallbackMessage="Pre-market movers temporarily unavailable"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Regular Hours</h3>
          <TradingViewWidget
            widgetType="hotlists"
            height={h}
            config={{
              colorTheme: theme,
              dateRange: '1D',
              exchange: 'US',
              showChart: true,
              locale: 'en',
              largeChartUrl: 'https://www.tradingview.com/chart/?symbol={tvsymbol}',
              isTransparent: true,
              showSymbolLogo: true,
              showFloatingTooltip: false,
              width: '100%',
              height: h,
            }}
            fallbackMessage="Movers temporarily unavailable"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">After-Hours</h3>
          <TradingViewWidget
            widgetType="hotlists"
            height={h}
            config={{
              colorTheme: theme,
              dateRange: '1D',
              exchange: 'US',
              showChart: true,
              locale: 'en',
              largeChartUrl: 'https://www.tradingview.com/chart/?symbol={tvsymbol}',
              isTransparent: true,
              showSymbolLogo: true,
              showFloatingTooltip: false,
              width: '100%',
              height: h,
            }}
            fallbackMessage="After-hours movers temporarily unavailable"
          />
        </div>
      </div>
    </div>
  );
}
