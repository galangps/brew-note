# Brew-Note ☕

**Brew. Taste. Tweak. Repeat.**

Brew-Note is a neo-brutalist coffee brewing journal and recipe lab built with Next.js. V1 is intentionally zero-setup: data is stored in the browser with `localStorage`, so you can run it immediately and deploy it to Vercel without provisioning a database first.

## Included in V1

- Neo-brutalism responsive dashboard
- Recipe library + search
- Full recipe form: bean, origin, process, roast, dose, water, ratio, temperature, grinder, grind setting/size, filter, agitation, brew time, notes
- Dynamic pour schedule with cumulative/add-water modes and pour technique
- Recipe scaling: change coffee dose and automatically scale water + pour amounts
- Save scaled recipe as a variant/version
- Bean inventory with automatic stock deduction after a brew log is saved
- Full-screen Brew Mode with timer and current pour instruction
- Brew Journal and star rating
- Favorite recipes

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to GitHub + Vercel

```bash
git init
git add .
git commit -m "feat: initial Brew-Note v1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Brew-Note.git
git push -u origin main
```

Then in Vercel:

1. Add New → Project
2. Import the `Brew-Note` GitHub repository
3. Keep the detected Next.js defaults
4. Deploy

## Important persistence note

V1 stores data in the current browser/device only. This is perfect for the first usable personal version, but data will **not sync between laptop and phone**. The code separates domain types and persistence (`lib/storage.ts`) so V2 can replace local storage with Supabase/Postgres/Prisma without rewriting the UI model.

## Suggested V1.5 / V2 roadmap

- Cloud database + authentication
- Sync between devices
- Rich taste sliders (sweetness/acidity/body/clarity)
- Recipe comparison/version tree
- Import recipe from URL
- Structured recipe scraper + attribution
- AI brew tuning assistant
- Charts for grinder setting vs. rating/extraction perception

## Stack

- Next.js 16.3.3
- React 19
- TypeScript
- Plain CSS (custom neo-brutalism design)
- Lucide icons
- Browser localStorage persistence


## V1.3 UI fixes
- Removed the demo-data reset action from the public UI.
- Recipe Edit, Open, and Brew are mutually exclusive flows.
- Recipe editor/detail and Brew Mode now render as true fixed overlays instead of extending the page.
- Bean cards expose a single Edit action.

## V1.4 UX update
- Mobile footer spacing tightened.
- Footer credit: Created with coffee by Galang.
- Journal supports recipe-linked notes and note detail popups.
- Mobile bean editor stacking bug fixed.
- Header branding updated to BREW-NOTE v1.1 with a larger coffee icon.
