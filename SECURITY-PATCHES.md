# Security Patches Applied

## PATCH 1 — Content Security Policy (HIGH → Fixed)

**File:** `index.html`

Added CSP meta tag restricting execution sources:

| Directive | Allowed Sources |
|:----------|:---------------|
| `script-src` | `'self' 'unsafe-inline' s3.tradingview.com` |
| `style-src` | `'self' 'unsafe-inline' fonts.googleapis.com` |
| `font-src` | `fonts.gstatic.com` |
| `connect-src` | `'self' api.rss2json.com` |
| `frame-src` | `www.tradingview.com` |
| `img-src` | `'self' data: blob:` |

---

## PATCH 2 — TradingViewWidget Stabilization (MEDIUM → Fixed)

**File:** `src/components/TradingViewWidget.tsx`

| Before | After |
|:-------|:------|
| `JSON.stringify(config)` in useEffect deps (anti-pattern) | `useMemo` with explicit dependency keys |
| No script load error handling | `script.onerror` + React state fallback |
| Ref-based cleanup (race condition) | `container.innerHTML = ''` on cleanup |

---

## PATCH 3 — Calendars DOM Manipulation (MEDIUM → Fixed)

**File:** `src/components/Calendars.tsx`

| Before | After |
|:-------|:------|
| `document.createElement` inside `onError` | React `useState` for error state |
| No iframe sandbox | `sandbox="allow-scripts allow-same-origin"` |
| No referrer policy | `referrerPolicy="no-referrer"` |
| No lazy loading | `loading="lazy"` |
| Unencoded theme param | `encodeURIComponent(theme)` |

---

## PATCH 4 — Watchlist Input Sanitization (LOW → Fixed)

**File:** `src/components/SidebarPanels.tsx`

| Before | After |
|:-------|:------|
| Raw symbol in URL path | `encodeURIComponent(symbol)` |
| No input validation | `sanitizeSymbol()` — allows only `A-Z 0-9 . -` |
| No length limit | `maxLength={12}` on input + `.slice(0, 12)` |
| No notes length limit | `maxLength={10000}` on textarea |

---

## PATCH 5 — NewsFeed XSS Protection (LOW → Fixed)

**File:** `src/components/NewsFeed.tsx`

| Before | After |
|:-------|:------|
| Raw RSS title rendered | `sanitizeText()` strips HTML |
| No URL validation | `isValidUrl()` validates HTTP(S) protocol |
| No JSON parse error handling | Try-catch around `res.json()` |
| No date validation | `isNaN(date.getTime())` check in `timeAgo()` |
| Magic number 0.6 | Named constant `DEDUP_THRESHOLD` |

---

## PATCH 6 — Dead Code Removal

**File:** `src/App.css`

This file is imported nowhere and contains unused styles. Safe to delete.

---

## Files Modified (Copy to Your Repo)

```
index.html                              ← CSP header added
src/components/TradingViewWidget.tsx     ← Stable deps + error handling
src/components/Calendars.tsx             ← React state errors + sandboxed iframe
src/components/SidebarPanels.tsx         ← URL encoding + input sanitization
src/components/NewsFeed.tsx              ← XSS protection + validation
```

## Files to Delete

```
src/App.css                             ← Dead code (unused)
```
