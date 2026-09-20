# YTGhoul

A Chrome extension (Manifest V3) that toggles a **Focus mode** for YouTube.
When Focus mode is on, the homepage recommendation feed, Shorts entries, and
watch-page "related videos" are hidden — so you can watch what you came for
without the endless scroll.

Named after the "restraint vs. hunger" theme of *Tokyo Ghoul*.

## Features

- **One-click toggle** between Normal and Focus mode from the popup.
- **Hides distractions**: home feed, Shorts sidebar links, and related videos.
- **Auto-relapse timer**: switching to Normal mode automatically snaps you
  back to Focus after 5 minutes, with a live countdown in the popup.
- **Instant** — uses CSS toggling; browsing tabs are never reloaded, only the
  active YouTube tab refreshes when the timer fires.

## How it works

| File | Role |
|------|------|
| `manifest.json` | Extension config, permissions, and entry points. |
| `content.js` | Injects the CSS that hides feeds; toggled by an attribute on `<html>`. |
| `popup.html` / `popup.js` / `popup.css` | The toolbar popup UI and its logic. |
| `background.js` | Service worker managing the 5-minute auto-focus alarm. |

State lives in a single `chrome.storage.local` key (`ytMode`). All three
contexts stay in sync by listening for changes to it.

## Installation (local / unpacked)

1. Download or clone this repo.
2. Go to `chrome://extensions`.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select the `YTGhoul` folder.
5. Pin the extension and open the popup to switch modes.

## Permissions

Deliberately minimal (least privilege):

- `storage` — save your current mode.
- `alarms` — run the 5-minute auto-focus timer.
- `host_permissions: youtube.com` — apply the focus CSS on YouTube only.

The extension does **not** request the `tabs` permission. An earlier version
did (to reload every YouTube tab when the timer fired); a self-audit showed it
was unnecessary — content scripts apply mode changes live via
`storage.onChanged`, and the single active-tab refresh works through the
existing YouTube host permission alone.

## Security & Limitations

Documented honestly, because a focus tool should be clear about what it can
and cannot enforce:

- **The lock is a nudge, not a wall.** Focus mode is CSS (`display: none`)
  gated by an attribute on `<html>`. Disabling the extension, using DevTools,
  or opening another browser defeats it. It is designed to add friction, not
  to be uncircumventable.
- **Selectors can rot.** The hiding rules target YouTube's internal element
  names (`ytd-rich-grid-renderer`, `ytd-watch-flexy #related`, …). If YouTube
  ships a redesign, hiding may silently stop working until the selectors are
  updated. If you notice the feed leaking through, open an issue.
- **No data collection.** The extension stores one word (`"normal"` or
  `"focus"`) locally on your machine. Nothing is transmitted anywhere, and
  there are no external dependencies or remote code.

## License

GNU GPLv3 — see [LICENSE](LICENSE).
