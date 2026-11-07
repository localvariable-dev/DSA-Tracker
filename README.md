# Tracebook

A self-contained practice tracker for the 90-day Java and Codeforces plan in the supplied handbooks.

## Open it

Run a local static server from this folder:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173` in a browser. The site has no package install or build step.

## What is in it

- **Today:** day focus, session checklist, proof-of-work log, and a short daily cue.
- **90-day path:** all phases, dates, practice bands, checkpoints, and selectable day tiles.
- **Field guide:** problem-solving protocol, pattern clues, Java snippets, bug checklist, contest method, weekly rhythm, and source resource links.
- **Weekly review:** completion and practice totals plus five reflection prompts.

Days 1 to 10 use the handbooks' daily bootcamp topics and drills. Days 11 to 90 keep the handbook phase topics, practice bands, and checkpoints. Their individual daily prompts are a suggested rotation through each phase because the source material specifies those later topics by ten-day phase, not as a fixed daily schedule.

## Your progress

Progress is saved in this browser with local storage. Use **Download a progress backup** before changing devices. A backup can be restored from the weekly review page.

### Optional Cloudflare R2 sync

The **Cloud sync** panel on the Weekly review page is opt-in. Save your Worker endpoint and personal token there. On each app open, Tracebook makes one request to load a cloud copy; if none exists, local progress remains. **Sync now** explicitly uploads the current progress. It does not sync each edit. Connection settings are stored separately from the progress backup, in this browser's local storage.

R2 is accessed through a Worker, not directly from browser code. The `sync-worker/` folder contains the API endpoint and a Cloudflare CLI config. Before using it:

1. The Worker is configured to use the private `dsa-progress` R2 bucket.
2. `ALLOWED_ORIGIN` allows `https://localvariable-dev.github.io` and `https://kimick.in`. If you publish the site on another host, add its exact origin (scheme and host only, no path or trailing slash) as another comma-separated value.
3. Create a private `.secrets.json` in `sync-worker/` with both `SYNC_TOKEN` and `OTTER_SYNC_TOKEN`. The owner token remains mapped to the existing progress file; the Otter token uses the `Otter/` prefix. Keep this file private and out of source control.
4. From `sync-worker/`, run `npm install`, sign in with `cf auth login`, and deploy with `cf deploy --secrets-file .secrets.json`. The folder uses Cloudflare's Vite plugin as the `cf` build tool.
5. In the app's Cloud sync panel, use the deployed Worker URL with `/api/progress` appended, and enter the same token.

The owner token keeps the existing progress at `tracebook/progress-v1.json`. A separate `OTTER_SYNC_TOKEN` maps to `Otter/progress-v1.json`, so your friend can use the same site and Worker without sharing your progress. Add both values to the ignored `sync-worker/.secrets.json` and redeploy the Worker. Share only the Otter token with your friend. Each person should use their own device or browser profile because progress and connection settings are also saved locally in the browser.

Closing a tab cannot guarantee a save: browsers may end the page before a request finishes. The current design therefore relies on **Sync now** for uploads and does not silently upload on close. A best-effort hidden-page save can be added later, but it can still be interrupted.

The 1300 Codeforces rating is treated as a stretch target. Independent solves, upsolves, implementation fluency, and weekly review are tracked separately from assisted work.

## Design notes

- **Design read:** a personal training log for a 90-day Java and Codeforces journey.
- **Dials:** ENERGY 2 / RHYTHM 3 / MOTION 1.
- **Identity:** bracket marks echo code notation and a notebook's daily checkoff. The 90-cell path is the central visual element because the student is tracking practice over time.
- **Color:** warm paper `#F3F0E8`, ink `#25241F`, muted text `#625E55`, and vermilion `#B33C27`. Body text and controls use a system sans; a restrained serif gives day titles the feel of a field notebook; monospace is limited to code and day numbers.
- **Motion:** brief checkoff and progress changes only, removed for people who prefer reduced motion.
- **Responsive structure:** wide screens use a left navigation rail; compact screens stack the content and use a bottom navigation bar.
