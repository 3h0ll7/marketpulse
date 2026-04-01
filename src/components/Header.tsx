import { useState } from 'react';
import { useAppContext, type TabId } from '@/context/AppContext';
import { format } from 'date-fns';
import { Search, Sun, Moon, CalendarIcon, Columns2, Rows2, Save, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'sectors', label: 'Sectors' },
  { id: 'movers', label: 'Movers' },
  { id: 'calendars', label: 'Calendars' },
  { id: 'news', label: 'News' },
  { id: 'forex', label: 'Forex' },
  { id: 'crypto', label: 'Crypto' },
];

export function Header() {
  const {
    theme, toggleTheme, compactMode, setCompactMode,
    activeTab, setActiveTab, searchQuery, setSearchQuery,
    selectedDate, setSelectedDate, saveView, savedViews, loadView, deleteView,
  } = useAppContext();
  const [viewName, setViewName] = useState('');
  const [showSaveView, setShowSaveView] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="container flex items-center gap-3 h-14 px-4">
        <h1 className="font-display text-base font-bold shrink-0 hidden sm:block">
          Market Pulse
        </h1>

        {/* Date */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary transition-colors text-sm shrink-0">
              <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden md:inline">{format(selectedDate, 'EEE, MMM d, yyyy')}</span>
              <span className="md:hidden">{format(selectedDate, 'MMM d')}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-7 pr-3 py-1.5 text-sm rounded-md bg-secondary border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Tabs - desktop */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-auto">
          {/* Save View */}
          <Popover open={showSaveView} onOpenChange={setShowSaveView}>
            <PopoverTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-secondary transition-colors" title="Saved Views">
                <Save className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    value={viewName}
                    onChange={e => setViewName(e.target.value)}
                    placeholder="View name..."
                    className="flex-1 px-2 py-1 text-xs rounded-md bg-secondary border-none outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => { if (viewName.trim()) { saveView(viewName.trim()); setViewName(''); } }}
                    className="px-2 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Save
                  </button>
                </div>
                {savedViews.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-muted-foreground font-medium">Saved Views</p>
                    {savedViews.map(v => (
                      <div key={v.id} className="flex items-center justify-between py-1">
                        <button onClick={() => { loadView(v.id); setShowSaveView(false); }} className="text-xs hover:text-primary transition-colors">
                          {v.name}
                        </button>
                        <button onClick={() => deleteView(v.id)}>
                          <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Compact toggle */}
          <button
            onClick={() => setCompactMode(!compactMode)}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title={compactMode ? 'Normal View' : 'Compact View'}
          >
            {compactMode ? <Columns2 className="w-4 h-4 text-muted-foreground" /> : <Rows2 className="w-4 h-4 text-muted-foreground" />}
          </button>

          {/* Theme */}
          <button onClick={toggleTheme} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
            {theme === 'light' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const { activeTab, setActiveTab } = useAppContext();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-header border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-12">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
