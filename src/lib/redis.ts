import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Guards the view/like endpoints from scripted abuse - generous enough
// that no real visitor should ever notice it.
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10s"),
  prefix: "ratelimit",
});

// One shared hash per counter type (field = slug, value = count) instead of
// a key per entry. This is what makes the homepage grid cheap: reading
// counts for all 70+ entries is one HGETALL per hash, not N GETs.
export const VIEWS_HASH = "views";
export const LIKE_COUNTS_HASH = "likeCounts";

// One set per visitor (member = slug) instead of one set per entry. Lets us
// batch-fetch "which of these entries has this visitor liked" in a single
// SMEMBERS call for the whole grid, and still gives O(1) dedup on toggle.
export const likesSetKey = (uid: string) => `likes:${uid}`;
