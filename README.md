# Goonj (गूँज) - Old Playlists Directory

Goonj is one place for nostalgic Indian playlist sites - an SEO-first collection built with Next.js App Router, inspired by the "OG Playlist" directory concept (`saloon.wtf` and the sites it spawned).

## What this is

A statically-generated directory of ~69 nostalgic playlist microsites, with:
- A dedicated, indexable page per directory entry (`/[locale]/playlist/[slug]`) and per category (`/[locale]/category/[slug]`) - the source site is a single-page SPA with none of this
- Full Hindi ⇄ English routing (`/hi/...`, `/en/...`) with `hreflang` alternates, via `next-intl`
- `sitemap.xml` / `robots.ts`, JSON-LD structured data (`CollectionPage`, `ItemList`, `BreadcrumbList`, `CreativeWork`) on every page
- A different visual identity from the source's "retro TV" cards - a cassette-tape motif, warm sepia palette, Devanagari-capable type (`Yatra One` + `Hind`)
- Zero database - content lives in `data/entries.json`, edited via PR

## Data provenance

`data/entries.json` was extracted from the live source site's own JS bundle (which embeds the entry list as plain data - `id`, `title`, `desc`, `owner`, `url`, `category`, plus `dead`/`pinned` flags), not guessed or hand-transcribed. 68 grid entries + 1 hardcoded "origin" entry (`saloon.wtf`, the site that started the trend) = 69 total, across 9 categories. Verified: all slugs unique, category set matches the 9 filter chips.

### Image provenance

Thumbnail screenshots (`public/images/entries/{slug}.jpg`, 69 files) were downloaded once from the source site's own `/thumbs/site-{id}.jpg` and are now self-hosted and served via `next/image` (responsive `srcSet`, lazy-loaded, explicit `alt` text). Offline entries (`status: "offline"`) intentionally skip the image and show the "no signal" placeholder instead.

**These screenshots were not taken by this project** - they're previews of the linked third-party sites, used here for identification purposes in a directory listing (the same purpose they served on the source). They are not covered by this repo's MIT license (see `LICENSE`). If you're a site owner and want your screenshot removed or updated, or you're forking this and want to avoid the provenance question entirely, swap the file in `public/images/entries/` (same filename = same slug, `null` the `image` field in `data/entries.json` to fall back to the placeholder card) - no code changes needed either way.

## Requirements

- **Node.js 20+** and npm. **This machine did not have Node.js installed when this project was scaffolded** - install it before running anything below (https://nodejs.org, or `nvm-windows`). Local dev/build/lint all require it; without it you can still push straight to GitHub and let Vercel build it in the cloud.

## Local development

```bash
cd goonj
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL for local runs (optional, defaults to localhost:3000)
npm run dev
```

Visit `http://localhost:3000` - middleware redirects to `/hi` (default locale). Toggle language via the switcher in the header.

Before deploying, always run a full production build locally at least once if you have Node available - this repo has **not** been built or run yet in this environment, so treat the first `npm run build` as the real correctness check:

```bash
npm run build
```

## Deploying to Vercel (free/Hobby tier)

1. Push this repo to GitHub.
2. In Vercel, "Import Project" → select the repo → framework auto-detects as Next.js → deploy.
3. Set the environment variable `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://goonj.vercel.app`) in Vercel's project settings - it's used to build absolute canonical/OG/sitemap URLs.
4. No serverless functions beyond what Next.js itself needs (everything is `generateStaticParams`-driven SSG) and no database, so this stays comfortably inside Hobby-tier limits.
5. Vercel's Image Optimization has a monthly transform quota on Hobby. This project now uses `next/image` on the 69 self-hosted screenshots in `public/images/entries/` - each unique image × size is optimized once and cached, so this is low-volume and should stay well inside Hobby limits, but worth knowing about if you add many more entries.

## Editing content

Add or edit entries in `data/entries.json` under `entries: []`. Each entry:

```json
{
  "id": 69,
  "slug": "unique-url-slug",
  "title": "Display name (as the creator wrote it - Hindi or English)",
  "title_en": null,
  "desc": "One-line description",
  "owner": "@handle",
  "url": "https://example.com",
  "domain": "example.com",
  "category": "safar",
  "status": "live",
  "featured": false,
  "pinned": false,
  "views": null,
  "image": "/images/entries/unique-url-slug.jpg"
}
```

`category` must match one of the slugs in the `categories` array in the same file. `image` should point to a file you've added under `public/images/entries/` (or be `null` to fall back to the placeholder "no signal" card). Static pages regenerate automatically on the next build/deploy - no code changes needed for a new entry.

## Known follow-ups (not yet built)

- **Submit flow**: `/submit` is currently a static instructions page (open a PR against `data/entries.json`). A real form would need a serverless handler - deliberately deferred per `REQUIREMENTS.md` §14 to avoid adding a database on a free-tier deploy.
- **Localized OG images**: `opengraph-image.tsx` currently renders Latin-only text. Rendering the Hindi variant needs a Devanagari font file passed to `ImageResponse`'s `fonts` option (e.g. fetch Noto Sans Devanagari at generation time) - left out here since it depends on an external font URL that couldn't be verified in this environment.
- **Client-side search**: not built; the 69-entry dataset is small enough that category pages + browser find-in-page cover most of it for now.

## Stack

Next.js (App Router, SSG) · TypeScript · Tailwind CSS v4 · next-intl · next-themes · lucide-react icons · next/og for the favicon/OG image generation.

## License

Source code is MIT-licensed (see `LICENSE`). The screenshot images under `public/images/entries/` are excluded from that grant - see "Image provenance" above.
