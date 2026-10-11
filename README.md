# Jeff Lu — Personal Website

A compact personal portfolio with dark/light themes, animated DotField, handwritten signature and a live market ticker.

## Local development

Requires Node.js 22.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm start
```

## Deploy on Vercel

1. This project is hosted in the public GitHub repository `jeffsasha/jeff-portfolio`.
2. In Vercel, add a project and import that repository.
3. Use the **Next.js** framework preset, the repository root, and Node.js **22.x**.
4. Deploy. The page and `/api/markets` run in the same project.
5. Visit `/api/markets` to verify that all ten symbols are present.

No ChatGPT sign-in, ChatGPT hosting, database, or API key is required by this version. Future pushes to the linked production branch trigger Vercel deployments.

## Market data

`GET /api/markets` aggregates seven NASDAQ stocks (AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA) from TradingView and BTC, ETH, SOL from Coinbase Exchange public 24-hour statistics. The browser refreshes every 60 seconds. Requests time out after 8 seconds; Vercel's function duration is configured to 20 seconds. Quotes may be delayed by their providers.

Vercel's CDN can cache successful responses for 60 seconds and serve a previous response while revalidating for up to 300 seconds. In-memory fallback is best effort and resets on cold starts; it is not durable storage. A partial response is marked `stale`; the page preserves previous quotes on a network failure and shows an unavailable state when no quote exists.

## Licenses

Site content displays the requested CC BY-NC-SA 4.0 footer. Third-party components, fonts and trademarks keep their own terms; see `THIRD_PARTY_LICENSES.md`, `public/third-party-notices.txt`, and `public/fonts/OFL.txt`.
