Finance Dashboard v11.0 – Mobile PWA stability update

Files: index.html, sw.js, README.txt

Changes
- Mobile pages now use content-driven height and a single bottom-navigation clearance. Removed the older oversized Calendar/footer spacer rules by applying a final consistent mobile layout override.
- Guide and Excel tabs remain visible even when no workbook is loaded; they show an actionable empty state instead of being hidden by the global empty-dashboard rule.
- Guide and Excel sections are refreshed on tab selection, PWA resume and page restoration. A second refresh pass handles delayed workbook-engine initialization.
- Mobile navigation enforces one active section at a time and prevents stale hidden views from overlaying the selected view.
- Desktop layout and workbook data/calculations are not intentionally changed.

Deployment
Replace index.html and sw.js together in your hosting location. Keep the existing manifest, workbook, libraries and icons. Allow the service worker to update, then fully close and reopen the PWA once to activate the new shell.

Validation
JavaScript syntax and ZIP integrity are checked. Physical-device layout and live workbook behavior still require testing on the user's phone and workbook.
