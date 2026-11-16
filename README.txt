Finance Dashboard PWA — v10.6

Mobile fixes and improvements:
- Fixed mobile PWA section isolation so only the selected screen is visible; inactive Calendar content can no longer appear over Invest, Portfolio or other sections.
- Corrected mobile bottom navigation order and moved Excel Sheet to the final tab (after Guides).
- Refreshed the Calendar month header, day tiles, selected-day panel and payment/investment planner for clearer mobile use.

Previous v10.5 features remain included: Portfolio Realised P&L sales transaction log, sale ledger and workbook export integration, and hiding fully sold holdings.

Deployment: replace index.html and sw.js together on your hosting/PWA. Keep manifest.webmanifest, icons/, libs/ and your master workbook unchanged. After deployment, reload the PWA once to activate the new shell.
