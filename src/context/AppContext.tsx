import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type TabId = 'overview' | 'sectors' | 'movers' | 'calendars' | 'news';

interface SavedView {
  id: string;
  name: string;
  date: string;
  sectorFilter: string | null;
  compactMode: boolean;
  activeTab: TabId;
}

interface AppState {
  theme: 'light' | 'dark';
  compactMode: boolean;
  activeTab: TabId;
  sectorFilter: string | null;
  searchQuery: string;
  selectedDate: Date;
  watchlist: string[];
  notes: string;
  savedViews: SavedView[];
}

interface AppContextType extends AppState {
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setCompactMode: (v: boolean) => void;
  setActiveTab: (t: TabId) => void;
  setSectorFilter: (s: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedDate: (d: Date) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  setNotes: (n: string) => void;
  saveView: (name: string) => void;
  loadView: (id: string) => void;
  deleteView: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'market-pulse-state';

function loadState(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveState(state: Partial<AppState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const stored = loadState();
  const [theme, setThemeState] = useState<'light' | 'dark'>(stored.theme || 'light');
  const [compactMode, setCompactMode] = useState(stored.compactMode ?? false);
  const [activeTab, setActiveTab] = useState<TabId>(stored.activeTab || 'overview');
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [watchlist, setWatchlist] = useState<string[]>(stored.watchlist || ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'SPY', 'QQQ']);
  const [notes, setNotes] = useState(stored.notes || '');
  const [savedViews, setSavedViews] = useState<SavedView[]>(stored.savedViews || []);

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    saveState({ theme, compactMode, activeTab, watchlist, notes, savedViews });
  }, [theme, compactMode, activeTab, watchlist, notes, savedViews]);

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.includes(symbol.toUpperCase()) ? prev : [...prev, symbol.toUpperCase()]);
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol.toUpperCase()));
  }, []);

  const saveView = useCallback((name: string) => {
    const view: SavedView = {
      id: Date.now().toString(),
      name,
      date: selectedDate.toISOString(),
      sectorFilter,
      compactMode,
      activeTab,
    };
    setSavedViews(prev => [...prev, view]);
  }, [selectedDate, sectorFilter, compactMode, activeTab]);

  const loadView = useCallback((id: string) => {
    const view = savedViews.find(v => v.id === id);
    if (!view) return;
    setSelectedDate(new Date(view.date));
    setSectorFilter(view.sectorFilter);
    setCompactMode(view.compactMode);
    setActiveTab(view.activeTab);
  }, [savedViews]);

  const deleteView = useCallback((id: string) => {
    setSavedViews(prev => prev.filter(v => v.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      theme, compactMode, activeTab, sectorFilter, searchQuery, selectedDate,
      watchlist, notes, savedViews,
      setTheme, toggleTheme, setCompactMode, setActiveTab, setSectorFilter,
      setSearchQuery, setSelectedDate, addToWatchlist, removeFromWatchlist,
      setNotes, saveView, loadView, deleteView,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
