import { useAppContext } from '@/context/AppContext';
import { TradingViewWidget } from './TradingViewWidget';

export function CryptoOverview() {
  const { theme, compactMode } = useAppContext();
  const height = compactMode ? 350 : 500;

  return (
    <div className="glass-card p-4 animate-fade-in">
      <h2 className="font-display text-lg font-semibold mb-3">Crypto Overview</h2>
      <TradingViewWidget
        widgetType="market-quotes"
        height={height}
        config={{
          width: '100%',
          height,
          symbolsGroups: [
            {
              name: 'Crypto',
              originalName: 'Crypto',
              symbols: [
                { name: 'BINANCE:BTCUSDT', displayName: 'Bitcoin' },
                { name: 'BINANCE:ETHUSDT', displayName: 'Ethereum' },
                { name: 'BINANCE:SOLUSDT', displayName: 'Solana' },
                { name: 'BINANCE:XRPUSDT', displayName: 'XRP' },
                { name: 'BINANCE:ADAUSDT', displayName: 'Cardano' },
                { name: 'BINANCE:DOGEUSDT', displayName: 'Dogecoin' },
                { name: 'BINANCE:AVAXUSDT', displayName: 'Avalanche' },
                { name: 'BINANCE:DOTUSDT', displayName: 'Polkadot' },
              ],
            },
          ],
          showSymbolLogo: true,
          isTransparent: true,
          colorTheme: theme,
          locale: 'en',
        }}
        fallbackMessage="Crypto overview temporarily unavailable"
      />
    </div>
  );
}
