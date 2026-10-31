# Grim Gamer YT — channel-matched website

Official-looking independent creator hub for [Grim Gamer YT](https://www.youtube.com/@grim-gamer-YT/featured). The original supplied YouTube banner and avatar are used directly, not regenerated or replaced. The banner is displayed in its native 5:2 aspect ratio to prevent accidental cropping on desktop and mobile.

## Features
- Real channel banner and reaper avatar
- Responsive, accessible navigation and mobile menu
- Videos, Shorts, live/replays, and playlists links (no invented video listings)
- Filterable channel navigation cards, scroll progress, entrance transitions, clipboard link copy
- Reduced-motion setting support and responsive small-screen layouts
- Plain HTML/CSS/JS; no build process or credentials required

## Deployment
Upload all files, including `assets/`, to the root of the `main` branch in `Grim-the-site/PUBREDME`. In Settings → Pages, select "Deploy from a branch", `main`, `/(root)`.

Live URL: https://grim-the-site.github.io/PUBREDME/

## Test locally
`python -m http.server 8000` then visit `http://localhost:8000`.

The original channel art is retained at `assets/grim-banner.webp` and `assets/grim-avatar.webp`; both were derived directly from user-provided source images. The UI is deliberately separated from the artwork so the logo and key visual elements remain unobstructed.