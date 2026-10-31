# Hatch — Independent Website (PUBREDME test deployment)

This is an independent HTML/CSS/JavaScript website prototype for the **Grim-the-site** organization. It is not connected to DEXCORE.

## Test URL

Once GitHub Pages is enabled and deployed, the website will be available at:

https://grim-the-site.github.io/PUBREDME/

## Enable GitHub Pages

1. Upload the contents of this package **directly to the root** of `Grim-the-site/PUBREDME` on the `main` branch. Upload the actual files, not the ZIP.
2. Open the repository **Settings > Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `main` and `/(root)`; click **Save**.
5. Check the GitHub Pages section for the live link after it deploys.

## Customize

- Open the site and click **Customize** to change the site name, introduction, colors, and theme.
- Those changes persist in that browser only. Choose **Export settings** and commit the exported `site-config.json` to publish the changes for all visitors.
- Edit the demonstration showcase projects in `index.html` and their detail content in `app.js`.
- The site uses static HTML, CSS and JavaScript; no build tooling or backend is needed.

## Run locally

`python -m http.server 8000` and open http://localhost:8000.

## Files

- `index.html` — homepage
- `styles.css` — layouts, animations and themes
- `app.js` — interactions
- `site-config.json` — public defaults
- `assets/favicon.svg` — favicon
- `.nojekyll` — Pages static hosting compatibility

All sample project content is fictional demo material.