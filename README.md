# Saltline

A first-person breach on a rain-soaked container port, built with three.js in a single web page. Cut the three uplink relays, slip past or destroy the drones (Gulls) and robot dogs (Hounds), and reach the boat. Every surface, machine and sound is generated in the browser.

Personal project for playing and for testing what Claude can build.

## Play on a phone, full screen

1. Turn on GitHub Pages for this repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save**.
2. After a minute the game is live at `https://kyleh686.github.io/saltlinedev/` (all lower case: Pages addresses are case-sensitive).
3. **iPhone:** open that link in Safari, tap **Share → Add to Home Screen**. Launch it from the home-screen icon and it runs full screen with no browser bars.
4. **Android:** open the link in Chrome, tap **⋮ → Add to Home screen / Install app**.

It works offline after the first visit. For 120 FPS on a ProMotion iPhone, turn off **Settings → Apps → Safari → Advanced → Feature Flags → Prefer Page Rendering Updates near 60fps**, then pick 120 or Max under the game's **Settings → Frame rate**.

## What's in the game

- Two maps, picked on the title screen: **Berth 4**, the rain-soaked container port, and **Dry Well**, a small walled oil lease in the desert with a climbable derrick, tank farm, pump house and a working pumpjack.
- Three difficulties (Recruit, Breacher, Veteran) with a best time saved for each.
- Stealth: patrols notice you faster when you're close, standing or sprinting. A meter shows when you're being noticed.
- Melee (F, middle mouse, RB/R3, or HIT on touch): a rifle-butt strike that silently destroys a machine that hasn't spotted you.
- Ammo crates dropped by wrecked machines, and three optional intel drives under blue beams.
- Touch controls with a crouch toggle and aim slowdown, gamepad support, an FPS counter and 30/60/120/Max frame-rate modes.

## Files

- `index.html` is the built game: the page, its styles and all the code in one file.
- `manifest.webmanifest`, `sw.js` and the icons make it installable and offline-capable.
- `src/` is the source: `shell.html` (page and styles), `game.js` (the game, unminified), `three.js` (three.js r180, bundled).
- `pwa/` holds the home-screen app pieces copied in by the build.
- `build.sh` rebuilds `index.html` (and `dist/saltline.html`, the single-file version) from `src/`. It needs Python 3 and esbuild (`npm i -g esbuild`, or it falls back to `npx esbuild`).
- `src/game.js` holds both maps: `C1` builds Berth 4 and `slDryWell` builds Dry Well (search for "Map 2"). `?map=drywell` in the address forces a map.
- `tools/` has Playwright scripts used to check the game headless (`node tools/t-eval.js '<query>' '<js>'` boots `dist/saltline.html` and runs a snippet; `?q=test&noaudio=1&autostart=1` skips the title).
