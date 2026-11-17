Finance Dashboard v11.4 update

Included files:
- index.html: shared responsive source for desktop Web Dashboard and Mobile PWA
- sw.js: service worker cache version v11.4

Updates:
- Funds available from sales = gross sale proceeds minus dashboard-recorded stock/MF purchase amounts, with a floor of zero. Total sale proceeds and realised P/L remain unchanged.
- Existing and pending dashboard purchases are counted once using Dashboard Entries and the pending-entry list.
- Stock & MF Tracking holdings columns are detected by their header names, supporting the former I:S layout and revised A:K layout. Dashboard purchase and sale write-back uses the detected columns.
- If the old bank-ledger table is absent or has a different layout, the purchase audit remains in Dashboard Entries and export does not fail solely because that table is missing.

Deployment: replace index.html and sw.js together in the same hosted folder. Keep manifest.webmanifest, icons, libs and finance_data.xlsx. Open the revised master workbook in the dashboard after uploading it.
