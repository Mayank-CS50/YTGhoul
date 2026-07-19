  # YTGhoul

  A Chrome extension (Manifest V3) that toggles a **Focus mode** for        
  YouTube.
  When Focus mode is on, the homepage recommendation feed, Shorts entries,  
  and
  watch-page "related videos" are hidden — so you can watch what you came   
  for
  without the endless scroll.

  Named after the "restraint vs. hunger" theme of *Tokyo Ghoul*.

  ## Features

  - **One-click toggle** between Normal and Focus mode from the popup.      
  - **Hides distractions**: home feed, Shorts sidebar links, and related    
  videos.
  - **Auto-relapse timer**: switching to Normal mode automatically snaps you
  back
    to Focus after 5 minutes, with a live countdown in the popup.
  - **Instant** — uses CSS toggling, no page reloads while browsing.        

  ## How it works

  | File | Role |
  |------|------|
  | `manifest.json` | Extension config, permissions, and entry points. |    
  | `content.js` | Injects the CSS that hides feeds; toggled by an attribute
  on `<html>`. |
  | `popup.html` / `popup.js` / `popup.css` | The toolbar popup UI and its  
  logic. |
  | `background.js` | Service worker managing the 5-minute auto-focus alarm.
  |

  State lives in a single `chrome.storage.local` key (`ytMode`). All three  
  contexts stay in sync by listening for changes to it.

  ## Installation (local / unpacked)

  1. Download or clone this repo.
  2. Go to `chrome://extensions`.
  3. Turn on **Developer mode** (top-right).
  4. Click **Load unpacked** and select the `YTGhoul` folder.
  5. Pin the extension and open the popup to switch modes.

  ## Permissions

  - `storage` — save your current mode.
  - `alarms` — run the 5-minute auto-focus timer.
  - `tabs` — reload open YouTube tabs when the timer fires.
  - `host_permissions: youtube.com` — apply the focus CSS on YouTube only.  

  ## License

  GNU GPLv3 — see [LICENSE](LICENSE).
