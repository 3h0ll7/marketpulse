import { AppProvider, useAppContext } from '@/context/AppContext';
import { Header, MobileTabBar } from '@/components/Header';
import { MarketOverview } from '@/components/MarketOverview';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { Movers } from '@/components/Movers';
import { Calendars } from '@/components/Calendars';
import { NewsFeed } from '@/components/NewsFeed';
import { WatchlistPanel, NotesPanel } from '@/components/SidebarPanels';

function MainContent() {
  const { activeTab } = useAppContext();

  const showSection = (section: string) => {
    return activeTab === 'overview' || activeTab === section;
  };

  return (
    <div className="space-y-4">
      {showSection('overview') && <MarketOverview />}
      {showSection('sectors') && <SectorHeatmap />}
      {showSection('movers') && <Movers />}
      {showSection('calendars') && <Calendars />}
      {showSection('news') && <NewsFeed />}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      <Header />
      <div className="container px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[220px_1fr_220px] gap-4">
          {/* Left sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-[72px]">
              <WatchlistPanel />
            </div>
          </aside>

          {/* Main content */}
          <main>
            <MainContent />
          </main>

          {/* Right sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[72px]">
              <NotesPanel />
            </div>
          </aside>
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
