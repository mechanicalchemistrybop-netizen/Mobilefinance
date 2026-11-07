# Money dashboard: mobile PWA setup (v1.4)

A PWA is your `index.html` served over **HTTPS**, plus a manifest, a service worker and icons. Once installed it opens full screen from the home screen, loads instantly and works offline.

## 1. What is in the folder

| File | Purpose |
|---|---|
| `index.html` | The dashboard (all your code) |
| `manifest.webmanifest` | App name, colors, icons, "standalone" display |
| `sw.js` | Service worker: caches the app so it opens offline |
| `icons/` | 192, 512, maskable 512, Apple touch icon, favicon |
| `libs/` | Chart.js, the data-label plugin and SheetJS saved locally (no CDN needed, faster, offline) |

Keep all of these together in one folder, with the same names and sub-folders.

## 2. Test on your computer first (2 minutes)

1. Open a terminal in the folder and run `python -m http.server 8080`
2. Open `http://localhost:8080` in Chrome or Edge. `localhost` counts as secure, so the service worker works.
3. Press F12, then **Application**. Under *Manifest* there should be no errors, and under *Service Workers* you should see `sw.js` "activated".
4. Tick *Offline*, reload: the dashboard should still open.

## 3. Put it online (free HTTPS hosting)

Phones only install a PWA from an HTTPS address. Pick one:

**Netlify Drop (easiest, no account setup)**
1. Go to app.netlify.com/drop and drag the **whole folder** onto the page.
2. You get an address like `https://random-name.netlify.app`. You can rename it in Site settings.

**Cloudflare Pages (free, fast)**
1. Pages, then Create project, then **Direct Upload**. Upload the folder.
2. You get `https://yourname.pages.dev`.

**GitHub Pages**
1. Create a repository and upload the folder contents. Settings, then Pages, then deploy from the `main` branch.
2. Note: on a free account the repository, and therefore your files, is public.

### Important: your Tapetide key
Version 1.0 put your Tapetide key inside `index.html`. Anyone who can open your site can read it in the page source.
- Your **financial data is not in these files**. It stays inside your Excel file, which never leaves your phone.
- If the site is public (GitHub Pages, or a guessable Netlify address), do this before uploading: open `index.html`, search for `TAPETIDE_KEY`, and empty the quotes (`const TAPETIDE_KEY='';`). Then paste your token once in the app's Tapetide box on your phone. It is saved only on that device.
- If you keep the key built in, use an unguessable address and don't share the link.

## 4. Install on your phone

**Android (Chrome)**
1. Open your HTTPS address.
2. Tap the **📲 Install app** button in the dashboard header, or the menu (⋮), then **Install app** / **Add to Home screen**.

**iPhone / iPad (Safari only)**
1. Open your HTTPS address in **Safari** (not Chrome).
2. Tap **Share**, then **Add to Home Screen**, then **Add**.

The icon appears on your home screen and the app opens without browser bars.

## 5. First launch: load your Excel

1. Tap **Open workbook** and choose your `.xlsx` from Files / Drive / Downloads.
2. From v1.4 the workbook is **remembered on the phone**. Next time you open the app it loads by itself. If the workbook is password-protected, the app asks for the password each time. The file stays encrypted on the device.
3. To update your numbers, save the new Excel to your phone and tap **Open workbook** again.
4. To remove the saved copy, clear the site data for the app in your phone settings.

## 6. Updating the app later

- Upload the new `index.html` to the same host. The app checks for a newer copy every time it opens while online, and uses the saved copy when offline.
- If you ever replace files inside `libs/` or `icons/`, also change `const VERSION='v1.4';` at the top of `sw.js` (for example to `'v1.5'`) so phones fetch the new files.
- The footer version (bottom of each page) tells you which copy your phone is running.

## 7. Good to know

- **Live prices** need internet. Offline, the app shows the last saved prices.
- On a hosted site there is no local helper, so stock prices use your Tapetide key and public price feeds. Fund NAVs come from mfapi.in.
- **Trouble installing?** You need HTTPS, a working `manifest.webmanifest`, `sw.js` and the icons. Reload twice after the first visit. In Chrome, DevTools, Application, "Service Workers", click *Unregister* and reload to reset.
- **Want a real app-store app later?** pwabuilder.com can wrap this same folder into an Android package. iOS packaging needs a Mac.
- Your Theme Studio choices, calendar entries and stock charts are saved on the phone, separately from the computer.
