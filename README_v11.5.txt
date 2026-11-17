Finance Dashboard v11.5 update
================================

Fixes included
--------------
1. Stock & MF Tracking header mapping now prioritizes exact header matches.
   This prevents "Type of Investment" in column A from being mistaken for the
   "Investment" amount column E. Invested amount now reads the actual Investment
   field in the revised A:K layout.

2. Funds Available now follows the dated cash ledger:
   - Sale proceeds increase the available sale-cash balance on the sale date.
   - Stock / MF purchases reduce that balance only on or after the date the
     sale proceeds became available.
   - Purchases made before a sale are not deducted from that later sale.
   - Same-day sale proceeds are applied before same-day purchases.

Files
-----
- index.html: updated dashboard for both desktop web and mobile PWA.
- sw.js: bumped service-worker cache to v11.5 so the updated app is fetched.

Deployment
----------
Replace the existing index.html and sw.js with the files in this package on
your existing hosting location. Keep the existing libs/, icons/, manifest and
other static assets in place. Then reload the dashboard. On mobile, close and
reopen the installed PWA or refresh it once while online to receive the new
service-worker cache.

Workbook observations
---------------------
The uploaded workbook's Sales Ledger contains a sale dated 16-Nov-2026 with
gross proceeds of Rs 492,862.05. Its Dashboard Entries purchases are dated
3-Nov through 9-Nov-2026, before that sale. Therefore those earlier purchases
must not be deducted from the 16-Nov sale proceeds. Any later purchases,
including pending dashboard entries, will consume available sale cash.
