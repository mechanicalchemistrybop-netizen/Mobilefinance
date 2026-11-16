Finance Dashboard PWA v10.4

Replace index.html and sw.js in your hosted repository. Keep manifest.webmanifest, icons/, libs/, and finance_data.xlsx unchanged.

Updates in v10.4:
- Mobile Calendar: reinforced vertical scrolling and bottom safe-area spacing so the last planner content and global footer remain reachable above the fixed bottom navigation.
- Excel Sheet: refreshed grid design retained; cells containing Excel formulas are now highlighted in green and marked ƒx. Hover/tap the cell to inspect its formula.
- Portfolio Contributions: holding-wise table now covers all recorded stock and mutual-fund purchases, grouped by category, with entries, units, this-month contribution and all-time contribution totals. Month-wise history remains available.
- Portfolio Sell: record partial/full stock or MF sales by date, units and sale price. Remaining units and invested cost basis update; gross proceeds are added to Funds available; realised P/L uses average cost before charges/taxes.
- Fully sold holdings with zero remaining units are hidden from Portfolio holdings and analysis views.
- When Updated Excel / Save Excel is used, new sale entries are applied once to Stock & MF Tracking: remaining units, invested cost and current value are recalculated. The Sales Ledger records an Applied to holdings marker to prevent duplicate deductions on later exports or reloads.
- Sales Ledger can be downloaded separately, written into the updated master workbook using Updated Excel / Save Excel, and included in Google Drive cloud backup using Save to cloud.

Deployment:
1. Replace index.html and sw.js together in the same folder as the existing manifest and assets.
2. Commit/push both files.
3. Open the hosted PWA online once and wait for the service-worker update; reload if prompted.
4. Reopen the master workbook if necessary.

Important: Sales ledger is persisted in this browser until exported or synced. Funds available is cumulative gross sale proceeds recorded in this dashboard; it is not linked to a bank account or cash-spending ledger. Realised P/L is calculated using average purchase cost and excludes brokerage, taxes and other charges.
