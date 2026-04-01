# Market Pulse — Real-Time Financial Dashboard

A sleek, glassmorphism-styled financial market dashboard built with React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui. Aggregates live market data, sector heatmaps, news feeds, forex rates, and crypto prices into one unified interface via TradingView embedded widgets and RSS feeds.

---

## Features

- **Market Overview** — Live indices, ETFs, and commodities via TradingView widgets
- **Sector Heatmap** — S&P 500 sectors with interactive filtering
- **Biggest Movers** — Pre-market, regular hours, and after-hours top movers
- **Economic & Earnings Calendars** — Embedded event calendars
- **News Feed** — Aggregated RSS from Yahoo Finance, CNBC, MarketWatch, and Reuters with deduplication
- **Forex & Currency** — Major and cross FX pairs
- **Crypto Overview** — Top cryptocurrencies by market cap
- **Watchlist** — Editable personal symbol watchlist with TradingView links
- **Notes** — Personal scratchpad persisted to localStorage
- **Saved Views** — Snapshot and restore dashboard configurations
- **Dark / Light Theme** — Full theme toggle with CSS custom properties
- **Compact Mode** — Reduced widget heights for dense information display
- **Date Picker** — Calendar-based date selection
- **Search** — Global headline and watchlist filtering
- **Responsive** — Desktop 3-column layout, tablet 2-column, mobile single-column with bottom tab bar

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3 + TypeScript 5.8 |
| Build | Vite 5.4 + SWC |
| Styling | Tailwind CSS 3.4 + tailwindcss-animate |
| Components | shadcn/ui (Radix UI primitives) |
| State | React Context API |
| Data | TradingView embedded widgets, rss2json API |
| Routing | React Router DOM 6.30 |
| Charts | Recharts 2.15 (available, not actively used in dashboard) |
| Date Utils | date-fns 3.6 |
| Testing | Vitest 3.2 + Playwright 1.59 |

---

## How It Works

### TradingView Widgets

The `TradingViewWidget` component dynamically injects `<script>` tags from `s3.tradingview.com/external-embedding/` into the DOM. Each widget type (market-overview, stock-heatmap, hotlists, market-quotes, events) receives a JSON config object serialized into the script's innerHTML. Widgets render inside dedicated container divs.

### RSS News Aggregation

The `NewsFeed` component fetches headlines from four financial RSS feeds via the `rss2json.com` proxy API. Results are sorted chronologically and deduplicated using a word-overlap similarity algorithm (threshold: 0.6). Failed feeds are gracefully reported without blocking the UI.

### State Persistence

The `AppContext` saves user preferences (theme, compact mode, active tab, watchlist, notes, saved views) to `localStorage` under the key `market-pulse-state`. State is restored on mount and updated on every change.

---

## Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/market-pulse.git
cd market-pulse

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Deployment

### GitHub Pages / Netlify / Vercel

1. Run `npm run build` — output goes to `dist/`
2. Deploy the `dist/` folder to your static host
3. For client-side routing, configure a redirect rule so all paths serve `index.html`

**Netlify example** (`_redirects` in `dist/`):
```
/*    /index.html   200
```

**Vercel example** (`vercel.json`):
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Security Considerations

### Third-Party Scripts (HIGH priority)

TradingView widgets inject external JavaScript from `s3.tradingview.com`. This is a trusted financial data provider, but embedding third-party scripts carries inherent risk. If the external source is compromised, injected code runs with full page privileges.

**Mitigations:**
- Consider loading TradingView widgets inside sandboxed `<iframe>` elements instead of direct script injection
- Implement a Content Security Policy (CSP) header restricting `script-src` to `'self'` and `s3.tradingview.com`

### RSS Proxy Dependency

The news feed relies on `api.rss2json.com` as a CORS proxy. This third-party service can see all RSS requests. If it goes down or becomes malicious, news data may be affected.

**Mitigations:**
- Consider a self-hosted RSS proxy or serverless function
- Validate and sanitize all response data before rendering

### No Sensitive Data Detected

The repository contains no API keys, tokens, secrets, or private URLs. All data sources are public embeds or public RSS feeds accessed through a free proxy. No `.env` files or hardcoded credentials were found.

### localStorage Usage

User preferences (theme, watchlist symbols, notes text) are stored in `localStorage`. This data is not sensitive, but notes content is stored as plaintext. No authentication tokens or session data are stored.

---

## Limitations

- **No backend** — All data comes from client-side embeds and a third-party RSS proxy; there is no server, database, or authentication layer
- **TradingView dependency** — If TradingView changes their embed widget URLs or removes the free embedding service, all market data widgets will break
- **rss2json.com dependency** — The free tier of rss2json has rate limits; heavy usage may result in blocked requests
- **No real-time streaming** — Market data refreshes only when widgets re-render or the user navigates tabs; there is no WebSocket or polling mechanism
- **No historical data** — The date picker UI exists but does not fetch historical snapshots; it primarily serves the saved-views feature
- **Limited error recovery** — Widget load failures show a fallback message but do not retry automatically
- **No SSR / SEO** — Single-page app with client-side rendering only
- **No authentication** — Watchlist and notes are local to the browser; clearing storage loses all data
- **Earnings calendar** — Uses an iframe with `onError` handler that manipulates DOM directly, which is fragile

---

## Future Improvements

- Add a lightweight backend (or Supabase) for user accounts, synced watchlists, and cloud-saved notes
- Implement WebSocket connections for real-time price streaming
- Add price alerts and push notifications
- Integrate a self-hosted RSS aggregation proxy to remove rss2json dependency
- Add CSP headers and iframe sandboxing for TradingView widgets
- Implement service worker for PWA offline support
- Add keyboard shortcuts for power users
- Historical data view tied to the date picker
- Portfolio tracking with P&L calculations
- Unit and integration tests beyond the placeholder example test

---

## Project Structure

```
market-pulse/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (40+ components)
│   │   ├── Header.tsx        # Top nav + mobile tab bar
│   │   ├── MarketOverview.tsx # Main indices widget
│   │   ├── SectorHeatmap.tsx  # S&P 500 heatmap + sector filters
│   │   ├── Movers.tsx         # Top gainers/losers
│   │   ├── Calendars.tsx      # Economic + earnings calendars
│   │   ├── NewsFeed.tsx       # RSS aggregator with dedup
│   │   ├── CurrencyConverter.tsx # Forex pairs
│   │   ├── CryptoOverview.tsx # Crypto market quotes
│   │   ├── SidebarPanels.tsx  # Watchlist + Notes + Quick Links
│   │   └── TradingViewWidget.tsx # Generic TV widget loader
│   ├── context/
│   │   └── AppContext.tsx     # Global state + localStorage persistence
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities (cn helper)
│   ├── pages/
│   │   ├── Index.tsx          # Main dashboard layout
│   │   └── NotFound.tsx       # 404 page
│   ├── test/                 # Test setup + example
│   ├── index.css             # Tailwind + custom properties + glassmorphism
│   ├── App.tsx               # Router + providers
│   └── main.tsx              # Entry point
├── tailwind.config.ts        # Extended theme config
├── vite.config.ts            # Dev server + aliases
├── vitest.config.ts          # Test runner config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies + scripts
```

---

## License

This project is unlicensed. Add a LICENSE file before publishing.

---

## Credits

- Market data powered by [TradingView](https://www.tradingview.com/) embedded widgets
- News aggregation via [rss2json](https://rss2json.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)# Welcome to your Lovable project

TODO: Document your project here
