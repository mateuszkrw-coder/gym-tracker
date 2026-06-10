# Gym Tracker

**Live app:** https://mateuszkrw-coder.github.io/gym-tracker/

A tiny offline-first PWA for tracking gym weights. Dark theme, no login, no backend —
everything is stored in `localStorage` on your phone.

**Features**

- Summary start page with weekly graphs and a **Start workout** button
- Workout sessions: live timer while you train, **End workout** recap
  (duration, exercises, sets, volume)
- Muscle groups → exercises → tap to log weight × reps × sets
- Just-saved sets listed right under the Save button with ✕ to remove misclicks
- "Last time" shown on every exercise, with ▲/▼ trend vs the previous session
- Progress chart and personal best per exercise
- Full history view with weekly/monthly stats
- Rest timer (1:00 / 1:30 / 2:00)
- Per-exercise notes (seat height, grip, machine settings…)
- Add / rename / delete groups and exercises (Edit button on the Workout tab)
- Export / import JSON backups (Settings tab)
- Installable on iPhone (Add to Home Screen), works fully offline

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app (HTML + CSS + JS) |
| `manifest.webmanifest` | PWA manifest (name, icons, standalone display) |
| `sw.js` | Service worker — caches the app so it works offline |
| `icons/` | App icons (home screen icon) |

## Deploy to GitHub Pages

1. Create a **public** repository on GitHub (e.g. `gym-tracker`).
2. Upload all files from this folder (keep the `icons/` folder structure).
3. In the repo: **Settings → Pages → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save**.
4. Wait ~1 minute. Your app is live at `https://YOUR-USERNAME.github.io/gym-tracker/`.

## Install on iPhone

1. Open the URL above in **Safari**.
2. Tap the **Share** button (square with an arrow).
3. Tap **Add to Home Screen** → **Add**.
4. Launch it from the home screen icon — it runs full screen and works offline.

## Updating the app

1. Edit the files in the repo (GitHub web editor works fine).
2. **Important:** in `sw.js`, bump the version string, e.g. `gym-tracker-v2` → `gym-tracker-v3`.
3. Commit. Installed phones pick up the new version next time the app is opened with internet.

## Your data

- Data lives only on your phone (`localStorage`), tied to the installed app.
- **If you delete the home screen icon, the data is deleted with it** — use
  Settings → Export now and then to keep a backup file.
- The installed app and the Safari tab have *separate* storage. Log your workouts
  in the installed app.
