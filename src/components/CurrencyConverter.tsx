import { useAppContext } from '@/context/AppContext';
import { TradingViewWidget } from './TradingViewWidget';

export function CurrencyConverter() {
  const { theme, compactMode } = useAppContext();
  const height = compactMode ? 350 : 500;

  return (
    <div className="glass-card p-4 animate-fade-in">
      <h2 className="font-display text-lg font-semibold mb-3">Forex & Currency</h2>
      <TradingViewWidget
        widgetType="market-quotes"
        height={height}
        config={{
          width: '100%',
          height,
          symbolsGroups: [
            {
              name: 'Major Pairs',
              originalName: 'Major Pairs',
              symbols: [
                { name: 'FX:EURUSD', displayName: 'EUR/USD' },
                { name: 'FX:GBPUSD', displayName: 'GBP/USD' },
                { name: 'FX:USDJPY', displayName: 'USD/JPY' },
                { name: 'FX:USDCHF', displayName: 'USD/CHF' },
                { name: 'FX:AUDUSD', displayName: 'AUD/USD' },
                { name: 'FX:USDCAD', displayName: 'USD/CAD' },
              ],
            },
            {
              name: 'Cross Rates',
              originalName: 'Cross Rates',
              symbols: [
                { name: 'FX:EURGBP', displayName: 'EUR/GBP' },
                { name: 'FX:EURJPY', displayName: 'EUR/JPY' },
                { name: 'FX:GBPJPY', displayName: 'GBP/JPY' },
                { name: 'FX_IDC:USDINR', displayName: 'USD/INR' },
              ],
            },
          ],
          showSymbolLogo: true,
          isTransparent: true,
          colorTheme: theme,
          locale: 'en',
        }}
        fallbackMessage="Forex data temporarily unavailable"
      />
    </div>
  );
}
