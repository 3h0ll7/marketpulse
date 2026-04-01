import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, X, ExternalLink, Search } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'TradingView', url: 'https://www.tradingview.com/' },
  { label: 'Finviz', url: 'https://finviz.com/' },
  { label: 'Yahoo Finance', url: 'https://finance.yahoo.com/' },
  { label: 'CNBC', url: 'https://www.cnbc.com/' },
  { label: 'MarketWatch', url: 'https://www.marketwatch.com/' },
  { label: 'Investing.com', url: 'https://www.investing.com/' },
];

export function WatchlistPanel() {
  const { watchlist, addToWatchlist, removeFromWatchlist, searchQuery } = useAppContext();
  const [newSymbol, setNewSymbol] = useState('');

  const filtered = searchQuery
    ? watchlist.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : watchlist;

  const handleAdd = () => {
    if (newSymbol.trim()) {
      addToWatchlist(newSymbol.trim());
      setNewSymbol('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 animate-fade-in">
        <h3 className="font-display text-sm font-semibold mb-3">Watchlist</h3>
        <div className="flex gap-1.5 mb-3">
          <input
            type="text"
            value={newSymbol}
            onChange={e => setNewSymbol(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Add symbol..."
            className="flex-1 px-2 py-1 text-xs rounded-md bg-secondary border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
          <button onClick={handleAdd} className="p-1 rounded-md hover:bg-secondary transition-colors">
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
          {filtered.map(symbol => (
            <div key={symbol} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors group">
              <a
                href={`https://www.tradingview.com/symbols/${symbol}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {symbol}
              </a>
              <button onClick={() => removeFromWatchlist(symbol)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 animate-fade-in">
        <h3 className="font-display text-sm font-semibold mb-3">Quick Links</h3>
        <div className="space-y-0.5">
          {QUICK_LINKS.map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors text-sm group"
            >
              {link.label}
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NotesPanel() {
  const { notes, setNotes } = useAppContext();

  return (
    <div className="glass-card p-4 animate-fade-in">
      <h3 className="font-display text-sm font-semibold mb-3">Notes</h3>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Jot down your thoughts..."
        className="w-full h-64 px-3 py-2 text-sm rounded-md bg-secondary border-none outline-none resize-none text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}
