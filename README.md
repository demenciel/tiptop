# Tip Top Barbershop

Website for Tip Top Barber Shop, 397 King Street, Fredericton, NB.
Plain HTML, CSS and JavaScript. No build step.

## Run locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Structure

- `index.html` content, SEO tags and structured data (BarberShop schema)
- `css/styles.css` design tokens at the top, then one block per section
- `js/main.js` live open/closed status, scroll progress, services photo swap, gallery scrolling

## Things to know

- **Booking link:** every "Book your cut" button points to
  `https://tiptopbarbershopbckf.setmore.com/#services`. Search and replace to change it.
- **Hours:** edit the `HOURS` table in `js/main.js` (minutes after midnight, Atlantic time),
  the table in the Visit section, and `openingHoursSpecification` in the JSON-LD.
- **Photos:** images are currently loaded from the old Wix site (`static.wixstatic.com`).
  Before that site is shut down, download them into an `assets/` folder and update the `src` values.
- **Brand:** strictly black and white, taken from the winged-T badge and the black brick wall of the
  original site. The logo and brick texture are loaded from the old Wix site like the photos.
- **Fonts:** Big Shoulders Display (condensed signage caps) and Newsreader (classical serif, echoing
  the lettering in the logo), both from Google Fonts.

## Deploy

Any static host works (GitHub Pages, Netlify, Cloudflare Pages). Publish the repo root.
