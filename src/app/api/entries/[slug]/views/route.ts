import { NextRequest, NextResponse } from "next/server";
import { getEntryBySlug } from "@/lib/data";
import { getClientIp } from "@/lib/getClientIp";
import { ratelimit, redis } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const count = await redis.get<number>(`views:${slug}`);
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

  const key = `views:${slug}`;
  // Seed from the historical scraped count on first write, so the counter
  // doesn't visibly drop back to zero for entries that already had views.
  await redis.setnx(key, entry.views ?? 0);
  const count = await redis.incr(key);

  return NextResponse.json({ views: count });
}
