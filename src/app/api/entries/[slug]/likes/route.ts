import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getEntryBySlug } from "@/lib/data";
import { getClientIp } from "@/lib/getClientIp";
import { ratelimit, redis } from "@/lib/redis";

const COOKIE_NAME = "goonj_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

function setUidCookie(res: NextResponse, uid: string) {
  res.cookies.set(COOKIE_NAME, uid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  const uid = req.cookies.get(COOKIE_NAME)?.value;
  const key = `liked:${slug}`;
  const [count, liked] = await Promise.all([
    redis.scard(key),
    uid ? redis.sismember(key, uid) : Promise.resolve(0),
  ]);

  return NextResponse.json({ likes: count, liked: Boolean(liked) });
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

  const uid = req.cookies.get(COOKIE_NAME)?.value ?? randomUUID();
  const key = `liked:${slug}`;
  await redis.sadd(key, uid);
  const count = await redis.scard(key);

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

  const uid = req.cookies.get(COOKIE_NAME)?.value;
  const key = `liked:${slug}`;
  if (uid) await redis.srem(key, uid);
  const count = await redis.scard(key);

  return NextResponse.json({ likes: count, liked: false });
}
