import { NextRequest, NextResponse } from "next/server";
import { LIKE_COUNTS_HASH, likesSetKey, redis, VIEWS_HASH } from "@/lib/redis";
import { UID_COOKIE_NAME } from "@/lib/uidCookie";

// Batched read for grid views (homepage/category) - one call, independent of
// how many entries are rendered. Auto-pipelining collapses the two/three
// independent commands below into a single HTTP round trip to Upstash, and
// HGETALL/SMEMBERS are each one Redis command regardless of entry count.
// Read-only - never mutates, so it's safe to call as often as pages load.
export async function GET(req: NextRequest) {
  const uid = req.cookies.get(UID_COOKIE_NAME)?.value;

  const [views, likes, likedSlugs] = await Promise.all([
    redis.hgetall<Record<string, number>>(VIEWS_HASH),
    redis.hgetall<Record<string, number>>(LIKE_COUNTS_HASH),
    uid ? redis.smembers(likesSetKey(uid)) : Promise.resolve<string[]>([]),
  ]);

  return NextResponse.json({
    views: views ?? {},
    likes: likes ?? {},
    likedSlugs,
  });
}
