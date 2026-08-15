# Views & likes

No separate backend - just two [Route Handlers](../src/app/api/entries) running as Vercel serverless functions, backed by [Upstash Redis](https://upstash.com) (free tier, REST-based, no connection pooling needed on serverless).

## Data model

Two shared hashes instead of a key per entry, so reading the whole grid is a fixed cost, not one that grows with entry count:

| Key | Type | Shape |
|---|---|---|
| `views` | Hash | `slug -> view count` |
| `likeCounts` | Hash | `slug -> like count` |
| `likes:{uid}` | Set | slugs this visitor has liked |

Fetching counts for every card on the homepage (`GET /api/entries/counts`) is **2-3 Redis commands total** via `HGETALL views`, `HGETALL likeCounts`, and (if the visitor has a cookie) `SMEMBERS likes:{uid}` - not one round trip per card.

The like count is never a separate counter that can drift - it's always `HINCRBY likeCounts` fired in lockstep with `SADD`/`SREM` on the visitor's set, so a re-count would always agree with the set's contents.

## Dedup ("one like per visitor")

An anonymous `httpOnly` cookie (`goonj_uid`, random UUID, 2-year expiry) identifies the visitor. Liking does `SADD likes:{uid} {slug}`; Redis itself is the source of truth for "already liked" - no client-side flag to spoof. Not defeatable by casual page tricks; only by clearing cookies or an incognito window, same ceiling as most like buttons that don't require an account.

Deliberately **not** IP-based (false positives on shared/NAT networks) or fingerprint-based (extra JS weight and privacy surface for a low-stakes feature).

## View counting

`POST /api/entries/[slug]/views` seeds the counter from that entry's historical `views` value in `entries.json` on first write (`HSETNX`), then `HINCRBY`s - so counts don't regress to zero for entries that already had a number. Fires once per page mount on the playlist detail page; the homepage grid only reads, never increments.

## Abuse protection

Every write endpoint is rate-limited: 20 requests / 10s / IP, sliding window, via `@upstash/ratelimit`.

## Display

`formatCount()` (`src/lib/format.ts`) renders compact counts (`1.5K`, `2.3M`) via `Intl.NumberFormat` pinned to `en-US` - `en-IN`'s compact notation switches to Lakh/Crore past 100K, which isn't what a K/M-style counter should show.
