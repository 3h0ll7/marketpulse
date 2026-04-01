import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

const RSS_FEEDS = [
  { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance' },
  { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', source: 'CNBC' },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', source: 'MarketWatch' },
  { url: 'https://feeds.reuters.com/reuters/businessNews', source: 'Reuters' },
];

function similarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let overlap = 0;
  wordsA.forEach(w => { if (wordsB.has(w)) overlap++; });
  return overlap / Math.max(wordsA.size, wordsB.size);
}

function deduplicate(items: NewsItem[]): NewsItem[] {
  const result: NewsItem[] = [];
  for (const item of items) {
    const isDup = result.some(r => similarity(r.title, item.title) > 0.6);
    if (!isDup) result.push(item);
  }
  return result;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NewsFeed() {
  const { searchQuery, sectorFilter } = useAppContext();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    const allItems: NewsItem[] = [];
    const errs: string[] = [];

    await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        try {
          const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=20`
          );
          if (!res.ok) throw new Error('Failed');
          const data = await res.json();
          if (data.status === 'ok' && data.items) {
            data.items.forEach((item: { title: string; link: string; pubDate: string }) => {
              allItems.push({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                source: feed.source,
              });
            });
          }
        } catch {
          errs.push(feed.source);
        }
      })
    );

    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    setNews(deduplicate(allItems));
    setErrors(errs);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  let filtered = news;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(n => n.title.toLowerCase().includes(q));
  }
  if (sectorFilter) {
    const q = sectorFilter.toLowerCase();
    filtered = filtered.filter(n => n.title.toLowerCase().includes(q));
  }

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold">News Feed</h2>
        <button onClick={fetchNews} disabled={loading} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {errors.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <AlertCircle className="w-3 h-3" />
          {errors.join(', ')} temporarily unavailable
        </div>
      )}
      {loading && news.length === 0 ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-1" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {filtered.map((item, i) => (
            <a
              key={`${item.link}-${i}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(item.pubDate)}</span>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
            </a>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No matching headlines found.</p>
          )}
        </div>
      )}
    </div>
  );
}
