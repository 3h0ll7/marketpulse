import { useAppContext } from '@/context/AppContext';
import { TradingViewWidget } from './TradingViewWidget';

export function MarketOverview() {
  const { theme, compactMode } = useAppContext();

  return (
    <div className="glass-card p-4 animate-fade-in">
      <h2 className="font-display text-lg font-semibold mb-3">Market Overview</h2>
      <TradingViewWidget
        widgetType="market-overview"
        height={compactMode ? 350 : 500}
        config={{
          colorTheme: theme,
          dateRange: '1D',
          showChart: true,
          locale: 'en',
          largeChartUrl: 'https://www.tradingview.com/chart/',
          isTransparent: true,
          showSymbolLogo: true,
          showFloatingTooltip: true,
          width: '100%',
          height: compactMode ? 350 : 500,
          tabs: [
            {
              title: 'Indices',
              symbols: [
                { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
                { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
                { s: 'FOREXCOM:DJI', d: 'Dow 30' },
                { s: 'INDEX:RUT', d: 'Russell 2000' },
                { s: 'INDEX:VIX', d: 'VIX' },
              ],
            },
            {
              title: 'ETFs',
              symbols: [
                { s: 'AMEX:SPY', d: 'SPY' },
                { s: 'AMEX:QQQ', d: 'QQQ' },
                { s: 'AMEX:IWM', d: 'IWM' },
                { s: 'AMEX:DIA', d: 'DIA' },
                { s: 'AMEX:GLD', d: 'GLD' },
              ],
            },
            {
              title: 'Commodities',
              symbols: [
                { s: 'CME_MINI:ES1!', d: 'E-Mini S&P' },
                { s: 'NYMEX:CL1!', d: 'Crude Oil' },
                { s: 'COMEX:GC1!', d: 'Gold' },
                { s: 'NYMEX:NG1!', d: 'Nat Gas' },
              ],
            },
          ],
        }}
        fallbackMessage="Market overview temporarily unavailable from source"
      />
    </div>
  );
}
