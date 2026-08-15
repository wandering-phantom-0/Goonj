import { NextRequest, NextResponse } from "next/server";
import { getEntryBySlug } from "@/lib/data";
import { getClientIp } from "@/lib/getClientIp";
import { ratelimit, redis, VIEWS_HASH } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const count = await redis.hget<number>(VIEWS_HASH, slug);
  return NextResponse.json({ views: count ?? entry.views ?? 0 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { success } = await ratelimit.limit(`views:${getClientIp(req)}`);
  if (!success) return NextResponse.json({ error: "rate limited" }, { status: 429 });

  // Seed from the historical scraped count on first write, so the counter
  // doesn't visibly drop back to zero for entries that already had views.
  await redis.hsetnx(VIEWS_HASH, slug, entry.views ?? 0);
  const count = await redis.hincrby(VIEWS_HASH, slug, 1);

  return NextResponse.json({ views: count });
}
