import { useAppContext } from '@/context/AppContext';
import { TradingViewWidget } from './TradingViewWidget';

export function Calendars() {
  const { theme, compactMode } = useAppContext();
  const h = compactMode ? 350 : 500;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass-card p-4">
        <h2 className="font-display text-lg font-semibold mb-3">Economic Calendar</h2>
        <TradingViewWidget
          widgetType="events"
          height={h}
          config={{
            colorTheme: theme,
            isTransparent: true,
            locale: 'en',
            importanceFilter: '-1,0,1',
            countryFilter: 'us,eu,gb,jp,cn',
            width: '100%',
            height: h,
          }}
          fallbackMessage="Economic calendar temporarily unavailable from source"
        />
      </div>
      <div className="glass-card p-4">
        <h2 className="font-display text-lg font-semibold mb-3">Earnings Calendar</h2>
        <div className="rounded-lg overflow-hidden border border-border" style={{ height: h }}>
          <iframe
            src={`https://www.tradingview.com/embed-widget-events/?locale=en&colorTheme=${theme}&isTransparent=true&width=100%25&height=${h}&importanceFilter=-1%2C0%2C1`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Earnings Calendar"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'flex items-center justify-center h-full text-muted-foreground text-sm';
              fallback.textContent = 'Earnings calendar temporarily unavailable from source';
              target.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </div>
    </div>
  );
}
