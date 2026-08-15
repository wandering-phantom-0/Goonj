import { NextRequest, NextResponse } from "next/server";
import { getEntryBySlug } from "@/lib/data";
import { getClientIp } from "@/lib/getClientIp";
import { LIKE_COUNTS_HASH, likesSetKey, ratelimit, redis } from "@/lib/redis";
import { getUid, setUidCookie, UID_COOKIE_NAME } from "@/lib/uidCookie";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const uid = req.cookies.get(UID_COOKIE_NAME)?.value;
  const [count, liked] = await Promise.all([
    redis.hget<number>(LIKE_COUNTS_HASH, slug),
    uid ? redis.sismember(likesSetKey(uid), slug) : Promise.resolve(0),
  ]);

  return NextResponse.json({ likes: count ?? 0, liked: Boolean(liked) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { success } = await ratelimit.limit(`likes:${getClientIp(req)}`);
  if (!success) return NextResponse.json({ error: "rate limited" }, { status: 429 });

  const uid = getUid(req);
  const added = await redis.sadd(likesSetKey(uid), slug);
  // hincrby's return value doubles as the fresh count, avoiding a second
  // read - added is 0 when this uid already liked it (idempotent replay).
  const count = added
    ? await redis.hincrby(LIKE_COUNTS_HASH, slug, 1)
    : (await redis.hget<number>(LIKE_COUNTS_HASH, slug)) ?? 0;

  const res = NextResponse.json({ likes: count, liked: true });
  setUidCookie(res, uid);
  return res;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const uid = req.cookies.get(UID_COOKIE_NAME)?.value;
  let count: number;
  if (uid) {
    const removed = await redis.srem(likesSetKey(uid), slug);
    count = removed
      ? await redis.hincrby(LIKE_COUNTS_HASH, slug, -1)
      : (await redis.hget<number>(LIKE_COUNTS_HASH, slug)) ?? 0;
  } else {
    count = (await redis.hget<number>(LIKE_COUNTS_HASH, slug)) ?? 0;
  }

  return NextResponse.json({ likes: count, liked: false });
}
