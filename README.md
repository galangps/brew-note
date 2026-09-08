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

## Suggested V1.7 / V2 roadmap

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

## V1.7 UX update
- Brew Mode now shows the upcoming brew steps below the current instruction.
- Bean process and roast level use controlled dropdowns.
- Recipe method, roast, and filter use controlled dropdowns; choosing a saved bean copies its origin/process/roast metadata.
- Added a neo-brutalist coffee mascot artwork and matching coffee-cup favicon.
- Footer is now a boxed neo-brutalist element.


## V1.7
- Clean transparent PNG mascots for hero and Brew Mode.
- Simplified transparent coffee-cup favicon.
- Improved mascot sizing on mobile.


## V1.8
- Re-cleaned both mascot PNGs from the original cutouts.
- Removed residual frame/hairline artifacts while keeping transparent backgrounds.


## V1.9
- Replaced both raster mascots with true transparent SVG artwork for clean desktop/mobile scaling.
- Added original procedural 2D-game-style lo-fi music with play/pause.
- Audio attempts to autoplay; browsers that block audible autoplay start it on the first user interaction.

## V2.0
- Iced recipe mode with ice at the beginning, end, or both.
- Ice steps live inside POUR STEP and scale with recipe dose.
- Brew detail / Brew Mode show brew-water vs ice summary.
- Bean library adds Roastery and Bean Type (Arabica, Robusta, Excelsa).
- Grinder presets with Other Grinders support.
- Pour labels and pour techniques converted to dropdowns.
- Hario Switch Dripper support with explicit OPEN/CLOSE switch steps:
  CLOSE = immersion, OPEN = percolation.

## V2.1
- Removed the separate Iced Recipe configuration box.
- Added `+ ADD ICE` beside `+ ADD POUR` and `+ ADD SWITCH ACTION`.
- Ice is now a normal brew-sequence step and can be moved anywhere using ↑ / ↓ controls.
- Recipe cards, dashboard Recent Recipes, recipe detail, and Brew Mode show:
  Liquid, Ice, Liquid:Ice, final ratio, and total beverage water.
- Lo-fi player changed to an original 90s arcade-fighter-inspired loop.
  It intentionally does not reproduce any copyrighted game soundtrack or melody.

## V2.2
- Removed the compact Liquid / Ice / Ratio strip from recipe cards.
- Removed Recent Recipes from the LAB dashboard for a cleaner landing page.
- Footer credit changed to `Created with ☕ by gpsteam`.

## V2.3
- Journal entries can now be edited and deleted, including the date.
- Target brew time uses minute/second up/down controls instead of manual text entry.
- LAB dashboard shows total grams of coffee actually brewed today.
- Journal notes are excluded from the daily coffee total; only real brew logs count.

## V2.4
- Fixed mobile Recipe Builder so Save/Cancel controls remain reachable.
- The bottom mobile navigation is hidden while a modal is open.
- Modal action buttons are sticky at the bottom on mobile.
- Daily coffee dashboard now treats 45g as the 100% daily maximum and shows progress + remaining grams.

## V2.5
- Recipes are bean-agnostic by default.
- Every Brew / Start Brew / Brew Again flow now asks which bean is being used first.
- The chosen bean is attached to that actual brew log and used for stock deduction.
- The bean picker previews origin, process, roast, roastery/type, and stock.

## V2.6
- Replaced the Indonesian helper text in the pre-brew bean picker with consistent English copy:
  `Select the beans you're using for this brew. We'll use them to keep your Journal and bean stock up to date.`
